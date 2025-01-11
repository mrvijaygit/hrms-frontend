import { Navigate } from "react-router-dom"

export default function logout() {
    const redirectToLogin = () =>{
        return <Navigate to='/' replace/>;
    }

    return {redirectToLogin};
}