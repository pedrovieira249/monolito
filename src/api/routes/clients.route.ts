import { Router } from "express";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm-facade.factory";

const clientsRoute = Router();

clientsRoute.post("/", async (req, res) => {
    try {
        const { id, name, email, address } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Campo 'name' é obrigatório e deve ser uma string." });
        }
        if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Campo 'email' é obrigatório e deve ser um e-mail válido." });
        }
        if (!address || typeof address !== "string") {
            return res.status(400).json({ error: "Campo 'address' é obrigatório e deve ser uma string." });
        }

        const facade = ClientAdmFacadeFactory.create();
        const client = await facade.create({ id, name, email, address });

        res.status(201).json(client);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default clientsRoute;
