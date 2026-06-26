/*
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useActorStore } from '../actor.ts'
import { useSignalingStateStore } from '../signalingState.ts'

describe('signalingStateStore', () => {
	let signalingStateStore
	let actorStore

	beforeEach(() => {
		setActivePinia(createPinia())
		signalingStateStore = useSignalingStateStore()
		actorStore = useActorStore()
	})

	afterEach(() => {
		vi.clearAllMocks()
		vi.useRealTimers()
	})

	describe('typing', () => {
		const TOKEN = 'XXTOKENXX'

		it('adds typing signal for participant', () => {
			signalingStateStore.setTyping({ token: TOKEN, sessionId: 'session-id-1', isTyping: true })

			expect(signalingStateStore.externalTypingSignals(TOKEN)).toEqual(['session-id-1'])
		})

		it('removes typing signal when participant stops typing', () => {
			signalingStateStore.setTyping({ token: TOKEN, sessionId: 'session-id-1', isTyping: true })
			signalingStateStore.setTyping({ token: TOKEN, sessionId: 'session-id-1', isTyping: false })

			expect(signalingStateStore.externalTypingSignals(TOKEN)).toEqual([])
		})

		it('excludes current actor session from external typing signals', () => {
			actorStore.setCurrentParticipant({ sessionId: 'local-session-id', attendeeId: 1 })

			signalingStateStore.setTyping({ token: TOKEN, sessionId: 'local-session-id', isTyping: true })
			signalingStateStore.setTyping({ token: TOKEN, sessionId: 'remote-session-id', isTyping: true })

			expect(signalingStateStore.externalTypingSignals(TOKEN)).toEqual(['remote-session-id'])
		})

		it('detects self typing via isSelfActorTyping', () => {
			actorStore.setCurrentParticipant({ sessionId: 'local-session-id', attendeeId: 1 })

			expect(signalingStateStore.isSelfActorTyping(TOKEN)).toBe(false)

			signalingStateStore.setTyping({ token: TOKEN, sessionId: 'local-session-id', isTyping: true })

			expect(signalingStateStore.isSelfActorTyping(TOKEN)).toBe(true)
		})

		it('automatically expires typing signal after 15 seconds', () => {
			vi.useFakeTimers()

			signalingStateStore.setTyping({ token: TOKEN, sessionId: 'session-id-1', isTyping: true })
			expect(signalingStateStore.externalTypingSignals(TOKEN)).toEqual(['session-id-1'])

			vi.advanceTimersByTime(15_000)
			expect(signalingStateStore.externalTypingSignals(TOKEN)).toEqual([])
		})

		/* Additional test cases located in src/utils/SignalingTypingHandler.spec.js */
	})

	describe('raised hand', () => {
		it('returns raised hand state for single session id', () => {
			signalingStateStore.setParticipantHandRaised({
				sessionId: 'session-id-1',
				raisedHand: { state: true, timestamp: 1 },
			})
			signalingStateStore.setParticipantHandRaised({
				sessionId: 'session-id-2',
				raisedHand: { state: true, timestamp: 2 },
			})

			expect(signalingStateStore.getParticipantRaisedHand(['session-id-1']))
				.toStrictEqual({ state: true, timestamp: 1 })

			expect(signalingStateStore.getParticipantRaisedHand(['session-id-2']))
				.toStrictEqual({ state: true, timestamp: 2 })

			expect(signalingStateStore.getParticipantRaisedHand(['session-id-another']))
				.toStrictEqual({ state: false, timestamp: null })
		})

		it('returns false state after hand is lowered', () => {
			signalingStateStore.setParticipantHandRaised({
				sessionId: 'session-id-2',
				raisedHand: { state: true, timestamp: 1 },
			})
			signalingStateStore.setParticipantHandRaised({
				sessionId: 'session-id-2',
				raisedHand: { state: false, timestamp: 3 },
			})

			expect(signalingStateStore.getParticipantRaisedHand(['session-id-2']))
				.toStrictEqual({ state: false, timestamp: null })
		})

		it('clears all raised hand entries on purgeRaisedHandsState', () => {
			signalingStateStore.setParticipantHandRaised({
				sessionId: 'session-id-1',
				raisedHand: { state: true, timestamp: 1 },
			})
			signalingStateStore.setParticipantHandRaised({
				sessionId: 'session-id-2',
				raisedHand: { state: true, timestamp: 2 },
			})

			signalingStateStore.purgeRaisedHandsState()

			expect(signalingStateStore.getParticipantRaisedHand(['session-id-1']))
				.toStrictEqual({ state: false, timestamp: null })
			expect(signalingStateStore.getParticipantRaisedHand(['session-id-2']))
				.toStrictEqual({ state: false, timestamp: null })
		})

		it('returns first matching session from list of session ids', () => {
			signalingStateStore.setParticipantHandRaised({
				sessionId: 'session-id-2',
				raisedHand: { state: true, timestamp: 1 },
			})
			signalingStateStore.setParticipantHandRaised({
				sessionId: 'session-id-3',
				raisedHand: { state: true, timestamp: 2 },
			})

			expect(signalingStateStore.getParticipantRaisedHand(['session-id-1', 'session-id-2', 'session-id-3']))
				.toStrictEqual({ state: true, timestamp: 1 })
		})

		it('throws if sessionId is empty', () => {
			expect(() => signalingStateStore.setParticipantHandRaised({
				sessionId: '',
				raisedHand: { state: true, timestamp: 1 },
			}))
				.toThrow('Missing or empty sessionId argument in call to setParticipantHandRaised')
		})
	})
})
