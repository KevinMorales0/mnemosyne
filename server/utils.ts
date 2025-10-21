import { ToolOutput } from "./types";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

type Result<T> = {
    content: { type: "text"; text: string }[];
    structuredContent: T;
    isError: false;
};
type ErrorResult = {
    content: { type: "text"; text: string }[];
    structuredContent: {
        name: string;
        message: string;
    };
    isError: true;
};

export function ToResult<T>(value: T): Result<T> {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(value),
            },
        ],
        structuredContent: value,
        isError: false,
    };
}

export function ToErrorResult(error: Error): ErrorResult {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({
                    name: error.name,
                    message: error.message,
                }),
            },
        ],
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
            content: z.array(z.object({
                type: z.enum(["text"]),
                text: z.string(),
            })),
            structuredContent: value,
            isError: z.boolean(),
        })
    ) as ToolOutput;
}