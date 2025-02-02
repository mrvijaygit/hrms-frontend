import type { stateType, actionType } from "../types/Dashboard";

export default function ClientsReducer(state:stateType, action:actionType):stateType{
    switch(action.type){
        case "setAll":
            return {...state, ...action.payload};
        default:
            return state
    }
}