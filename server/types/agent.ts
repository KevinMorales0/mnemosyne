import { z } from "zod";

/*
 * AGENT_CREATE = "agent_create",
 * AGENT_GET_STATUS = "agent_get_status",
 * AGENTS_GET_DETAILS = "agents_get_details",
 */
// Agent tools Input Schemas

export const AgentCreateInputSchema = z.object({
    agent_name: z.string().describe("Agent name of the AI instance"),
    description: z.string().describe("Description of the AI instance"),
});

export const AgentGetStatusInputSchema = z.object({
    agent_name: z.string().describe("Agent name of the AI instance"),
});

export const AgentsGetDetailsInputSchema = z.object({}).describe("No input required");

// Agent tools Output Schemas

export const AgentCreateOutputSchema = z.union([
    z.null().describe("No agent created"),
    z.object({
        agent_name: z.string().describe("Agent name of the AI instance"),
    })
]);

export const AgentGetStatusOutputSchema = z.union([
    z.null().describe("No agent found"),
    z.object({
        agent_name: z.string().describe("Agent name of the AI instance"),
        current_date: z.string().describe("Current date on redeable format"),
        unreaded_messages: z.number().describe("Number of unreaded messages"),
    })
]);

export const AgentsGetDetailsOutputSchema = z.union([
    z.null().describe("No agents found"),
    z.object({
        items: z.array(
            z.object({
                agent_name: z.string().describe("Agent name of the AI instance"),
                description: z.string().describe("Description of the AI instance"),
            })
        )
    })
]);

export type AgentCreateInput = z.infer<typeof AgentCreateInputSchema>;
export type AgentCreateOutput = z.infer<typeof AgentCreateOutputSchema>;
export type AgentGetStatusInput = z.infer<typeof AgentGetStatusInputSchema>;
export type AgentGetStatusOutput = z.infer<typeof AgentGetStatusOutputSchema>;
export type AgentsGetDetailsInput = z.infer<typeof AgentsGetDetailsInputSchema>;
export type AgentsGetDetailsOutput = z.infer<typeof AgentsGetDetailsOutputSchema>;
