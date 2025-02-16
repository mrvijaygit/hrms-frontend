import { Box, Grid, Textarea } from "@mantine/core"
import { useForm } from "@mantine/form";

export default function Summary() {
    const form = useForm({
    initialValues:{
        summary_id:-1,
        q1:"",
        q2:"",
        q3:"",
        q4:"",
        q5:""
    },
    });
  return (
    <>
        <Box component="form">
            <Grid>
                <Grid.Col span={{lg:6}}><Textarea label="What was your biggest achievemnet of this year?" {...form.getInputProps("q1")}  rows={3} /></Grid.Col>
                <Grid.Col span={{lg:6}}><Textarea label="What do you enjoy most about your job?" {...form.getInputProps("q2")} rows={3} /></Grid.Col>
                <Grid.Col span={{lg:6}}><Textarea label="What do you think are your particular strengths and skills?" {...form.getInputProps("q3")} rows={3} /></Grid.Col>
                <Grid.Col span={{lg:6}}><Textarea label="How would you like to see your career develop?" {...form.getInputProps("q4")} rows={3} /></Grid.Col>
                <Grid.Col span={{lg:6}}><Textarea label="What areas of your expertise need futher development?" {...form.getInputProps("q5")}  rows={3} /></Grid.Col>
            </Grid>
        </Box>
    </>
  )
}
