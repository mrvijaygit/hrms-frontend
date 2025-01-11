import {stateType , actionType} from "../types/EmployeeForm";

export default function LayoutReducer(state:stateType, action:actionType):stateType{
    switch(action.type){
        case "setPrimaryKey":
            return {...state, ...action.payload}
        case "setMasters":
            return {...state,  master:action.payload}
        case "setEditFormData":
            return {...state,  [action.payload.key]:action.payload.value}
        default:
            return state
    }
}