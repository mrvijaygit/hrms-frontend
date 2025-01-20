import { Box, Button,  ComboboxData,  Divider, Flex, Grid, Group, Paper, Select, Table, Text, Textarea, Title, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom"
import { protectedApi } from "../../utils/ApiService";
import { alert } from "../../utils/Alert";
import {leaveUpdateForm, viewDetailType} from "../../types/LeaveRequest";
import { useForm } from "@mantine/form";
import { useAppSelector } from "../../redux/hook";

function View() {

    const logger_id = useAppSelector((state) => state.user.user_login_id);

    const location = useLocation();
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const [triggerApi, setTriggerApi] = useState<Boolean>(true);
    const [data, setData] = useState<viewDetailType | null>(null);
    const [leaveStatus, setLeaveStatus] = useState<ComboboxData | null>(null);

    const form = useForm<leaveUpdateForm>({
        initialValues:{
            leave_id:location.state.leave_id,
            m_leave_status_id:'1',
            remarks:"",
        },
        validate:{
            m_leave_status_id:(value) => ((value != null) ?  (Number(value) == 1) ?  "Pending is not allowed" : null : null),
            remarks: (value) => (value.trim().length > 4 ? null : "Required"),
        }
    });

    useEffect(()=>{
        (async()=>{
          try{
            let leaveStatus = await protectedApi.get("/master/leaveStatus");
            setLeaveStatus(leaveStatus.data);
          }
          catch(err:any){
            alert.error(err);
          }
        })();
    },[]);

   useEffect(()=>{
     if(location.state.leave_id){
        (async()=>{
           try{
                let response = await protectedApi.get('/leave/viewLeaveRequest',{
                params:{
                    leave_id : location.state.leave_id,
                    user_login_id: location.state.user_login_id
                }
                });
                setData(response.data);
                form.setFieldValue('m_leave_status_id', String(response.data.basic['m_leave_status_id']));
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
            <Title order={6} c={theme.primaryColor}>{data?.basic?.user_name}</Title>
            <Text>Status: <Text fw={500} component="span" c={data?.basic?.status_color}>{data?.basic?.leave_status}</Text></Text>
            <Button leftSection={<FaAngleLeft/>} color="dark.6" onClick={()=>history.go(-1)}>Back</Button>
        </Flex>
        <Divider variant="dashed"/>
        <Box p='sm'>
            <Grid gutter='sm'>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Role</Text>
                    <Text fw={500}>{data?.basic?.user_type}</Text>
                </Grid.Col>
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
                    <Text fz='xs' tt='uppercase' c='dark.3'>No.of days</Text>
                    <Text fw={500}>{data?.basic?.no_of_days}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Created On</Text>
                    <Text fw={500}>{data?.basic?.created_on}</Text>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Reason</Text>
                    <Text fw={400}>{data?.basic?.reason}</Text>
                </Grid.Col>
            </Grid>
        </Box>
    </Paper>

    <Grid gutter='xs'>
        <Grid.Col span={{md:6}}>
            <Paper shadow='xs' h='100%'>
                <Title order={6} p='sm' c={theme.primaryColor}>Recent Leave History <Text ml={8} component="small" c='dimmed' fz={12}>(Approvals Only)</Text> </Title>
                <Divider variant="dashed"/>
                <Box className="table-responsive" p='sm'>
                    <Table withRowBorders withTableBorder>
                        <Table.Thead bg='dark.6' c='white'>
                            <Table.Tr>
                                <Table.Th w={30}>#</Table.Th>
                                <Table.Th w={100}>Type</Table.Th>
                                <Table.Th w={200}>Dates</Table.Th>
                                <Table.Th w={100} ta='center'>No.of Days</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {
                                data?.recentLeaveHistory != null ? <>
                                    {
                                        data.recentLeaveHistory.map((item)=>(
                                            <Table.Tr key={item.s_no}>
                                                <Table.Td>{item.s_no}</Table.Td>
                                                <Table.Td>{item.leave_type}</Table.Td>
                                                <Table.Td className="text-nowrap">{item.dates}</Table.Td>
                                                <Table.Td ta='center'>{item.no_of_days}</Table.Td>
                                            </Table.Tr>
                                        ))
                                    }
                                </> :  <Table.Tr><Table.Td colSpan={4} c='dimmed' ta='center'>No Records</Table.Td></Table.Tr>
                            }

                        </Table.Tbody>
                    </Table>
                </Box>
            </Paper>
        </Grid.Col>
        <Grid.Col span={{md:6}}>
            {
                data?.basic != null && data.basic.m_leave_status_id == 1 && data.basic.reporting_id == logger_id && <Paper shadow='xs'>
                <Title order={6} p='sm' c={theme.primaryColor}>Approval Form</Title>
                <Divider variant="dashed"/>
                <Box component="form" p='sm' onSubmit={form.onSubmit(values => handleSubmit(values))}>
                    <Grid gutter='sm' align='flex-end'>
                        <Grid.Col span={{lg:6}}>
                            <Select label="Leave Status" data={leaveStatus != null ? leaveStatus : []} {...form.getInputProps("m_leave_status_id")}/>
                        </Grid.Col>
                        <Grid.Col span={{lg:12}}>
                            <Textarea label="Remarks" maxLength={255} rows={6} {...form.getInputProps("remarks")}/>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Group justify="flex-end" gap='sm'>
                                <Button  color="dark.6" leftSection={<FaXmark/>} onClick={()=>{form.reset();}}>Clear</Button>
                                <Button type='submit' leftSection={<FaFloppyDisk/>}>Save</Button>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Box>
            </Paper>
            }

            {
                data?.basic != null && data.basic.m_leave_status_id != 1 && <Paper shadow='xs'>
                    <Title order={6} p='sm' c={theme.primaryColor}>Reviewer Action</Title>
                    <Divider variant="dashed"/>
                    <Box p='sm'>
                        <Grid gutter='sm' align='flex-end'>
                            <Grid.Col span={{md:6}}>
                                <Text fz='xs' tt='uppercase' c='dark.3'>Reviewed On</Text>
                                <Text fw={500}>{data?.basic?.updated_on}</Text>
                            </Grid.Col>
                            <Grid.Col span={{md:6}}>
                                <Text fz='xs' tt='uppercase' c='dark.3'>Reviewed by</Text>
                                <Text fw={500}>{data?.basic?.updated_by}</Text>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Text fz='xs' tt='uppercase' c='dark.3'>Remark</Text>
                                <Text fw={400}>{data?.basic?.remarks}</Text>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Paper>
            }
        </Grid.Col>
    </Grid>


 
    </>
  )
}

export default View