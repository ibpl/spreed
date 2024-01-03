/**
 * @copyright Copyright (c) 2023 Maksim Sukharev <antreesy.web@gmail.com>
 *
 * @author Maksim Sukharev <antreesy.web@gmail.com>
 * @author Marco Ambrosini <marcoambrosini@icloud.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import hark from 'hark'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

import attachMediaStream from '../utils/attachmediastream.js'
import TrackToStream from '../utils/media/pipeline/TrackToStream.js'
import VirtualBackground from '../utils/media/pipeline/VirtualBackground.js'
import { mediaDevicesManager } from '../utils/webrtc/index.js'

/**
 * Check whether the user joined the call of the current token in this PHP session or not
 *
 * @param {import('vue').Ref} video element ref to attach track to
 * @param {boolean} initializeOnMounted whether to initialize mixin or not
 * @return {{[key:string]: Function|import('vue').Ref|import('vue').ComputedRef}}
 */
export function useDevices(video, initializeOnMounted) {
	// Internal variables
	let _initialized = false
	let _pendingGetUserMediaAudioCount = 0
	let _pendingGetUserMediaVideoCount = 0
	const _hark = ref(null)
	const _videoTrackToStream = ref(null)
	const _mediaDevicesManager = reactive(mediaDevicesManager)

	// Variables used in components
	const currentVolume = ref(-100)
	const currentThreshold = ref(-100)
	const virtualBackground = ref(null)
	const audioStream = ref(null)
	const audioStreamError = ref(null)
	const videoStream = ref(null)
	const videoStreamError = ref(null)

	// Computed properties used in components
	const devices = computed(() => {
		return _mediaDevicesManager.attributes.devices
	})

	const audioInputId = computed({
		get() {
			return _mediaDevicesManager.attributes.audioInputId
		},
		set(value) {
			_mediaDevicesManager.set('audioInputId', value)
		},
	})
	const audioPreviewAvailable = computed(() => {
		return !!audioInputId.value && !!audioStream.value
	})

	const videoInputId = computed({
		get() {
			return _mediaDevicesManager.attributes.videoInputId
		},
		set(value) {
			_mediaDevicesManager.set('videoInputId', value)
		},
	})
	const videoPreviewAvailable = computed(() => {
		return !!videoInputId.value && !!videoStream.value
	})

	// Lifecycle events
	watch(audioInputId, () => {
		if (_initialized) {
			_updateAudioStream()
		}
	})

	watch(videoInputId, () => {
		if (_initialized) {
			_updateVideoStream()
		}
	})

	onMounted(() => {
		virtualBackground.value = new VirtualBackground()
		// The virtual background should be enabled and disabled as needed by components
		virtualBackground.value.setEnabled(false)

		_videoTrackToStream.value = new TrackToStream()
		_videoTrackToStream.value.addInputTrackSlot('video')

		virtualBackground.value.connectTrackSink('default', _videoTrackToStream.value, 'video')

		if (initializeOnMounted) {
			initializeDevicesMixin()
		}
	})

	onBeforeUnmount(() => {
		stopDevicesMixin()
	})

	// Methods used in components
	const initializeDevicesMixin = () => {
		_initialized = true

		if (!_mediaDevicesManager.isSupported()) {
			// DOMException constructor is not supported in Internet Explorer,
			// so a plain object is used instead.
			audioStreamError.value = {
				message: 'MediaDevicesManager is not supported',
				name: 'NotSupportedError',
			}
			videoStreamError.value = {
				message: 'MediaDevicesManager is not supported',
				name: 'NotSupportedError',
			}
		}

		_mediaDevicesManager.enableDeviceEvents()
		_updateAudioStream()
		_updateVideoStream()
	}

	const stopDevicesMixin = () => {
		_initialized = false

		_stopAudioStream()
		_stopVideoStream()
		_mediaDevicesManager.disableDeviceEvents()
	}

	// Internal variables and methods for audio stream
	const _audioStreamInputId = computed(() => {
		if (!audioStream.value) {
			return null
		}
		const audioTracks = audioStream.value.getAudioTracks()
		return audioTracks.length < 1 ? null : audioTracks[0].getSettings().deviceId
	})

	const _setAudioStream = (stream) => {
		audioStream.value = stream
		if (!stream) {
			return
		}

		_hark.value = hark(stream)
		_hark.value.on('volume_change', (volume, volumeThreshold) => {
			currentVolume.value = volume
			currentThreshold.value = volumeThreshold
		})
	}

	const _stopAudioStream = () => {
		if (!audioStream.value) {
			return
		}

		audioStream.value.getTracks().forEach(track => track.stop())
		audioStream.value = null

		if (_hark.value) {
			_hark.value.stop()
			_hark.value.off('volume_change')
			_hark.value = null
		}
	}

	const _resetPendingGetUserMediaAudioCount = () => {
		const updateAudioStreamAgain = _pendingGetUserMediaAudioCount > 1
		_pendingGetUserMediaAudioCount = 0
		if (updateAudioStreamAgain) {
			_updateAudioStream()
		}
	}

	const _updateAudioStream = () => {
		if (!_mediaDevicesManager.isSupported()) {
			return
		}
		if (_audioStreamInputId.value && _audioStreamInputId.value === audioInputId.value) {
			return
		}
		if (_pendingGetUserMediaAudioCount) {
			_pendingGetUserMediaAudioCount++
			return
		}
		// When the audio input device changes the previous stream must be
		// stopped before a new one is requested, as for example currently
		// Firefox does not support having two different audio input devices
		// active at the same time:
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1468700
		_stopAudioStream()

		audioStreamError.value = null

		if (audioInputId.value === null || audioInputId.value === undefined) {
			return
		}
		_pendingGetUserMediaAudioCount = 1

		_mediaDevicesManager.getUserMedia({ audio: true })
			.then(stream => {
				if (!_initialized) {
					// The promise was fulfilled once the stream is no
					// longer needed, so just discard it.
					stream.getTracks().forEach(track => track.stop())
				} else {
					_setAudioStream(stream)
				}
			})
			.catch(error => {
				console.error('Error getting audio stream: ' + error.name + ': ' + error.message)
				audioStreamError.value = error
				_setAudioStream(null)
			})
			.finally(() => {
				_resetPendingGetUserMediaAudioCount()
			})
	}

	// Internal variables and methods for audio stream
	const _videoStreamInputId = computed(() => {
		if (!videoStream.value) {
			return null
		}
		const videoTracks = videoStream.value.getVideoTracks()
		return videoTracks.length < 1 ? null : videoTracks[0].getSettings().deviceId
	})

	const _setVideoStream = (stream) => {
		videoStream.value = stream
		if (!video.value) {
			return
		}
		if (!stream) {
			virtualBackground.value._setInputTrack('default', null)
			return
		}

		virtualBackground.value._setInputTrack('default', videoStream.value.getVideoTracks()[0])

		const options = { autoplay: true, mirror: true, muted: true }
		attachMediaStream(_videoTrackToStream.value.getStream(), video.value, options)
	}

	const _stopVideoStream = () => {
		virtualBackground.value._setInputTrack('default', null)
		if (!videoStream.value) {
			return
		}

		videoStream.value.getTracks().forEach(track => track.stop())
		videoStream.value = null

		if (video.value) {
			video.value.srcObject = null
		}
	}

	const _resetPendingGetUserMediaVideoCount = () => {
		const updateVideoStreamAgain = _pendingGetUserMediaVideoCount > 1
		_pendingGetUserMediaVideoCount = 0
		if (updateVideoStreamAgain) {
			_updateVideoStream()
		}
	}

	const _updateVideoStream = () => {
		if (!_mediaDevicesManager.isSupported()) {
			return
		}
		if (_videoStreamInputId.value && _videoStreamInputId.value === videoInputId.value) {
			return
		}
		if (_pendingGetUserMediaVideoCount) {
			_pendingGetUserMediaVideoCount++
			return
		}

		// Video stream is stopped too to avoid potential issues similar to
		// the audio ones (see "updateAudioStream").
		_stopVideoStream()

		videoStreamError.value = null

		if (videoInputId.value === null || videoInputId.value === undefined) {
			return
		}

		_pendingGetUserMediaVideoCount = 1

		_mediaDevicesManager.getUserMedia({ video: true })
			.then(stream => {
				if (!_initialized) {
					// The promise was fulfilled once the stream is no
					// longer needed, so just discard it.
					stream.getTracks().forEach(track => track.stop())
				} else {
					_setVideoStream(stream)
				}
			})
			.catch(error => {
				console.error('Error getting video stream: ' + error.name + ': ' + error.message)
				videoStreamError.value = error
				_setVideoStream(null)
			})
			.finally(() => {
				_resetPendingGetUserMediaVideoCount()
			})
	}

	return {
		devices,
		currentVolume,
		currentThreshold,
		audioPreviewAvailable,
		videoPreviewAvailable,
		audioInputId,
		videoInputId,
		// MediaDevicesPreview only
		audioStream,
		audioStreamError,
		videoStream,
		videoStreamError,
		// MediaSettings only
		initializeDevicesMixin,
		stopDevicesMixin,
		virtualBackground,
	}
}
