/*
 * STATE_SAVE = "state_save",
 * STATE_GET_LATEST = "state_get_latest",
 * STATES_GET_LATEST = "states_get_latest",
 */

import { States } from "../repos/states";
import { 
    StateSaveInput, 
    StateSaveOutput, 
    StateGetLatestInput, 
    StateGetLatestOutput, 
    StatesGetLatestInput, 
    StatesGetLatestOutput 
} from "../types/state";

interface IStateRepository {
    get states(): States;
}

export async function handle_state_save(repo: IStateRepository, args: StateSaveInput): Promise<StateSaveOutput> {
    const result = repo.states.saveInstanceState(args.agent_name, args.content);
    return {
        date: new Date(result.timestamp),
    };
}

export async function handle_state_get_latest(repo: IStateRepository, args: StateGetLatestInput): Promise<StateGetLatestOutput> {
    const result = repo.states.getLatestState(args.agent_name);
    if (result === null) {
        return null;
    }
    return {
        date: new Date(result.timestamp),
        content: result.content,
    };
}

export async function handle_states_get_latest(repo: IStateRepository, args: StatesGetLatestInput): Promise<StatesGetLatestOutput> {
    const result = repo.states.getLatestStates(args.agent_name, args.states_back);
    if (result === null) {
        return null;
    }
    return {
        items: result.map((item) => {
            return {
                date: new Date(item.timestamp),
                content: item.content,
            };
        }),
    };
}