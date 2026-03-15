import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id: Id;
    name: string;
    description: string;
    salesPrice: number;
    stock: number;
}

export default class Product extends BaseEntity implements AggregateRoot {
    private readonly _name: string;
    private readonly _description: string;
    private readonly _salesPrice: number;
    private readonly _stock: number;

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._description = props.description;
        this._salesPrice = props.salesPrice;
        this._stock = props.stock;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get salesPrice(): number {
        return this._salesPrice; 
    }

    get stock(): number {
        return this._stock;
    }
}