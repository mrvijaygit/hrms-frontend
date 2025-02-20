import type { stateType, actionType } from "../types/MyReview";

export default function AttendanceReducer(state:stateType, action:actionType):stateType{
    switch(action.type){
        case "trigger":
            return {...state, 'trigger':action.payload};
        case "response":
            return {...state, 'data':action.payload};
        case "filter":
            return {...state, "filter":{...state.filter, [action.payload.key]:action.payload.value}};
        default:
            return state
    }
}