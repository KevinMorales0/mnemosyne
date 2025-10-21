# Mnemosyne

> MCP server for persistent state management across Claude instances

## Problem

Claude instances in multi-agent systems hit context limits within 48 hours, consuming daily token budgets before collapse. Daily reports are reactive, not proactive. Summaries require expensive models.

**Solution**: Lightweight state persistence enabling real-time cross-instance queries.

## Features

- **State persistence**: Save conversation state by instance with timestamps
- **Fast retrieval**: Query latest state in <2 seconds
- **Historical search**: Retrieve multiple states with date filtering
- **Minimal overhead**: Single SQLite file, zero configuration

## Architecture

```
[Claude Desktop] → [MCP Server] → [SQLite]
                      ↓
          3 tools: save, get_latest, search
```

**Stack**: Node.js 22.19.0 + TypeScript

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

**Save state**:
```
"Save state for <instance_id>: daily completed, no alerts, context under control"
```

**Get latest state**:
```
"Get the latest state for <instance_id>"
```

**Search history**:
```
"Get the last 3 states for <instance_id>"
```

## MCP Tools

### `state_save`
- **Input**: `instance_id`, `content`
- **Output**: DateTime of saved state

### `state_get_latest`
- **Input**: `instance_id`
- **Output**: Latest state content + DateTime

### `states_get_latest`
- **Input**: `instance_id`, `states_back` (1-20)
- **Output**: Array of max <states_back> states ordered DESC by DateTime

## Use Cases

1. Multi-agent coordinator queries instance
2. Instance saves state at session end with timestamp
3. System retrieves latest state for context continuation
4. Historical search for pattern detection

## Performance

- Query response: <2 seconds
- Storage: SQLite file grows ~1KB per state
- Handles 1000+ states without degradation

## Tech Choices

- **TypeScript**: Portfolio requirement, type safety
- **Local-only**: No auth, no networking, zero configuration

## License

MIT
