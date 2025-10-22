import {
    ToolSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod";

const ToolInputSchema = ToolSchema.shape.inputSchema;
export type ToolInput = z.infer<typeof ToolInputSchema>;

const ToolOutputSchema = ToolSchema.shape.outputSchema;
export type ToolOutput = z.infer<typeof ToolOutputSchema>;