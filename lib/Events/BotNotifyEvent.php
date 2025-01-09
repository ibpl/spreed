<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Talk\Events;

use OCA\Talk\Model\Bot;
use OCP\EventDispatcher\Event;

/**
 * @psalm-type ChatMessageData = array{
 *     type: 'Activity'|'Create',
 *     actor: array{
 *         type: 'Person',
 *         id: non-empty-string,
 *         name: non-empty-string,
 *     },
 *     object: array{
 *         type: 'Note',
 *         id: non-empty-string,
 *         name: string,
 *         content: non-empty-string,
 *         mediaType: 'text/markdown'|'text/plain',
 *     },
 *     target: array{
 *         type: 'Collection',
 *         id: non-empty-string,
 *         name: non-empty-string,
 *     },
 * }
 */
class BotNotifyEvent extends Event {
	/**
	 * @param ChatMessageData $data
	 */
	public function __construct(
		protected Bot $bot,
		protected array $data,
	) {
		parent::__construct();
	}

	public function getBot(): Bot {
		return $this->bot;
	}

	/**
	 * @return ChatMessageData
	 */
	public function getData(): array {
		return $this->data;
	}
}
