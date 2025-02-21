import {Button, Flex, NumberInput, Paper,Table,Text, Textarea} from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form";
import { QuestionSchema } from "../../utils/Validation";
import { alert } from "../../utils/Alert";
import { protectedApi } from "../../utils/ApiService";
import { useAppSelector } from "../../redux/hook";
import { UseMyReview } from "../../contextapi/MyReviewContext";
import type { TableDataType, FormType} from "../../types/SelfAppraisal";

export default function Questions({questions}:{questions:TableDataType[]}) {

   const user_login_id =  useAppSelector(state => state.user.user_login_id);

   const {state, dispatch}  = UseMyReview();

    const form = useForm<FormType>({
        initialValues: {
            responses: questions.map((item) => ({ user_rating: "", user_comment: '', compentency_id:item.compentency_id,  self_appraisal_id:-1 , appraisal_cycle_id:state?.data?.appraisal_cycle_id})), 
        },
        validate:zodResolver(QuestionSchema)
    });

    const handleSubmit = (values:FormType) =>{
        alert.question("Are you sure do you Submit your Appraisal?").then(async(res)=>{
            if(res.isConfirmed){

                try{

                    // Calculate the overall rating
                    const self_score = values.responses.reduce((sum, item) => {
                        let x = questions.filter(obj => obj.compentency_id == item.compentency_id)[0];
                        return sum + (Number(item.user_rating) * (Number(x.weightage) / 100));
                    }, 0);

                    let promise = await protectedApi.post("/performance/saveSelfAppraisal", 
                      JSON.stringify({...values, "user_login_id":user_login_id, "status_id":2, "appraisee_id":state?.data?.appraisee_id, 'self_score':self_score}));
                    alert.success(promise.data.msg);
                    form.reset();
                    dispatch({type:"trigger", payload:!state.trigger});
                }
                catch(err:any){
                    alert.error(err);
                }
            }
        });
    }

  return (
    <>
      <Paper p='sm' component="form" onSubmit={form.onSubmit((values)=>handleSubmit(values))}>
          <Table withTableBorder withColumnBorders withRowBorders>
            <Table.Thead bg="gray.1">
                <Table.Tr>
                  <Table.Th ta='center' style={{width:"20px"}}>#</Table.Th>
                  <Table.Th style={{width:"300px"}}>Questions</Table.Th>
                  <Table.Th ta='center' style={{width:"120px"}}>Weightage</Table.Th>
                  <Table.Th ta='center' style={{width:"120px"}}>Rating</Table.Th>
                  <Table.Th style={{width:"400px"}}>Comments</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
            {
                questions.map((item, index:number) =>{
                   return <Table.Tr key={item.s_no}>
                        <Table.Th ta='center'>{item.s_no}</Table.Th>
                        <Table.Th style={{whiteSpace:'wrap'}}>{item.compentency_name}</Table.Th>
                        <Table.Td ta='center'>{item.weightage}%</Table.Td>
                        <Table.Td>
                            <NumberInput  min={1} max={5} maxLength={1}
                             style={{width:'70px'}} mx='auto' placeholder="" rightSectionWidth="30px" 
                             rightSection={<Text> / 5</Text>}
                             {...form.getInputProps(`responses.${index}.user_rating`)}
                             />

                        </Table.Td>
                        <Table.Td>
                          <Textarea rows={4}   {...form.getInputProps(`responses.${index}.user_comment`)}/>
                        </Table.Td>
                    </Table.Tr>
                })
            }
            </Table.Tbody>
          </Table>

          <Paper p='xs' mt='xs'>
            <Flex justify='flex-end' gap='sm'>
                <Button color="dark.6" onClick={()=>form.reset()}>Reset</Button>
                <Button type="submit">Submit</Button>
            </Flex>
        </Paper>

      </Paper>
   
    </>
  )
}
