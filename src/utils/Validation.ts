import z from "zod";

export const NormalStringValidation = z.string().trim().min(4, "Min 4 letter is required");
const numberValidation = z.number({message:"Required"});

export const TaskSchema = z.object({
    task_id:z.number(),
    task_name:NormalStringValidation.max(255),
    task_description:NormalStringValidation,
    start_date:z.date(),
    end_date:z.date(),
    task_status_id:numberValidation,
    projected_hours:numberValidation.min(1),
}).refine((data) => data.start_date <= data.end_date, {
    message: "Start date must be before or equal to end date",
    path: ['start_date'],
});

export const TimeSheetSchema = z.object({
    timesheet_id:z.number(),
    task_id:z.number(),
    project_member_id:z.number(),
    start_date_time:z.date(),
    end_date_time:z.date(),
    comments:NormalStringValidation
}).refine((data) => data.start_date_time <= data.end_date_time, {
    message: "Start date time must be before or equal to end date time",
    path: ['start_date'],
});

export const MyReviewSchema = z.object({
    responses: z.array(
      z.object({
        user_rating: z
          .number()
          .min(1, 'Rating must be at least 1')
          .max(5, 'Rating cannot exceed 5'),
        user_comment: z.string().min(1, 'Comment is required'),
      })
    ),
  });