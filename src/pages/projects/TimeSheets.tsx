import { useDisclosure } from '@mantine/hooks';
import { Box, Button, ComboboxData, Drawer, Grid, Group, Pagination, Paper,Select,Text,Textarea, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFileExcel, FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm, zodResolver} from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseTime } from '../../contextapi/GenericContext';
import { excelDownload , directionAccessor} from '../../utils/helper';
import type { SortingType } from '../../types/Generic';
import type { FormType, TableDataType } from '../../types/TimeSheets';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import { useNavigate, useLocation} from 'react-router-dom';
import { TimeSheetSchema } from '../../utils/Validation';
import { DateTimePicker } from '@mantine/dates';
import CustomSelect from '../../components/CustomSelect';

export default function TimeSheets() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const [selfTrigger, setSelfTrigger] = useState<Boolean>(true);
  const {state, dispatch}  = UseTime();
  const [sort, setSort] = useState({} as SortingType);

  const [tasks, setTasks] = useState<ComboboxData | null>(null);
  const [teamMembers, setTeamMembers] = useState<ComboboxData | null>(null);

  const form = useForm<FormType>({
    initialValues:{
      timesheet_id:-1,
      task_id:null,
      project_member_id:null,
      start_date_time:null,
      end_date_time:null,
      comments:""
    },
    validate:zodResolver(TimeSheetSchema)
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
        let response1 = await protectedApi.get("/master/tasks", {params:{'project_id':location?.state?.project_id}});
        setTasks(response1.data);

        let response2 = await protectedApi.get("/master/teamMembers", {params:{'project_id':location?.state?.project_id}});
        setTeamMembers(response2.data);


        dispatch({type:"filter", payload:{'key':"task_id",'value':location?.state?.task_id ? location?.state?.task_id : -1}});
        dispatch({type:"filter", payload:{'key':"project_member_id",'value':location?.state?.project_member_id ? location?.state?.project_member_id : -1}});
        

        dispatch({type:"filter", payload:{'key':"project_id",'value':location?.state?.project_id}});
      }
      catch(err:any){
        alert.error(err, true);
      }
    })()
  },[]);

  useEffect(()=>{
    if(state?.filter?.project_id != null && state?.filter?.task_id != null &&  state?.filter?.project_member_id){
      (async()=>{
        try{
          let response = await protectedApi.get("/project/timesheets", {
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
          alert.error(err, true)
        }
      })();
    }
  },[state.page, state.show, triggerApi, sort, state?.filter?.project_member_id, state?.filter?.task_id]);

  const handleEdit = async(id:number) =>{
      try{
        const data = state?.data.filter(obj => obj.timesheet_id == id)[0];
        let obj = {
          timesheet_id:data.timesheet_id,
          task_id:data.task_id,
          project_member_id:data.project_member_id,
          start_date_time:new Date(data.start_date_time),
          end_date_time:new Date(data.end_date_time),
          comments:data.comments
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
      let promise = await protectedApi.post("/project/saveTimesheets", JSON.stringify({...values, 'project_id':location.state?.project_id}));
      alert.success(promise.data.msg);
      form.reset();
      dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});
      close();
      setTriggerApi((prev) => (prev == false) ? true : false);
    }
    catch(error:any){
      alert.error(error, true);
    }
  }

  const handleDelete = (id:number) =>{
    try{
      alert.question("Do you Want to delete this record").then(async(res)=>{
        if(res.isConfirmed){
          let promise = await protectedApi.post("/project/saveTimesheets", JSON.stringify({"timesheet_id":id, "is_deleted":1}));
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
      Header:'User Name',
      accessor:"user_name",
      width:300,
      sortDirection: sort.accessor === 'user_name' ? sort.direction : 'none',
      Cell:({row})=><>
        <Text>{row.original.user_name}</Text>
        <Text c='dimmed' fz={13}>{row.original.comments}</Text>
      </>
    },
    {
      Header:'Task Name',
      accessor:"task_name",
      width: 250,
      sortDirection: sort.accessor === 'task_name' ? sort.direction : 'none'
    },
    {
      Header:'Start Date Time',
      accessor:"display_start_date_time",
      width: 200,
      disableSortBy:true
    },
    {
      Header:'End Date Time',
      accessor:"display_end_date_time",
      width: 200,
      disableSortBy:true
    },
    {
      Header:'Spent Time',
      accessor:"task_duration",
      width: 100,
      disableSortBy:true,
      headerClassName:"text-center",
      Cell:({value}) => <Text>{value.split(':')[0]}:{value.split(':')[1]}</Text> 
    },
    {
      Header:'Action',
      width: 100,
      headerClassName:"text-center",
      disableSortBy:true,
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.timesheet_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.timesheet_id)}><FaTrash/></Button>
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
          <Title order={6} tt='uppercase'>Timesheets</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add TimeSheet</Button>
            <Button leftSection={<FaFileExcel/>} color='green' onClick={()=>excelDownload("timesheets")}>Excel</Button>
            <Button leftSection={<FaAngleDoubleLeft/>} color='dark.6' onClick={()=>navigate(-1)}>Back</Button>
          </Group>
        </Group>
      </Paper>
      <Paper p='xs' shadow='xs' mb='xs' ref={filterRef}>
        <Grid gutter='xs'>
          <Grid.Col span={{lg:3, md:6}}>
            <CustomSelect size='xs' label='Task' data={tasks != null ? tasks :[]} 
            value={state.filter?.task_id} 
            onChange={(value) => dispatch({type:"filter", payload:{'key':"task_id",'value':value}})}/>
          </Grid.Col>
          <Grid.Col span={{lg:3, md:6}}>
            <CustomSelect size='xs' label='Team Member' data={teamMembers != null ? teamMembers :[]} 
            value={state.filter?.project_member_id} 
            onChange={(value) => dispatch({type:"filter", payload:{'key':"project_member_id",'value':value}})}/>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Timesheet"  : "Add Timesheet"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <CustomSelect label="Task" data={tasks != null ? tasks :[]} {...form.getInputProps("task_id")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <CustomSelect label="Team Member" data={teamMembers != null ? teamMembers :[]}  {...form.getInputProps("project_member_id")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <DateTimePicker label="Start Date & Time" maxDate={new Date()} valueFormat='DD-MMM-YYYY hh:mm a' {...form.getInputProps("start_date_time")}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <DateTimePicker label="End Date & Time" maxDate={new Date()} valueFormat='DD-MMM-YYYY hh:mm a' {...form.getInputProps("end_date_time")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Comments" rows={5} {...form.getInputProps("comments")}/>
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
