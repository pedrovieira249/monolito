import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

// Para rodar esse teste, é necessário rodar o comando "npm test -- --testPathPattern=payment.facade.spec.ts" no terminal
describe("PaymentFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should process a payment", async () => {
    const facade = PaymentFacadeFactory.create();

    const input = {
      orderId: "1",
      amount: 100,
    };

    const result = await facade.process(input);

    expect(result.transactionId).toBeDefined();
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

});