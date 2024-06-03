<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="conversation-ban__settings">
		<h4 class="app-settings-section__subtitle">
			{{ t('spreed', 'Banned users') }}
		</h4>
		<div class="app-settings-section__hint">
			{{ t('spreed', 'Manage the list of banned users in this conversation.') }}
		</div>
		<NcButton @click="modal = true">
			{{ t('spreed', 'Manage bans') }}
		</NcButton>

		<NcModal v-if="modal"
			container=".conversation-ban__settings"
			@close="modal = false">
			<div class="conversation-ban__content">
				<h2 class="conversation-ban__title">
					{{ t('spreed', 'Banned users') }}
				</h2>

				<ul v-if="banList.length" class="conversation-ban__list">
					<BannedItem v-for="ban in banList"
						:key="ban.id"
						:ban="ban"
						@unban-participant="handleUnban(ban.id)" />
				</ul>

				<NcEmptyContent v-else>
					<template #icon>
						<NcLoadingIcon v-if="isLoading" />
						<AccountCancel v-else />
					</template>

					<template #description>
						<p>{{ isLoading ? t('spreed', 'Loading …') : t('spreed', 'No banned users') }}</p>
					</template>
				</NcEmptyContent>
			</div>
		</NcModal>
	</div>
</template>

<script>
import AccountCancel from 'vue-material-design-icons/AccountCancel.vue'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'
import NcEmptyContent from '@nextcloud/vue/dist/Components/NcEmptyContent.js'
import NcLoadingIcon from '@nextcloud/vue/dist/Components/NcLoadingIcon.js'
import NcModal from '@nextcloud/vue/dist/Components/NcModal.js'

import BannedItem from './BannedItem.vue'

import { getConversationBans, unbanActor } from '../../../services/banService.ts'

export default {
	name: 'BanSettings',

	components: {
		NcButton,
		NcEmptyContent,
		NcLoadingIcon,
		NcModal,
		BannedItem,
		// Icons
		AccountCancel,
	},

	props: {
		token: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			banList: [],
			isLoading: true,
			modal: false,
			showDetails: false,
		}
	},

	watch: {
		modal(value) {
			if (!value) {
				return
			}
			this.getList()
		}
	},

	methods: {
		async getList() {
			const resp1 = await getConversationBans(this.token)
			console.debug(resp1.data.ocs.data)
			this.banList = resp1.data.ocs.data
			this.isLoading = false
		},

		async handleUnban(id) {
			const resp3 = await unbanActor(this.token, id)
			console.debug(resp3.data.ocs.data)
			this.banList = this.banList.filter(ban => ban.id !== id)
		}
	},
}
</script>

<style lang="scss" scoped>
.conversation-ban {
	&__content {
		min-height: 240px;
	}

	&__title {
		text-align: center;
	}

	&__list {
		overflow: scroll;
		height: 400px;
	}
}
</style>
