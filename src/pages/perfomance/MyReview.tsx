import { Button, ComboboxData, Flex, Grid, Group, Paper, Text, Title} from "@mantine/core"
import { UseMyReview } from "../../contextapi/MyReviewContext";
import { useEffect, useState } from "react";
import { protectedApi } from "../../utils/ApiService";
import { alert } from "../../utils/Alert";
import CustomSelect from "../../components/CustomSelect";
import type { TableDataType } from "../../types/SelfAppraisal";

import Questions from "./Questions";
import BasicAppraiseeDetail from "./BasicAppraiseeDetail";
import { useLocation , useNavigate} from "react-router-dom";
import { useAppSelector } from "../../redux/hook";
import { FaAngleLeft } from "react-icons/fa6";
import QuestionsAndAnswer from "./QuestionsAndAnswer";

export default function MyReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const user_login_id = useAppSelector((state) => state?.user.user_login_id);
  const [appraisalCycle, setAppraisalCycle] = useState<ComboboxData | null>(null);
  const [questions, setQuestions] = useState<TableDataType[] | null>(null);

  const {state,dispatch} = UseMyReview();

  useEffect(()=>{
      (async()=>{
          try{
            let resolve = await protectedApi.get('/master/appraisalCycle', {
              params:{
                appraisal_cycle_id:location?.state?.appraisal_cycle_id,
                user_login_id:location?.state?.user_login_id || user_login_id
              }
            }); 
            setAppraisalCycle(resolve.data.data);
            dispatch({type:"filter", payload:{"key":"appraisal_cycle_id", "value":resolve.data.selected_id}});
          }
          catch(err:any){
            alert.error(err);
          }
      })();
  },[]);

  
  useEffect(()=>{
    if(state?.filter?.appraisal_cycle_id != null){
      (async()=>{
          try{
            let resolve = await protectedApi.get('/performance/viewAppraisee', {
              params:{
                appraisal_cycle_id:state?.filter?.appraisal_cycle_id,
                user_login_id:location?.state?.user_login_id || user_login_id
              }
            }); 
            if(resolve.data.length > 0){
              dispatch({type:"response", payload:resolve.data[0]});
              dispatch({type:"filter", payload:{'key':"status_id", 'value':resolve.data[0]['status_id']}});
            }
            else{
              dispatch({type:"response", payload:null});
              dispatch({type:"filter", payload:{'key':"status_id", 'value':null}});
            }
          }
          catch(err:any){
            alert.error(err);
          }
      })();
    }
  },[state?.filter?.appraisal_cycle_id, state?.trigger]);

  useEffect(()=>{
    if(state?.filter?.status_id != null){
      (async()=>{
        try{
            let response = await protectedApi.get("/performance/questions", {
              params:{
                appraisal_cycle_id:state?.filter?.appraisal_cycle_id,
                user_login_id:location?.state?.user_login_id || user_login_id
              }
            });
            setQuestions(response.data);
        }
        catch(err:any){
            alert.error(err);
        }
        })();
    }
  },[state?.filter?.status_id]);

  
  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs'>
        <Grid gutter='xs' justify="space-between">
          <Grid.Col span={{lg:3, md:4}}>
              <CustomSelect size="xs" data={appraisalCycle != null ? appraisalCycle : []} value={state?.filter.appraisal_cycle_id} onChange={(value) => dispatch({type:"filter", payload:{"key":"appraisal_cycle_id", "value":value}})}/>
          </Grid.Col>
          {
            state?.data?.user_login_id != user_login_id  &&  <Grid.Col span={{lg:3, md:4}} ta='end'>
              <Button leftSection={<FaAngleLeft/>} onClick={()=>navigate(-1)} color='dark.6'>Back</Button>
            </Grid.Col>
          }
        </Grid>
      </Paper>
        {
          state?.data != null ? <Paper p='sm' shadow="xs" my='xs'>  <BasicAppraiseeDetail/> </Paper>
          : <Flex justify='center' align="center"><Text>You are not included in this appraisal cycle</Text></Flex> 
        }
        {
          state?.filter?.status_id == 1 && questions != null && 
          <>
            {
              state?.data?.user_login_id == user_login_id ? <Questions questions={questions}/> : 
              <Group align="center" justify="center" h={300}><Title order={5} c='dimmed'>Waiting For Self Review</Title></Group>
            }
          </>
         
        }
        {
          state?.filter?.status_id != null && state.filter.status_id >= 2 && questions != null &&  <QuestionsAndAnswer questions={questions}/>
        }
    </>
  )
}
