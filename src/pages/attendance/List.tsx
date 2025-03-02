import { Box, Button, ComboboxData, Drawer, Grid, Group, Pagination, Paper, Select, Text, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { sortingType } from '../../types/general';
import { formType, tableDataType } from "../../types/Attendance";
import { UseAttendance } from '../../contextapi/AttendanceContent';
import { alert } from "../../utils/Alert";
import { protectedApi } from "../../utils/ApiService";
import Filter from "./Filter";
import { useAppSelector } from "../../redux/hook";


function List() {
  const userInfo = useAppSelector(state => state.user);

  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseAttendance();
  const [sort, setSort] = useState({} as sortingType);
  const [statusColor] = useState(['green','orange','blue','red']);
  const [employees, setEmployees] = useState<ComboboxData | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<formType>({
    initialValues:{
      attendance_id:-1,
      user_login_id:null,
      punch_in:'',
      punch_out:'',
      attendance_date:null,
      m_attendance_status_id:null
    },
    validate: {  
      user_login_id:(value) => (value != null ? null : 'Required'),
      punch_in:(value) => (value.length > 0 ? null : 'Required'),
      punch_out:(value) => ((value != null && value.length > 0) ? null : 'Required'),
      attendance_date:(value) => (value != null ? null : 'Required'),
      m_attendance_status_id:(value) => (value != null ? null : 'Required')
    },
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
        let response = await protectedApi.get("/master/userList");
        setEmployees(response.data);
      }
      catch(err:any){
        alert.error(err);
      }
    })();
  },[]);

  useEffect(()=>{
    (async()=>{
      try{
        let response = await protectedApi.get("/attendance/attendance", {
          params:{
            currentpage:state.page,
            postperpage:Number(state.show),
            sorting:sort,
            filter:state.filter
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
  
  },[state.page, state.show, triggerApi, sort, state.filter.attendance_date, state.filter.m_attendance_status_id]);

  const handleEdit = async(id:number) =>{
      try{
        let response = await protectedApi.get("/attendance/viewAttendance", {
          params:{
            "attendance_id":id
          }
        });
        let obj = {...response.data[0], 
          attendance_date:new Date(response.data[0]['attendance_date']),
          m_attendance_status_id: String(response.data[0]['m_attendance_status_id']),
          user_login_id: String(response.data[0]['user_login_id']) };

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

  const handleSubmit = async(values:formType) =>{
    try{
      let promise = await protectedApi.post("/attendance/saveAttendance", JSON.stringify(values));
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
          let promise = await protectedApi.post("/attendance/saveAttendance", JSON.stringify({"attendance_id":id, "is_deleted":1}));
          alert.success(promise.data.msg);
          setTriggerApi((prev) => (prev == false) ? true : false);
        }
      });
    }
    catch(error:any){
      alert.error(error);
    }
  }

  const columns:Column<tableDataType>[] = useMemo(() => [
    {
      Header:'#',
      accessor:'s_no',
      width:40,
      disableSortBy:true
    },
    {
      Header:'Employee Name',
      accessor:'user_name',
      width:"auto",
      headerClassName:"text-capitalize",
      sortDirection: sort.accessor === 'user_name' ? sort.direction : 'none',
      visible:userInfo.m_user_type_id == 1 ? false : true
    },
    {
      Header:'Date',
      accessor:'attendance_date',
      width:150,
      sortDirection: sort.accessor === 'attendance_date' ? sort.direction : 'none',
    },
    {
      Header:'Punch In',
      accessor:'punch_in',
      width:150,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'punch_in' ? sort.direction : 'none',
    },
    {
      Header:'Punch Out',
      accessor:'punch_out',
      width:150,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'punch_out' ? sort.direction : 'none',
    },
    {
      Header:'Working Hours',
      accessor:'working_hours',
      width:150,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'working_hours' ? sort.direction : 'none',
    },
    {
      Header:'Status',
      accessor:'attendance_status',
      width:150, 
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'attendance_status' ? sort.direction : 'none',
      Cell:({row})=>{
        return <Text fw={500} c={statusColor[row.original.m_attendance_status_id - 1]}>{row.original.attendance_status}</Text>
     }
    },
    {
      Header:'Action',
      width: 150,
      headerClassName:"text-center",
      visible:[1000,100].includes(userInfo.m_user_type_id),
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.attendance_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.attendance_id)}><FaTrash/></Button>
          </Group>;
      }
    },
  ], [sort]);

  const data:tableDataType[] = useMemo(()=>state.data, [state.data]);

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
          <Title order={6} tt='uppercase'>Attendance List</Title>
          <Group align="center" gap='xs'>
            {
              [1000,100].includes(userInfo.m_user_type_id) &&  <Button leftSection={<FaPlus/>} onClick={open}>Add Attendance</Button>
            }
          </Group>
        </Group>
      </Paper>
      <Paper p='xs' shadow='xs' mb='xs' ref={filterRef}>
        <Filter/>
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
      <Drawer opened={opened} onClose={()=>{close(); form.reset(); dispatch({type:'isUpdated', payload:{is_updated:false, editData:null}})}} title="Add Attendance" closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <Select  label="Employees"  data={employees != null ? employees : []} {...form.getInputProps('user_login_id')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <TimeInput label="Punch In" {...form.getInputProps('punch_in')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <TimeInput label="Punch Out" {...form.getInputProps('punch_out')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerInput label="Attendance Date" {...form.getInputProps('attendance_date')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Select label="Status" data={state?.status != null ? state?.status : []} {...form.getInputProps('m_attendance_status_id')}/>
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

export default List