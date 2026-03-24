import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import ClientModel from "../modules/client-adm/repository/client.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../modules/invoice/repository/invoice-items.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import ProductAdmModel from "../modules/product-adm/repository/product.model";
import StoreProductModel from "../modules/store-product/repository/product.model";
import app, { setSequelize } from "./express";

describe("API E2E Tests", () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
        });

        sequelize.addModels([
            ClientModel,
            InvoiceModel,
            InvoiceItemsModel,
            TransactionModel,
        ]);

        await sequelize.sync({ force: true });

        // Tabela 'products' é compartilhada por product-adm (purchasePrice)
        // e store-product (salesPrice). Criamos manualmente com todas as colunas.
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS products (
                id            TEXT    NOT NULL PRIMARY KEY,
                name          TEXT    NOT NULL,
                description   TEXT    NOT NULL,
                purchasePrice REAL    NOT NULL DEFAULT 0,
                salesPrice    REAL    NOT NULL DEFAULT 0,
                stock         INTEGER NOT NULL DEFAULT 0,
                createdAt     TEXT    NOT NULL,
                updatedAt     TEXT    NOT NULL
            )
        `);

        sequelize.addModels([ProductAdmModel, StoreProductModel]);

        // Disponibiliza o sequelize para as rotas atualizarem salesPrice
        setSequelize(sequelize);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        await sequelize.query("DELETE FROM invoice_items");
        await sequelize.query("DELETE FROM invoices");
        await sequelize.query("DELETE FROM transactions");
        await sequelize.query("DELETE FROM products");
        await sequelize.query("DELETE FROM clients");
    });

    // ─── POST /products ─────────────────────────────────────────────────────────

    describe("POST /products", () => {
        it("should create a product and return 201", async () => {
            const body = {
                name: "Produto Teste",
                description: "Descrição do produto",
                purchasePrice: 50,
                salesPrice: 80,
                stock: 10,
            };

            const res = await request(app).post("/products").send(body);

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                name: body.name,
                description: body.description,
                purchasePrice: body.purchasePrice,
                salesPrice: body.salesPrice,
                stock: body.stock,
            });
            expect(res.body.id).toBeDefined();
        });

        it("should return 400 when name is missing", async () => {
            const res = await request(app).post("/products").send({
                description: "Desc",
                purchasePrice: 50,
                salesPrice: 80,
                stock: 5,
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/name/i);
        });

        it("should return 400 when purchasePrice is negative", async () => {
            const res = await request(app).post("/products").send({
                name: "Prod",
                description: "Desc",
                purchasePrice: -1,
                salesPrice: 80,
                stock: 5,
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/purchasePrice/i);
        });

        it("should return 400 when salesPrice is missing", async () => {
            const res = await request(app).post("/products").send({
                name: "Prod",
                description: "Desc",
                purchasePrice: 50,
                stock: 5,
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/salesPrice/i);
        });

        it("should return 400 when stock is a decimal number", async () => {
            const res = await request(app).post("/products").send({
                name: "Prod",
                description: "Desc",
                purchasePrice: 50,
                salesPrice: 80,
                stock: 1.5,
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/stock/i);
        });
    });

    // ─── POST /clients ───────────────────────────────────────────────────────────

    describe("POST /clients", () => {
        it("should create a client and return 201", async () => {
            const body = {
                name: "João Silva",
                email: "joao@exemplo.com",
                address: "Rua das Flores, 123",
            };

            const res = await request(app).post("/clients").send(body);

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                name: body.name,
                email: body.email,
                address: body.address,
            });
            expect(res.body.id).toBeDefined();
        });

        it("should return 400 when email is missing", async () => {
            const res = await request(app).post("/clients").send({
                name: "Joao",
                address: "Rua A",
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/email/i);
        });

        it("should return 400 when email is invalid", async () => {
            const res = await request(app).post("/clients").send({
                name: "Joao",
                email: "nao-eh-email",
                address: "Rua A",
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/email/i);
        });

        it("should return 400 when address is missing", async () => {
            const res = await request(app).post("/clients").send({
                name: "Joao",
                email: "joao@mail.com",
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/address/i);
        });
    });

    // ─── POST /checkout ──────────────────────────────────────────────────────────

    describe("POST /checkout", () => {
        it("should place an order and return 200 with approved status", async () => {
            const clientRes = await request(app).post("/clients").send({
                name: "Maria Teste",
                email: "maria@teste.com",
                address: "Avenida Central, 456",
            });
            const clientId = clientRes.body.id;

            const productRes = await request(app).post("/products").send({
                name: "Notebook",
                description: "Notebook top",
                purchasePrice: 200,
                salesPrice: 200,
                stock: 50,
            });
            const productId = productRes.body.id;

            const body = {
                clientId,
                products: [{ productId, quantity: 1 }],
            };

            const res = await request(app).post("/checkout").send(body);

            expect(res.status).toBe(200);
            expect(res.body.clientId).toBe(clientId);
            expect(res.body.status).toBe("approved");
            expect(res.body.invoiceId).toBeDefined();
            expect(res.body.total).toBe(200);
            expect(res.body.products).toEqual(body.products);
        });

        it("should return 200 with pending status when total is below 100", async () => {
            const clientRes = await request(app).post("/clients").send({
                name: "Pedro Declínio",
                email: "pedro@declinio.com",
                address: "Rua Pequena, 1",
            });
            const clientId = clientRes.body.id;

            const productRes = await request(app).post("/products").send({
                name: "Caneta",
                description: "Caneta azul",
                purchasePrice: 5,
                salesPrice: 10,
                stock: 100,
            });
            const productId = productRes.body.id;

            const res = await request(app).post("/checkout").send({
                clientId,
                products: [{ productId, quantity: 1 }],
            });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("pending");
            expect(res.body.invoiceId).toBeNull();
        });

        it("should return 400 when clientId is missing", async () => {
            const res = await request(app).post("/checkout").send({
                products: [{ productId: "abc", quantity: 1 }],
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/clientId/i);
        });

        it("should return 400 when products array is empty", async () => {
            const res = await request(app).post("/checkout").send({
                clientId: "any-id",
                products: [],
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/products/i);
        });

        it("should return 400 when product quantity is zero", async () => {
            const res = await request(app).post("/checkout").send({
                clientId: "any-id",
                products: [{ productId: "abc", quantity: 0 }],
            });
            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/quantity/i);
        });

        it("should return 500 when client does not exist", async () => {
            const res = await request(app).post("/checkout").send({
                clientId: "id-inexistente",
                products: [{ productId: "abc", quantity: 1 }],
            });
            expect(res.status).toBe(500);
            expect(res.body.error).toMatch(/client not found/i);
        });
    });

    // ─── GET /invoice/:id ────────────────────────────────────────────────────────

    describe("GET /invoice/:id", () => {
        it("should return an invoice for an approved order", async () => {
            const clientRes = await request(app).post("/clients").send({
                name: "Ana Nota",
                email: "ana@nota.com",
                address: "Rua da Nota, 789",
            });
            const clientId = clientRes.body.id;

            const productRes = await request(app).post("/products").send({
                name: "Mouse",
                description: "Mouse sem fio",
                purchasePrice: 100,
                salesPrice: 150,
                stock: 30,
            });
            const productId = productRes.body.id;

            const checkoutRes = await request(app).post("/checkout").send({
                clientId,
                products: [{ productId, quantity: 1 }],
            });

            expect(checkoutRes.body.status).toBe("approved");
            const invoiceId = checkoutRes.body.invoiceId;

            const invoiceRes = await request(app).get(`/invoice/${invoiceId}`);

            expect(invoiceRes.status).toBe(200);
            expect(invoiceRes.body.id).toBe(invoiceId);
            expect(invoiceRes.body.name).toBe("Ana Nota");
            expect(invoiceRes.body.items).toHaveLength(1);
            expect(invoiceRes.body.items[0].name).toBe("Mouse");
            expect(invoiceRes.body.total).toBe(150);
        });

        it("should return 404 for a non-existent invoice", async () => {
            const res = await request(app).get("/invoice/id-inexistente");
            expect(res.status).toBe(404);
        });
    });
});

