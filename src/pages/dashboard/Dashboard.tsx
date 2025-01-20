import {Flex, Title, Grid, Paper} from "@mantine/core"
import AdminCard from "./AdminCard";
import { useAppSelector } from "../../redux/hook";
import { DonutChart } from '@mantine/charts';
import Notice from "./Notice";
import { useEffect } from "react";
import { alert } from "../../utils/Alert";
import { protectedApi } from "../../utils/ApiService";
import { UseDashboard } from "../../contextapi/DashboardContext";
import UpcomingHolidays from "./UpcomingHolidays";
import TodayBirthday from "./TodayBirthday";
import NewHires from "./NewHires";
import WorkAnniversary from "./WorkAnniversary";


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