import { DatabaseSync } from "node:sqlite";
import { Agents } from "./agents";
import { Messages } from "./messages";
import { States } from "./states";

export class MnemosyneRepository {
    private db: DatabaseSync;

    private agents_repo: Agents;
    private messages_repo: Messages;
    private states_repo: States;

    constructor(db: DatabaseSync) {
        this.db = db;
        this.agents_repo = new Agents(db);
        this.messages_repo = new Messages(db);
        this.states_repo = new States(db);
    }

    public get agents(): Agents {
        return this.agents_repo;
    }

    public get messages(): Messages {
        return this.messages_repo;
    }

    public get states(): States {
        return this.states_repo;
    }
}
