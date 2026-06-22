import { http, HttpResponse } from "msw";
import db from "../db";

export const articleHandlers = [
  http.get("/api/articles", () => HttpResponse.json(db.articles)),

  http.get("/api/articles/:id", ({ params }) => {
    const article = db.articles.find((a) => a.id === Number(params.id));
    return article
      ? HttpResponse.json(article)
      : new HttpResponse(null, { status: 404 });
  }),

  http.post("/api/articles", async ({ request }) => {
    const newArticle = await request.json();
    newArticle.id = Date.now();
    newArticle.createdAt = new Date().toISOString();
    db.articles.push(newArticle);
    return HttpResponse.json(newArticle, { status: 201 });
  }),

  http.put("/api/articles/:id", async ({ request, params }) => {
    const index = db.articles.findIndex((a) => a.id === Number(params.id));
    if (index === -1) return new HttpResponse(null, { status: 404 });
    const updated = await request.json();
    db.articles[index] = { ...db.articles[index], ...updated };
    return HttpResponse.json(db.articles[index]);
  }),

  http.delete("/api/articles/:id", ({ params }) => {
    db.articles = db.articles.filter((a) => a.id !== Number(params.id));
    return new HttpResponse(null, { status: 204 });
  }),
];
