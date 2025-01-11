import {Box} from "@mantine/core";
import Titlebar from "./Titlebar";
import SideBar from "./SideBar";
import {Outlet } from "react-router-dom";
import '../../assets/css/layout.scss';
import Loader from "../Loader";
import { Suspense } from "react";
import { useAppSelector } from "../../redux/hook";
function Layout() {
   const isActive = useAppSelector((state)=>state.layout.panelActive);
   
  return (

    <>
        <Box className={`panel ${isActive ? 'active' : ''}`}>
            <SideBar/>
            <Box className="panel-container" bg='gray.0'>
                <Titlebar/>
                <Box component="main" className="main" p={8}>
                   <Suspense fallback={<Loader/>}><Outlet/></Suspense>
                </Box>
            </Box>
        </Box>
    </>
  )
}

export default Layout