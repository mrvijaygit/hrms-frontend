import {Flex, Title, Grid, Paper} from "@mantine/core"
import { useAppSelector } from "../../redux/hook";
import { lazy, useEffect } from "react";
import { alert } from "../../utils/Alert";
import { protectedApi } from "../../utils/ApiService";
import { UseDashboard } from "../../contextapi/DashboardContext";

const Punch = lazy(()=>import("./Punch"));
const AdminCard = lazy(()=>import("./AdminCard"));
const AttendanceChart = lazy(()=>import("./AttendanceChart"));
const UpcomingHolidays = lazy(()=>import("./UpcomingHolidays"));
const TodayBirthday = lazy(()=>import("./TodayBirthday"));
const NewHires = lazy(()=>import("./NewHires"));
const WorkAnniversary = lazy(()=>import("./WorkAnniversary"));
const Notice = lazy(()=>import("./Notice"));

function Dashboard() {
  const userInfo = useAppSelector(state => state.user);
  const {dispatch} = UseDashboard();
  
  useEffect(()=>{
    (async()=>{
      try{
        let response = await protectedApi.get("/dashboard/getAll");
        dispatch({type:"setAll", payload:response.data});
      }
      catch(err:any){
        alert.error(err);
      }
    })();
  },[]);

  return (
    <>
      <Paper px='sm' py='xs' shadow='xs' mb='xs'>
         <Flex justify='space-between'>
            <Title order={6} tt="uppercase">Dashboard - {userInfo.user_type}</Title>
         </Flex>
      </Paper>
      <Grid gutter='xs' align="stretch"> 
        {
          userInfo.m_user_type_id != 1000 && <Punch/>
        }
        {
          [1000,100].includes(userInfo.m_user_type_id) &&  <>
          
        <Grid.Col span={{lg:8}}>
           <AdminCard/>
        </Grid.Col>

        <Grid.Col span={{lg:4}}>
          <AttendanceChart/>
        </Grid.Col>
          </>
        }
        
        <TodayBirthday/>
       <WorkAnniversary/>
        <UpcomingHolidays/>
        <Notice/>
        <NewHires/>
      </Grid>

    </>
  )
}

export default Dashboard