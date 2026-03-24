import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import ClientModel from "../modules/client-adm/repository/client.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../modules/invoice/repository/invoice-items.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import ProductAdmModel from "../modules/product-adm/repository/product.model";
import StoreProductModel from "../modules/store-product/repository/product.model";
import app from "./express";

describe("API E2E Tests", () => {
    let sequelize: Sequelize;

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
        });

        // Registrar modelos sem conflito de tabela
        sequelize.addModels([
            ClientModel,
            InvoiceModel,
            InvoiceItemsModel,
            TransactionModel,
        ]);

        await sequelize.sync({ force: true });

        // Criar tabela 'products' manualmente com todas as colunas necessárias
        // para que tanto o módulo product-adm (purchasePrice) quanto
        // o store-product (salesPrice) possam operar sobre a mesma tabela
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS products (
                id         TEXT    NOT NULL PRIMARY KEY,
                name       TEXT    NOT NULL,
                description TEXT   NOT NULL,
                purchasePrice REAL NOT NULL DEFAULT 0,
                salesPrice    REAL NOT NULL DEFAULT 0,
                stock      INTEGER NOT NULL DEFAULT 0,
                createdAt  TEXT    NOT NULL,
                updatedAt  TEXT    NOT NULL
            )
        `);

        // Registrar os modelos de produto após a criação manual da tabela
        // para que queries via Model.findOne() / Model.create() funcionem
        sequelize.addModels([ProductAdmModel, StoreProductModel]);
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
                stock: 10,
            };

            const res = await request(app).post("/products").send(body);

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                name: body.name,
                description: body.description,
                purchasePrice: body.purchasePrice,
                stock: body.stock,
            });
            expect(res.body.id).toBeDefined();
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
    });

    // ─── POST /checkout ──────────────────────────────────────────────────────────

    describe("POST /checkout", () => {
        it("should place an order and return 200 with approved status", async () => {
            // Seed: cliente
            const clientRes = await request(app).post("/clients").send({
                name: "Maria Teste",
                email: "maria@teste.com",
                address: "Avenida Central, 456",
            });
            const clientId = clientRes.body.id;

            // Seed: produto diretamente no banco para garantir salesPrice correto
            // (produto-adm only sets purchasePrice; store-catalog reads salesPrice)
            const productId = "product-e2e-1";
            const now = new Date().toISOString();
            await sequelize.query(`
                INSERT INTO products (id, name, description, purchasePrice, salesPrice, stock, createdAt, updatedAt)
                VALUES ('${productId}', 'Notebook', 'Notebook top', 200, 200, 50, '${now}', '${now}')
            `);

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

        it("should decline order when total is below 100", async () => {
            const clientRes = await request(app).post("/clients").send({
                name: "Pedro Declínio",
                email: "pedro@declinio.com",
                address: "Rua Pequena, 1",
            });
            const clientId = clientRes.body.id;

            const productId = "product-e2e-cheap";
            const now = new Date().toISOString();
            await sequelize.query(`
                INSERT INTO products (id, name, description, purchasePrice, salesPrice, stock, createdAt, updatedAt)
                VALUES ('${productId}', 'Caneta', 'Caneta azul', 10, 10, 100, '${now}', '${now}')
            `);

            const res = await request(app).post("/checkout").send({
                clientId,
                products: [{ productId, quantity: 1 }],
            });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("pending");
            expect(res.body.invoiceId).toBeNull();
        });
    });

    // ─── GET /invoice/:id ────────────────────────────────────────────────────────

    describe("GET /invoice/:id", () => {
        it("should return an invoice for an approved order", async () => {
            // Seed: cliente
            const clientRes = await request(app).post("/clients").send({
                name: "Ana Nota",
                email: "ana@nota.com",
                address: "Rua da Nota, 789",
            });
            const clientId = clientRes.body.id;

            // Seed: produto com salesPrice >= 100
            const productId = "product-invoice-e2e";
            const now = new Date().toISOString();
            await sequelize.query(`
                INSERT INTO products (id, name, description, purchasePrice, salesPrice, stock, createdAt, updatedAt)
                VALUES ('${productId}', 'Mouse', 'Mouse sem fio', 150, 150, 30, '${now}', '${now}')
            `);

            // Realizar checkout para gerar invoice
            const checkoutRes = await request(app).post("/checkout").send({
                clientId,
                products: [{ productId, quantity: 1 }],
            });

            expect(checkoutRes.body.status).toBe("approved");
            const invoiceId = checkoutRes.body.invoiceId;

            // Buscar invoice
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
