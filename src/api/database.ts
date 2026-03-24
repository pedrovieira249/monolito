import { Sequelize } from "sequelize-typescript";
import ClientModel from "../modules/client-adm/repository/client.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import InvoiceItemsModel from "../modules/invoice/repository/invoice-items.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import ProductAdmModel from "../modules/product-adm/repository/product.model";
import StoreProductModel from "../modules/store-product/repository/product.model";

// Instância única compartilhada pela aplicação
let sequelize: Sequelize;

export async function setupDatabase(storage = "./monolito.sqlite"): Promise<Sequelize> {
    if (sequelize) {
        return sequelize;
    }

    sequelize = new Sequelize({
        dialect: "sqlite",
        storage,
        logging: false,
    });

    // Registra os modelos que têm tabelas exclusivas
    sequelize.addModels([
        ClientModel,
        InvoiceModel,
        InvoiceItemsModel,
        TransactionModel,
    ]);

    // Sincroniza as tabelas exclusivas
    await sequelize.sync();

    // A tabela 'products' é compartilhada pelos módulos product-adm (purchasePrice)
    // e store-product (salesPrice). Criamos manualmente com todas as colunas
    // necessárias para que ambos os módulos funcionem corretamente.
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

    // Registra os modelos de produto APÓS a criação manual da tabela
    sequelize.addModels([ProductAdmModel, StoreProductModel]);

    return sequelize;
}
