import type { stateType, actionType } from "../types/Projects";

export default function ProjectsReducer(state:stateType, action:actionType):stateType{
    switch(action.type){
        case "setShow":
            return {...state, show:action.payload}
        case "setPage":
            return {...state, page:action.payload}
        case "isUpdated":
            return {...state, is_updated:action.payload.is_updated, editData:action.payload.editData}
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

            return {...state, 'data':action.payload.data, 'totalPage':totalPage, 'info':info}
        default:
            return state
    }
}