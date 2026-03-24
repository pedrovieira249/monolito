import { Router } from "express";
import CheckoutFacadeFactory from "../../modules/checkout/factory/checkout.facade.factory";

const checkoutRoute = Router();

checkoutRoute.post("/", async (req, res) => {
    try {
        const facade = CheckoutFacadeFactory.create();
        const { clientId, products } = req.body;

        const output = await facade.placeOrder({ clientId, products });

        res.status(200).json(output);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default checkoutRoute;
