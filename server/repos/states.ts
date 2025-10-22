import { DatabaseSync, StatementSync } from "node:sqlite";

export class States {
    private store: DatabaseSync;

    private getLatestStateQuery: StatementSync;
    private getLatestStatesQuery: StatementSync;
    private saveInstanceStateQuery: StatementSync;

    constructor(store: DatabaseSync) {
        this.store = store;

        this.store.exec(
            `
            CREATE TABLE IF NOT EXISTS states (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                agent_name TEXT NOT NULL REFERENCES agents(agent_name),
                timestamp INTEGER NOT NULL,
                content TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_instance ON states(agent_name);
            CREATE INDEX IF NOT EXISTS idx_timestamp ON states(timestamp);
            CREATE INDEX IF NOT EXISTS idx_instance_time ON states(agent_name, timestamp DESC);
            `
        );

        this.getLatestStateQuery = this.store.prepare(
            `SELECT content, timestamp FROM states WHERE agent_name = ? ORDER BY timestamp DESC LIMIT 1`
        );

        this.getLatestStatesQuery = this.store.prepare(
            `SELECT content, timestamp FROM states WHERE agent_name = ? ORDER BY timestamp DESC LIMIT ?`
        );

        this.saveInstanceStateQuery = this.store.prepare(
            `INSERT INTO states (agent_name, timestamp, content) VALUES (?, ?, ?)`
        );
    }

    public getLatestState(agentName: string): {content: string, timestamp: number} | null {
        const result = this.getLatestStateQuery.get(agentName);
        if (!result) {
            return null;
        }
        const content = result.content;
        if (typeof content !== "string") {
            throw new Error("Content is not a string");
        }
        const timestamp = result.timestamp;
        if (typeof timestamp !== "number") {
            throw new Error("Timestamp is not a number");
        }
        return {content, timestamp};
    }

    public getLatestStates(agentName: string, limit: number): {content: string, timestamp: number}[] | null {
        const results = this.getLatestStatesQuery.all(agentName, limit);
        if (results.length === 0) {
            return null;
        }
        return results.map((result) => {
            const content = result.content;
            if (typeof content !== "string") {
                throw new Error("Content is not a string");
            }
            const timestamp = result.timestamp;
            if (typeof timestamp !== "number") {
                throw new Error("Timestamp is not a number");
            }
            return {content, timestamp};
        });
    }

    public saveInstanceState(agentName: string, content: string): {timestamp: number} {
        const timestamp = Date.now();
        this.saveInstanceStateQuery.run(agentName, timestamp, content);
        return {timestamp};
    }
}
