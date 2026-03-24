import { Router } from "express";
import CheckoutFacadeFactory from "../../modules/checkout/factory/checkout.facade.factory";

const checkoutRoute = Router();

checkoutRoute.post("/", async (req, res) => {
    try {
        const { clientId, products } = req.body;

        if (!clientId || typeof clientId !== "string") {
            return res.status(400).json({ error: "Campo 'clientId' é obrigatório e deve ser uma string." });
        }
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Campo 'products' é obrigatório e deve ser um array com pelo menos um item." });
        }
        for (const item of products) {
            if (!item.productId || typeof item.productId !== "string") {
                return res.status(400).json({ error: "Cada produto deve ter um 'productId' válido." });
            }
            if (item.quantity === undefined || typeof item.quantity !== "number" || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
                return res.status(400).json({ error: "Cada produto deve ter um 'quantity' inteiro maior que zero." });
            }
        }

        const facade = CheckoutFacadeFactory.create();
        const output = await facade.placeOrder({ clientId, products });

        res.status(200).json(output);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default checkoutRoute;
