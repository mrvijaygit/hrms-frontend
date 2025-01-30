import {Flex, Title, Grid, Paper} from "@mantine/core"
import { useAppSelector } from "../../redux/hook";
import { DonutChart } from '@mantine/charts';
import { lazy, useEffect } from "react";
import { alert } from "../../utils/Alert";
import { protectedApi } from "../../utils/ApiService";
import { UseDashboard } from "../../contextapi/DashboardContext";

const Punch = lazy(()=>import("./Punch"));
const AdminCard = lazy(()=>import("./AdminCard"));
const UpcomingHolidays = lazy(()=>import("./UpcomingHolidays"));
const TodayBirthday = lazy(()=>import("./TodayBirthday"));
const NewHires = lazy(()=>import("./NewHires"));
const WorkAnniversary = lazy(()=>import("./WorkAnniversary"));
const Notice = lazy(()=>import("./Notice"));

function Dashboard() {
  const userInfo = useAppSelector(state => state.user);
  const {dispatch} = UseDashboard();
  
  const donutData = [
    { name: 'Present', value: 80, color: '#2196F3' },
    { name: 'Absent', value: 5, color: 'red.8' },
    { name: 'Late', value: 2, color: 'yellow.5' },
    { name: 'On Leave', value: 13, color: 'red.2' },
  ];

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
        <Punch/>
        {
          [1000,100].includes(userInfo.m_user_type_id) &&  <>
          
          <Grid.Col span={{lg:8}}>
           <AdminCard/>
        </Grid.Col>

        <Grid.Col span={{lg:4}}>
          <Paper shadow='xs' h='100%'>
                <DonutChart data={donutData} paddingAngle={2} withLabelsLine labelsType="percent" withLabels size={160} thickness={18} tooltipDataSource="segment" chartLabel={"Attendance"} mx="auto"/>
            </Paper>
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