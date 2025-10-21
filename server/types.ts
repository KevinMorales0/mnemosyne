import {
    ToolSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod";

const ToolInputSchema = ToolSchema.shape.inputSchema;
export type ToolInput = z.infer<typeof ToolInputSchema>;

const ToolOutputSchema = ToolSchema.shape.outputSchema;
export type ToolOutput = z.infer<typeof ToolOutputSchema>;

// State tools Input Schemas

export const StateSaveInputSchema = z.object({
    instance_id: z.string().describe("Instance ID of the AI instance"),
    content: z.string().describe("Content to save"),
});
export type StateSaveInput = z.infer<typeof StateSaveInputSchema>;

export const StateGetLatestInputSchema = z.object({
    instance_id: z.string().describe("Instance ID of the AI instance"),
});
export type StateGetLatestInput = z.infer<typeof StateGetLatestInputSchema>;

export const StatesGetLatestInputSchema = z.object({
    instance_id: z.string().describe("Instance ID of the AI instance"),
    states_back: z.number().describe("Number of states to search back"),
});
export type StatesGetLatestInput = z.infer<typeof StatesGetLatestInputSchema>;

// State tools Output Schemas

export const StateSaveOutputSchema = z.union([
    z.null().describe("No state saved"),
    z.object({
        date: z.date().describe("Date of the state save"),
    })
]);
export type StateSaveOutput = z.infer<typeof StateSaveOutputSchema>;

export const StateGetLatestOutputSchema = z.union([
    z.null().describe("No state found for instance"),
    z.object({
        date: z.date().describe("Date of the state"),
        content: z.string().describe("Content of the state"),
    })
]);
export type StateGetLatestOutput = z.infer<typeof StateGetLatestOutputSchema>;

export const StatesGetLatestOutputSchema = z.union([
    z.null().describe("No states found for instance"),
    z.object({
        items: z.array(
            z.object({
                date: z.date().describe("Date of the state"),
                content: z.string().describe("Content of the state"),
            })
        )
    })
]);
export type StatesGetLatestOutput = z.infer<typeof StatesGetLatestOutputSchema>;
