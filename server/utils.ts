import { ToolInput, ToolOutput } from "./types";
import type { ILogger } from "./logger";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";
import { Server } from "@modelcontextprotocol/sdk/server";
import { CallToolRequestSchema, ListToolsRequestSchema, Tool } from "@modelcontextprotocol/sdk/types.js";
import { ToolName } from "./tools";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Logger } from "./logger";

export type Result<T> = {
    content: { type: "text"; text: string }[];
    structuredContent: T;
    isError: false;
};
export type ErrorResult = {
    content: { type: "text"; text: string }[];
    structuredContent: {
        name: string;
        message: string;
    };
    isError: true;
};

export function ToResult<T>(value: T): Result<T> {
    return {
        content: [{ type: "text", text: JSON.stringify(value) }],
        structuredContent: value,
        isError: false,
    };
}

export function ToErrorResult(error: Error): ErrorResult {
    return {
        content: [{ type: "text", text: error.message }],
        structuredContent: {
            name: error.name,
            message: error.message,
        },
        isError: true,
    };
}

export function ToResultSchema(value: z.ZodTypeAny): ToolOutput {
    return zodToJsonSchema(
        z.object({
            content: z.array(z.object({ type: z.string(), text: z.string() })),
            structuredContent: value,
            isError: z.boolean(),
        })
    ) as ToolOutput;
}

interface ITool<TRepo, TInput, TOutput> {
    name: ToolName;
    description: string;
    inputSchema: z.ZodType<TInput>;
    outputSchema: z.ZodType<TOutput>;
    handler: (repository: TRepo, args: TInput) => Promise<TOutput>
}

export class ServerBuilder<TRepo> {
    private tools: Tool[] = [];
    private tool_handlers: Record<string, (repository: TRepo, args: Record<string, unknown> | undefined) => Promise<Result<any> | ErrorResult>> = {}

    private transport: Transport | undefined;
    private logger: ILogger;
    private repository: TRepo | undefined;

    constructor() {
        this.logger = new Logger();
    }

    public add_tool<TInput, TOutput>(
        tool: ITool<TRepo, TInput, TOutput>
    ): ServerBuilder<TRepo> {
        this.tools.push({
            name: tool.name,
            description: tool.description,
            inputSchema: zodToJsonSchema(tool.inputSchema) as ToolInput,
            outputSchema: ToResultSchema(tool.outputSchema),
            handler: tool.handler,
        });
        this.tool_handlers[tool.name] = async (repository, args) => ToResult(await tool.handler(repository, tool.inputSchema.parse(args)));
        return this;
    }

    public set_transport(transport: Transport): ServerBuilder<TRepo> {
        this.transport = transport;
        return this;
    }

    public set_logger(logger: ILogger): ServerBuilder<TRepo> {
        this.logger = logger;
        return this;
    }

    public set_repository(repository: TRepo): ServerBuilder<TRepo> {
        this.repository = repository;
        return this;
    }

    public build(server: Server): () => Promise<void> {
        if (!this.repository) {
            throw new Error("Repository not set");
        }
        // List available tools
        server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: this.tools }));

        // Handle tool calls
        server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                const { name, arguments: args } = request.params;
                return this.tool_handlers[name](this.repository!, args);
            } catch (error) {
                return ToErrorResult(error);
            }
        });

        server.onerror = (error) => {
            this.logger.error(error.message);
        };

        process.on("SIGINT", async () => {
            await server.close();
            process.exit(0);
        });

        return () => server.connect(this.transport ?? new StdioServerTransport());
    }
}