<!--
  - SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<li :key="ban.id" class="ban-item">
		<div class="ban-item__header">
			<span>{{ ban.bannedId }}</span>
			<div class="ban-item__buttons">
				<NcButton type="tertiary" @click="showDetails = !showDetails">
					{{ showDetails ? t('spreed', 'Hide details') : t('spreed', 'Details') }}
				</NcButton>
				<NcButton @click="$emit('unban-participant')">
					{{ t('spreed', 'Unban') }}
				</NcButton>
			</div>
		</div>
		<div v-if="showDetails" class="ban-item__hint">
			<div v-for="(item, index) in banInfo" :key="index">
				{{ item }}
			</div>
		</div>
	</li>
</template>

<script>
import moment from '@nextcloud/moment'

import NcButton from '@nextcloud/vue/dist/Components/NcButton.js'

import { getConversationBans, unbanActor } from '../../../services/banService.ts'

export default {
	name: 'BannedItem',

	components: {
		NcButton,
	},

	props: {
		ban: {
			type: Object,
			required: true,
		},
	},

	emits: ['unban-participant'],

	data() {
		return {
			showDetails: null,
		}
	},

	computed: {
		banInfo() {
			return [
				t('spreed', 'Banned by: {actor}', { actor: this.ban.actorId }),
				t('spreed', 'Date: {date}', { date: moment(this.ban.bannedTime * 1000).format('lll') }),
				t('spreed', 'Note: {note}', { note: this.ban.internalNote }),
			]
		},
	},
}
</script>

<style lang="scss" scoped>

.ban-item {
    margin-bottom: 2px;
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &__hint {
        word-wrap: break-word;
        color: var(--color-text-maxcontrast);
        margin-bottom: 4px;
    }
    &__buttons {
        display: flex;
    }
}
</style>
