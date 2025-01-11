import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Drawer, Grid, Group,ComboboxData, Pagination, Paper,Select,Text,Textarea,TextInput, Title, NumberInput } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaEye, FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseProjects } from '../../contextapi/ProjectsContext';
import type { dataType } from '../../types/Projects';
import { DatePickerInput } from '@mantine/dates';
import { sortingType } from '../../types/general';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../../redux/hook";

export default function List() {
  const navigate = useNavigate();
  const userInfo = useAppSelector(state => state.user);
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseProjects();
  const [sort, setSort] = useState({} as sortingType);

  const [projectStatus, setProjectStatus] = useState<ComboboxData>([]);
  const [clients, setClients] = useState<ComboboxData>([]);
  const [managers, setManagers] = useState<ComboboxData>([]);

  const form = useForm<dataType>({
    initialValues:{
      project_id:-1,
      project_name:"",
      project_description:"",
      client_id:null,
      project_manager_id: null,
      start_date:null,
      deadline:null,
      project_status_id:null,
      project_value:''
    },
    validate:{
      project_name: (value) => (value.trim().length > 4 ? null : "Required"),
      project_description: (value) => (value.trim().length > 4 ? null : "Required"),
      client_id: (value) => (value != null ? null : "Required"),
      project_manager_id: (value) => (value != null ? null : "Required"),
      project_status_id: (value) => (value != null ? null : "Required"),
      deadline: (value) => (value != null ? null : "Required"),
      project_value: (value) => (String(value).length > 0 ? null : "Required"),
    }
  });

  useLayoutEffect(() => {
    const calculateTableHeight = () => {
      let h1 = 0;
      if (topRef.current) {
        h1 =  topRef.current.clientHeight + 58 + 56; 
        if(bottomRef.current){
          h1 += bottomRef.current.clientHeight;
        }
        const height = window.innerHeight - h1;
        setTableHeight(height);
      }
    };
    calculateTableHeight();

    window.addEventListener('resize', calculateTableHeight);

    return () => window.removeEventListener('resize', calculateTableHeight);
  }, []);

  useEffect(()=>{
    (async()=>{
      try{
        let response = await protectedApi.get("/project/projects", {
          params:{
            currentpage:state.page,
            postperpage:Number(state.show),
            sorting:sort
          }
        });
        dispatch({type:"response", payload:{
          data:response.data.data,
          totalRecord:response.data.totalRecord
        }});
      }
      catch(err){

      }
    })()
  
  },[state.page, state.show, triggerApi, sort]);

  useEffect(()=>{
    (async()=>{
      try{
        let response = await protectedApi.get("/master/clients");
        setClients(response.data);
        let response3 = await protectedApi.get("/master/projectStatus");
        setProjectStatus(response3.data);
        let response2 = await protectedApi.get("/master/userList", {
          params:{
            m_user_type_id:20
          }
        });
        setManagers(response2.data);
      }
      catch(err){

      }
    })()
  },[]);

  const handleEdit = async(id:number) =>{
      try{
        let response = await protectedApi.get("/project/viewProject", {
          params:{
            "project_id":id
          }
        });
        let deadline = response.data[0]['deadline'];
        let start_date = response.data[0]['start_date'];
        let obj = {...response.data[0], project_status_id:String(response.data[0]['project_status_id']),  start_date: start_date != null ? new Date(start_date) : null, deadline: deadline != null ? new Date(deadline) : null};
        dispatch({type:"isUpdated", payload:{is_updated:true, editData:obj}});
        form.setValues(obj);
        open();
      }
      catch(error:any){
        alert.error(error);
      }
  }

  const handleClearReset = () =>{
    if(state.is_updated && state.editData != null){
      form.setValues({...state.editData});
    }
    else{
      form.reset();
    }
  } 

  const handleSubmit = async(values:dataType) =>{
    try{
      let promise = await protectedApi.post("/project/saveProject", JSON.stringify(values));
      alert.success(promise.data.msg);
      form.reset();
      dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});
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
          let promise = await protectedApi.post("/project/saveProject", JSON.stringify({"project_id":id, "is_deleted":1}));
          alert.success(promise.data.msg);
          setTriggerApi((prev) => (prev == false) ? true : false);
        }
      });
    }
    catch(error:any){
      alert.error(error);
    }
  }

  const columns:Column<dataType>[] = useMemo(() => [
    {
      Header:'#',
      accessor:'s_no',
      width: 40,
      disableSortBy:true
    },
    {
      Header:'Name',
      accessor:"project_name",
      width:150,
      sortDirection: sort.accessor === 'project_name' ? sort.direction : 'none'
    },
    {
      Header:'Client',
      accessor:"client_name",
      width:150,
      sortDirection: sort.accessor === 'client_name' ? sort.direction : 'none'
    },
    {
      Header:'Project Manager',
      accessor:"project_manager",
      width: 150,
      sortDirection: sort.accessor === 'project_manager' ? sort.direction : 'none'
    },
    {
      Header:'Start Date',
      accessor:"start_date",
      width: 150,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'start_date' ? sort.direction : 'none'
    },
    {
      Header:'Deadline',
      accessor:"deadline",
      width: 150,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'deadline' ? sort.direction : 'none'
    },
    {
      Header:'Status',
      accessor:"project_status",
      width: 150,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'project_status' ? sort.direction : 'none',
      Cell:({row, value}) => <Text fw={500} c={row.original.status_color}>{value}</Text>
    },
    {
      Header:'Action',
      width: 150,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' color='green' onClick={()=> navigate('/projects/view', {state:{project_id:row.original.project_id}})}><FaEye/></Button>
            {
              [1000,100].includes(userInfo.m_user_type_id) && <>
                <Button variant='light' onClick={()=>handleEdit(row.original.project_id)}><FaPencil/></Button>
                <Button variant='light' color="red" onClick={()=>handleDelete(row.original.project_id)}><FaTrash/></Button>
              </>
            }

          </Group>;
      }
    },
  ], [sort]);

  const data:dataType[] = useMemo(()=>state.data, [state.data]);

  const columnHeaderClick = async (column:any) => {
 
    switch (column.sortDirection) {
      case 'none':
        setSort({ direction: 'ASC', accessor: column.id });
        break;
      case 'ASC':
        setSort({ direction: 'DESC', accessor: column.id });
        break;
      case 'DESC':
        setSort({ direction: 'none', accessor: column.id });
        break;
    }
  };

  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs' ref={topRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Title order={6} tt='uppercase'>Projects</Title>

          {
            [1000,100].includes(userInfo.m_user_type_id) &&    <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Project</Button>
          </Group>
          }
       
        </Group>
      </Paper>
      <Paper p='xs' shadow="xs" my='xs'>
        <Box style={{'overflow':'auto'}} h={tableHeight}>
            <BasicTable columns={columns} data={data} onHeaderClick= {columnHeaderClick}/>
        </Box>
      </Paper>
      <Paper p='xs' shadow="xs" ref={bottomRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Select data={['10','25','50','100']} size="xs" value={state.show} onChange={(value) => dispatch({type:'setShow', payload:value})} w={60}/>
          <Text>{state.info}</Text>
          <Pagination total={state.totalPage} size='sm' value={state.page} onChange={(value) => dispatch({type:'setPage', payload:value})}/>
        </Group>
      </Paper>
      <Drawer size={"lg"} opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Project"  : "Add Project"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Project Name" maxLength={180} {...form.getInputProps("project_name")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Select label="Client" data={clients} {...form.getInputProps("client_id")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Select label="Project manager" data={managers} {...form.getInputProps("project_manager_id")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput label="Start Date" {...form.getInputProps("start_date")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput label="Deadline" {...form.getInputProps("deadline")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <Select label="Status" data={projectStatus} {...form.getInputProps("project_status_id")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput label="Project Value"  {...form.getInputProps("project_value")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Description" rows={7}  {...form.getInputProps("project_description")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Group justify="flex-end" gap='sm'>
                  <Button  color="red" leftSection={<FaXmark/>} onClick={()=>handleClearReset()}>{state.is_updated ? "Reset"  : "Clear"}</Button>
                  <Button type='submit' color="green" leftSection={<FaFloppyDisk/>}>{state.is_updated ? "Update"  : "Save"}</Button>
                </Group>
              </Grid.Col>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}
