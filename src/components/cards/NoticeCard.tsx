import { Box, Group, Text, Title, Badge, Collapse} from "@mantine/core"
import { useState } from "react"
import { FaAngleDown } from "react-icons/fa6";
import type { NoticeCardtype } from "../../types/Dashboard";


function NoticeCard(props:NoticeCardtype) {
   const [active , setActive] =  useState<boolean>(false);
  return (
    <>
        <Box py='sm' className={props.isLast ? "" : "border-bottom"}>
            <Group align="center" justify="space-between" gap='sm' onClick={()=>setActive(!active)} className="cursor-pointer">
                <Group align="center" gap='sm'>
                    <FaAngleDown size={14} style={{transform:`${active ? "rotate(180deg)" : "none"}`, transition:'all ease .5s'}}/>
                    <Title order={6}>{props.title}</Title>
                </Group>
                <Badge variant="light" c='black' bg='yellow.1'>{props.date}</Badge>
            </Group>
            <Collapse in={active} p='xs' pb={0}>
            <Text fz='sm'>{props.content}</Text>
            </Collapse>
        </Box>
    </>
  )
}

export default NoticeCard