<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2023, Joas Schilling <coding@schilljs.com>
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

namespace OCA\Talk\Model;

use OCP\AppFramework\Db\QBMapper;
use OCP\AppFramework\Db\TTransactional;
use OCP\DB\QueryBuilder\IQueryBuilder;
use OCP\IDBConnection;

/**
 * @method Webhook mapRowToEntity(array $row)
 * @method Webhook findEntity(IQueryBuilder $query)
 * @method Webhook[] findEntities(IQueryBuilder $query)
 * @template-extends QBMapper<Webhook>
 */
class WebhookMapper extends QBMapper {
	use TTransactional;

	public function __construct(
		IDBConnection $db,
	) {
		parent::__construct($db, 'talk_webhooks', Webhook::class);
	}

	public function findForToken(string $token): array {
		$query = $this->db->getQueryBuilder();
		$query->select('*')
			->from('talk_webhooks')
			->where($query->expr()->eq('token', $query->createNamedParameter($token)));

		return $this->findEntities($query);
	}
}
