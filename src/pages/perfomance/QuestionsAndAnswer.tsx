import {useMantineTheme, Avatar, Box, Button, Flex, Group, NumberInput, Paper,Table,Text, Textarea} from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form";
import { QuestionAndAnswerSchema } from "../../utils/Validation";
import { alert } from "../../utils/Alert";
import { protectedApi } from "../../utils/ApiService";
import { useAppSelector } from "../../redux/hook";
import { UseMyReview } from "../../contextapi/MyReviewContext";
import type { TableDataType, FormType } from "../../types/SelfAppraisal";

export default function QuestionsAndAnswer({questions}:{questions:TableDataType[]}) {
    const theme = useMantineTheme();
   const user_login_id =  useAppSelector(state => state.user.user_login_id);

   const {state, dispatch}  = UseMyReview();

    const form = useForm<FormType>({
        initialValues: {
            responses: questions.map((item) => ({ 
                user_rating: item.user_rating,
                user_comment: item.user_comment,
                compentency_id:item.compentency_id,
                self_appraisal_id:item.self_appraisal_id,
                reviewer_rating:"",
                reviewer_comment:"",
            }))
        },
        validate:zodResolver(QuestionAndAnswerSchema)
    });

    const handleSubmit = (values:FormType) =>{
        alert.question("Are you sure do you Submit your Appraisal?").then(async(res)=>{
            if(res.isConfirmed){
                try{

                  // Calculate the overall rating
                  const overall_score = values.responses.reduce((sum, item) => {
                      let x = questions.filter(obj => obj.compentency_id == item.compentency_id)[0];
                      return sum + (Number(item.reviewer_rating) * (Number(x.weightage) / 100));
                  }, 0);

                  let promise = await protectedApi.post("/performance/saveSelfAppraisal", 
                    JSON.stringify({...values, "user_login_id":state?.data?.user_login_id, "status_id":3, "appraisee_id":state?.data?.appraisee_id, "overall_score":overall_score}));

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
      <Box p='sm' component="form" onSubmit={form.onSubmit((values)=>handleSubmit(values))}>
        
        <Flex gap='sm' direction='column'>
           {
             questions.map((item, index) => {
                return <Paper p='sm' key={item.s_no} shadow="xs">
                            <Flex gap='xs' justify="space-between" align="center">
                                <Text>{item.s_no}. {item.compentency_name}</Text>
                                <Text c='dimmed'>Weightage: <Text fw={500} component="span" c='black'>{item.weightage}%</Text></Text>
                            </Flex>
                            <Box p='xs'>
                              <Table withTableBorder withColumnBorders withRowBorders>
                                <Table.Thead bg="gray.1">
                                    <Table.Tr>
                                      <Table.Th style={{width:"200px"}}>Reviewers</Table.Th>
                                      <Table.Th style={{width:"150px"}} ta='center'>Rating</Table.Th>
                                      <Table.Th style={{width:"400px"}}>Comments</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                  <Table.Tr>
                                      <Table.Th>
                                        <Group align="center" gap='xs'>
                                          <Avatar color={theme.primaryColor} name={state?.data?.user_name}/>
                                          <Box>
                                            <Text fw={500} fz="sm">{state?.data?.user_name}</Text>
                                            <Text fw={500} fz="xs" c='dimmed' lh={1}>{state?.data?.designation_name}</Text>
                                          </Box>
                                        </Group>
                                      </Table.Th>
                                      <Table.Td ta='center'>{item.user_rating} / 5</Table.Td>
                                      <Table.Td>{item.user_comment}</Table.Td>
                                  </Table.Tr>
                                {
                                    state?.data?.status_id == 2 && user_login_id == state?.data?.reporting_id && 
                                    <Table.Tr>
                                        <Table.Th>
                                        <Group align="center" gap='xs'>
                                            <Avatar color="green" name={state?.data?.reviewer_name}/>
                                            <Box>
                                                <Text fw={500} fz="sm">{state?.data?.reviewer_name}</Text>
                                                <Text fw={500} fz="xs" c='dimmed' lh={1}>{state?.data?.department_name}</Text>
                                            </Box>
                                        </Group>
                                        </Table.Th>
                                        <Table.Td>
                                            <NumberInput  min={1} max={5} maxLength={1}
                                            style={{width:'70px'}} mx='auto' placeholder="" rightSectionWidth="30px" 
                                            rightSection={<Text> / 5</Text>}
                                            {...form.getInputProps(`responses.${index}.reviewer_rating`)}
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <Textarea rows={4} {...form.getInputProps(`responses.${index}.reviewer_comment`)}/>
                                        </Table.Td>
                                    </Table.Tr>
                                }
                                {
                                    ((state?.data?.status_id == 3 && user_login_id == state?.data?.reporting_id) ||  state?.data?.is_publish == 1) && <Table.Tr>
                                             <Table.Th>
                                             <Group align="center" gap='xs'>
                                                 <Avatar color="blue" name={state?.data?.reviewer_name}/>
                                                 <Box>
                                                     <Text fw={500} fz="sm">{state?.data?.reviewer_name}</Text>
                                                     <Text fw={500} fz="xs" c='dimmed' lh={1}>{state?.data?.department_name}</Text>
                                                 </Box>
                                             </Group>
                                             </Table.Th>
                                             <Table.Td ta='center'>{item.reviewer_rating} / 5</Table.Td>
                                             <Table.Td>{item.reviewer_comment}</Table.Td>
                                    </Table.Tr>
                                }
                                </Table.Tbody>
                              </Table>
                            </Box>
                    </Paper>
             })
           }
        </Flex>
        {
            state?.data?.status_id == 2 && user_login_id == state?.data?.reporting_id && 
            <Paper p='xs' mt='xs'>
                <Flex justify='flex-end' gap='sm'>
                    <Button color="dark.6" onClick={()=>form.reset()}>Reset</Button>
                    <Button type="submit">Submit</Button>
                </Flex>
            </Paper>
        }


      </Box>
   
    </>
  )
}
