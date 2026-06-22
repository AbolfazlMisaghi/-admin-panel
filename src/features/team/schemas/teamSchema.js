import { z } from "zod";

export const teamSchema = z.object({
  name: z
    .string()
    .min(1, "نام الزامی است")
    .min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  role: z.string().min(1, "سمت الزامی است"),
  email: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")), // اختیاری، می‌تواند خالی باشد
  image: z.string().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
});
