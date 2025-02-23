import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Drawer, Grid, Group,ComboboxData, Pagination, Paper,Select,Text,Textarea,TextInput, Title, NumberInput } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFileExcel, FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseProjects } from '../../contextapi/GenericContext';
import type {TableDataType, FormType } from '../../types/Projects';
import { excelDownload , directionAccessor} from '../../utils/helper';
import { DatePickerInput } from '@mantine/dates';
import { SortingType } from '../../types/Generic';
import { useAppSelector } from "../../redux/hook";

export default function List() {
  const userInfo = useAppSelector(state => state.user);
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseProjects();
  const [sort, setSort] = useState({} as SortingType);

  const [projectStatus, setProjectStatus] = useState<ComboboxData>([]);
  const [clients, setClients] = useState<ComboboxData>([]);
  const [managers, setManagers] = useState<ComboboxData>([]);

  const form = useForm<FormType>({
    initialValues:{
      project_id:-1,
      project_name:"",
      project_description:"",
      client_id:null,
      project_manager_id: null,
      start_date:null,
      end_date:null,
      project_status_id:null,
      project_value:''
    },
    validate:{
      project_name: (value) => (value.trim().length > 4 ? null : "Required"),
      project_description: (value) => (value.trim().length > 4 ? null : "Required"),
      client_id: (value) => (value != null ? null : "Required"),
      project_manager_id: (value) => (value != null ? null : "Required"),
      project_status_id: (value) => (value != null ? null : "Required"),
      end_date: (value) => (value != null ? null : "Required"),
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
        let end_date = response.data[0]['end_date'];
        let start_date = response.data[0]['start_date'];
        let obj = {...response.data[0], project_status_id:String(response.data[0]['project_status_id']),  start_date: start_date != null ? new Date(start_date) : null, end_date: end_date != null ? new Date(end_date) : null};
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

  const handleSubmit = async(values:FormType) =>{
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

  const columns:Column<TableDataType>[] = useMemo(() => [
    {
      Header:'#',
      accessor:'s_no',
      width: 40,
      disableSortBy:true
    },
    {
      Header:'Name',
      accessor:"project_name",
      width:330,
      sortDirection: sort.accessor === 'project_name' ? sort.direction : 'none',
      Cell:({row, value}) => <>
        <Text mb={2}>{value}</Text>
        <Text fz={12} c='dimmed' tt='capitalize'>{row.original.client_name}</Text>
      </>
    },
    {
      Header:'Manager',
      accessor:"project_manager",
      width:200,
      sortDirection: sort.accessor === 'project_manager' ? sort.direction : 'none',
    },
    {
      Header:'Status',
      accessor:"project_status",
      width: 150,
      sortDirection: sort.accessor === 'project_status' ? sort.direction : 'none',
      Cell:({row, value}) => <Text fw={500} c={row.original.status_color}>{value}</Text>
    },
    {
      Header:'Start Date',
      accessor:"start_date",
      width: 150,
      sortDirection: sort.accessor === 'start_date' ? sort.direction : 'none',
    },
    {
      Header:'End Date',
      accessor:"end_date",
      width: 150,
      sortDirection: sort.accessor === 'end_date' ? sort.direction : 'none',
    },
    {
      Header:'Members',
      accessor:"members",
      width: 150,
      disableSortBy:true,
      headerClassName:"text-center",
      Cell:({value}) => <>
        <Button variant='light' onClick={()=>{}}>{value}</Button>
      </>
    },
    {
      Header:'Tasks',
      accessor:"tasks",
      width: 150,
      disableSortBy:true,
      headerClassName:"text-center",
      Cell:({value}) => <>
        <Button variant='light' onClick={()=>{}}>{value}</Button>
      </>
    },
    {
      Header:'Work Done',
      accessor:"work_done",
      width: 150,
      disableSortBy:true,
      headerClassName:"text-center",
      Cell:({value}) => <>
        <Button variant='light' onClick={()=>{}}>{value != null ? `${value.split(':')[0]}:${value.split(':')[1]}` : 0}</Button>
      </>

    },
    {
      Header:'Action',
      width: 150,
      headerClassName:"text-center",
      disableSortBy:true,
      visible:[1000,100].includes(userInfo.m_user_type_id) ? true : false,
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
                <Button variant='light' onClick={()=>handleEdit(row.original.project_id)}><FaPencil/></Button>
                <Button variant='light' color="red" onClick={()=>handleDelete(row.original.project_id)}><FaTrash/></Button>
          </Group>;
      }
    },
  ], [sort]);

  const data:TableDataType[] = useMemo(()=>state.data, [state.data]);

  const columnHeaderClick = async (column:any) => {
    setSort(directionAccessor(column));
  };

  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs' ref={topRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Title order={6} tt='uppercase'>Projects</Title>
          <Group align="center" gap='xs'>
            {
              [1000,100].includes(userInfo.m_user_type_id) &&
              <Button leftSection={<FaPlus/>} onClick={open}>Add Project</Button>
            }
            <Button leftSection={<FaFileExcel/>} color='green' onClick={()=>excelDownload("projects")}>Excel</Button>
          </Group>
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
                <DatePickerInput label="End Date" {...form.getInputProps("end_date")}/>
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
                  <Button  color="dark.6" leftSection={<FaXmark/>} onClick={()=>handleClearReset()}>{state.is_updated ? "Reset"  : "Clear"}</Button>
                  <Button type='submit' leftSection={<FaFloppyDisk/>}>{state.is_updated ? "Update"  : "Save"}</Button>
                </Group>
              </Grid.Col>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}
