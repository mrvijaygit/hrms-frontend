import z from "zod";

export const NormalStringValidation = z.string().trim().min(4, "Min 4 letter is required");
const dateRangeSchema = z.tuple([z.date(), z.date()]);
const numberValidation = z.number({message:"Required"});

export const TaskSchema = z.object({
    task_id:z.number(),
    task_name:NormalStringValidation.max(255),
    task_description:NormalStringValidation,
    task_date:dateRangeSchema,
    task_status_id:numberValidation,
    projected_hours:numberValidation,
});
