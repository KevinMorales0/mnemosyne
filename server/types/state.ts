import { z } from "zod";

// State tools Input Schemas

export const StateSaveInputSchema = z.object({
    agent_name: z.string().describe("Agent name of the AI instance"),
    content: z.string().describe("Content to save"),
});

export const StateGetLatestInputSchema = z.object({
    agent_name: z.string().describe("Agent name of the AI instance"),
});

export const StatesGetLatestInputSchema = z.object({
    agent_name: z.string().describe("Agent name of the AI instance"),
    states_back: z.number().describe("Number of states to search back"),
});

export type StateSaveInput = z.infer<typeof StateSaveInputSchema>;
export type StateGetLatestInput = z.infer<typeof StateGetLatestInputSchema>;
export type StatesGetLatestInput = z.infer<typeof StatesGetLatestInputSchema>;
// State tools Output Schemas

export const StateSaveOutputSchema = z.union([
    z.null().describe("No state saved"),
    z.object({
        date: z.date().describe("Date of the state save"),
    })
]);

export const StateGetLatestOutputSchema = z.union([
    z.null().describe("No state found for agent"),
    z.object({
        date: z.date().describe("Date of the state"),
        content: z.string().describe("Content of the state"),
    })
]);

export const StatesGetLatestOutputSchema = z.union([
    z.null().describe("No states found for agent"),
    z.object({
        items: z.array(
            z.object({
                date: z.date().describe("Date of the state"),
                content: z.string().describe("Content of the state"),
            })
        )
    })
]);

export type StateSaveOutput = z.infer<typeof StateSaveOutputSchema>;
export type StateGetLatestOutput = z.infer<typeof StateGetLatestOutputSchema>;
export type StatesGetLatestOutput = z.infer<typeof StatesGetLatestOutputSchema>;
