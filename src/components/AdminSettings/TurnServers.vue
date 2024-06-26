<!--
 - @copyright Copyright (c) 2019 Joas Schilling <coding@schilljs.com>
 -
 - @author Joas Schilling <coding@schilljs.com>
 -
 - @license GNU AGPL version 3 or any later version
 -
 - This program is free software: you can redistribute it and/or modify
 - it under the terms of the GNU Affero General Public License as
 - published by the Free Software Foundation, either version 3 of the
 - License, or (at your option) any later version.
 -
 - This program is distributed in the hope that it will be useful,
 - but WITHOUT ANY WARRANTY; without even the implied warranty of
 - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 - GNU Affero General Public License for more details.
 -
 - You should have received a copy of the GNU Affero General Public License
 - along with this program. If not, see <http://www.gnu.org/licenses/>.
 -
 -->

<template>
	<section id="turn_server" class="videocalls section">
		<h2>
			{{ t('spreed', 'TURN servers') }}
		</h2>

		<!-- eslint-disable-next-line vue/no-v-html -->
		<p class="settings-hint" v-html="documentationHint" />

		<TransitionWrapper class="turn-servers"
			name="fade"
			tag="ul"
			group>
			<TurnServer v-for="(server, index) in servers"
				:key="`server${index}`"
				:schemes.sync="servers[index].schemes"
				:server.sync="servers[index].server"
				:secret.sync="servers[index].secret"
				:protocols.sync="servers[index].protocols"
				:index="index"
				:loading="loading"
				@remove-server="removeServer"
				@update:schemes="debounceUpdateServers"
				@update:server="debounceUpdateServers"
				@update:secret="debounceUpdateServers"
				@update:protocols="debounceUpdateServers" />
		</TransitionWrapper>

		<NcButton class="additional-top-margin"
			:disabled="loading"
			@click="newServer">
			<template #icon>
				<span v-if="loading" class="icon icon-loading-small" />
				<Plus v-else :size="20" />
			</template>
			{{ t('spreed', 'Add a new TURN server') }}
		</NcButton>
	</section>
</template>

<script>
import debounce from 'debounce'

import Plus from 'vue-material-design-icons/Plus.vue'

import { showSuccess } from '@nextcloud/dialogs'
import { loadState } from '@nextcloud/initial-state'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'

import TurnServer from '../../components/AdminSettings/TurnServer.vue'
import TransitionWrapper from '../TransitionWrapper.vue'

export default {
	name: 'TurnServers',

	components: {
		NcButton,
		TurnServer,
		Plus,
		TransitionWrapper,
	},

	data() {
		return {
			servers: [],
			loading: false,
			saved: false,
		}
	},

	computed: {
		documentationHint() {
			return t('spreed', 'A TURN server is used to proxy the traffic from participants behind a firewall. If individual participants cannot connect to others a TURN server is most likely required. See {linkstart}this documentation{linkend} for setup instructions.')
				.replace('{linkstart}', '<a  target="_blank" rel="noreferrer nofollow" class="external" href="https://nextcloud-talk.readthedocs.io/en/latest/TURN/">')
				.replace('{linkend}', ' ↗</a>')
		},
	},

	beforeMount() {
		this.servers = loadState('spreed', 'turn_servers')
	},

	methods: {
		removeServer(index) {
			this.servers.splice(index, 1)
			this.debounceUpdateServers()
		},

		newServer() {
			this.servers.push({
				schemes: 'turn', // default to turn only
				server: '',
				secret: '',
				protocols: 'udp,tcp', // default to udp AND tcp
			})
		},

		debounceUpdateServers: debounce(function() {
			this.updateServers()
		}, 1000),

		async updateServers() {
			const servers = []

			this.servers.forEach((server) => {
				const data = {
					schemes: server.schemes,
					server: server.server,
					secret: server.secret,
					protocols: server.protocols,
				}

				if (data.server.startsWith('https://')) {
					data.server = data.server.slice(8)
				} else if (data.server.startsWith('http://')) {
					data.server = data.server.slice(7)
				}

				if (data.secret === '') {
					return
				}

				servers.push(data)
			})

			const self = this

			this.loading = true
			OCP.AppConfig.setValue('spreed', 'turn_servers', JSON.stringify(servers), {
				success() {
					showSuccess(t('spreed', 'TURN settings saved'))
					self.loading = false
					self.toggleSave()
				},
			})
		},

		toggleSave() {

			this.saved = true
			setTimeout(() => {
				this.saved = false
			}, 3000)
		},
	},
}
</script>

<style lang="scss">
.additional-top-margin {
	margin-top: 10px;
}

</style>
