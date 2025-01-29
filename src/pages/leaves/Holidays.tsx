import { useDisclosure } from '@mantine/hooks';
import { Box, Button, ComboboxData, Drawer, Grid, Group, Pagination, Paper,Select,Text,TextInput, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFileExcel, FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { DatePickerInput } from '@mantine/dates';
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseHoliday } from '../../contextapi/GenericContext';
import { excelDownload , directionAccessor} from '../../utils/helper';
import type { SortingType } from '../../types/Generic';
import type { FormType, TableDataType } from '../../types/Holiday';

export default function Holidays() {
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseHoliday();
  const [sort, setSort] = useState({} as SortingType);
  const [year, setYear] = useState<ComboboxData | null>(null);

  const form = useForm<FormType>({
    initialValues:{
      holiday_id:-1,
      holiday_title:'',
      holiday_date:null,
    },
    validate:{
      holiday_title: (value) => (value.trim().length > 2 ? null : "Required"),
      holiday_date: (value) => (value != null ? null : "Required"),
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
        const response = await protectedApi.get("/master/leaveYear");
        if(response.data.length > 0){
          let _obj = response.data.filter((obj:any) => obj.selected == 1)[0];
          setYear(response.data);
          console.log(_obj);
          dispatch({type:"filter", payload:{"key":"m_year_id", "value":_obj.value}});
        }
      }
      catch(err:any){
        alert.error(err, true);
      }
    })();
  },[triggerApi]);

  useEffect(()=>{
    if(state.filter?.m_year_id != null){
      (async()=>{
        try{
          let response = await protectedApi.get("/leave/holiday", {
            params:{
              currentpage:state.page,
              postperpage:Number(state.show),
              sorting:sort,
              filter:state.filter
            },
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
  
  },[state.page, state.show, triggerApi, sort, state.filter?.m_year_id]);

  const handleEdit = async(id:number) =>{
      try{
        let response = await protectedApi.get("/leave/viewHoliday", {
          params:{
            "holiday_id":id
          }
        });
        let obj = {...response.data[0], holiday_date: new Date(response.data[0].holiday_date)};
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
      form.setValues({...state.editData, holiday_date:state.editData.holiday_date});
    }
    else{
      form.reset();
    }
  } 

  const handleSubmit = async(values:FormType) =>{
    try{
      let promise = await protectedApi.post("/leave/saveHoliday", JSON.stringify(values));
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
          let promise = await protectedApi.post("/leave/saveHoliday", JSON.stringify({"holiday_id":id, "is_deleted":1}));
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
      Header:'Title',
      accessor:'holiday_title',
      width:"auto",
      sortDirection: sort.accessor === 'holiday_title' ? sort.direction : 'none'
    },
    {
      Header:'Date',
      accessor:'holiday_date',
      width: 150,
      sortDirection: sort.accessor === 'holiday_date' ? sort.direction : 'none'
    },
    {
      Header:'Day',
      accessor:'holiday_day',
      width: 150,
      sortDirection: sort.accessor === 'holiday_day' ? sort.direction : 'none'
    },
    {
      Header:'Action',
      width: 150,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.holiday_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.holiday_id)}><FaTrash/></Button>
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
          <Title order={6} tt='uppercase'>Holiday</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Holiday</Button>
            <Button leftSection={<FaFileExcel/>} color='green' onClick={()=>excelDownload("holiday", state?.filter)}>Excel</Button>
          </Group>
        </Group>
      </Paper>
      
      <Paper p='xs' shadow='xs' mb='xs' ref={filterRef}>
        <Grid gutter={{lg:"xs"}}>
          <Grid.Col span={{lg:2, md:3}}>
            <Select label='Year' data={year != null ? year :  []} size='xs' value={state?.filter?.m_year_id}
            onChange={(value) => dispatch({'type':'filter', payload:{'key':'m_year_id',"value":value}})}/>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Holiday"  : "Add Holiday"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Title" maxLength={20} {...form.getInputProps('holiday_title')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerInput label="Date" {...form.getInputProps('holiday_date')}/>
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
