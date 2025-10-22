/*
 * AGENT_CREATE = "agent_create",
 * AGENT_GET_STATUS = "agent_get_status",
 * AGENTS_GET_DETAILS = "agents_get_details",
 */

import { Agents } from "../repos/agents";
import { 
    AgentCreateInput,
    AgentCreateOutput,
    AgentGetStatusInput,
    AgentGetStatusOutput,
    AgentsGetDetailsInput,
    AgentsGetDetailsOutput,
} from "../types/agent";

interface IAgentRepository {
    get agents(): Agents;
}

export async function handle_agent_create(repo: IAgentRepository, args: AgentCreateInput): Promise<AgentCreateOutput> {
    repo.agents.createAgent(args.agent_name, args.description);
    return {
        agent_name: args.agent_name,
    };
}

export async function handle_agent_get_status(repo: IAgentRepository, args: AgentGetStatusInput): Promise<AgentGetStatusOutput> {
    const unreadedMessages = repo.agents.getAgentUnreadedMessages(args.agent_name);
    
    // If the agent doesn't exist, getAgentUnreadedMessages returns 0
    // We might want to check if the agent actually exists
    // For now, we'll return the status
    const day_map: { [key: number]: string } = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    };
    
    let currentDate = new Date().toLocaleString();
    currentDate += " | " + day_map[new Date().getDay()];
    
    return {
        agent_name: args.agent_name,
        current_date: currentDate,
        unreaded_messages: unreadedMessages,
    };
}

export async function handle_agents_get_details(repo: IAgentRepository, args: AgentsGetDetailsInput): Promise<AgentsGetDetailsOutput> {
    const result = repo.agents.getAgentsDetails();
    if (result === null) {
        return null;
    }
    return {
        items: result.map((item) => {
            return {
                agent_name: item.agent_name,
                description: item.description,
            };
        }),
    };
}
