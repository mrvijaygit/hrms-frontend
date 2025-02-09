import type {TState, TAction } from "../types/Generic";

export default function GenericReducer<T extends {'s_no' : number}, E={}, F={}>(state:TState<T, E, F>, action:TAction<T, E, F>):TState<T,E,F>{
    switch(action.type){
        case "setShow":
            return {...state, show:action.payload}
        case "setPage":
            return {...state, page:action.payload}
        case "isUpdated":
            return {...state, is_updated:action.payload.is_updated, editData:action.payload.editData}
        case "response":
            let data = action.payload.data;
            const totalPage = state.show ? Math.ceil(action.payload.totalRecord / Number(state.show)) : 0;
            const info = `Showing ${data[0]?.s_no ?? 0} - ${data[data.length - 1]?.s_no ?? 0} of ${action.payload.totalRecord} entries`;
            return {...state, 'data':action.payload.data, 'totalPage':totalPage, 'info':info};
        case "filter":
            return { ...state, filter: state.filter ? { ...state.filter, [action.payload.key]: action.payload.value }
                : { [action.payload.key]: action.payload.value } as F, // Type cast for safety
            };
        default:
            return state
    }
}