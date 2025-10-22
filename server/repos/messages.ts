import { DatabaseSync, StatementSync } from "node:sqlite";

export class Messages {
    private store: DatabaseSync;

    private get_message_query: StatementSync;
    private get_unreaded_messages_query: StatementSync;
    private get_latest_unreaded_message_query: StatementSync;
    private get_oldest_unreaded_message_query: StatementSync;
    private create_message_query: StatementSync;
    private update_is_readed_messages_query: StatementSync;
    
    constructor(store: DatabaseSync) {
        this.store = store;

        this.store.exec(
            `
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender TEXT NOT NULL REFERENCES agents(agent_name),
                receiver TEXT NOT NULL REFERENCES agents(agent_name),
                content TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                is_readed INTEGER NOT NULL DEFAULT 0
            );
            `
        );

        this.get_message_query = this.store.prepare(
            `SELECT id, sender, receiver, content, timestamp FROM messages WHERE id = ?`
        );

        this.get_unreaded_messages_query = this.store.prepare(
            `SELECT id, sender, receiver, content, timestamp FROM messages WHERE receiver = ? AND is_readed = 0`
        );

        this.get_latest_unreaded_message_query = this.store.prepare(
            `SELECT id, sender, receiver, content, timestamp FROM messages WHERE receiver = ? AND is_readed = 0 ORDER BY timestamp DESC LIMIT 1`
        );

        this.get_oldest_unreaded_message_query = this.store.prepare(
            `SELECT id, sender, receiver, content, timestamp FROM messages WHERE receiver = ? AND is_readed = 0 ORDER BY timestamp ASC LIMIT 1`
        );

        this.create_message_query = this.store.prepare(
            `INSERT INTO messages (sender, receiver, content, timestamp) VALUES (?, ?, ?, ?)`
        );

        this.update_is_readed_messages_query = this.store.prepare(
            `UPDATE messages SET is_readed = ? WHERE id = ?`
        );
    }

    public getMessage(id: number): {id: number, sender: string, receiver: string, content: string, timestamp: number} | null {
        const result = this.get_message_query.get(id);
        if (!result) {
            return null;
        }
        if (typeof result.id !== "number") {
            throw new Error("Id is not a number");
        }
        if (typeof result.sender !== "string") {
            throw new Error("Sender is not a string");
        }
        if (typeof result.receiver !== "string") {
            throw new Error("Receiver is not a string");
        }
        if (typeof result.content !== "string") {
            throw new Error("Content is not a string");
        }
        if (typeof result.timestamp !== "number") {
            throw new Error("Timestamp is not a number");
        }
        return {id: result.id, sender: result.sender, receiver: result.receiver, content: result.content, timestamp: result.timestamp};
    }

    public getUnreadedMessages(agentName: string): {id: number, sender: string, receiver: string, content: string, timestamp: number}[] | null {
        const result = this.get_unreaded_messages_query.all(agentName);
        if (result.length === 0) {
            return null;
        }
        return result.map((item) => {
            if (typeof item.id !== "number") {
                throw new Error("Id is not a number");
            }
            if (typeof item.sender !== "string") {
                throw new Error("Sender is not a string");
            }
            if (typeof item.receiver !== "string") {
                throw new Error("Receiver is not a string");
            }
            if (typeof item.content !== "string") {
                throw new Error("Content is not a string");
            }
            if (typeof item.timestamp !== "number") {
                throw new Error("Timestamp is not a number");
            }
            return {id: item.id, sender: item.sender, receiver: item.receiver, content: item.content, timestamp: item.timestamp};
        });
    }

    public getLatestUnreadedMessage(agentName: string): {id: number, sender: string, receiver: string, content: string, timestamp: number} | null {
        const result = this.get_latest_unreaded_message_query.get(agentName);
        if (!result) {
            return null;
        }
        if (typeof result.id !== "number") {
            throw new Error("Id is not a number");
        }
        if (typeof result.sender !== "string") {
            throw new Error("Sender is not a string");
        }
        if (typeof result.receiver !== "string") {
            throw new Error("Receiver is not a string");
        }
        if (typeof result.content !== "string") {
            throw new Error("Content is not a string");
        }
        if (typeof result.timestamp !== "number") {
            throw new Error("Timestamp is not a number");
        }
        return {id: result.id, sender: result.sender, receiver: result.receiver, content: result.content, timestamp: result.timestamp};
    }

    public getOldestUnreadedMessage(agentName: string): {id: number, sender: string, receiver: string, content: string, timestamp: number} | null {
        const result = this.get_oldest_unreaded_message_query.get(agentName);
        if (!result) {
            return null;
        }
        if (typeof result.id !== "number") {
            throw new Error("Id is not a number");
        }
        if (typeof result.sender !== "string") {
            throw new Error("Sender is not a string");
        }
        if (typeof result.receiver !== "string") {
            throw new Error("Receiver is not a string");
        }
        if (typeof result.content !== "string") {
            throw new Error("Content is not a string");
        }
        if (typeof result.timestamp !== "number") {
            throw new Error("Timestamp is not a number");
        }
        return {id: result.id, sender: result.sender, receiver: result.receiver, content: result.content, timestamp: result.timestamp};
    }

    public createMessage(sender: string, receiver: string, content: string): {id: number} {
        const result = this.create_message_query.run(sender, receiver, content, Date.now());
        return {id: Number(result.lastInsertRowid)};
    }

    public updateIsReadedMessages(id: number, isReaded: boolean) {
        this.update_is_readed_messages_query.run(isReaded ? 1 : 0, id);
    }
}
