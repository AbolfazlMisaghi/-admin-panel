const db = {
  users: [
    { id: 1, email: 'admin@example.com', password: 'admin123', name: 'Admin' },
  ],

  team: [
    { id: 1, name: 'علی احمدی', role: 'مدیرعامل', image: '', email: 'ali@example.com' },
    { id: 2, name: 'سارا محمدی', role: 'مدیر فنی', image: '', email: 'sara@example.com' },
    { id: 3, name: 'رضا کریمی', role: 'طراح محصول', image: '', email: 'reza@example.com' },
    { id: 4, name: 'مریم حسینی', role: 'بازاریابی', image: '', email: 'maryam@example.com' },
  ],

  products: [
    {
      id: 1,
      name: 'آموزش React',
      description: 'دوره جامع React از مبتدی تا پیشرفته',
      link: 'https://example.com/react',
      image: '',
    },
    {
      id: 2,
      name: 'آموزش Node.js',
      description: 'ساخت بک‌اند با Node و Express',
      link: 'https://example.com/node',
      image: '',
    },
    {
      id: 3,
      name: 'آموزش طراحی UI',
      description: 'اصول طراحی رابط کاربری مدرن',
      link: 'https://example.com/ui',
      image: '',
    },
  ],

  articles: [
    {
      id: 1,
      title: 'شروع کار با React',
      slug: 'getting-started-react',
      summary: 'در این مقاله با مفاهیم اولیه React آشنا می‌شوید',
      content: 'محتوای کامل مقاله...',
      image: '',
      metaTitle: 'شروع کار با React | سایت من',
      metaDescription: 'آموزش گام‌به‌گام React برای مبتدیان',
      status: 'published',
      createdAt: new Date('2026-01-15').toISOString(),
    },
    {
      id: 2,
      title: 'مقایسه Vue و React',
      slug: 'vue-vs-react',
      summary: 'کدام فریم‌ورک برای پروژه شما مناسب‌تر است؟',
      content: 'محتوای مقایسه...',
      image: '',
      metaTitle: 'مقایسه Vue و React | سایت من',
      metaDescription: 'بررسی تفاوت‌های Vue و React',
      status: 'published',
      createdAt: new Date('2026-02-10').toISOString(),
    },
    {
      id: 3,
      title: 'راهنمای Zustand',
      slug: 'zustand-guide',
      summary: 'مدیریت state ساده با Zustand',
      content: 'محتوای آموزش Zustand...',
      image: '',
      metaTitle: 'راهنمای Zustand | سایت من',
      metaDescription: 'یادگیری کامل Zustand در ۱۰ دقیقه',
      status: 'draft',
      createdAt: new Date('2026-03-05').toISOString(),
    },
    {
      id: 4,
      title: 'نکات سئو در React',
      slug: 'seo-tips-react',
      summary: 'چگونه سایت React خود را سئو-فرندلی کنیم',
      content: 'محتوای سئو...',
      image: '',
      metaTitle: 'نکات سئو در React | سایت من',
      metaDescription: 'بهبود سئو در برنامه‌های تک صفحه‌ای',
      status: 'published',
      createdAt: new Date('2026-04-01').toISOString(),
    },
  ],

  settings: {
    siteName: 'تیم آموزشی من',
    logo: '',
    description: 'ما بهترین دوره‌های آموزشی را ارائه می‌دهیم',
    socials: { telegram: '', instagram: '' },
  },
};

export default db;