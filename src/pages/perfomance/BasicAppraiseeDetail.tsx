import {Box, Divider, Flex, Grid,Group,Text, useMantineTheme } from "@mantine/core"
import { UseMyReview } from "../../contextapi/MyReviewContext";

function BasicAppraiseeDetail() {
    const theme = useMantineTheme();

    const {state} = UseMyReview();
    
  return (
   <>

        <Flex gap='xs' align='center' justify='space-between'>
            <Box>
                <Text c={theme.primaryColor} fw={500}>{state?.data?.user_name} - ({state?.data?.appraisal_cycle_dates})</Text>
                <Text fz='xs' c='dimmed'>{state?.data?.designation_name}</Text>
            </Box>
            <Text component="span" fw={500}>{state?.data?.status}</Text>
            <Group align="center" gap='xs'>
                <Text fz="xs" c='dark.3' tt="uppercase" >Final Rating</Text>
                <Text component="span" fw={500}>{state?.data?.overall_score}</Text>
            </Group>
        </Flex>
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