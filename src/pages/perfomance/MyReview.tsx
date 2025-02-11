import { Paper, Tabs } from "@mantine/core"
import {AiOutlineUser} from 'react-icons/ai'
import { IoSchoolOutline } from "react-icons/io5";
import { GoalContext } from "../../contextapi/GenericContext";
import Goal from "./Goal";

export default function MyReview() {
  
  return (
    <>
        <Paper p='sm'>
            <Tabs defaultValue='goal'>
                <Tabs.List grow>
                  <Tabs.Tab value="goal" leftSection={<AiOutlineUser/>}>Goal</Tabs.Tab>
                  <Tabs.Tab value="self_appraisal" leftSection={<IoSchoolOutline/>}>Self Appraisal</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="goal" pt='sm'>
                  <GoalContext><Goal/></GoalContext>
                </Tabs.Panel>
                <Tabs.Panel value="self_appraisal" pt='sm'>
                 <></>
                </Tabs.Panel>
            </Tabs>
        </Paper>
    </>
  )
}
