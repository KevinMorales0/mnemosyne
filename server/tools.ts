export enum ToolName {
    STATE_SAVE = "state_save",
    STATE_GET_LATEST = "state_get_latest",
    STATES_GET_LATEST = "states_get_latest",

    MESSAGE_CREATE = "message_create",
    MESSAGE_GET_BY_ID = "message_get_by_id",
    MESSAGE_GET_LATEST_UNREADED = "message_get_latest_unreaded",
    MESSAGE_GET_OLDEST_UNREADED = "message_get_oldest_unreaded",
    MESSAGES_GET_UNREADED = "messages_get_unreaded",
    MESSAGE_SET_AS_READED = "message_set_as_readed",

    AGENT_CREATE = "agent_create",
    AGENT_GET_STATUS = "agent_get_status",
    AGENTS_GET_DETAILS = "agents_get_details",
}