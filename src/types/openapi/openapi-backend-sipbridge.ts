/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export type paths = {
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/room/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a room */
        get: operations["room-get-single-room"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/room/{token}/pin/{pin}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Verify a dial-in PIN (SIP bridge) */
        get: operations["room-verify-dial-in-pin-deprecated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/room/{token}/verify-dialin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify a dial-in PIN (SIP bridge) */
        post: operations["room-verify-dial-in-pin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/room/{token}/verify-dialout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify a dial-out number (SIP bridge) */
        post: operations["room-verify-dial-out-number"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/room/{token}/open-dial-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a guest by their dial-in */
        post: operations["room-create-guest-by-dial-in"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/ocs/v2.php/apps/spreed/api/{apiVersion}/room/{token}/rejected-dialout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Reset call ID of a dial-out participant when the SIP gateway rejected it */
        delete: operations["room-rejected-dial-out-request"];
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
                    "start-without-media": boolean;
                    /** Format: int64 */
                    "max-duration": number;
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
            invitedActorId?: string;
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
    "room-get-single-room": {
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
        requestBody?: never;
        responses: {
            /** @description Room returned */
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
            /** @description SIP request invalid */
            401: {
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
    "room-verify-dial-in-pin-deprecated": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                token: string;
                /** @description PIN the participant used to dial-in */
                pin: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Participant returned */
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
            /** @description SIP request invalid */
            401: {
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
            /** @description Participant not found */
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
            /** @description SIP dial-in is not configured */
            501: {
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
    "room-verify-dial-in-pin": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                token: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description PIN the participant used to dial-in */
                    pin: string;
                };
            };
        };
        responses: {
            /** @description Participant returned */
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
            /** @description SIP request invalid */
            401: {
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
            /** @description Participant not found */
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
            /** @description SIP dial-in is not configured */
            501: {
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
    "room-verify-dial-out-number": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                token: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description E164 formatted phone number */
                    number: string;
                    /**
                     * @description Additional details to verify the validity of the request
                     * @default {}
                     */
                    options?: {
                        actorId?: string;
                        actorType?: string;
                        /** Format: int64 */
                        attendeeId?: number;
                    };
                };
            };
        };
        responses: {
            /** @description Participant created successfully */
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
            /** @description Phone number and details could not be confirmed */
            400: {
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
            /** @description SIP request invalid */
            401: {
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
            /** @description Phone number is not invited as a participant */
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
            /** @description SIP dial-out is not configured */
            501: {
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
    "room-create-guest-by-dial-in": {
        parameters: {
            query?: never;
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Participant created successfully */
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
            /** @description SIP not enabled */
            400: {
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
            /** @description SIP request invalid */
            401: {
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
    "room-rejected-dial-out-request": {
        parameters: {
            query: {
                /** @description The call ID provided by the SIP bridge earlier to uniquely identify the call to terminate */
                callId: string;
                /** @description Additional details to verify the validity of the request */
                options?: string;
            };
            header: {
                /** @description Required to be true for the API request to pass */
                "OCS-APIRequest": boolean;
            };
            path: {
                apiVersion: "v4";
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Call ID reset */
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
            /** @description Call ID mismatch or attendeeId not found in $options */
            400: {
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
            /** @description SIP request invalid */
            401: {
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
            /** @description Participant was not found */
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
            /** @description SIP dial-out is not configured */
            501: {
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
