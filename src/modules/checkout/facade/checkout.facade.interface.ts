import { PlaceOrderInputDTO, PlaceOrderOutputDTO } from "../usecase/place-order/place-order.dto";

export default interface CheckoutFacadeInterface {
    placeOrder(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO>;
}
