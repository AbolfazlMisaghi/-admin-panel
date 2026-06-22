import { http, HttpResponse } from "msw";
import db from "../db";

export const settingsHandlers = [
  http.get("/api/settings", () => {
    return HttpResponse.json(db.settings);
  }),

  http.put("/api/settings", async ({ request }) => {
    const updated = await request.json();
    db.settings = { ...db.settings, ...updated };
    return HttpResponse.json(db.settings);
  }),
];
