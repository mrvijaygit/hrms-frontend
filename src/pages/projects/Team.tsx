import { useDisclosure } from '@mantine/hooks';
import { Box, Button, ComboboxData, Drawer, Grid, Group, Pagination, Paper,Select,Text,TextInput, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseTeam } from '../../contextapi/TeamContext';
import type { FormType, TableDataType } from '../../types/Team';
import { useAppSelector } from '../../redux/hook';
import { useLocation } from 'react-router-dom';
type sortingType = { direction: string, accessor: string};

export default function Tasks() {
  
  const logger_user_login_id = useAppSelector(state => state.user.user_login_id);
  const location = useLocation();
  const [employees , setEmployees] = useState<ComboboxData | null>(null);
  const [projects , setProjects] = useState<ComboboxData | null>(null);
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseTeam();
  const [sort, setSort] = useState({} as sortingType);

  const form = useForm<FormType>({
    initialValues:{
      project_member_id:-1,
      user_login_id:null,
      role:""
    },
    validate:{
      user_login_id: (value) => (value != null ? null : 'Required'),
      role: (value) => (value.trim().length > 4 ? null : "Required")
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
        let projectResponse = await protectedApi.get('/master/projects', {
          params:{
            selected_id: location.state != null ?  location.state.project_id : null
          }
        });
        dispatch({type:"filter", payload:{'key':"project_id",'value':projectResponse.data.selected_id}})
        setProjects(projectResponse.data.data);
        let response = await protectedApi.get('/master/userList', {
            params:{
              reporting_id: logger_user_login_id
            }
        });
        setEmployees(response.data);
      }
      catch(err:any){
        alert.error(err,true);
      }
    })();
  },[]);

  useEffect(()=>{
    if(state.filter.project_id != null){
      (async()=>{
        try{
          let response = await protectedApi.get("/project/teamMembers", {
            params:{
              currentpage:state.page,
              postperpage:Number(state.show),
              project_id:state.filter.project_id,
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
      })();
    }
  
  },[state.page, state.show, triggerApi, sort, state.filter.project_id]);

  const handleEdit = async(id:number) =>{
    const data = state?.data.filter(obj => obj.project_member_id == id)[0];
    let obj = {
      project_member_id: data.project_member_id,
      user_login_id: String(data.user_login_id),
      role: data.role,
    };
    dispatch({type:"isUpdated", payload:{is_updated:true, editData:obj}});
    form.setValues(obj);
    open();
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
      let promise = await protectedApi.post("/project/saveTeamMember", JSON.stringify({...values, "project_id":state.filter.project_id}));
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

  const columns:Column<TableDataType>[] = useMemo(() => [
    {
      Header:'#',
      accessor:'s_no',
      width: 40,
      disableSortBy:true
    },
    {
      Header:'Name',
      accessor:"user_name",
      width:"auto",
      sortDirection: sort.accessor === 'user_name' ? sort.direction : 'none'
    },
    {
      Header:'Role',
      accessor:"role",
      width: 250,
      sortDirection: sort.accessor === 'role' ? sort.direction : 'none'
    },
    {
      Header:'Timesheet Entries',
      accessor:"timesheet_entries",
      width: 250,
      disableSortBy:true,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'timesheet_entries' ? sort.direction : 'none',
      Cell:({value}) => <Button variant='light' onClick={()=>{}}>{value}</Button>
    },
    {
      Header:'Timesheet Hours',
      accessor:"timesheet_hours",
      width: 250,
      disableSortBy:true,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'timesheet_hours' ? sort.direction : 'none',
      Cell:({value}) => <Button variant='light' onClick={()=>{}}>{value}</Button>
    },
    {
      Header:'Action',
      width: 100,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.project_member_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.project_member_id)}><FaTrash/></Button>
          </Group>;
      }
    },
  ], [sort]);

  const data:TableDataType[] = useMemo(()=>state.data, [state.data]);

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
          <Title order={6} tt='uppercase'>Team Members</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Member</Button>
          </Group>
        </Group>
      </Paper>
      <Paper p='xs' shadow='xs' mb='xs' ref={filterRef}>
        <Grid gutter='xs'>
          <Grid.Col span={{lg:3, md:6}}>
            <Select size='xs' label='Select Projects' data={projects != null ? projects : []} 
            value={state?.filter.project_id} 
            onChange={(value) => dispatch({type:"filter", payload:{'key':"project_id",'value':value}})}/>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Member"  : "Add Member"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <Select label='Member' description={state.is_updated ? "You cannot update the team member" : null} data={employees != null ? employees : []} {...form.getInputProps("user_login_id")} readOnly={form.values.project_member_id == -1 ? false : true}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput label="Role" maxLength={50} {...form.getInputProps("role")}/>
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
