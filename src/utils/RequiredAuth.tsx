import React,{lazy} from "react";
import { Navigate  } from "react-router-dom";
const NotFound = lazy(()=> import("../pages/NotFound"));
import { useAppSelector } from "../redux/hook";
type RequiredAuthType = {
  children:React.ReactNode,
  m_user_type_id?:number[]
}

function RequiredAuth({m_user_type_id, children}:RequiredAuthType) {

    const _token = localStorage.getItem('access_token');

    const auth_m_user_type_id = useAppSelector((state) => state.user.m_user_type_id)
       
    if(auth_m_user_type_id != 0){
     
      return (
        (m_user_type_id?.includes(Number(auth_m_user_type_id))) ? <>{children}</> : <NotFound />
      )
    }
    else{
      return (
        (_token == null) ? <Navigate to='/' replace/> : <>{children}</>
      )
    }


}

export default RequiredAuth