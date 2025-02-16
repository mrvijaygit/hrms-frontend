import { Button, ComboboxData, Grid, Paper, Tabs } from "@mantine/core"
import {AiOutlineUser} from 'react-icons/ai'
import { IoSchoolOutline } from "react-icons/io5";
import { GoalContext } from "../../contextapi/GenericContext";
import { UseMyReview } from "../../contextapi/MyReviewContext";
import Goal from "./Goal";
import SelfAppraisal from "./SelfAppraisal";
import { useEffect, useState } from "react";
import { protectedApi } from "../../utils/ApiService";
import { alert } from "../../utils/Alert";
import CustomSelect from "../../components/CustomSelect";
import { FaPlus } from "react-icons/fa6";

export default function MyReview() {

  const [appraisalCycle, setAppraisalCycle] = useState<ComboboxData | null>(null);

  const {state,dispatch} = UseMyReview();

  useEffect(()=>{
      (async()=>{
          try{
            let resolve = await protectedApi.get('/master/appraisalCycle'); 
            setAppraisalCycle(resolve.data.data);
            dispatch({type:"filter", payload:{"key":"appraisal_cycle_id", "value":resolve.data.selected_id}});
          }
          catch(err){
              alert.error('Master Error');
          }
      })();
  },[]);
  
  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs'>
        <Grid gutter='xs' justify="space-between">
          <Grid.Col span={{lg:3, md:4}}>
              <CustomSelect size="xs" data={appraisalCycle != null ? appraisalCycle : []} value={state?.filter.appraisal_cycle_id} onChange={(value) => dispatch({type:"filter", payload:{"key":"appraisal_cycle_id", "value":value}})}/>
          </Grid.Col>
          <Grid.Col span={{lg:3, md:4}} ta='end'>
            <Button leftSection={<FaPlus/>}>Add Goal</Button>
          </Grid.Col>
        </Grid>
      </Paper>
      <Paper p='sm'>
          <Tabs defaultValue='goal'>
              <Tabs.List grow>
                <Tabs.Tab value="goal" leftSection={<AiOutlineUser/>}>Goal</Tabs.Tab>
                <Tabs.Tab value="compentency" leftSection={<IoSchoolOutline/>}>Compentency</Tabs.Tab>
                <Tabs.Tab value="self_appraisal" leftSection={<IoSchoolOutline/>}>Self Appraisal</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="goal" pt='sm'>
                <GoalContext><Goal/></GoalContext>
              </Tabs.Panel>
              <Tabs.Panel value="compentency" pt='sm'>
                <></>
              </Tabs.Panel>
              <Tabs.Panel value="self_appraisal" pt='sm'>
                 <SelfAppraisal/>
              </Tabs.Panel>
          </Tabs>
      </Paper>
      {/* <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Goal"  : "Add Goal"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
            
      </Drawer> */}
    </>
  )
}
