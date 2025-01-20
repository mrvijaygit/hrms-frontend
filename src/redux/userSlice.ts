import { createSlice } from "@reduxjs/toolkit";

export interface UserDataType{
    user_name:string;
    user_type:string;
    m_user_type_id:number;
    user_login_id:number;
}

const is_user = localStorage.getItem('user_info');
const userInfo = is_user != null ? JSON.parse(atob(is_user)) : null;

const initialState:UserDataType = {
    user_name:userInfo != null ? userInfo.user_name : '',
    user_type:userInfo != null ? userInfo.user_type : '',
    m_user_type_id:userInfo != null ? userInfo.m_user_type_id : 0,
    user_login_id:userInfo != null ? userInfo.user_login_id : -1
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        login:(state,{payload}:{payload:UserDataType})=>{
            return state = {
                ...state,
                user_name:payload.user_name,
                user_type:payload.user_type,
                m_user_type_id:payload.m_user_type_id,
                user_login_id:payload.user_login_id
            }
        },
        logout:(state)=>{
            localStorage.clear();
            return state = {...state, ...initialState};
        }
    }
});
export const {login, logout} = userSlice.actions;
export default userSlice.reducer;