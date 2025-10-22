import { DatabaseSync, StatementSync } from "node:sqlite";

export class Agents {
    private store: DatabaseSync;

    private get_agent_unreaded_messages_query: StatementSync;
    private get_agents_details_query: StatementSync;
    private update_agent_unreaded_messages_query: StatementSync;
    private create_agent_query: StatementSync;

    constructor(store: DatabaseSync) {
        this.store = store;

        this.store.exec(
            `
            CREATE TABLE IF NOT EXISTS agents (
                agent_name TEXT PRIMARY KEY,
                description TEXT NOT NULL,
                unreaded_messages INTEGER DEFAULT 0
            );
            `
        );

        this.get_agent_unreaded_messages_query = this.store.prepare(
            `SELECT agent_name, unreaded_messages FROM agents WHERE agent_name = ?`
        );

        this.update_agent_unreaded_messages_query = this.store.prepare(
            `UPDATE agents SET unreaded_messages = ? WHERE agent_name = ?`
        );

        this.get_agents_details_query = this.store.prepare(
            `SELECT agent_name, description FROM agents`
        );

        this.create_agent_query = this.store.prepare(
            `INSERT INTO agents (agent_name, description) VALUES (?, ?)`
        );
    }

    public getAgentUnreadedMessages(agentName: string): number {
        const result = this.get_agent_unreaded_messages_query.get(agentName);
        if (!result) {
            return 0;
        }
        if (typeof result.unreaded_messages !== "number") {
            throw new Error("Unreaded messages is not a number");
        }
        return result.unreaded_messages;
    }

    public getAgentsDetails(): {agent_name: string, description: string}[] | null {
        const results = this.get_agents_details_query.all();
        if (results.length === 0) {
            return null;
        }
        return results.map((result) => {
            if (typeof result.agent_name !== "string") {
                throw new Error("Agent name is not a string");
            }
            if (typeof result.description !== "string") {
                throw new Error("Description is not a string");
            }
            return {agent_name: result.agent_name, description: result.description};
        });
    }

    public createAgent(agentName: string, description: string) {
        this.create_agent_query.run(agentName, description);
    }

    public updateAgentUnreadedMessages(agentName: string, unreadedMessages: number) {
        this.update_agent_unreaded_messages_query.run(unreadedMessages, agentName);
    }
}
