import { http, HttpResponse } from "msw";
import db from "../db";

export const productHandlers = [
  // دریافت همه محصولات
  http.get("/api/products", () => {
    return HttpResponse.json(db.products);
  }),

  // دریافت یک محصول
  http.get("/api/products/:id", ({ params }) => {
    const product = db.products.find((p) => p.id === Number(params.id));
    return product
      ? HttpResponse.json(product)
      : new HttpResponse(null, { status: 404 });
  }),

  // ایجاد محصول جدید
  http.post("/api/products", async ({ request }) => {
    const newProduct = await request.json();
    newProduct.id = Date.now();
    db.products.push(newProduct);
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // ویرایش محصول
  http.put("/api/products/:id", async ({ request, params }) => {
    const index = db.products.findIndex((p) => p.id === Number(params.id));
    if (index === -1) return new HttpResponse(null, { status: 404 });
    const updated = await request.json();
    db.products[index] = { ...db.products[index], ...updated };
    return HttpResponse.json(db.products[index]);
  }),

  // حذف محصول
  http.delete("/api/products/:id", ({ params }) => {
    db.products = db.products.filter((p) => p.id !== Number(params.id));
    return new HttpResponse(null, { status: 204 });
  }),
];
