import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'نام محصول الزامی است'),
  description: z.string().min(1, 'توضیحات الزامی است'),
  link: z.string().url('لینک باید معتبر باشد').optional().or(z.literal('')),
  image: z.string().url('آدرس تصویر معتبر نیست').optional().or(z.literal('')),
});