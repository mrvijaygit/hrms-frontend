import { Dispatch } from "react"
export interface stateType{
    data:[],
    is_updated:boolean,
    editData:null,
    filter:{
        appraisal_cycle_id:number | null,
    }
}

export type actionType = {type:"response", payload:{data:[]}} 
| {type:"isUpdated", payload:{ is_updated:boolean, editData:null}} 
| {type:"filter", payload:{key:string, value:number | null}}

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}