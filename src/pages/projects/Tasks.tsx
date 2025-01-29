import { useDisclosure } from '@mantine/hooks';
import { Box, Button, ComboboxData, Drawer, Grid, Group, NumberInput, Pagination, Paper,Select,Text,Textarea,TextInput, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFileExcel, FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseTasks } from '../../contextapi/GenericContext';
import { excelDownload , directionAccessor} from '../../utils/helper';
import type { SortingType } from '../../types/Generic';
import type { FormType, TableDataType } from '../../types/Tasks';
import { DatePickerInput } from '@mantine/dates';
import { useAppSelector } from '../../redux/hook';
import { useLocation } from 'react-router-dom';
import { zodResolver } from '@mantine/form';
import { TaskSchema } from '../../utils/Validation';

export default function Tasks() {
  const logger_user_login_id = useAppSelector(state => state.user.user_login_id);
  const location = useLocation();
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseTasks();
  const [sort, setSort] = useState({} as SortingType);

  const [taskStatus, setTaskStatus] = useState<ComboboxData | null>(null);
  const [projects , setProjects] = useState<ComboboxData | null>(null);
  const [employees , setEmployees] = useState<ComboboxData | null>(null);

  const dxxata = [
    {value:1, label:'sss'},
    {value:2, label:'df'},
    {value:3, label:'dsfd'},
    {value:4, label:'dgfd'},
  ];

  const form = useForm<FormType>({
    initialValues:{
      task_id:-1,
      task_name:"",
      task_description:"",
      start_date:null,
      end_date:null,
      task_status_id:null,
      projected_days:null,
      projected_hours:null,
      projected_minutes:null,
    },
    validate:zodResolver(TaskSchema),
  });

  useLayoutEffect(() => {
    const calculateTableHeight = () => {
      let h1 = 0;
      if (topRef.current && filterRef.current) {
        h1 =  topRef.current.clientHeight + filterRef.current.clientHeight + 58 + 56; 
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
        let response = await protectedApi.get("/project/tasks", {
          params:{
            currentpage:state.page,
            postperpage:Number(state.show),
            sorting:sort,
            
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
        let response = await protectedApi.get("/master/projectStatus");
        setTaskStatus(response.data);

        let projectResponse = await protectedApi.get('/master/projects', {
          params:{
            selected_id: location.state != null ?  location.state.project_id : null
          }
        });
        dispatch({type:"filter", payload:{'key':"project_id",'value':projectResponse.data.selected_id}})
        setProjects(projectResponse.data.data);

        let response2 = await protectedApi.get('/master/userList', {
            params:{
              reporting_id: logger_user_login_id
            }
        });
        setEmployees(response2.data);

      }
      catch(err:any){
        alert.error(err, true);
      }
    })()
  },[]);

  const handleEdit = async(id:number) =>{
      try{
        let response = await protectedApi.get("/project/viewTasks", {
          params:{
            "task_id":id
          }
        });
        let obj = {...response.data[0]};
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
      let promise = await protectedApi.post("/project/saveTasks", JSON.stringify(values));
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
          let promise = await protectedApi.post("/project/saveTasks", JSON.stringify({"task_id":id, "is_deleted":1}));
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
      Header:'Task',
      accessor:"task_name",
      width:250,
      sortDirection: sort.accessor === 'task_name' ? sort.direction : 'none',
      Cell:({row, value})=>{
        return <>
          <Text mb={2}>{value}</Text>
          <Text fz='xs' c='dimmed'>{row.original.task_description}</Text>
        </>
      }
    },
    {
      Header:'Status',
      accessor:"task_status",
      width: 130,
      sortDirection: sort.accessor === 'task_status' ? sort.direction : 'none'
    },
    {
      Header:'Start Date',
      accessor:"start_date",
      width: 130,
      sortDirection: sort.accessor === 'start_date' ? sort.direction : 'none'
    },
    {
      Header:'End Date',
      accessor:"end_date",
      width: 130,
      sortDirection: sort.accessor === 'end_date' ? sort.direction : 'none'
    },
    {
      Header:'Projected Time',
      accessor:"projected_time",
      width: 130,
      disableSortBy:true
    },
    {
      Header:'Spent Time',
      accessor:"spent_time",
      width: 130,
      disableSortBy:true
    },
    {
      Header:'Action',
      width: 100,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.task_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.task_id)}><FaTrash/></Button>
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
          <Title order={6} tt='uppercase'>Task List</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Task</Button>
            <Button leftSection={<FaFileExcel/>} color='green' onClick={()=>excelDownload("clients")}>Excel</Button>
          </Group>
        </Group>
      </Paper>
      <Paper p='xs' shadow='xs' mb='xs' ref={filterRef}>
        <Grid gutter='xs'>
          <Grid.Col span={{lg:3, md:6}}>
            <Select size='xs' label='Projects' data={projects != null ? projects : []} 
            value={state.filter?.project_id} 
            onChange={(value) => dispatch({type:"filter", payload:{'key':"project_id",'value':value}})}/>
          </Grid.Col>
          <Grid.Col span={{lg:3, md:6}}>
            <Select size='xs' label='Team Members' data={employees != null ? employees : []} 
            value={state.filter?.user_login_id} 
            onChange={(value) => dispatch({type:"filter", payload:{'key':"user_login_id",'value':value}})}/>
          </Grid.Col>
        </Grid>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Task"  : "Add Task"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Task Name" maxLength={50} {...form.getInputProps("task_name")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Description" rows={6} maxLength={255} {...form.getInputProps("task_description")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput label="Start Date" {...form.getInputProps("start_date")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput label="End Date" {...form.getInputProps("end_date")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput label="Projected Time" minLength={0} step={0.00} {...form.getInputProps("projected_time_hours")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <Select label="Status" data={dxxata} {...form.getInputProps("task_status_id")}/>
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