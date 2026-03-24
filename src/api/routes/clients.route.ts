import { Router } from "express";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm-facade.factory";

const clientsRoute = Router();

clientsRoute.post("/", async (req, res) => {
    try {
        const facade = ClientAdmFacadeFactory.create();
        const { id, name, email, address } = req.body;

        const client = await facade.create({ id, name, email, address });

        res.status(201).json(client);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default clientsRoute;
