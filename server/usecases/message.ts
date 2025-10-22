/*
 * MESSAGE_CREATE = "message_create",
 * MESSAGE_GET_BY_ID = "message_get_by_id",
 * MESSAGE_GET_LATEST_UNREADED = "message_get_latest_unreaded",
 * MESSAGE_GET_OLDEST_UNREADED = "message_get_oldest_unreaded",
 * MESSAGES_GET_UNREADED = "messages_get_unreaded",
 */

import { Messages } from "../repos/messages";
import { Agents } from "../repos/agents";
import { 
    MessageCreateInput,
    MessageCreateOutput,
    MessageGetByIdInput,
    MessageGetByIdOutput,
    MessageGetLatestUnreadedInput,
    MessageGetLatestUnreadedOutput,
    MessageGetOldestUnreadedInput,
    MessageGetOldestUnreadedOutput,
    MessagesGetUnreadedInput,
    MessagesGetUnreadedOutput,
    MessageSetAsReadedInput,
    MessageSetAsReadedOutput,
} from "../types/message";

interface IMessageRepository {
    get messages(): Messages;
    get agents(): Agents;
}

export async function handle_message_create(repo: IMessageRepository, args: MessageCreateInput): Promise<MessageCreateOutput> {
    const result = repo.messages.createMessage(args.sender, args.receiver, args.content);
    const unreadedMessages = repo.agents.getAgentUnreadedMessages(args.receiver);
    repo.agents.updateAgentUnreadedMessages(args.receiver, unreadedMessages + 1);
    return {
        id: result.id,
    };
}

export async function handle_message_get_by_id(repo: IMessageRepository, args: MessageGetByIdInput): Promise<MessageGetByIdOutput> {
    const result = repo.messages.getMessage(args.id);
    if (result === null) {
        return null;
    }
    return {
        id: result.id,
        sender: result.sender,
        receiver: result.receiver,
        content: result.content,
        date: new Date(result.timestamp),
    };
}

export async function handle_message_get_latest_unreaded(repo: IMessageRepository, args: MessageGetLatestUnreadedInput): Promise<MessageGetLatestUnreadedOutput> {
    const result = repo.messages.getLatestUnreadedMessage(args.receiver);
    if (result === null) {
        return null;
    }
    return {
        id: result.id,
        sender: result.sender,
        receiver: result.receiver,
        content: result.content,
        date: new Date(result.timestamp),
    };
}

export async function handle_message_get_oldest_unreaded(repo: IMessageRepository, args: MessageGetOldestUnreadedInput): Promise<MessageGetOldestUnreadedOutput> {
    const result = repo.messages.getOldestUnreadedMessage(args.receiver);
    if (result === null) {
        return null;
    }
    return {
        id: result.id,
        sender: result.sender,
        receiver: result.receiver,
        content: result.content,
        date: new Date(result.timestamp),
    };
}

export async function handle_messages_get_unreaded(repo: IMessageRepository, args: MessagesGetUnreadedInput): Promise<MessagesGetUnreadedOutput> {
    const result = repo.messages.getUnreadedMessages(args.receiver);
    if (result === null) {
        return null;
    }
    return {
        items: result.map((item) => {
            return {
                id: item.id,
                sender: item.sender,
                receiver: item.receiver,
                content: item.content,
                date: new Date(item.timestamp),
            };
        }),
    };
}

export async function handle_message_set_as_readed(repo: IMessageRepository, args: MessageSetAsReadedInput): Promise<MessageSetAsReadedOutput> {
    const result = repo.messages.getMessage(args.id);
    if (result === null) {
        return null;
    }
    repo.messages.updateIsReadedMessages(args.id, true);
    const unreadedMessages = repo.agents.getAgentUnreadedMessages(result.receiver);
    repo.agents.updateAgentUnreadedMessages(result.receiver, unreadedMessages - 1);
    return {
        id: result.id,
    };
}

