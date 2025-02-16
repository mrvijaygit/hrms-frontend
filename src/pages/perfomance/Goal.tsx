import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Drawer, Grid, Group, NumberInput, Pagination, Paper,Select,Text,Textarea,TextInput, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseGoal } from '../../contextapi/GenericContext';
import {directionAccessor} from '../../utils/helper';
import type { SortingType } from '../../types/Generic';
import type { FormType, TableDataType } from '../../types/Goal';
import { DatePickerInput } from '@mantine/dates';
import { Progress } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/hook';

export default function Goal() {
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const [triggerTableCol, setTriggerTableCol] = useState<Boolean>(true);
  const {state, dispatch}  = UseGoal();
  const [sort, setSort] = useState({} as SortingType);
  const location =  useLocation();

  const user_login_id = useAppSelector(state => state?.user.user_login_id);

  const form = useForm<FormType>({
    initialValues:{
        goal_id:-1,
        goal_name:"",
        goal_date:[null, null],
        description:"",
        weightage:0,
        progress:0
    },
    validate:{
        goal_name: (value) => (value.trim().length > 4 ? null : "Required"),
        goal_date:(value) => value[0] != null ? null : "Required",
        description: (value) => (value.trim().length > 4 ? null : "Required"),
        weightage: (value) => (String(value).trim().length > 0 ? null : "Required"),
        progress: (value) => (String(value).trim().length > 0 ? null : "Required"),
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
          let response = await protectedApi.get("/performance/goal", {
            params:{
              currentpage:state.page,
              postperpage:Number(state.show),
              sorting:sort,
            },
          });
          setTriggerTableCol((prev) => prev == true ? false : true);
          dispatch({type:"response", payload:{
            data:response.data.data,
            totalRecord:response.data.totalRecord
          }});
        }
        catch(err:any){
          alert.error(err);
        }
      })();
  },[state.page, state.show, triggerApi, sort]);

  const handleEdit = async(id:number) =>{
      try{
        let data = state?.data.filter(obj => obj.goal_id == id)[0];

        let obj:FormType = {
            goal_id:data.goal_id,
            goal_name:data.goal_name,
            goal_date:[new Date(data.start_date), new Date(data.end_date)],
            description:data.description,
            weightage:data.weightage,
            progress:data.progress
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
       let user_id = user_login_id;
      if(location?.state?.user_login_id){
        user_id = location.state.user_login_id;
      }

      let promise = await protectedApi.post("/performance/saveGoal", JSON.stringify({...values, "user_login_id":user_id, "appraisal_cycle_id":1}));
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
          let promise = await protectedApi.post("/performance/saveGoal", JSON.stringify({"goal_id":id, "is_deleted":1}));
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
      Header:'Goal',
      accessor:"goal_name",
      width:200,
      sortDirection: sort.accessor === 'goal_name' ? sort.direction : 'none',
      Cell:({row})=>{
        return <>
            <Text>{row.original.goal_name}</Text>
            <Text c='dimmed' fz={12}>{row.original.start_date} to {row.original.end_date}</Text>
        </>
      }
    },
    {
      Header:'Weightage',
      accessor:"weightage",
      width: 150,
      sortDirection: sort.accessor === 'weightage' ? sort.direction : 'none'
    },
    {
      Header:'Progress',
      accessor:"progress",
      width: 150,
      disableSortBy:true,
      Cell:({row})=>{
        return <>
            <Progress value={row.original.progress} striped title={String(row.original.progress)} />
        </>
      }
    },
    {
      Header:'Action',
      width: 150,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.goal_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.goal_id)}><FaTrash/></Button>
          </Group>;
      }
    },
  ], [sort, triggerTableCol]);

  const data:TableDataType[] = useMemo(()=>state.data, [state.data]);

  const columnHeaderClick = async (column:any) => {
    setSort(directionAccessor(column));
  };

  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs' ref={topRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Title order={6} tt='uppercase'>Goal</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Goal</Button>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Goal"  : "Add Goal"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Goal" maxLength={100} {...form.getInputProps("goal_name")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerInput type='range' label="Date" {...form.getInputProps("goal_date")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <NumberInput label="Weightage" maxLength={3} min={0} max={100} {...form.getInputProps("weightage")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <NumberInput label="progress" maxLength={3} min={0}  max={100} {...form.getInputProps("progress")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Description" maxLength={255} rows={5} {...form.getInputProps("description")}/>
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
