import { createSlice } from "@reduxjs/toolkit";

export interface stateType{
    panelActive:boolean;
}

const initialState:stateType = {
    panelActive:false
}

export const layoutSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        panelControl:(state,{payload}:{payload:boolean})=>{
            return state = {
                ...state, panelActive:payload,
            }
        },
    }
});
export const {panelControl} = layoutSlice.actions;
export default layoutSlice.reducer;