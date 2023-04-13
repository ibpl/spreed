<?php

declare(strict_types=1);
/**
 * @copyright Copyright (c) 2018 Denis Mosolov <denismosolov@gmail.com>
 *
 * @author Denis Mosolov <denismosolov@gmail.com>
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

namespace OCA\Talk\Command\Turn;

use OC\Core\Command\Base;
use OCP\IConfig;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class Delete extends Base {
	private IConfig $config;

	public function __construct(IConfig $config) {
		parent::__construct();
		$this->config = $config;
	}

	protected function configure(): void {
		$this
			->setName('talk:turn:delete')
			->setDescription('Remove an existing TURN server.')
			->addArgument(
				'schemes',
				InputArgument::REQUIRED,
				'Schemes, can be turn or turns or turn,turns'
			)->addArgument(
				'server',
				InputArgument::REQUIRED,
				'A domain name, ex. turn.nextcloud.com'
			)->addArgument(
				'protocols',
				InputArgument::REQUIRED,
				'Protocols, can be udp or tcp or udp,tcp'
			);
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		$schemes = $input->getArgument('schemes');
		$server = $input->getArgument('server');
		$protocols = $input->getArgument('protocols');

		$config = $this->config->getAppValue('spreed', 'turn_servers');
		$servers = json_decode($config, true);

		if ($servers === null || empty($servers) || !is_array($servers)) {
			$servers = [];
		}

		$count = count($servers);
		// remove all occurrences which match $schemes, $server and $protocols
		$servers = array_filter($servers, function ($s) use ($schemes, $server, $protocols) {
			return $s['schemes'] !== $schemes || $s['server'] !== $server || $s['protocols'] !== $protocols;
		});
		$servers = array_values($servers); // reindex

		$this->config->setAppValue('spreed', 'turn_servers', json_encode($servers));
		if ($count > count($servers)) {
			$output->writeln('<info>Deleted ' . $server . '.</info>');
		} else {
			$output->writeln('<info>There is nothing to delete.</info>');
		}
		return 0;
	}
}
