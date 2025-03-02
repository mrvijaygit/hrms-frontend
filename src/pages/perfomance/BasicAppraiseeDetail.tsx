import {Divider, Grid,Rating,Text, useMantineTheme } from "@mantine/core"
import { UseMyReview } from "../../contextapi/MyReviewContext";
import { useAppSelector } from "../../redux/hook";

function BasicAppraiseeDetail() {
    const user_login_id = useAppSelector(state => state.user.user_login_id);
    const theme = useMantineTheme();

    const {state} = UseMyReview();
    
  return (
   <>
        <Grid>
            <Grid.Col span={{md:6}}>
                <Text c={theme.primaryColor} fw={500}>{state?.data?.user_name} - ({state?.data?.appraisal_cycle_dates})</Text>
                <Text fz='xs' c='dimmed'>{state?.data?.designation_name} - <Text fz='xs' component="span" c='green'>{state?.data?.status}</Text> </Text>
            </Grid.Col>
            <Grid.Col span={{md:3, sm:6}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Self Rating</Text> <Rating value={state?.data?.self_score} fractions={2} readOnly />
            </Grid.Col>
            {
                (state?.data?.is_publish == 1 || user_login_id != state.data?.user_login_id)  &&  <Grid.Col span={{md:3, sm:6}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Final Rating</Text> <Rating  value={state?.data?.overall_score} fractions={2} readOnly />
            </Grid.Col>
            }
           
        </Grid>

        <Divider variant="dashed" my='xs'/>
        <Grid>
            <Grid.Col span={{md:3}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Emp Code</Text><Text fw={500}>{state?.data?.emp_code}</Text>
            </Grid.Col>
            <Grid.Col span={{md:3}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Department</Text><Text fw={500}>{state?.data?.department_name}</Text>
            </Grid.Col>
            <Grid.Col span={{md:3}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Date of joining</Text><Text fw={500}>{state?.data?.date_of_joining}</Text>
            </Grid.Col>
            <Grid.Col span={{md:3}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Reviewer</Text><Text fw={500}>{state?.data?.reviewer_name}</Text>
            </Grid.Col>
        </Grid>
    
   </>
  )
}

export default BasicAppraiseeDetail