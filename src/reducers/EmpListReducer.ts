import {stateType , actionType} from "../types/EmployeeList";

export default function EmpListReducer(state:stateType, action:actionType):stateType{
    switch(action.type){
        case "setShow":
            return {...state, show:action.payload};
        case "setPage":
            return {...state, page:action.payload};
        case "response":
            let data = action.payload.data , info = "", totalPage=0;
             if(data.length == 0){
                info = `Showing 0 - 0 of 0 entries`;
                totalPage = 0;
             }
             else{
                totalPage = Math.ceil(action.payload.totalRecord / Number(state.show));
                info = `Showing ${data[0]['s_no']} - ${data[data.length - 1]['s_no']} of ${action.payload.totalRecord} entries`;
             }

            return {...state, 'data':action.payload.data, 'totalPage':totalPage, 'info':info};
        case "filter":
            return {...state, "filter":{...state.filter, [action.payload.key]:action.payload.value}};
        case "setMasters":
            return {...state,  master:action.payload};
        default:
            return state
    }
}