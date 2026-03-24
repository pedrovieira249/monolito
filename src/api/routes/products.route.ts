import { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/product-adm.facade.factory";

const productsRoute = Router();

productsRoute.post("/", async (req, res) => {
    try {
        const { name, description, purchasePrice, salesPrice, stock } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Campo 'name' é obrigatório e deve ser uma string." });
        }
        if (!description || typeof description !== "string") {
            return res.status(400).json({ error: "Campo 'description' é obrigatório e deve ser uma string." });
        }
        if (purchasePrice === undefined || typeof purchasePrice !== "number" || purchasePrice <= 0) {
            return res.status(400).json({ error: "Campo 'purchasePrice' é obrigatório e deve ser um número maior que zero." });
        }
        if (salesPrice === undefined || typeof salesPrice !== "number" || salesPrice <= 0) {
            return res.status(400).json({ error: "Campo 'salesPrice' é obrigatório e deve ser um número maior que zero." });
        }
        if (stock === undefined || typeof stock !== "number" || stock < 0 || !Number.isInteger(stock)) {
            return res.status(400).json({ error: "Campo 'stock' é obrigatório e deve ser um número inteiro maior ou igual a zero." });
        }

        const facade = ProductAdmFacadeFactory.create();
        const id = uuid();

        await facade.create({ id, name, description, purchasePrice, stock });

        // Persiste salesPrice na coluna da tabela compartilhada.
        // O módulo product-adm gerencia apenas purchasePrice; a borda de API
        // é responsável por registrar o preço de venda (salesPrice) usado pelo
        // módulo store-product (catálogo).
        const sequelize: Sequelize = req.app.get("sequelize");
        if (sequelize) {
            await sequelize.query(
                "UPDATE products SET salesPrice = :salesPrice WHERE id = :id",
                { replacements: { salesPrice, id } }
            );
        }

        res.status(201).json({ id, name, description, purchasePrice, salesPrice, stock });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default productsRoute;
