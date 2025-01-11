import { Box, Button,  Divider, Flex, Grid, Group, Paper, Select, Text, Textarea, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom"
import { protectedApi } from "../../utils/ApiService";
import { alert } from "../../utils/Alert";
import {leaveUpdateForm, viewDetailType} from "../../types/LeaveRequest";
import { useForm } from "@mantine/form";

function View() {

    const location = useLocation();
    const navigate = useNavigate();

    const [triggerApi, setTriggerApi] = useState<Boolean>(true);
    const [data, setData] = useState<viewDetailType | null>(null);

   useEffect(()=>{
     if(location.state.leave_id){
        (async()=>{
           try{
                let response = await protectedApi.get('/leave/viewLeaveRequest',{
                params:{
                    leave_id : location.state.leave_id
                }
                });
                setData(response.data);

           }
           catch(err:any){
             alert.error(err);
           }
        })()
     }
     else{
       navigate('/leaverequests');
     }
   },[triggerApi]);

    const form = useForm<leaveUpdateForm>({
        initialValues:{
            leave_id:location.state.leave_id,
            m_leave_status_id:null,
            remarks:"",
        },
        validate:{
            m_leave_status_id:(value) => ((value != null && Number(value) != 1) ? null : "Required"),
            remarks: (value) => (value.trim().length > 4 ? null : "Required"),
        }
    });


    const handleSubmit = async(values:leaveUpdateForm) =>{
        try{
            let promise = await protectedApi.post("/leave/saveLeaveRequest", JSON.stringify({...values, leave_id:location.state.leave_id}));
            alert.success(promise.data.msg);
            form.reset();
            setTriggerApi((prev) => (prev == false) ? true : false);
        }
        catch(error:any){
            alert.error(error);
        }
    }

  return (
    <>
    <Paper mb='xs' shadow='xs'>
        <Flex gap='xs' py='xs' px='sm' justify="space-between" align='center'>
            <Title order={6} c={'blue'}>{data?.basic?.user_name}</Title>
            <Text>Role: {data?.basic?.user_type}</Text>
            <Button leftSection={<FaAngleLeft/>} color="red" onClick={()=>history.go(-1)}>Back</Button>
        </Flex>
        <Divider variant="dashed"/>
        <Box p='sm'>
            <Grid gutter='sm'>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Department</Text>
                    <Text fw={500}>{data?.basic?.department_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Designation</Text>
                    <Text fw={500}>{data?.basic?.designation_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Email Id</Text>
                    <Text fw={500}>{data?.basic?.email_id}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Phone Number</Text>
                    <Text fw={500}>{data?.basic?.phone_number}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Leave Type</Text>
                    <Text fw={500}>{data?.basic?.leave_type}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Start date</Text>
                    <Text fw={500}>{data?.basic?.start_date}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>End date</Text>
                    <Text fw={500}>{data?.basic?.end_date}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Status</Text>
                    <Text fw={500} c={data?.basic?.status_color}>{data?.basic?.leave_status}</Text>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Reason</Text>
                    <Text fw={500}>{data?.basic?.reason}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Created On</Text>
                    <Text fw={500}>{data?.basic?.created_on}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Approval On</Text>
                    <Text fw={500}>{data?.basic?.updated_on}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Approval by</Text>
                    <Text fw={500}>{data?.basic?.updated_by}</Text>
                </Grid.Col>
            </Grid>
        </Box>
    </Paper>

    <Grid gutter='xs'>
        <Grid.Col span={{md:6}}>
            <Paper p='xs' shadow='xs'>
                <Group align="center" justify="space-between" gap='xs'>
                    <Title order={6}>Leave History</Title>
                </Group>
            </Paper>
            
        </Grid.Col>
        <Grid.Col span={{md:6}}>
            <Paper shadow='xs'>
                <Title order={6} p='sm' c='blue'>Approval Form</Title>
                <Divider variant="dashed"/>
                <Box component="form" p='sm' onSubmit={form.onSubmit(values => handleSubmit(values))}>
                    <Grid gutter='sm' align='flex-end'>
                        <Grid.Col span={{lg:6}}>
                            <Select label="Leave Status" data={[]} {...form.getInputProps("m_leave_status_id")}/>
                        </Grid.Col>
                        <Grid.Col span={{lg:12}}>
                            <Textarea label="Remarks" maxLength={255} rows={6} {...form.getInputProps("remarks")}/>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Group justify="flex-end" gap='sm'>
                                <Button  color="red" leftSection={<FaXmark/>} onClick={()=>form.reset()}>Clear</Button>
                                <Button type='submit' color="green" leftSection={<FaFloppyDisk/>}>Save</Button>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Paper>
        </Grid.Col>
    </Grid>


 
    </>
  )
}

export default View