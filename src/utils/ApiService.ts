import axios from "axios";
const BASEURL = "http://localhost:8000";
import { alert } from "./Alert";
import { logout} from "../redux/userSlice";
import { loaderControl} from "../redux/layoutSlice";
import { store } from "../redux/store";
export const authApi = axios.create({
    baseURL: BASEURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Api count for loader visible;
let apiCount:number = 0;

const ErrorHandling = (error:any) =>{
    if(error.code == "ERR_NETWORK"){
        return error.message;
    }
    else{
        return error.response.data.error
    }
}

authApi.interceptors.response.use(function (response) {
    return Promise.resolve(response);
  }, function (error) {
    return Promise.reject(ErrorHandling(error));
});

export const protectedApi = axios.create({
    baseURL: BASEURL,
    headers: {
        'Content-Type': 'application/json',
        "Authorization":`Bearer ${localStorage.getItem('access_token') != null ? localStorage.getItem('access_token') : ''}`
    }
});

protectedApi.interceptors.request.use(function (request){
    apiCount++;
    if(!store.getState().layout.isLoading){
        store.dispatch(loaderControl(true));
    }
    return request;
});

const removeApiCounts = () =>{
    apiCount--;
    if(store.getState().layout.isLoading && apiCount == 0){
        store.dispatch(loaderControl(false));
    }
}

protectedApi.interceptors.response.use(function (response) {
    removeApiCounts();
    return  Promise.resolve(response);
  }, async function (error) {
    removeApiCounts();
    
    const originalRequest = error.config;

    if(error.response && error.response.status === 403 && !originalRequest._retry){
        originalRequest._retry = true; // Prevent infinite loops
        const refreshToken = localStorage.getItem('refresh_token');

        if(refreshToken != null){
            try{
                let res = await authApi.post('/auth/token', JSON.stringify({"refresh_token":refreshToken}));
                const newAccessToken = res.data.access_token;
                localStorage.setItem('access_token', newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                protectedApi.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return protectedApi(originalRequest);
            }
            catch(error){
                alert.error('Token Exipred. Kindly login').then(()=>{
                    store.dispatch(logout());
                    window.location.href = '/';
                });
            }
        }
        else{
            alert.error('Token Exipred. Kindly login').then(()=>{
                store.dispatch(logout());
                window.location.href = '/';
            });
        }
    }

    if(error.response && error.response.status === 401){
        alert.error(error.response.data.msg).then(()=>{
            store.dispatch(logout());
            window.location.href = '/';
        });
    }

    return Promise.reject(error.response.data.msg);
});