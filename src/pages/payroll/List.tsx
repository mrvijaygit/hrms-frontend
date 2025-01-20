import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Drawer, Grid, Group, NumberInput, Pagination, Paper,Select,Text, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark, FaFileInvoiceDollar} from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UsePayroll } from '../../contextapi/PayrollContext';
import type { formType, tableDataType } from '../../types/Payroll';
import {  MonthPickerInput } from '@mantine/dates';
import Filter from './Filter';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from "../../redux/hook";

type sortingType = { direction: string, accessor: string};

export default function List() {
  const userInfo = useAppSelector(state => state.user);

  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UsePayroll();
  const [sort, setSort] = useState({} as sortingType);

  const navigate = useNavigate();

  const handleNavigate = (id:number, user_name:string) => {
    navigate('/payroll/generatePayslip', { state: { payroll_id: id, user_name:user_name} });
  };

  const form = useForm<formType>({
    initialValues:{
      payroll_id:-1,
      user_login_id:null,
      payroll_month:null,
      basic_salary:0,
      house_rent_allowance:0,
      medical_allowance:0,
      transport_allowance:0,
      other_allowance:0,
      tax:0,
      other_deduction:0,
      net_salary:0,
      gross_salary:0
    },
    validate:{
      payroll_month:(value) => (value != null ? null : 'Required'),
      user_login_id:(value) => (value != null ? null : 'Required'),
      other_deduction:(value) => (String(value).length > 0 ? null : 'Required'),
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

  const handleSalary = ()=> {
    let gross = Number(form.values.basic_salary) + Number(form.values.house_rent_allowance) + 
    Number(form.values.medical_allowance) + Number(form.values.transport_allowance) + Number(form.values.other_allowance);
    let net = gross - (Number(form.values.tax) + Number(form.values.other_deduction));
    form.setFieldValue('gross_salary', gross);
    form.setFieldValue("net_salary", net);
  }

  useEffect(()=>{
    (async()=>{
      try{
        let response = await protectedApi.get("/payroll/payrollList", {
          params:{
            currentpage:state?.page,
            postperpage:Number(state?.show),
            sorting:sort,
            filter:state?.filter
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
  
  },[state?.page, state?.show, triggerApi, sort, state?.filter.payroll_month, state?.filter.user_login_id]);

  useEffect(()=>{
    (async()=>{
      if(form.values.user_login_id != null && form.values.payroll_id == -1){
        let response = await protectedApi.get('/user/salary/', {
          params:{
            user_login_id:form.values.user_login_id
          }
        });

        if(response.data.length > 0){
          delete response.data[0].employee_salary_id;
          delete response.data[0].user_login_id;
          form.setValues({...form.values, ...response.data[0]});
          handleSalary();
        }

      }
    })();

  },[form.values.user_login_id]);

  useEffect(()=>{
    handleSalary();
  },[form.values.other_deduction]);

  const handleEdit = async(id:number) =>{
      try{
        let response = await protectedApi.get("/payroll/viewPayroll", {
          params:{
            "payroll_id":id
          }
        });
        let obj = {...response.data[0], payroll_month:new Date(response.data[0]['payroll_month']), user_login_id:String(response.data[0]['user_login_id'])};
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
      let promise = await protectedApi.post("/payroll/savePayroll", JSON.stringify(values));
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
          let promise = await protectedApi.post("/payroll/savePayroll", JSON.stringify({"payroll_id":id, "is_deleted":1}));
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
      width: 40,
      disableSortBy:true
    },
    {
      Header:'Name',
      accessor:"user_name",
      width:200,
      sortDirection: sort.accessor === 'user_name' ? sort.direction : 'none'
    },
    {
      Header:'Payroll Month',
      accessor:"payroll_month",
      width: 150,
      sortDirection: sort.accessor === 'payroll_month' ? sort.direction : 'none'
    },
    {
      Header:'basic salary',
      accessor:"basic_salary",
      width: 150,
      sortDirection: sort.accessor === 'basic_salary' ? sort.direction : 'none'
    },
    {
      Header:'Total Allowances',
      accessor:"allowances",
      width: 150,
      sortDirection: sort.accessor === 'allowances' ? sort.direction : 'none'
    },
    {
      Header:'gross',
      accessor:"gross_salary",
      width: 150,
      sortDirection: sort.accessor === 'gross_salary' ? sort.direction : 'none'
    },
    {
      Header:'tax',
      accessor:"tax",
      width: 100,
      sortDirection: sort.accessor === 'tax' ? sort.direction : 'none'
    },
    {
      Header:'other deductions',
      accessor:"other_deduction",
      width: 150,
      sortDirection: sort.accessor === 'other_deduction' ? sort.direction : 'none'
    },
    {
      Header:'net salary',
      accessor:"net_salary",
      width: 150,
      sortDirection: sort.accessor === 'net_salary' ? sort.direction : 'none'
    },
    {
      Header:'Action',
      width: 150,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' color='green' onClick={()=>handleNavigate(row.original.payroll_id, row.original.user_name)}><FaFileInvoiceDollar/></Button>
          {
            [1000,100].includes(userInfo.m_user_type_id) && <>
              <Button variant='light' onClick={()=>handleEdit(row.original.payroll_id)}><FaPencil/></Button>
              <Button variant='light' color="red" onClick={()=>handleDelete(row.original.payroll_id)}><FaTrash/></Button>
            </>
          }
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
          <Title order={6} tt='uppercase'>Payroll List</Title>
          {
            [1000,100].includes(userInfo.m_user_type_id) &&   <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Payroll</Button>
          </Group>
          }
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
      <Drawer  opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Payroll"  : "Add Payroll"} closeOnClickOutside={false} position="right" offset={8} radius="sm" size="xl">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
            <Grid.Col span={{lg:6}}>
              <Select label="Employee" data={state?.employee} {...form.getInputProps('user_login_id')}/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <MonthPickerInput label="Payroll Month"  {...form.getInputProps("payroll_month")}/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="Basic Salary" maxLength={10} {...form.getInputProps('basic_salary')} readOnly/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="House Rent Allowance" maxLength={10} {...form.getInputProps('house_rent_allowance')} readOnly/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="Medical Allowance" maxLength={10} {...form.getInputProps('medical_allowance')} readOnly/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="Transport Allowance" maxLength={10} {...form.getInputProps('transport_allowance')} readOnly/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="Other Allowance" maxLength={10} {...form.getInputProps('other_allowance')} readOnly/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="Tax" maxLength={10} {...form.getInputProps('tax')} readOnly/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="Other Deduction" description="Extend deductions for Unnessary Leaves" maxLength={10} {...form.getInputProps('other_deduction')}/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="Gross salary" maxLength={10} {...form.getInputProps('gross_salary')} readOnly/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <NumberInput label="Net salary" maxLength={10} {...form.getInputProps('net_salary')} readOnly />
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
