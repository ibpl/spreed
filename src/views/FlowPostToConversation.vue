<template>
	<div>
		<NcSelect :value="currentRoom"
			:options="roomOptions"
			label="displayName"
			@input="(newValue) => newValue !== null && $emit('input', JSON.stringify({'m': currentMode.id, 't': newValue.token }))" />

		<NcSelect :value="currentMode"
			:options="modeOptions"
			label="text"
			@input="(newValue) => newValue !== null && $emit('input', JSON.stringify({'m': newValue.id, 't': currentRoom.token }))" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

import NcSelect from '@nextcloud/vue/dist/Components/NcSelect.js'

import { FLOW, CONVERSATION, PARTICIPANT } from '../constants.js'

export default {
	name: 'FlowPostToConversation',
	components: { NcSelect },
	props: {
		value: {
			default: JSON.stringify({ m: '0', t: '' }),
			type: String,
		},
	},

	emits: ['input'],

	data() {
		return {
			modeOptions: [
				{
					id: FLOW.MESSAGE_MODES.NO_MENTION,
					text: t('spreed', 'Message without mention'),
				},
				{
					id: FLOW.MESSAGE_MODES.SELF_MENTION,
					text: t('spreed', 'Mention myself'),
				},
				{
					id: FLOW.MESSAGE_MODES.ROOM_MENTION,
					text: t('spreed', 'Mention room'),
				},
			],
			roomOptions: [],
		}
	},
	computed: {
		currentRoom() {
			if (this.value === '') {
				return ''
			}
			const selectedRoom = JSON.parse(this.value).t
			const newValue = this.roomOptions.find(option => option.token === selectedRoom)
			if (typeof newValue === 'undefined') {
				return ''
			}
			return newValue
		},
		currentMode() {
			if (this.value === '') {
				return this.modeOptions[0]
			}
			const selectedMode = JSON.parse(this.value).m
			const newValue = this.modeOptions.find(option => option.id === selectedMode)
			if (typeof newValue === 'undefined') {
				return this.modeOptions[0]
			}
			return newValue
		},
	},
	beforeMount() {
		this.fetchRooms()
	},
	methods: {
		fetchRooms() {
			axios.get(generateOcsUrl('/apps/spreed/api/v4/room')).then((response) => {
				this.roomOptions = response.data.ocs.data.filter(function(room) {
					return room.readOnly === CONVERSATION.STATE.READ_WRITE
						&& (room.permissions & PARTICIPANT.PERMISSIONS.CHAT) !== 0
				})
			})
		},
	},
}

</script>

<style scoped>
	.multiselect {
		width: 100%;
		margin: auto;
		text-align: center;
	}
</style>
