import { z } from "zod";

export const settingsSchema = z.object({
  siteName: z.string().min(1, "نام سایت الزامی است"),
  logo: z.string().url("آدرس لوگو معتبر نیست").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  socials: z.object({
    telegram: z
      .string()
      .url("لینک تلگرام معتبر نیست")
      .optional()
      .or(z.literal("")),
    instagram: z
      .string()
      .url("لینک اینستاگرام معتبر نیست")
      .optional()
      .or(z.literal("")),
  }),
});
