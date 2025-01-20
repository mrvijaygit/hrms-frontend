import { Grid, Paper, ScrollArea, Title, useMantineTheme } from "@mantine/core"
import NoticeCard from "../../components/cards/NoticeCard"
import { UseDashboard } from "../../contextapi/DashboardContext"

function Notice() {
   const {state} =  UseDashboard();
   const theme = useMantineTheme();
  return (
    <>
        <Grid.Col span={{base:12, lg:8}}>
            <Paper p='sm' shadow='xs'>
                <Title order={5} mb='sm' c={theme.primaryColor}>Announments</Title>
                <ScrollArea h={240}>
                    {
                        state?.notice != null && <>
                            {
                                state?.notice.map((item, index)=>{
                                    return <NoticeCard key={index} isLast = {(index + 1) == (state?.notice?.length || 0 )} title={item.notice_title} date={item.issue_date_display || ""} content={item.notice_content} />
                                })
                            }
                        </>
                    }
                    
                </ScrollArea>
            </Paper>
        </Grid.Col>
    </>
  )
}

export default Notice