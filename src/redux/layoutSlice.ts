import { createSlice } from "@reduxjs/toolkit";

export interface stateType{
    panelActive:boolean;
    isLoading:boolean;
}

const initialState:stateType = {
    panelActive:false,
    isLoading:false
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
        loaderControl:(state,{payload}:{payload:boolean})=>{
            return state = {
                ...state, isLoading:payload,
            }
        },
    }
});
export const {panelControl, loaderControl} = layoutSlice.actions;
export default layoutSlice.reducer;