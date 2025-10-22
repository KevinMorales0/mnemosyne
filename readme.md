# Mnemosyne

> MCP server for multi-agent communication and persistent state management

## Problem

Claude instances in multi-agent systems hit context limits within 48 hours, consuming daily token budgets before collapse. Coordinating multiple AI agents requires message passing, state persistence, and agent discovery.

**Solution**: Lightweight multi-agent infrastructure with message queues, state persistence, and agent registry.

## Features

### Agent Management
- **Agent registry**: Create and track AI agents with descriptions
- **Status monitoring**: Check agent status and unread message counts
- **Agent discovery**: List all registered agents

### Message Passing
- **Async messaging**: Send messages between agents
- **Message queues**: Retrieve latest, oldest, or all unread messages
- **Read tracking**: Mark messages as read, auto-update unread counts

### State Persistence
- **State storage**: Save conversation state by agent with timestamps
- **Fast retrieval**: Query latest state in <2 seconds
- **Historical search**: Retrieve multiple states with date filtering

### Infrastructure
- **File logging**: All operations logged to `server.log`
- **Single database**: SQLite file with automatic migrations
- **Zero configuration**: Works out of the box

## Architecture

```
[Claude Desktop] → [MCP Server] → [SQLite]
                      ↓
          11 tools across 3 domains:
          - Agents (3): create, status, list
          - Messages (6): create, get, query, mark read
          - States (3): save, get_latest, search
```

**Stack**: Node.js 22.19.0 + TypeScript + SQLite

## Installation

**Prerequisites**: Node.js 22.19.0+ and Claude Desktop

```bash
# Clone
git clone https://github.com/KevinMorales0/mnemosyne.git
cd mnemosyne

# Package
npm npx @anthropic-ai/mcpb pack
```
Install the package in Claude Desktop

## Usage

### Agent Management
```
"Create an agent named 'coordinator' with description 'Main orchestrator'"
"Get status for agent 'coordinator'"
"List all registered agents"
```

### Message Passing
```
"Send a message from 'agent1' to 'agent2': Task completed successfully"
"Get the latest unread message for 'agent2'"
"Get all unread messages for 'agent2'"
"Mark message 5 as read"
```

### State Persistence
```
"Save state for 'coordinator': daily completed, no alerts, context under control"
"Get the latest state for 'coordinator'"
"Get the last 3 states for 'coordinator'"
```

## MCP Tools

### Agent Tools

#### `agent_create`
- **Input**: `agent_name`, `description`
- **Output**: Created agent name

#### `agent_get_status`
- **Input**: `agent_name`
- **Output**: Agent name, current date/time with day of week, unread message count

#### `agents_get_details`
- **Input**: None
- **Output**: Array of all agents with names and descriptions

### Message Tools

#### `message_create`
- **Input**: `sender`, `receiver`, `content`
- **Output**: Created message ID

#### `message_get_by_id`
- **Input**: `id`
- **Output**: Message details (id, sender, receiver, content, date)

#### `message_get_latest_unreaded`
- **Input**: `receiver`
- **Output**: Latest unread message for receiver

#### `message_get_oldest_unreaded`
- **Input**: `receiver`
- **Output**: Oldest unread message for receiver

#### `messages_get_unreaded`
- **Input**: `receiver`
- **Output**: Array of all unread messages for receiver

#### `message_set_as_readed`
- **Input**: `id`
- **Output**: Message ID (marks message as read, decrements unread count)

### State Tools

#### `state_save`
- **Input**: `agent_name`, `content`
- **Output**: DateTime of saved state

#### `state_get_latest`
- **Input**: `agent_name`
- **Output**: Latest state content + DateTime

#### `states_get_latest`
- **Input**: `agent_name`, `states_back`
- **Output**: Array of states ordered DESC by DateTime

## Use Cases

### Multi-Agent Coordination
1. Coordinator agent creates worker agents
2. Coordinator sends tasks via messages
3. Workers check status to see unread messages
4. Workers retrieve and process messages
5. Workers mark messages as read when complete

### State Management
1. Agents save state at session end
2. Coordinator queries agent states for health checks
3. Historical search for pattern detection
4. State retrieval for context continuation

### Agent Discovery
1. New agent registers itself on startup
2. Coordinator lists all available agents
3. Agents query each other's status

## Performance

- Query response: <2 seconds
- Storage: SQLite file grows ~1KB per state/message
- Handles 1000+ states and messages without degradation
- Automatic indexing on agent names and timestamps
- File-based logging for debugging

## Tech Choices

- **TypeScript**: Type safety and better developer experience
- **SQLite**: Embedded database with automatic migrations
- **File logging**: Simple debugging without external dependencies
- **Local-only**: No auth, no networking, zero configuration
- **MCP Protocol**: Standard interface for Claude Desktop integration

## License

MIT
