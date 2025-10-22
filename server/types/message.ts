import { z } from "zod";

// Message tools Input Schemas

/**
 * MESSAGE_CREATE = "message_create",
 * MESSAGE_GET_BY_ID = "message_get_by_id",
 * MESSAGE_GET_LATEST_UNREADED = "message_get_latest_unreaded",
 * MESSAGE_GET_OLDEST_UNREADED = "message_get_oldest_unreaded",
 * MESSAGES_GET_UNREADED = "messages_get_unreaded",
 * MESSAGE_SET_AS_READED = "message_set_as_readed",
 */

export const MessageCreateInputSchema = z.object({
    sender: z.string().describe("Agent name of the sender of the message"),
    receiver: z.string().describe("Agent name of the receiver of the message"),
    content: z.string().describe("Content of the message"),
});

export const MessageGetByIdInputSchema = z.object({
    id: z.number().describe("ID of the message"),
});

export const MessageGetLatestUnreadedInputSchema = z.object({
    receiver: z.string().describe("Agent name of the receiver of the message"),
});

export const MessageGetOldestUnreadedInputSchema = z.object({
    receiver: z.string().describe("Agent name of the receiver of the message"),
});

export const MessagesGetUnreadedInputSchema = z.object({
    receiver: z.string().describe("Agent name of the receiver of the message"),
});

export const MessageSetAsReadedInputSchema = z.object({
    id: z.number().describe("ID of the message"),
});

// Message tools Output Schemas

export const MessageCreateOutputSchema = z.union([
    z.null().describe("No message created"),
    z.object({
        id: z.number().describe("ID of the message"),
    })
]);

export const MessageGetByIdOutputSchema = z.union([
    z.null().describe("No message found"),
    z.object({
        id: z.number().describe("ID of the message"),
        sender: z.string().describe("Agent name of the sender of the message"),
        receiver: z.string().describe("Agent name of the receiver of the message"),
        content: z.string().describe("Content of the message"),
        date: z.date().describe("Date of the message"),
    })
]);
export const MessageGetLatestUnreadedOutputSchema = z.union([
    z.null().describe("No message found"),
    z.object({
        id: z.number().describe("ID of the message"),
        sender: z.string().describe("Agent name of the sender of the message"),
        receiver: z.string().describe("Agent name of the receiver of the message"),
        content: z.string().describe("Content of the message"),
        date: z.date().describe("Date of the message"),
    })
]);
export const MessageGetOldestUnreadedOutputSchema = z.union([
    z.null().describe("No message found"),
    z.object({
        id: z.number().describe("ID of the message"),
        sender: z.string().describe("Agent name of the sender of the message"),
        receiver: z.string().describe("Agent name of the receiver of the message"),
        content: z.string().describe("Content of the message"),
        date: z.date().describe("Date of the message"),
    })
]);
export const MessagesGetUnreadedOutputSchema = z.union([
    z.null().describe("No messages found"),
    z.object({
        items: z.array(
            z.object({
                id: z.number().describe("ID of the message"),
                sender: z.string().describe("Agent name of the sender of the message"),
                receiver: z.string().describe("Agent name of the receiver of the message"),
                content: z.string().describe("Content of the message"),
                date: z.date().describe("Date of the message"),
            })
        )
    })
]);
export const MessageSetAsReadedOutputSchema = z.union([
    z.null().describe("No message found"),
    z.object({
        id: z.number().describe("ID of the message"),
    })
]);

export type MessageCreateInput = z.infer<typeof MessageCreateInputSchema>;
export type MessageCreateOutput = z.infer<typeof MessageCreateOutputSchema>;
export type MessageGetByIdInput = z.infer<typeof MessageGetByIdInputSchema>;
export type MessageGetByIdOutput = z.infer<typeof MessageGetByIdOutputSchema>;
export type MessageGetLatestUnreadedInput = z.infer<typeof MessageGetLatestUnreadedInputSchema>;
export type MessageGetLatestUnreadedOutput = z.infer<typeof MessageGetLatestUnreadedOutputSchema>;
export type MessageGetOldestUnreadedInput = z.infer<typeof MessageGetOldestUnreadedInputSchema>;
export type MessageGetOldestUnreadedOutput = z.infer<typeof MessageGetOldestUnreadedOutputSchema>;
export type MessagesGetUnreadedInput = z.infer<typeof MessagesGetUnreadedInputSchema>;
export type MessagesGetUnreadedOutput = z.infer<typeof MessagesGetUnreadedOutputSchema>;
export type MessageSetAsReadedInput = z.infer<typeof MessageSetAsReadedInputSchema>;
export type MessageSetAsReadedOutput = z.infer<typeof MessageSetAsReadedOutputSchema>;

