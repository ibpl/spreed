/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { getCapabilities as _getCapabilities } from '@nextcloud/capabilities'
import { showError, TOAST_PERMANENT_TIMEOUT } from '@nextcloud/dialogs'

import { getRemoteCapabilities } from './federationService.ts'
import BrowserStorage from '../services/BrowserStorage.js'
import type { Capabilities, JoinRoomFullResponse } from '../types'

interface ICapabilitiesManager {
	localCapabilities: Capabilities
	remoteCapabilities: Record<string, Capabilities & Partial<{ hash: string }>>
	getCapabilities: (token: 'local'|string) => Capabilities
}

type Config = Capabilities['spreed']['config']

class CapabilitiesManager implements ICapabilitiesManager {

	public localCapabilities

	public remoteCapabilities

	static instance: ICapabilitiesManager

	constructor() {
		this.localCapabilities = _getCapabilities() as Capabilities
		this.remoteCapabilities = this.restoreRemoteCapabilities()
	}

	public getCapabilities(token: 'local'|string = 'local') {
		return (token === 'local' || !this.remoteCapabilities[token])
			? this.localCapabilities
			: this.remoteCapabilities[token]
	}

	public hasTalkFeature(token: 'local'|string, feature: string): boolean {
		if (this.localCapabilities.spreed['features-local'].includes(feature)) {
			return this.localCapabilities?.spreed?.features?.includes(feature) ?? false
		}
		return this.getCapabilities(token)?.spreed?.features?.includes(feature) ?? false
	}

	public getTalkConfig(token: 'local'|string, key1: keyof Config, key2: keyof Config[keyof Config]) {
		return this.localCapabilities.spreed['config-local'][key1][key2]
			? this.localCapabilities?.spreed?.config?.[key1]?.[key2]
			: getCapabilities(token)?.spreed?.config?.[key1]?.[key2]
	}

	public async setRemoteCapabilities(joinRoomResponse: JoinRoomFullResponse): Promise<void> {
		const token = joinRoomResponse.data.ocs.data.token

		// Check if remote capabilities have not changed since last check
		if (joinRoomResponse.headers['x-nextcloud-talk-proxy-hash'] === this.remoteCapabilities[token]?.hash) {
			return
		}

		try {
			const response = await getRemoteCapabilities(token)
			if (Array.isArray(response.data.ocs.data)) {
				// unknown[] received from server, nothing to update with
				return
			}

			this.remoteCapabilities[token] = { spreed: response.data.ocs.data }
			this.remoteCapabilities[token].hash = joinRoomResponse.headers['x-nextcloud-talk-proxy-hash']
			BrowserStorage.setItem('remoteCapabilities', JSON.stringify(this.remoteCapabilities))

			// As normal capabilities update, requires a reload to take effect
			showError(t('spreed', 'Nextcloud Talk Federation was updated, please reload the page'), {
				timeout: TOAST_PERMANENT_TIMEOUT,
			})
		} catch (error) {
			console.error(error)
		}
	}

	restoreRemoteCapabilities(): ICapabilitiesManager['remoteCapabilities'] {
		const remoteCapabilities = BrowserStorage.getItem('remoteCapabilities')
		if (!remoteCapabilities?.length) {
			return {}
		}

		return JSON.parse(remoteCapabilities) as ICapabilitiesManager['remoteCapabilities']
	}

}

const capabilitiesManager = new CapabilitiesManager()

export const getCapabilities = capabilitiesManager.getCapabilities.bind(capabilitiesManager)
export const getTalkConfig = capabilitiesManager.getTalkConfig.bind(capabilitiesManager)
export const hasTalkFeature = capabilitiesManager.hasTalkFeature.bind(capabilitiesManager)
export const setRemoteCapabilities = capabilitiesManager.setRemoteCapabilities.bind(capabilitiesManager)
