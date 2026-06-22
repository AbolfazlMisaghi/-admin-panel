import { http, HttpResponse } from 'msw';
import db from '../db';

export const statsHandlers = [
  http.get('/api/stats', () => {
    return HttpResponse.json({
      teamCount: db.team.length,
      productCount: db.products.length,
      articleCount: db.articles.length,
    });
  }),
];