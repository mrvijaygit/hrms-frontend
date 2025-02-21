import {Divider, Grid,Rating,Text, useMantineTheme } from "@mantine/core"
import { UseMyReview } from "../../contextapi/MyReviewContext";

function BasicAppraiseeDetail() {
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
            <Grid.Col span={{md:3, sm:6}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Final Rating</Text> <Rating  value={state?.data?.is_publish == 1 ? state?.data?.overall_score : 0} fractions={2} readOnly />
            </Grid.Col>
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