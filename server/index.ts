import { Server } from "@modelcontextprotocol/sdk/server/index.js";

import { DatabaseSync } from 'node:sqlite';

import { ServerBuilder } from "./utils.js";
import { MnemosyneRepository } from "./repos/index.js";
import { ToolName } from "./tools.js";
import { 
    StateSaveInputSchema, 
    StateSaveOutputSchema,
    StateGetLatestInputSchema, 
    StateGetLatestOutputSchema,
    StatesGetLatestInputSchema, 
    StatesGetLatestOutputSchema,
} from "./types/state.js";
import { 
    MessageCreateInputSchema, 
    MessageCreateOutputSchema,
    MessageGetByIdInputSchema, 
    MessageGetByIdOutputSchema,
    MessageGetLatestUnreadedInputSchema, 
    MessageGetLatestUnreadedOutputSchema,
    MessageGetOldestUnreadedInputSchema, 
    MessageGetOldestUnreadedOutputSchema,
    MessagesGetUnreadedInputSchema, 
    MessagesGetUnreadedOutputSchema,
    MessageSetAsReadedInputSchema,
    MessageSetAsReadedOutputSchema,
} from "./types/message.js";
import { 
    AgentCreateInputSchema, 
    AgentCreateOutputSchema,
    AgentGetStatusInputSchema, 
    AgentGetStatusOutputSchema,
    AgentsGetDetailsInputSchema, 
    AgentsGetDetailsOutputSchema,
} from "./types/agent.js";

import { 
    handle_state_save,
    handle_state_get_latest,
    handle_states_get_latest,
} from "./usecases/state.js";
import {
    handle_message_create,
    handle_message_get_by_id,
    handle_message_get_latest_unreaded,
    handle_message_get_oldest_unreaded,
    handle_messages_get_unreaded,
    handle_message_set_as_readed,
} from "./usecases/message.js";
import {
    handle_agent_create,
    handle_agent_get_status,
    handle_agents_get_details,
} from "./usecases/agent.js";
import { Logger } from "./logger.js";

/**
 * Mnemosyne MCP Server
 * A basic MCP server for registry and consumption of data between AI instances
 */

const builder = new ServerBuilder<MnemosyneRepository>();

builder.set_repository(new MnemosyneRepository(new DatabaseSync(`${import.meta.dirname}/mnemosyne.db`)));

// State tools

builder
    .add_tool(
        {
            name: ToolName.STATE_SAVE,
            description: "Save a state",
            inputSchema: StateSaveInputSchema,
            outputSchema: StateSaveOutputSchema,
            handler: handle_state_save,
        }
    ).add_tool(
        {
            name: ToolName.STATE_GET_LATEST,
            description: "Get the latest state",
            inputSchema: StateGetLatestInputSchema,
            outputSchema: StateGetLatestOutputSchema,
            handler: handle_state_get_latest,
        }
    ).add_tool(
        {
            name: ToolName.STATES_GET_LATEST,
            description: "Get the latest states",
            inputSchema: StatesGetLatestInputSchema,
            outputSchema: StatesGetLatestOutputSchema,
            handler: handle_states_get_latest,
        }
    );

// Message tools

builder
    .add_tool(
        {
            name: ToolName.MESSAGE_CREATE,
            description: "Create a message",
            inputSchema: MessageCreateInputSchema,
            outputSchema: MessageCreateOutputSchema,
            handler: handle_message_create,
        }
    ).add_tool(
        {
            name: ToolName.MESSAGE_GET_BY_ID,
            description: "Get a message by ID",
            inputSchema: MessageGetByIdInputSchema,
            outputSchema: MessageGetByIdOutputSchema,
            handler: handle_message_get_by_id,
        }
    ).add_tool(
        {
            name: ToolName.MESSAGE_GET_LATEST_UNREADED,
            description: "Get the latest unreaded message",
            inputSchema: MessageGetLatestUnreadedInputSchema,
            outputSchema: MessageGetLatestUnreadedOutputSchema,
            handler: handle_message_get_latest_unreaded,
        }
    ).add_tool(
        {
            name: ToolName.MESSAGE_GET_OLDEST_UNREADED,
            description: "Get the oldest unreaded message",
            inputSchema: MessageGetOldestUnreadedInputSchema,
            outputSchema: MessageGetOldestUnreadedOutputSchema,
            handler: handle_message_get_oldest_unreaded,
        }
    ).add_tool(
        {
            name: ToolName.MESSAGES_GET_UNREADED,
            description: "Get unreaded messages",
            inputSchema: MessagesGetUnreadedInputSchema,
            outputSchema: MessagesGetUnreadedOutputSchema,
            handler: handle_messages_get_unreaded,
        }
    ).add_tool(
        {
            name: ToolName.MESSAGE_SET_AS_READED,
            description: "Set a message as readed",
            inputSchema: MessageSetAsReadedInputSchema,
            outputSchema: MessageSetAsReadedOutputSchema,
            handler: handle_message_set_as_readed,
        }
    );

// Agent tools

builder
    .add_tool(
        {
            name: ToolName.AGENT_CREATE,
            description: "Create an agent",
            inputSchema: AgentCreateInputSchema,
            outputSchema: AgentCreateOutputSchema,
            handler: handle_agent_create,
        }
    ).add_tool(
        {
            name: ToolName.AGENT_GET_STATUS,
            description: "Get the status of an agent",
            inputSchema: AgentGetStatusInputSchema,
            outputSchema: AgentGetStatusOutputSchema,
            handler: handle_agent_get_status,
        }
    ).add_tool(
        {
            name: ToolName.AGENTS_GET_DETAILS,
            description: "Get the details of all agents",
            inputSchema: AgentsGetDetailsInputSchema,
            outputSchema: AgentsGetDetailsOutputSchema,
            handler: handle_agents_get_details,
        }
    );

builder.build(
    new Server(
        {
            name: "mnemosyne",
            version: "0.0.1",
        },
        {
            capabilities: {
                tools: {}
            },
        }
    )
)().catch((error) => {
    (new Logger()).error(error.message);
    process.exit(1);
});

