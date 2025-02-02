import { Box, Flex, Grid, Paper, Title, useMantineTheme, Text, Button } from "@mantine/core"
import { UseDashboard } from "../../contextapi/DashboardContext"
import { useAppSelector } from "../../redux/hook";
import { RiFingerprintLine } from "react-icons/ri";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { protectedApi } from "../../utils/ApiService";
import { alert } from "../../utils/Alert";

export default function Punch() {
    const { state, dispatch } = UseDashboard();
    const user_login_id = useAppSelector((state) => state.user.user_login_id);
    const theme = useMantineTheme();
    const [triggerApi, setTriggerApi] = useState(false);
    useEffect(()=>{
        (async()=>{
            try{
                let response = await protectedApi.get("/dashboard/attendance");
                dispatch({type:"setAll", payload:response.data});
            }
            catch(err:any){
                alert.error(err);
            }
        })();
    },[triggerApi]);

    const checkinout = async() =>{
        try{
            let _obj ={
                attendance_id:state.attendance?.attendance_id || -1,
                user_login_id:user_login_id,
                punch_in:state.attendance != null ? state.attendance.punch_in : dayjs().format("HH:mm"),
                punch_out:(state.attendance != null && state.attendance.punch_out == null) ? dayjs().format("HH:mm") : state.attendance?.punch_out,
                attendance_date:new Date()
            }

            let response = await protectedApi.post('/attendance/saveAttendance', _obj);
            if(response.data){
                setTriggerApi((prev) => (prev == false) ? true : false);
            }
           
        }
        catch(err:any){
            alert.error(err);
        }

    }

    return (
        <>
            <Grid.Col span={{ base: 12, lg: 4 , md:6}}>
                <Paper p='sm' shadow='xs' bg={theme.colors[theme.primaryColor][0]} h='100%' withBorder>
                    <Flex direction='column' align='center' justify="space-between" gap='xs' h='100%'>
                        <Box>
                            <Title order={5} mb="xs" c={theme.primaryColor} ta='center'>Attendance</Title>
                            <Title order={5} ta='center'>{dayjs().format('dddd, DD-MMM-YYYY')}</Title>
                        </Box>
                        <Paper w='100px' h='100px' radius="50%" bg='white' withBorder>
                            <Flex align='center' justify='center' direction='column' h='100%'>
                                <Text c='dimmed' fz={12} lh={1}>Total Hours</Text>
                                <Text  fw={500}>{state.attendance?.total_hours || "0:00"}</Text>
                            </Flex>
                        </Paper>
                       
                        <Flex align='center' gap='xs'>
                            <RiFingerprintLine color="orange" />
                            <Text fw={500} ta='center'>{state.attendance == null ? 'Waiting for punch In' :
                             state.attendance?.punch_out == null ? `Punch In at ${dayjs(`2025-01-01T${state.attendance.punch_in}`).format("hh:mm A")}` : `Punch out at ${dayjs(`2025-01-01T${state.attendance.punch_out}`).format("hh:mm A")}`}</Text>
                        </Flex>
                        <Button color="dark.6" w='100%' onClick={checkinout}>{state.attendance == null ? "Punch In" : "Punch Out"}</Button>
                    </Flex>
                    
                </Paper>
            </Grid.Col>
        </>
    )
}
