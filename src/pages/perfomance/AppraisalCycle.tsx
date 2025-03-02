import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Drawer, Grid, Group, Pagination, Paper,Select,Switch,Text,TextInput, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaEye,FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { DatePickerInput } from '@mantine/dates';
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseACycle } from '../../contextapi/GenericContext';
import {directionAccessor} from '../../utils/helper';
import type { SortingType } from '../../types/Generic';
import type { FormType, TableDataType } from '../../types/AppraisalCycle';
import CustomSelect from '../../components/CustomSelect';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hook';

export default function AppraisalCycle() {
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const [triggerTableCol, setTriggerTableCol] = useState<Boolean>(true);
  const {state, dispatch}  = UseACycle();
  const [sort, setSort] = useState({} as SortingType);

  const navigate = useNavigate();
  const m_user_type_id = useAppSelector(state => state.user.m_user_type_id);

  const form = useForm<FormType>({
    initialValues:{
      appraisal_cycle_id:-1,
      appraisal_name:"",
      appraisal_date:[null,null],
      appraisal_status_id:null
    },
    validate:{
      appraisal_name: (value) => (value.trim().length > 4 ? null : "Required"),
      appraisal_date: (value) => (value[0] != null ? null : "Required"),
      appraisal_status_id: (value) => (value != null ? null : "Required"),
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
          let response = await protectedApi.get("/performance/appraisalCycleList", {
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
       
        let data = state?.data.filter(obj => obj.appraisal_cycle_id == id)[0];
        console.log(data.end_date);
        let obj:FormType = {
          appraisal_cycle_id:data.appraisal_cycle_id,
          appraisal_name:data.appraisal_name,
          appraisal_status_id:data.appraisal_status_id,
          appraisal_date: [new Date(data.start_date), new Date(data.end_date)]
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
      form.setValues({...state.editData, appraisal_date:state.editData.appraisal_date});
    }
    else{
      form.reset();
    }
  } 

  const handleSubmit = async(values:FormType) =>{
    try{
      let promise = await protectedApi.post("/performance/saveAppraisalCycle", JSON.stringify(values));
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
          let promise = await protectedApi.post("/performance/saveAppraisalCycle", JSON.stringify({"appraisal_cycle_id":id, "is_deleted":1}));
          alert.success(promise.data.msg);
          setTriggerApi((prev) => (prev == false) ? true : false);
        }
      });
    }
    catch(error:any){
      alert.error(error);
    }
  }

  const handleActive = (event:React.ChangeEvent<HTMLInputElement>, id:number) =>{
    if(event.target.checked){
        alert.question("Are you Sure do you want to change the period").then((res)=>{
          if(res.isConfirmed){
            try{
              (async()=>{
                let promise = await protectedApi.post("/performance/saveAppraisalCycle", JSON.stringify({"appraisal_cycle_id":id, is_active:1}));
                alert.success(promise.data.msg);
                setTriggerApi((prev) => (prev == false) ? true : false);
              })();
           }
           catch(err:any){
              alert.error(err);
           }
          }
        });
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
      accessor:"appraisal_name",
      width:200,
      sortDirection: sort.accessor === 'appraisal_name' ? sort.direction : 'none'
    },
    {
      Header:'Period',
      accessor:"appraisal_date",
      width: 250,
      sortDirection: sort.accessor === 'appraisal_date' ? sort.direction : 'none'
    },
    {
      Header:'Active',
      accessor:"is_active",
      width: 150,
      disableSortBy:true,
      headerClassName:"text-center",
      visible:m_user_type_id == 1000 ? true : false,
      Cell:({row, value})=>{
        return <Group justify='center'><Switch checked={value} disabled={row.original.appraisal_status_id == 3 ? true : false} onChange={(event)=>handleActive(event, row.original.appraisal_cycle_id)} /></Group>;
      }
    },
    {
      Header:'Status',
      accessor:'appraisal_status',
      width: 150,
      sortDirection: sort.accessor === 'appraisal_status' ? sort.direction : 'none',
      headerClassName:"text-center"
    },
    {
      Header:'Action',
      width: 150,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' color='green' onClick={()=>navigate('/performance/appraisalcycle/appraiseelist', {state:{'appraisal_cycle_id':row.original.appraisal_cycle_id}})}><FaEye/></Button>
            {
               m_user_type_id == 1000 &&  <>
                  <Button variant='light' onClick={()=>handleEdit(row.original.appraisal_cycle_id)}><FaPencil/></Button>
                  <Button variant='light' color="red" onClick={()=>handleDelete(row.original.appraisal_cycle_id)}><FaTrash/></Button>
               </>
            }

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
          <Title order={6} tt='uppercase'>Appraisal Cycle</Title>
          {
            m_user_type_id == 1000 &&  <Group align="center" gap='xs'>
              <Button leftSection={<FaPlus/>} onClick={open}>Add</Button>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Cycle"  : "Add Cycle"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Title" maxLength={100} {...form.getInputProps('appraisal_name')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerInput type='range' label="Date" {...form.getInputProps('appraisal_date')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <CustomSelect data={[
                  {value:"1", "label":"Start"},
                  {value:"2", "label":"Inprogess"},
                  {value:"3", "label":"Completed"},
                ]} label="Status" {...form.getInputProps('appraisal_status_id')}/>
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
