import type { stateType, actionType } from "../types/Dashboard";

export default function DashboardReducer(state:stateType, action:actionType):stateType{
    switch(action.type){
        case "setAll":
            return {...state, ...action.payload};
        default:
            return state
    }
}