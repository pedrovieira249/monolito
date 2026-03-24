import { Router } from "express";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";

const invoiceRoute = Router();

invoiceRoute.get("/:id", async (req, res) => {
    try {
        const facade = InvoiceFacadeFactory.create();
        const { id } = req.params;

        const invoice = await facade.find({ id });

        res.status(200).json(invoice);
    } catch (err: any) {
        res.status(404).json({ error: err.message });
    }
});

export default invoiceRoute;
