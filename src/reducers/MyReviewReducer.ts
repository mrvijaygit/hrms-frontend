import type { stateType, actionType } from "../types/MyReview";

export default function AttendanceReducer(state:stateType, action:actionType):stateType{
    switch(action.type){
        case "isUpdated":
            return {...state, is_updated:action.payload.is_updated, editData:action.payload.editData}
        case "response":
            return {...state, 'data':action.payload.data};
        case "filter":
            return {...state, "filter":{...state.filter, [action.payload.key]:action.payload.value}};
        default:
            return state
    }
}