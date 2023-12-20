Feature: chat-1/edit-message
  Background:
    Given user "participant1" exists
    Given user "participant2" exists

  Scenario: Moderator edits their own message
    Given user "participant1" creates room "room" (v4)
      | roomType | 2 |
      | roomName | room |
    And user "participant1" adds user "participant2" to room "room" with 200 (v4)
    And user "participant1" sends message "Message 1" to room "room" with 201
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message     | messageParameters | parentMessage |
      | room | users     | participant1 | participant1-displayname | Message 1   | []                |               |
    And user "participant1" edits message "Message 1" in room "room" to "Message 1 - Edit 1" with 200
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message            | messageParameters | parentMessage |
      | room | users     | participant1 | participant1-displayname | Message 1 - Edit 1 | []                |               |
    Then user "participant2" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message            | messageParameters | parentMessage |
      | room | users     | participant1 | participant1-displayname | Message 1 - Edit 1 | []                |               |
    And user "participant2" edits message "Message 1 - Edit 1" in room "room" to "Message 1 - Edit 2" with 403
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message            | messageParameters | parentMessage |
      | room | users     | participant1 | participant1-displayname | Message 1 - Edit 1 | []                |               |
    Then user "participant2" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message            | messageParameters | parentMessage |
      | room | users     | participant1 | participant1-displayname | Message 1 - Edit 1 | []                |               |

  Scenario: User and moderator edit user message
    Given user "participant1" creates room "room" (v4)
      | roomType | 2 |
      | roomName | room |
    And user "participant1" adds user "participant2" to room "room" with 200 (v4)
    And user "participant2" sends message "Message 1" to room "room" with 201
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message     | messageParameters | parentMessage |
      | room | users     | participant2 | participant2-displayname | Message 1   | []                |               |
    And user "participant1" edits message "Message 1" in room "room" to "Message 1 - Edit 1" with 200
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message            | messageParameters | parentMessage |
      | room | users     | participant2 | participant2-displayname | Message 1 - Edit 1 | []                |               |
    Then user "participant2" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message            | messageParameters | parentMessage |
      | room | users     | participant2 | participant2-displayname | Message 1 - Edit 1 | []                |               |
    And user "participant2" edits message "Message 1 - Edit 1" in room "room" to "Message 1 - Edit 2" with 200
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message            | messageParameters | parentMessage |
      | room | users     | participant2 | participant2-displayname | Message 1 - Edit 2 | []                |               |
    Then user "participant2" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message            | messageParameters | parentMessage |
      | room | users     | participant2 | participant2-displayname | Message 1 - Edit 2 | []                |               |

  Scenario: Notification handling
    Given user "participant1" creates room "room" (v4)
      | roomType | 2 |
      | roomName | room |
    And user "participant1" adds user "participant2" to room "room" with 200 (v4)
    # Join and leave to clear the invite notification
    Given user "participant2" joins room "room" with 200 (v4)
    And user "participant2" sends message "Message 1" to room "room" with 201
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message     | messageParameters | parentMessage |
      | room | users     | participant2 | participant2-displayname | Message 1   | []                |               |
    Then user "participant2" has the following notifications
    And user "participant1" edits message "Message 1" in room "room" to "Message 1 - Edit @participant2" with 200
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message                          | messageParameters | parentMessage |
      | room | users     | participant2 | participant2-displayname | Message 1 - Edit {mention-user1} | {"mention-user1":{"type":"user","id":"participant2","name":"participant2-displayname"}}                |               |
    Then user "participant2" has the following notifications
      | app    | object_type | object_id                            | subject                                                          |
      | spreed | chat        | room/Message 1 - Edit {mention-user1} | participant1-displayname mentioned you in a private conversation |
    And user "participant1" edits message "Message 1" in room "room" to "Message 1 - Edit 2" with 200
    Then user "participant1" sees the following messages in room "room" with 200
      | room | actorType | actorId      | actorDisplayName         | message                        | messageParameters | parentMessage |
      | room | users     | participant2 | participant2-displayname | Message 1 - Edit 2             | []                |               |
    Then user "participant2" has the following notifications
