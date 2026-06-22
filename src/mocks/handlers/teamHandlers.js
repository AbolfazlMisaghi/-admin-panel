import { http, HttpResponse } from 'msw';
import db from '../db';

export const teamHandlers = [
  http.get('/api/team', () => {
    return HttpResponse.json(db.team);
  }),
  http.get('/api/team/:id', ({ params }) => {
    const member = db.team.find(m => m.id === Number(params.id));
    return member ? HttpResponse.json(member) : new HttpResponse(null, { status: 404 });
  }),
  http.post('/api/team', async ({ request }) => {
    const newMember = await request.json();
    newMember.id = Date.now();
    db.team.push(newMember);
    return HttpResponse.json(newMember, { status: 201 });
  }),
  http.put('/api/team/:id', async ({ request, params }) => {
    const index = db.team.findIndex(m => m.id === Number(params.id));
    if (index === -1) return new HttpResponse(null, { status: 404 });
    const updated = await request.json();
    db.team[index] = { ...db.team[index], ...updated };
    return HttpResponse.json(db.team[index]);
  }),
  http.delete('/api/team/:id', ({ params }) => {
    db.team = db.team.filter(m => m.id !== Number(params.id));
    return new HttpResponse(null, { status: 204 });
  }),
];