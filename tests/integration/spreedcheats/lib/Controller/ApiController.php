<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\SpreedCheats\Controller;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCSController;
use OCP\Calendar\Exceptions\CalendarException;
use OCP\Calendar\ICreateFromString;
use OCP\Calendar\IManager;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;
use OCP\IRequest;
use OCP\Share\IShare;
use Sabre\VObject\UUIDUtil;

class ApiController extends OCSController {
	public function __construct(
		string $appName,
		IRequest $request,
		protected IDBConnection $db,
		private IManager $calendarManager,
		private ?string $userId,
	) {
		parent::__construct($appName, $request);
	}

	public function resetSpreed(): DataResponse {
		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_attachments')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_attendees')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_bots_conversation')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_bots_server')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_bridges')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_commands')
			->where($delete->expr()->neq('app', $delete->createNamedParameter('')))
			->andWhere($delete->expr()->neq('command', $delete->createNamedParameter('help')))
			->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_consent')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_internalsignaling')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_invitations')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_polls')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_poll_votes')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_proxy_messages')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_reminders')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_retry_ocm')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_rooms')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('talk_sessions')->executeStatement();

		$delete = $this->db->getQueryBuilder();
		$delete->delete('share')
			->where($delete->expr()->orX(
				$delete->expr()->eq('share_type', $delete->createNamedParameter(IShare::TYPE_ROOM)),
				$delete->expr()->eq('share_type', $delete->createNamedParameter(11 /*RoomShareProvider::SHARE_TYPE_USERROOM*/))
			))
			->executeStatement();


		$delete = $this->db->getQueryBuilder();
		$delete->delete('preferences')
			->where($delete->expr()->in('configkey', $delete->createNamedParameter(['changelog', 'note_to_self', 'samples_created'], IQueryBuilder::PARAM_STR_ARRAY)))
			->andWhere($delete->expr()->eq('appid', $delete->createNamedParameter('spreed')))
			->executeStatement();

		try {
			$delete = $this->db->getQueryBuilder();
			$delete->delete('notifications')
				->where($delete->expr()->eq('app', $delete->createNamedParameter('spreed')))
				->executeStatement();
		} catch (\Throwable $e) {
			// Ignore
		}

		return new DataResponse();
	}

	public function ageChat(string $token, int $hours): DataResponse {
		$query = $this->db->getQueryBuilder();
		$query->select('id')
			->from('talk_rooms')
			->where($query->expr()->eq('token', $query->createNamedParameter($token)));

		$result = $query->executeQuery();
		$roomId = (int)$result->fetchOne();
		$result->closeCursor();

		if (!$roomId) {
			return new DataResponse(null, Http::STATUS_NOT_FOUND);
		}

		$update = $this->db->getQueryBuilder();
		$update->update('comments')
			->set('creation_timestamp', $update->createParameter('creation_timestamp'))
			->set('expire_date', $update->createParameter('expire_date'))
			->set('meta_data', $update->createParameter('meta_data'))
			->where($update->expr()->eq('id', $update->createParameter('id')));

		$query = $this->db->getQueryBuilder();
		$query->select('id', 'creation_timestamp', 'expire_date', 'meta_data')
			->from('comments')
			->where($query->expr()->eq('object_type', $query->createNamedParameter('chat')))
			->andWhere($query->expr()->eq('object_id', $query->createNamedParameter($roomId)));

		$result = $query->executeQuery();
		while ($row = $result->fetch()) {
			$creationTimestamp = new \DateTime($row['creation_timestamp']);
			$creationTimestamp->sub(new \DateInterval('PT' . $hours . 'H'));

			$expireDate = null;
			if ($row['expire_date']) {
				$expireDate = new \DateTime($row['expire_date']);
				$expireDate->sub(new \DateInterval('PT' . $hours . 'H'));
			}

			$metaData = 'null';
			if ($row['meta_data'] !== 'null') {
				$metaData = json_decode($row['meta_data'], true);
				if (isset($metaData['last_edited_time'])) {
					$metaData['last_edited_time'] -= $hours * 3600;
				}
				$metaData = json_encode($metaData);
			}

			$update->setParameter('id', $row['id']);
			$update->setParameter('creation_timestamp', $creationTimestamp, IQueryBuilder::PARAM_DATE);
			$update->setParameter('expire_date', $expireDate, IQueryBuilder::PARAM_DATE);
			$update->setParameter('meta_data', $metaData);
			$update->executeStatement();
		}
		$result->closeCursor();

		return new DataResponse();
	}

	#[NoAdminRequired]
	public function createEventInCalendar(string $location, string $start, string $end): DataResponse {
		if ($this->userId === null) {
			return new DataResponse(null, Http::STATUS_UNAUTHORIZED);
		}

		$calendar = null;
		// Create a calendar event with LOCATION and time via OCP
		$calendars = $this->calendarManager->getCalendarsForPrincipal('principals/users/' . $this->userId);
		foreach ($calendars as $c) {
			if ($c instanceof ICreateFromString) {
				$calendar = $c;
			}
		}

		if ($calendar === null) {
			return new DataResponse(null, Http::STATUS_NOT_FOUND);
		}

		$calData = <<<EOF
BEGIN:VCALENDAR
PRODID:-//IDN nextcloud.com//Calendar app 5.2.0-dev.1//EN
CALSCALE:GREGORIAN
VERSION:2.0
BEGIN:VEVENT
CREATED:20250310T171800Z
DTSTAMP:20250310T171819Z
LAST-MODIFIED:20250310T171819Z
SEQUENCE:1
UID:{{{UID}}}
DTSTART;TZID=Europe/Vienna:{{{START}}}
DTEND;TZID=Europe/Vienna:{{{END}}}
STATUS:CONFIRMED
SUMMARY:Event Room Test
LOCATION:{{{LOCATION}}}
END:VEVENT
BEGIN:VTIMEZONE
TZID:Europe/Vienna
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
END:VCALENDAR
EOF;

		$start = (new \DateTime())->setTimestamp((int)$start)->format('Ymd\THis');
		$end = (new \DateTime())->setTimestamp((int)$end)->format('Ymd\THis');
		$uid = UUIDUtil::getUUID();
		$calData = str_replace(['{{{START}}}', '{{{END}}}', '{{{UID}}}', '{{{LOCATION}}}'], [$start, $end, $uid, $location], $calData);

		try {
			/** @var ICreateFromString $calendar */
			$calendar->createFromString((string)time(), $calData);
		} catch (CalendarException) {
			return new DataResponse(null, Http::STATUS_FORBIDDEN);
		}
		return new DataResponse();
	}
}
