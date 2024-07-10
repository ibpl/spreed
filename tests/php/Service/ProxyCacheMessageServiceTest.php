<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2024 Joas Schilling <coding@schilljs.com>
 *
 * @author Joas Schilling <coding@schilljs.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

namespace OCA\Talk\Tests\php\Service;

use OCA\Talk\Exceptions\InvalidRoomException;
use OCA\Talk\Model\ProxyCacheMessage;
use OCA\Talk\Model\ProxyCacheMessageMapper;
use OCA\Talk\Room;
use OCA\Talk\Service\ProxyCacheMessageService;
use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IDBConnection;
use PHPUnit\Framework\MockObject\MockObject;
use Psr\Log\LoggerInterface;
use Test\TestCase;

/**
 * @group DB
 */
class ProxyCacheMessageServiceTest extends TestCase {
	protected ?ProxyCacheMessageMapper $mapper = null;
	protected LoggerInterface|MockObject $logger;
	protected ITimeFactory|MockObject $timeFactory;
	protected ?ProxyCacheMessageService $service = null;


	public function setUp(): void {
		parent::setUp();

		$this->mapper = new ProxyCacheMessageMapper(\OCP\Server::get(IDBConnection::class));
		$this->logger = $this->createMock(LoggerInterface::class);
		$this->timeFactory = $this->createMock(ITimeFactory::class);

		$this->service = new ProxyCacheMessageService(
			$this->mapper,
			$this->logger,
			$this->timeFactory,
		);
		$this->clearMessages();
	}

	public function tearDown(): void {
		$this->clearMessages();

		parent::tearDown();
	}

	protected function clearMessages(): void {
		$query = \OCP\Server::get(IDBConnection::class)->getQueryBuilder();
		$query->delete('talk_proxy_messages')
			->where($query->expr()->eq('remote_server_url', $query->createNamedParameter('phpunittests')));
		$query->executeStatement();
	}

	public function dataDeleteExpiredMessages(): array {
		return [
			[1234,    12345, true],
			[1234567, 12345, false],
			[null,    12345, false],
		];
	}

	/**
	 * @dataProvider dataDeleteExpiredMessages
	 */
	public function testDeleteExpiredMessages(?int $messageTime, int $currentTime, bool $expired): void {
		$room = $this->createMock(Room::class);
		$room->method('isFederatedConversation')
			->willReturn(true);

		$m1 = new ProxyCacheMessage();
		$m1->setLocalToken('local_token');
		$m1->setRemoteServerUrl('phpunittests');
		$m1->setRemoteToken('remote_token');
		$m1->setRemoteMessageId(12345);
		$m1->setActorType('actor_type');
		$m1->setActorId('actor_id');
		$m1->setMessageType('message_type');
		if ($messageTime === null) {
			$m1->setExpirationDatetime($messageTime);
		} else {
			$m1->setExpirationDatetime(new \DateTime('@' . $messageTime));
		}
		$this->mapper->insert($m1);

		$this->mapper->findById($room, $m1->getId());

		$this->timeFactory->method('getDateTime')
			->willReturn(new \DateTime('@' . $currentTime));
		$this->service->deleteExpiredMessages();

		if ($expired) {
			$this->expectException(DoesNotExistException::class);
		}
		$actual = $this->mapper->findById($room, $m1->getId());
		if (!$expired) {
			$this->assertEquals($m1->getId(), $actual->getId());
		}
	}

	public function testFindByIdThrows(): void {
		$this->expectException(InvalidRoomException::class);
		$room = $this->createMock(Room::class);
		$room->method('isFederatedConversation')
			->willReturn(false);

		$this->mapper->findById($room, 42);
	}
}
