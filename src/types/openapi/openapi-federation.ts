/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export type paths = {
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/proxy/new/user-avatar/{size}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the avatar of a cloudId user when inviting users while creating a conversation */
        get: operations["avatar-get-user-proxy-avatar-without-room"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/proxy/new/user-avatar/{size}/dark": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the dark mode avatar of a cloudId user when inviting users while creating a conversation */
        get: operations["avatar-get-user-proxy-avatar-dark-without-room"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/proxy/{token}/user-avatar/{size}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the avatar of a cloudId user */
        get: operations["avatar-get-user-proxy-avatar"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/proxy/{token}/user-avatar/{size}/dark": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the dark mode avatar of a cloudId user */
        get: operations["avatar-get-user-proxy-avatar-dark"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/federation/invitation/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Accept a federation invites
         * @description 🚧 Draft: Still work in progress
         */
        post: operations["federation-accept-share"];
        /**
         * Decline a federation invites
         * @description 🚧 Draft: Still work in progress
         */
        delete: operations["federation-reject-share"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/federation/invitation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get a list of federation invites
         * @description 🚧 Draft: Still work in progress
         */
        get: operations["federation-get-shares"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/room/{token}/federation/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Join room on the host server using the session id of the federated user.
         * @description The session id can be null only for requests from Talk < 20.
         */
        post: operations["room-join-federated-room"];
        /** Leave room on the host server using the session id of the federated user. */
        delete: operations["room-leave-federated-room"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        BaseMessage: {
            actorDisplayName: string;
            actorId: string;
            actorType: string;
            /** Format: int64 */
            expirationTimestamp: number;
            message: string;
            messageParameters: {
                [key: string]: components["schemas"]["RichObjectParameter"];
            };
            messageType: string;
            systemMessage: string;
        };
        Capabilities: {
            features: string[];
            "features-local": string[];
            config: {
                attachments: {
                    allowed: boolean;
                    folder?: string;
                };
                call: {
                    enabled: boolean;
                    "breakout-rooms": boolean;
                    recording: boolean;
                    /** Format: int64 */
                    "recording-consent": number;
                    "supported-reactions": string[];
                    "predefined-backgrounds": string[];
                    "can-upload-background": boolean;
                    "sip-enabled": boolean;
                    "sip-dialout-enabled": boolean;
                    "can-enable-sip": boolean;
                };
                chat: {
                    /** Format: int64 */
                    "max-length": number;
                    /** Format: int64 */
                    "read-privacy": number;
                    "has-translation-providers": boolean;
                    /** Format: int64 */
                    "typing-privacy": number;
                };
                conversations: {
                    "can-create": boolean;
                };
                federation: {
                    enabled: boolean;
                    "incoming-enabled": boolean;
                    "outgoing-enabled": boolean;
                    "only-trusted-servers": boolean;
                };
                previews: {
                    /** Format: int64 */
                    "max-gif-size": number;
                };
                signaling: {
                    /** Format: int64 */
                    "session-ping-limit": number;
                    "hello-v2-token-key"?: string;
                };
            };
            "config-local": {
                [key: string]: string[];
            };
            version: string;
        };
        ChatMessage: components["schemas"]["BaseMessage"] & {
            /** @enum {boolean} */
            deleted?: true;
            /** Format: int64 */
            id: number;
            isReplyable: boolean;
            markdown: boolean;
            reactions: {
                [key: string]: number;
            };
            reactionsSelf?: string[];
            referenceId: string;
            /** Format: int64 */
            timestamp: number;
            token: string;
            lastEditActorDisplayName?: string;
            lastEditActorId?: string;
            lastEditActorType?: string;
            /** Format: int64 */
            lastEditTimestamp?: number;
            silent?: boolean;
        };
        ChatProxyMessage: components["schemas"]["BaseMessage"];
        FederationInvite: {
            /** Format: int64 */
            id: number;
            /** Format: int64 */
            state: number;
            localCloudId: string;
            localToken: string;
            /** Format: int64 */
            remoteAttendeeId: number;
            remoteServerUrl: string;
            remoteToken: string;
            roomName: string;
            userId: string;
            inviterCloudId: string;
            inviterDisplayName: string;
        };
        OCSMeta: {
            status: string;
            statuscode: number;
            message?: string;
            totalitems?: string;
            itemsperpage?: string;
        };
        PublicCapabilities: {
            spreed: components["schemas"]["Capabilities"];
        } | unknown[];
        RichObjectParameter: {
            type: string;
            id: string;
            name: string;
            server?: string;
            link?: string;
            /** @enum {string} */
            "call-type"?: "one2one" | "group" | "public";
            "icon-url"?: string;
            "message-id"?: string;
            boardname?: string;
            stackname?: string;
            size?: string;
            path?: string;
            mimetype?: string;
            /** @enum {string} */
            "preview-available"?: "yes" | "no";
            mtime?: string;
            latitude?: string;
            longitude?: string;
            description?: string;
            thumb?: string;
            website?: string;
            /** @enum {string} */
            visibility?: "0" | "1";
            /** @enum {string} */
            assignable?: "0" | "1";
            conversation?: string;
            etag?: string;
            permissions?: string;
            width?: string;
            height?: string;
            blurhash?: string;
        };
        Room: {
            actorId: string;
            actorType: string;
            /** Format: int64 */
            attendeeId: number;
            /** Format: int64 */
            attendeePermissions: number;
            attendeePin: string | null;
            avatarVersion: string;
            /** Format: int64 */
            breakoutRoomMode: number;
            /** Format: int64 */
            breakoutRoomStatus: number;
            /** Format: int64 */
            callFlag: number;
            /** Format: int64 */
            callPermissions: number;
            /** Format: int64 */
            callRecording: number;
            /** Format: int64 */
            callStartTime: number;
            canDeleteConversation: boolean;
            canEnableSIP: boolean;
            canLeaveConversation: boolean;
            canStartCall: boolean;
            /** Format: int64 */
            defaultPermissions: number;
            description: string;
            displayName: string;
            hasCall: boolean;
            hasPassword: boolean;
            /** Format: int64 */
            id: number;
            isCustomAvatar: boolean;
            isFavorite: boolean;
            /** Format: int64 */
            lastActivity: number;
            /** Format: int64 */
            lastCommonReadMessage: number;
            lastMessage: components["schemas"]["RoomLastMessage"] | unknown[];
            /** Format: int64 */
            lastPing: number;
            /** Format: int64 */
            lastReadMessage: number;
            /** Format: int64 */
            listable: number;
            /** Format: int64 */
            lobbyState: number;
            /** Format: int64 */
            lobbyTimer: number;
            /** Format: int64 */
            mentionPermissions: number;
            /** Format: int64 */
            messageExpiration: number;
            name: string;
            /** Format: int64 */
            notificationCalls: number;
            /** Format: int64 */
            notificationLevel: number;
            objectId: string;
            objectType: string;
            /** Format: int64 */
            participantFlags: number;
            /** Format: int64 */
            participantType: number;
            /** Format: int64 */
            permissions: number;
            /** Format: int64 */
            readOnly: number;
            /** Format: int64 */
            recordingConsent: number;
            remoteServer?: string;
            remoteToken?: string;
            sessionId: string;
            /** Format: int64 */
            sipEnabled: number;
            status?: string;
            /** Format: int64 */
            statusClearAt?: number | null;
            statusIcon?: string | null;
            statusMessage?: string | null;
            token: string;
            /** Format: int64 */
            type: number;
            unreadMention: boolean;
            unreadMentionDirect: boolean;
            /** Format: int64 */
            unreadMessages: number;
            isArchived: boolean;
        };
        RoomLastMessage: components["schemas"]["ChatMessage"] | components["schemas"]["ChatProxyMessage"];
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    "avatar-get-user-proxy-avatar-without-room": {
        parameters: {
            query: {
                /** @description Federation CloudID to get the avatar for */
                cloudId: string;
                /** @description Theme used for background */
                darkTheme?: 0 | 1;
            };
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                /** @description Avatar size */
                size: 64 | 512;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User avatar returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    "avatar-get-user-proxy-avatar-dark-without-room": {
        parameters: {
            query: {
                /** @description Federation CloudID to get the avatar for */
                cloudId: string;
            };
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                /** @description Avatar size */
                size: 64 | 512;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User avatar returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    "avatar-get-user-proxy-avatar": {
        parameters: {
            query: {
                /** @description Federation CloudID to get the avatar for */
                cloudId: string;
                /** @description Theme used for background */
                darkTheme?: 0 | 1;
            };
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                token: string;
                /** @description Avatar size */
                size: 64 | 512;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User avatar returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    "avatar-get-user-proxy-avatar-dark": {
        parameters: {
            query: {
                /** @description Federation CloudID to get the avatar for */
                cloudId: string;
            };
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                token: string;
                /** @description Avatar size */
                size: 64 | 512;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User avatar returned */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "*/*": string;
                };
            };
        };
    };
    "federation-accept-share": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                /** @description ID of the share */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invite accepted successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: components["schemas"]["Room"];
                        };
                    };
                };
            };
            /** @description Invite can not be accepted (maybe it was accepted already) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error: string;
                            };
                        };
                    };
                };
            };
            /** @description Invite can not be found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error?: string;
                            };
                        };
                    };
                };
            };
            /** @description Remote server could not be reached to notify about the acceptance */
            410: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error: string;
                            };
                        };
                    };
                };
            };
        };
    };
    "federation-reject-share": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
                /** @description ID of the share */
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Invite declined successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: unknown;
                        };
                    };
                };
            };
            /** @description Invite was already accepted, use the "Remove the current user from a room" endpoint instead */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error?: string;
                            };
                        };
                    };
                };
            };
            /** @description Invite can not be found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: {
                                error?: string;
                            };
                        };
                    };
                };
            };
        };
    };
    "federation-get-shares": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v1";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Get list of received federation invites successfully */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: components["schemas"]["FederationInvite"][];
                        };
                    };
                };
            };
        };
    };
    "room-join-federated-room": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                /** @description Token of the room */
                token: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Federated session id to join with */
                    sessionId?: string | null;
                };
            };
        };
        responses: {
            /** @description Federated user joined the room */
            200: {
                headers: {
                    "X-Nextcloud-Talk-Hash"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: components["schemas"]["Room"];
                        };
                    };
                };
            };
            /** @description Room not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: unknown;
                        };
                    };
                };
            };
        };
    };
    "room-leave-federated-room": {
        parameters: {
            query: {
                /** @description Federated session id to leave with */
                sessionId: string;
            };
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                /** @description Token of the room */
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successfully left the room */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: unknown;
                        };
                    };
                };
            };
            /** @description Room not found (non-federation request) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ocs: {
                            meta: components["schemas"]["OCSMeta"];
                            data: unknown;
                        };
                    };
                };
            };
        };
    };
}
