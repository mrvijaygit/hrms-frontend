import { useDisclosure } from '@mantine/hooks';
import { Box, Button, ComboboxData, Drawer, Grid, Group, NumberInput, Pagination, Paper,Select,Text,Textarea,TextInput, Title, Tooltip } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaClock, FaFileExcel, FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
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
import { useLocation } from 'react-router-dom';
import CustomSelect from '../../components/CustomSelect';
import { FaTimes } from 'react-icons/fa';

export default function Tasks() {
  const location = useLocation();
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const [selfTrigger, setSelfTrigger] = useState<Boolean>(true);
  const {state, dispatch}  = UseTasks();
  const [sort, setSort] = useState({} as SortingType);

  const [taskStatus, setTaskStatus] = useState<ComboboxData | null>(null);
  const [projects , setProjects] = useState<ComboboxData | null>(null);

  const form = useForm<FormType>({
    initialValues:{
      task_id:-1,
      task_name:"",
      task_description:"",
      task_date:[null,null],
      task_status_id:null,
      projected_hours:0
    },
    validate:{
      task_name: (value) => (value.trim().length > 4 ? null : "Required"),
      task_description: (value) => (value.trim().length > 4 ? null : "Required"),
      task_date: (value) => (value[0] != null ? null : 'Required'),
      task_status_id: (value) => (value != null ? null : 'Required'),
      projected_hours: (value) => (value > 0 ? null : 'Required'),
    }
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
        let response = await protectedApi.get("/master/projectStatus");
        setTaskStatus(response.data);

        let projectResponse = await protectedApi.get('/master/projects', {
          params:{
            selected_id: location.state != null ?  location.state.project_id : null
          }
        });
        dispatch({type:"filter", payload:{'key':"project_id",'value':projectResponse.data.selected_id}});
        setProjects(projectResponse.data.data);

      }
      catch(err:any){
        alert.error(err, true);
      }
    })()
  },[]);

  useEffect(()=>{
    if(state?.filter?.project_id != null){
      (async()=>{
        try{
          let response = await protectedApi.get("/project/tasks", {
            params:{
              currentpage:state.page,
              postperpage:Number(state.show),
              sorting:sort,
              filter:state?.filter
            }
          });
          dispatch({type:"response", payload:{
            data:response.data.data,
            totalRecord:response.data.totalRecord
          }});
          setSelfTrigger((prev) => (prev == false) ? true : false);
        }
        catch(err:any){
          alert.error(err);
        }
      })()
    }
  },[state.page, state.show, triggerApi, sort, state?.filter?.project_id, state?.filter?.task_status_id]);

  const handleEdit = async(id:number) =>{
      try{
        let data = state?.data.filter(obj => obj.task_id == id)[0];
        let obj:FormType = {
          task_id:data.task_id,
          task_name:data.task_name,
          task_description:data.task_description,
          task_date:[new Date(data.start_date), new Date(data.end_date)],
          task_status_id:data.task_status_id,
          projected_hours:data.projected_hours
        };

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

      let promise = await protectedApi.post("/project/saveTask", JSON.stringify({...values, "project_id":state?.filter?.project_id}));
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
          let promise = await protectedApi.post("/project/saveTask", JSON.stringify({"task_id":id, "is_deleted":1}));
          alert.success(promise.data.msg);
          setTriggerApi((prev) => (prev == false) ? true : false);
        }
      });
    }
    catch(error:any){
      alert.error(error);
    }
  }

  const handleView = (id:number)=>{
    
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
      sortDirection: sort.accessor === 'task_status' ? sort.direction : 'none',
      Cell:({row, value}) => <Text c={row.original.status_color}>{value}</Text>
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
      Header:'Projected Hours',
      accessor:"projected_hours",
      width: 130,
      disableSortBy:true,
      headerClassName:"text-center",
      Cell:({value}) => <Button variant='light' onClick={()=>{}}>{value}</Button>
    },
    {
      Header:'Spent Time',
      accessor:"spent_time",
      width: 130,
      disableSortBy:true,
      headerClassName:"text-center",
      Cell:({value}) => <Button variant='light' onClick={()=>{}}>{value}</Button>
    },
    {
      Header:'Action',
      width: 130,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Tooltip label="Timesheet" withArrow position="bottom"><Button variant='light' color='green' onClick={()=>handleView(row.original.task_id)}><FaClock/></Button></Tooltip>
            <Button variant='light' onClick={()=>handleEdit(row.original.task_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.task_id)}><FaTrash/></Button>
          </Group>;
      }
    },
  ], [sort, selfTrigger]);

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
            <CustomSelect size='xs' label='Projects' data={projects != null ? projects : []} 
            value={state.filter?.project_id} 
            onChange={(value) => dispatch({type:"filter", payload:{'key':"project_id",'value':value}})}/>
          </Grid.Col>
          <Grid.Col span={{lg:3, md:6}}>
            <CustomSelect size='xs' label='Status' data={taskStatus != null ? taskStatus : []} 
            value={state.filter?.task_status_id} 
            onChange={(value) => dispatch({type:"filter", payload:{'key':"task_status_id",'value':value}})}
            clearable/>
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
        <Box component="form" onSubmit={form.onSubmit(values =>{ handleSubmit(values);})}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Task Name" maxLength={50} {...form.getInputProps("task_name")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Description" rows={6} maxLength={255} {...form.getInputProps("task_description")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerInput type='range' label="Date" {...form.getInputProps("task_date")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput label="Projected Hours" maxLength={3} placeholder='Enter Hrs' {...form.getInputProps("projected_hours")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <CustomSelect label="Status" data={taskStatus != null ? taskStatus : []} {...form.getInputProps("task_status_id")}/>
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