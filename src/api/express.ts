import express from "express";
import clientsRoute from "./routes/clients.route";
import checkoutRoute from "./routes/checkout.route";
import invoiceRoute from "./routes/invoice.route";
import productsRoute from "./routes/products.route";

const app = express();

app.use(express.json());

app.use("/products", productsRoute);
app.use("/clients", clientsRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export default app;
