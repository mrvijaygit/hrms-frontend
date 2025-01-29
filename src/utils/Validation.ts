import z from "zod";

const NormalStringValidation = z.string().trim().min(4, "Min 4 letter is required");
const DateValidation = z.date();
const numberValidation = z.number();

export const TaskSchema = z.object({
    task_id:z.number(),
    task_name:NormalStringValidation.max(255),
    task_description:NormalStringValidation,
    start_date:DateValidation,
    end_date:DateValidation,
    task_status_id:numberValidation,
    projected_days:numberValidation,
    projected_hours:numberValidation,
    projected_minutes:numberValidation,
}).refine((data)=>{
    // Check if at least one field has a value
    return data.projected_days > 0 || data.projected_hours > 0 || data.projected_minutes > 0;
  }, {
    message: "At least one field must have a value greater than 0",
    path: ["projected_days", "projected_hours", "projected_minutes"], // Pointing to all fields for the error
});
