Feature: callapi/recording
  Background:
    Given user "participant1" exists
    Given user "participant2" exists

  Scenario: Start and stop video recording
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    When user "participant1" starts "video" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":1,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 3             |
    And recording server sent started request for "video" recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage        |
      | room1 | users     | participant1 | participant1-displayname | recording_started    |
      | room1 | users     | participant1 | participant1-displayname | call_started         |
      | room1 | users     | participant1 | participant1-displayname | conversation_created |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    When user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    And recording server sent stopped request for recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage        |
      | room1 | users     | participant1 | participant1-displayname | recording_stopped    |
      | room1 | users     | participant1 | participant1-displayname | recording_started    |
      | room1 | users     | participant1 | participant1-displayname | call_started         |
      | room1 | users     | participant1 | participant1-displayname | conversation_created |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Start and stop audio recording
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    When user "participant1" starts "audio" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":2,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 4             |
    And recording server sent started request for "audio" recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage           |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_started |
      | room1 | users     | participant1 | participant1-displayname | call_started            |
      | room1 | users     | participant1 | participant1-displayname | conversation_created    |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    When user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    And recording server sent stopped request for recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage           |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_stopped |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_started |
      | room1 | users     | participant1 | participant1-displayname | call_started            |
      | room1 | users     | participant1 | participant1-displayname | conversation_created    |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Non moderators need to receive the notification Start and stop audio recording
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    And user "participant1" adds user "participant2" to room "room1" with 200 (v4)
    And user "participant2" joins room "room1" with 200 (v4)
    When user "participant1" starts "audio" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":2,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 4             |
    And user "participant2" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 4             |
    And recording server sent started request for "audio" recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage           |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_started |
      | room1 | users     | participant1 | participant1-displayname | user_added              |
      | room1 | users     | participant1 | participant1-displayname | call_started            |
      | room1 | users     | participant1 | participant1-displayname | conversation_created    |
    Then user "participant2" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage           |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_started |
      | room1 | users     | participant1 | participant1-displayname | user_added              |
      | room1 | users     | participant1 | participant1-displayname | call_started            |
      | room1 | users     | participant1 | participant1-displayname | conversation_created    |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    And user "participant2" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    When user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    And user "participant2" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    And recording server sent stopped request for recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage           |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_stopped |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_started |
      | room1 | users     | participant1 | participant1-displayname | user_added              |
      | room1 | users     | participant1 | participant1-displayname | call_started            |
      | room1 | users     | participant1 | participant1-displayname | conversation_created    |
    Then user "participant2" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage           |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_stopped |
      | room1 | users     | participant1 | participant1-displayname | audio_recording_started |
      | room1 | users     | participant1 | participant1-displayname | user_added              |
      | room1 | users     | participant1 | participant1-displayname | call_started            |
      | room1 | users     | participant1 | participant1-displayname | conversation_created    |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |
    And user "participant2" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Recording failed to start
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    And user "participant1" starts "video" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":1,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 3             |
    When recording server sent failed request for recording in room "room1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage        |
      | room1 | users     | participant1 | participant1-displayname | call_started         |
      | room1 | users     | participant1 | participant1-displayname | conversation_created |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 5             |

  Scenario: Video recording failed
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    And user "participant1" starts "video" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":1,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 3             |
    And recording server sent started request for "video" recording in room "room1" as "participant1" with 200
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    When recording server sent failed request for recording in room "room1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId               | actorDisplayName         | systemMessage        |
      | room1 | guests    | failed-to-get-session |                          | recording_failed     |
      | room1 | users     | participant1          | participant1-displayname | recording_started    |
      | room1 | users     | participant1          | participant1-displayname | call_started         |
      | room1 | users     | participant1          | participant1-displayname | conversation_created |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 5             |

  Scenario: Start and stop recording again after the previous one failed to start
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    And user "participant1" starts "video" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":1,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 3             |
    And recording server sent failed request for recording in room "room1" with 200
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 5             |
    When user "participant1" starts "video" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":1,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 3             |
    And recording server sent started request for "video" recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage        |
      | room1 | users     | participant1 | participant1-displayname | recording_started    |
      | room1 | users     | participant1 | participant1-displayname | call_started         |
      | room1 | users     | participant1 | participant1-displayname | conversation_created |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    When user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    And recording server sent stopped request for recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId      | actorDisplayName         | systemMessage        |
      | room1 | users     | participant1 | participant1-displayname | recording_stopped    |
      | room1 | users     | participant1 | participant1-displayname | recording_started    |
      | room1 | users     | participant1 | participant1-displayname | call_started         |
      | room1 | users     | participant1 | participant1-displayname | conversation_created |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Start and stop recording again after the previous one failed
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    And user "participant1" starts "video" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":1,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 3             |
    And recording server sent started request for "video" recording in room "room1" as "participant1" with 200
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    And recording server sent failed request for recording in room "room1" with 200
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 5             |
    When user "participant1" starts "video" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":1,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 3             |
    And recording server sent started request for "video" recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId               | actorDisplayName         | systemMessage        |
      | room1 | users     | participant1          | participant1-displayname | recording_started    |
      | room1 | guests    | failed-to-get-session |                          | recording_failed     |
      | room1 | users     | participant1          | participant1-displayname | recording_started    |
      | room1 | users     | participant1          | participant1-displayname | call_started         |
      | room1 | users     | participant1          | participant1-displayname | conversation_created |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    When user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    And recording server sent stopped request for recording in room "room1" as "participant1" with 200
    Then user "participant1" sees the following system messages in room "room1" with 200 (v1)
      | room  | actorType | actorId               | actorDisplayName         | systemMessage        |
      | room1 | users     | participant1          | participant1-displayname | recording_stopped    |
      | room1 | users     | participant1          | participant1-displayname | recording_started    |
      | room1 | guests    | failed-to-get-session |                          | recording_failed     |
      | room1 | users     | participant1          | participant1-displayname | recording_started    |
      | room1 | users     | participant1          | participant1-displayname | call_started         |
      | room1 | users     | participant1          | participant1-displayname | conversation_created |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Get error when start|stop recording and already did this
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    When user "participant1" starts "audio" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":2,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And recording server sent started request for "audio" recording in room "room1" as "participant1" with 200
    And user "participant1" starts "audio" recording in room "room1" with 400 (v1)
    Then the response error matches with "recording"
    And recording server received the following requests
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    When user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And recording server sent stopped request for recording in room "room1" as "participant1" with 200
    And user "participant1" stops recording in room "room1" with 200 (v1)
    Then recording server received the following requests
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |
    When user "participant1" starts "video" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":1,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And recording server sent started request for "video" recording in room "room1" as "participant1" with 200
    And user "participant1" starts "video" recording in room "room1" with 400 (v1)
    Then the response error matches with "recording"
    And recording server received the following requests
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 1             |
    When user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" stops recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And recording server sent stopped request for recording in room "room1" as "participant1" with 200
    And user "participant1" stops recording in room "room1" with 200 (v1)
    Then recording server received the following requests
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Get error when try to start recording with invalid status
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    When user "participant1" starts "invalid" recording in room "room1" with 400 (v1)
    Then the response error matches with "status"
    And recording server received the following requests
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Manager try without success to start recording when signaling is internal
    Given user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    When user "participant1" starts "video" recording in room "room1" with 400 (v1)
    Then the response error matches with "config"
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |
    When user "participant1" starts "audio" recording in room "room1" with 400 (v1)
    Then the response error matches with "config"
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Get error when non moderator/owner try to start recording
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    And user "participant1" adds user "participant2" to room "room1" with 200 (v4)
    And user "participant2" joins room "room1" with 200 (v4)
    And user "participant2" joins call "room1" with 200 (v4)
    When user "participant2" starts "video" recording in room "room1" with 403 (v1)
    And user "participant2" starts "audio" recording in room "room1" with 403 (v1)
    Then recording server received the following requests
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Get error when try to start recording and no call started
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    When user "participant1" starts "video" recording in room "room1" with 400 (v1)
    Then the response error matches with "call"
    And recording server received the following requests
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |
    When user "participant1" starts "audio" recording in room "room1" with 400 (v1)
    Then the response error matches with "call"
    And recording server received the following requests
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Store recording with success
    Given user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    When user "participant1" store recording file "/img/join_call.ogg" in room "room1" with 200 (v1)
    Then user "participant1" has the following notifications
      | app    | object_type | object_id | subject                      | message                                                                                      |
      | spreed | recording   | room1     | Call recording now available | The recording for the call in room1 was uploaded to /Talk/Recording/{{TOKEN}}/join_call.ogg. |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Store recording with failure
    Given user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    When user "participant1" store recording file "big" in room "room1" with 400 (v1)
    Then user "participant1" has the following notifications
      | app    | object_type           | object_id | subject                         |
      | spreed | recording_information | room1     | Failed to upload call recording |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Stop recording automatically when end the call
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    And user "participant1" starts "audio" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":2,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And recording server sent started request for "audio" recording in room "room1" as "participant1" with 200
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    When user "participant1" ends call "room1" with 200 (v4)
    Then recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":{"actor":{"type":"users","id":"participant1"}}} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    And recording server sent stopped request for recording in room "room1" as "participant1" with 200
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |

  Scenario: Stop recording automatically when the last participant go out
    Given recording server is started
    And user "participant1" creates room "room1" (v4)
      | roomType | 2 |
      | roomName | room1 |
    And user "participant1" joins room "room1" with 200 (v4)
    And user "participant1" joins call "room1" with 200 (v4)
    And user "participant1" starts "audio" recording in room "room1" with 200 (v1)
    And recording server received the following requests
      | token | data                                                         |
      | room1 | {"type":"start","start":{"status":2,"owner":"participant1","actor":{"type":"users","id":"participant1"}}} |
    And recording server sent started request for "audio" recording in room "room1" as "participant1" with 200
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    When user "participant1" leaves room "room1" with 200 (v4)
    Then recording server received the following requests
      | token | data             |
      | room1 | {"type":"stop","stop":[]} |
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 2             |
    And recording server sent stopped request for recording in room "room1" with 200
    And user "participant1" is participant of the following unordered rooms (v4)
      | type | name  | callRecording |
      | 2    | room1 | 0             |
