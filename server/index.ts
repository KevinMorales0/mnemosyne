import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool
} from "@modelcontextprotocol/sdk/types.js";

import { DatabaseSync, StatementSync } from 'node:sqlite';
import { ToolName } from "./tools.js";
import { StateGetLatestInput, StateGetLatestInputSchema, StateGetLatestOutput, StateGetLatestOutputSchema, StateSaveInput, StateSaveInputSchema, StateSaveOutput, StateSaveOutputSchema, StatesGetLatestInput, StatesGetLatestInputSchema, StatesGetLatestOutput, StatesGetLatestOutputSchema, ToolInput, ToolOutput } from "./types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ToErrorResult, ToResult, ToResultSchema } from "./utils.js";

/**
 * Mnemosyne MCP Server
 * A basic MCP server for registry and consumption of data between AI instances
 */

class MnemosyneServer {
    private server: Server;
    private memoryStore: DatabaseSync;

    private get_latest_state_query: StatementSync;
    private search_instance_history_query: StatementSync;
    private save_instance_state_query: StatementSync;
    constructor() {
        this.server = new Server(
            {
                name: "mnemosyne",
                version: "0.0.1",
            },
            {
                capabilities: {
                    tools: {}
                },
            }
        );

        this.memoryStore = new DatabaseSync(`${import.meta.dirname}/mnemosyne.db`);
        this.setupHandlers();
        this.setupErrorHandling();

        this.memoryStore.exec(
            `
            CREATE TABLE IF NOT EXISTS states (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                instance_id TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                content TEXT NOT NULL,
                char_count INTEGER NOT NULL,
                created_at INTEGER DEFAULT (strftime('%s', 'now'))
            );

            CREATE INDEX IF NOT EXISTS idx_instance ON states(instance_id);
            CREATE INDEX IF NOT EXISTS idx_timestamp ON states(timestamp);
            CREATE INDEX IF NOT EXISTS idx_instance_time ON states(instance_id, timestamp DESC);
            `
        );

        this.get_latest_state_query = this.memoryStore.prepare(
            `SELECT content, timestamp FROM states WHERE instance_id = ? ORDER BY timestamp DESC LIMIT 1`
        );

        this.search_instance_history_query = this.memoryStore.prepare(
            `SELECT content, timestamp FROM states WHERE instance_id = ? ORDER BY timestamp DESC LIMIT ?`
        );

        this.save_instance_state_query = this.memoryStore.prepare(
            `INSERT INTO states (instance_id, timestamp, content, char_count) VALUES (?, ?, ?, ?)`
        );

    }

    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error("[MCP Error]", error);
        };

        process.on("SIGINT", async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            const tools: Tool[] = [
                {
                    name: ToolName.STATE_SAVE,
                    description: "Save the latest state of an AI instance",
                    inputSchema: zodToJsonSchema(StateSaveInputSchema) as ToolInput,
                    outputSchema: ToResultSchema(StateSaveOutputSchema),
                },
                {
                    name: ToolName.STATE_GET_LATEST,
                    description: "Get the latest state of an AI instance",
                    inputSchema: zodToJsonSchema(StateGetLatestInputSchema) as ToolInput,
                    outputSchema: ToResultSchema(StateGetLatestOutputSchema),
                },
                {
                    name: ToolName.STATES_GET_LATEST,
                    description: "Get the latest states of an AI instance",
                    inputSchema: zodToJsonSchema(StatesGetLatestInputSchema) as ToolInput,
                    outputSchema: ToResultSchema(StatesGetLatestOutputSchema),
                }
            ];
            return {
                tools,
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                const { name, arguments: args } = request.params;

                switch (name) {
                    case ToolName.STATE_SAVE:
                        const stateSaveInput = StateSaveInputSchema.parse(args);
                        return ToResult(await this.handleStateSave(stateSaveInput));
                    case ToolName.STATE_GET_LATEST:
                        const stateGetLatestInput = StateGetLatestInputSchema.parse(args);
                        return ToResult(await this.handleStateGetLatest(stateGetLatestInput));
                    case ToolName.STATES_GET_LATEST:
                        const statesGetLatestInput = StatesGetLatestInputSchema.parse(args);
                        return ToResult(await this.handleStatesGetLatest(statesGetLatestInput));
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            } catch (error) {
                return ToErrorResult(error);
            }
        });
    }

    async handleStateSave(args: StateSaveInput): Promise<StateSaveOutput> {
        const { instance_id, content } = args;
        const timestamp = Date.now();
        const char_count = content.length;
        this.save_instance_state_query.run(instance_id, timestamp, content, char_count);
        return {
            date: new Date(timestamp),
        };
    }

    async handleStateGetLatest(args: StateGetLatestInput): Promise<StateGetLatestOutput> {
        const { instance_id } = args;
        const result = this.get_latest_state_query.get(instance_id);
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
        return {
            date: new Date(timestamp),
            content,
        };
    }

    async handleStatesGetLatest(args: StatesGetLatestInput): Promise<StatesGetLatestOutput> {
        const { instance_id, states_back } = args;
        const result = this.search_instance_history_query.all(instance_id, states_back);
        if (result.length === 0) {
            return null;
        }
        return {
            items: result.map((item) => {
                if (typeof item.content !== "string") {
                    throw new Error("Content is not a string");
                }
                if (typeof item.timestamp !== "number") {
                    throw new Error("Timestamp is not a number");
                }
                return {
                    date: new Date(item.timestamp),
                    content: item.content,
                };
            }),
        };
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
    }
}

// Start the server
const server = new MnemosyneServer();
server.run().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});

