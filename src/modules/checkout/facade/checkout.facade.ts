import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface from "./checkout.facade.interface";
import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from "../usecase/place-order/place-order.dto";

export default class CheckoutFacade implements CheckoutFacadeInterface {
    private readonly _placeOrderUseCase: UseCaseInterface;

    constructor(placeOrderUseCase: UseCaseInterface) {
        this._placeOrderUseCase = placeOrderUseCase;
    }

    async placeOrder(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
        return await this._placeOrderUseCase.execute(input);
    }
}
