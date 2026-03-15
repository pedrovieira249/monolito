import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDTO, PaymentFacadeOutputDTO } from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {
    constructor(private readonly processPaymentUseCase: UseCaseInterface) {}

    async process(input: PaymentFacadeInputDTO): Promise<PaymentFacadeOutputDTO> {
        return await this.processPaymentUseCase.execute(input);
    }
}