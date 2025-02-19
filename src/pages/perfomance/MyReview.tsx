import {ComboboxData, Grid, Paper} from "@mantine/core"
import { UseMyReview } from "../../contextapi/MyReviewContext";
import { useEffect, useState } from "react";
import { protectedApi } from "../../utils/ApiService";
import { alert } from "../../utils/Alert";
import CustomSelect from "../../components/CustomSelect";
import type { TableDataType } from "../../types/Competency";

import ReviewForm from "./ReviewForm";

export default function MyReview() {
  const [appraisalCycle, setAppraisalCycle] = useState<ComboboxData | null>(null);
  const [questions, setQuestions] = useState<TableDataType[] | null>(null);

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

    useEffect(()=>{
        (async()=>{
        try{
            let response = await protectedApi.get("/performance/questions");
            setQuestions(response.data);
        }
        catch(err:any){
            alert.error(err);
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
        </Grid>
      </Paper>
      {
        questions != null &&  <ReviewForm questions={questions}/>
      }
    </>
  )
}
