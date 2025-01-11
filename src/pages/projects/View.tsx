import { Box, Button, ComboboxData, Divider, Drawer, Flex, Grid, Group, Paper, Select, Text, TextInput, Title, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { FaAngleLeft, FaFloppyDisk, FaPen, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom"
import { protectedApi } from "../../utils/ApiService";
import { alert } from "../../utils/Alert";
import { TeamMemberFormType, TeamFormStateType, ProjectDetailsType } from "../../types/Projects";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { useAppSelector } from "../../redux/hook";

function View() {
    const userInfo = useAppSelector(state => state.user);
    const isManager:boolean = (userInfo.m_user_type_id == 20);
    const isEmployee:boolean = (userInfo.m_user_type_id == 1);

    const location = useLocation();
    const navigate = useNavigate();

    const [opened, { open, close }] = useDisclosure(false);
    const [triggerApi, setTriggerApi] = useState<Boolean>(true);
    const [data, setData] = useState<ProjectDetailsType | null>(null);
    const [employees , setEmployees] = useState<ComboboxData | null>(null);

    const [formState, setFormState] = useState<TeamFormStateType>({
        isUpdated:false,
        editData:null
    });

   useEffect(()=>{
     if(location.state.project_id){
        (async()=>{
           try{
                let response = await protectedApi.get('/project/projectDetails',{
                params:{
                    project_id : location.state.project_id
                }
                });
                setData(response.data);

                let response2 = await protectedApi.get('/master/userList', {
                    params:{
                        reporting_id: response.data.basic.project_manager_id
                    }
                });
                setEmployees(response2.data);

           }
           catch(err:any){
             alert.error(err);
           }
        })()
     }
     else{
       navigate('/employee/list');
     }
   },[triggerApi]);

    const form = useForm<TeamMemberFormType>({
        initialValues:{
            project_member_id:-1,
            user_login_id:null,
            role:"",
            start_date:null,
            end_date:null
        },
        validate:{
            user_login_id: (value) => (value != null ? null : "Required"),
            role: (value) => (value.trim().length > 4 ? null : "Required"),
            start_date: (value) => (value != null ? null : "Required"),
        }
    });

    const handleEdit = async(id:number) =>{
        try{
            if(data != null && data?.teamMembers != null){
                let obj = data.teamMembers.filter((obj) => obj.project_member_id == id)[0];
                let x = {
                    project_member_id: obj.project_member_id,
                    user_login_id:String(obj.user_login_id),
                    role:obj.role,
                    start_date: new Date(obj.start_date),
                    end_date: obj.end_date != null ? new Date(obj.end_date) : null
                }
                setFormState({...formState, isUpdated:true, editData:x});

                form.setValues({...x});
                open();
            }
           
   
        }
        catch(error:any){
            alert.error(error);
        }
    }

    const handleClearReset = () =>{
        if(formState.isUpdated && formState.editData != null){
            let x = formState.editData;
            form.setValues({...x});
        }
        else{
            form.reset();
        }
    } 

    const handleSubmit = async(values:TeamMemberFormType) =>{
        try{
            let promise = await protectedApi.post("/project/saveTeamMember", JSON.stringify({...values, project_id:location.state.project_id}));
            alert.success(promise.data.msg);
            form.reset();
            setFormState({...formState, isUpdated:false, editData:null});
            close();
            setTriggerApi((prev) => (prev == false) ? true : false);
        }
        catch(error:any){
            alert.error(error);
        }
    }

    const handleDelete = (id:number) =>{
        try{
            alert.question("Do you Want to delete this record").then(async(res)=>{
            if(res.isConfirmed){
                let promise = await protectedApi.post("/project/saveTeamMember", JSON.stringify({"project_member_id":id, "is_deleted":1}));
                alert.success(promise.data.msg);
                setTriggerApi((prev) => (prev == false) ? true : false);
            }
            });
        }
        catch(error:any){
            alert.error(error);
        }
    }

  return (
    <>
    <Paper mb='xs' shadow='xs'>
        <Flex gap='xs' py='xs' px='sm' justify="space-between" align='center'>
            <Title order={6} c={'blue'}>{data?.basic.project_name}</Title>
            <Button leftSection={<FaAngleLeft/>} color="red" onClick={()=>history.go(-1)}>Back</Button>
        </Flex>
        <Divider variant="dashed"/>
        <Box p='sm'>
            <Grid gutter='sm'>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Client Name</Text>
                    <Text fw={500}>{data?.basic.client_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Project Manager</Text>
                    <Text fw={500}>{data?.basic.project_manager}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Department</Text>
                    <Text fw={500}>{data?.basic.department_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Start Date</Text>
                    <Text fw={500}>{data?.basic.start_date}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Deadline</Text>
                    <Text fw={500}>{data?.basic.deadline}</Text>
                </Grid.Col>
                {
                    !isEmployee && <Grid.Col span={{lg:3, md:6}}>
                        <Text fz='xs' tt='uppercase' c='dark.3'>Project value</Text>
                        <Text fw={500}>{data?.basic.project_value}</Text>
                    </Grid.Col>
                }
                <Grid.Col span={{lg:3, md:6}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Status</Text>
                    <Text fw={500} c={data?.basic.status_color}>{data?.basic.project_status}</Text>
                </Grid.Col>
                <Grid.Col span={{base:12}}>
                    <Text fz='xs' tt='uppercase' c='dark.3'>Description</Text>
                    <Text>{data?.basic.project_description}</Text>
                </Grid.Col>
            </Grid>
        </Box>
    </Paper>
    <Paper p='xs' mb='xs' shadow='xs'>
        <Group align="center" justify="space-between" gap='xs'>
            <Title order={6}>Team Members</Title>
            {
                isManager && <Button leftSection={<FaPlus/>} onClick={open}>Add Member</Button>
            }
        </Group>
    </Paper>
  
    <Grid gutter='xs'>
        {
            data != null && data.teamMembers != null && <>
                {
                    data.teamMembers.map((item)=>{
                        return  <Grid.Col span={{lg:4, md:6}} key={item.project_member_id}>
                        <Paper h='100%' p='sm' shadow="xs">
                            <Flex gap='xs' mb='sm' justify="space-between" align='center'>
                                <Box>
                                    <Title order={6}>{item.user_name}</Title>
                                    <Text fz='xs'  c='dark.3'>{item.role}</Text>
                                </Box>
                                {
                                    isManager &&  <Group gap='xs'>
                                        <UnstyledButton c='blue' fz='xs' onClick={()=> handleEdit(item.project_member_id)}><FaPen/></UnstyledButton>
                                        <UnstyledButton c='red' fz='xs' onClick={()=>handleDelete(item.project_member_id)}><FaTrash/></UnstyledButton>
                                    </Group>
                                }                            
                            </Flex>
                            <Flex gap='xs' justify="space-between" align='center'>
                                <Box>
                                    <Text fz='xs' c='dark.3'>Email</Text>
                                    <Text>{item.email_id}</Text>
                                </Box>
                                <Box>
                                    <Text fz='xs' c='dark.3'>Contact</Text>
                                    <Text>{item.phone_number}</Text>
                                </Box>
                            </Flex>
                            <Divider variant="dashed" my='xs' />
                            <Flex gap='xs' justify="space-between" align='center'>
                                <Group align='center' gap="xs">
                                    <Text fz='xs' c="dark.3" lh={0}>SD:</Text>
                                    <Text>{item.start_date}</Text>
                                </Group>
                                {
                                    item.end_date != null &&  <Group align='center' gap="xs">
                                        <Text fz='xs' c="dark.3" lh={0}>ED:</Text>
                                        <Text>{item.end_date}</Text>
                                    </Group>
                                }
                               
                            </Flex>
                        </Paper>
                    </Grid.Col>
                    })
                }
            </>
        }
       
    </Grid>

    <Drawer opened={opened} onClose={()=>{form.reset(); close(); setFormState({...formState, isUpdated:false, editData:null});}} title={formState.isUpdated ? "Update Team Member"  : "Add Team Member"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
            <Grid gutter='sm' align='flex-end'>
                <Grid.Col span={12}>
                    <Select data={employees != null ? employees : []} {...form.getInputProps("user_login_id")}/>
                </Grid.Col>
                <Grid.Col span={12}>
                    <TextInput label="Role" maxLength={50} {...form.getInputProps("role")}/>
                </Grid.Col>
                <Grid.Col span={12}>
                    <DatePickerInput  label="Start Date" minDate={new Date(data != null ? data.basic.start_date : '')} {...form.getInputProps("start_date")} />
                </Grid.Col>
                <Grid.Col span={12}>
                    <DatePickerInput  label="End Date" minDate={new Date(data != null ? data.basic.start_date : '')} {...form.getInputProps("end_date")} />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Group justify="flex-end" gap='sm'>
                        <Button  color="red" leftSection={<FaXmark/>} onClick={()=>handleClearReset()}>{formState.isUpdated ? "Reset"  : "Clear"}</Button>
                        <Button type='submit' color="green" leftSection={<FaFloppyDisk/>}>{formState.isUpdated ? "Update"  : "Save"}</Button>
                    </Group>
                </Grid.Col>
            </Grid>
        </Box>
    </Drawer>
    </>
  )
}

export default View