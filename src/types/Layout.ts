import { Dispatch } from "react";

export type stateType = {
    panelActive : boolean;
}

export type actionType = {type:'panelActive', payload:boolean};

export type ContextType = {
    state : stateType,
    dispatch : Dispatch<actionType>
    mainRef:React.MutableRefObject<HTMLElement | null>
}