import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  slug: z
    .string()
    .min(1, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "فقط حروف کوچک، عدد و خط تیره"),
  summary: z.string().min(1, "خلاصه الزامی است"),
  content: z.string().min(1, "محتوا الزامی است"),
  image: z.string().url("آدرس تصویر معتبر نیست").optional().or(z.literal("")),
  metaTitle: z.string().min(1, "عنوان متا الزامی است"),
  metaDescription: z.string().min(1, "توضیحات متا الزامی است"),
  status: z.enum(["draft", "published"]),
});
