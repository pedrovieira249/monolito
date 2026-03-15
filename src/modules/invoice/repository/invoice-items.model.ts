import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemsModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false, field: "invoice_id" })
  declare invoiceId: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;
}
