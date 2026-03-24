import { Router } from "express";
import { v4 as uuid } from "uuid";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/product-adm.facade.factory";

const productsRoute = Router();

productsRoute.post("/", async (req, res) => {
    try {
        const facade = ProductAdmFacadeFactory.create();
        const id = uuid();
        const { name, description, purchasePrice, stock } = req.body;

        await facade.create({ id, name, description, purchasePrice, stock });

        res.status(201).json({ id, name, description, purchasePrice, stock });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default productsRoute;
