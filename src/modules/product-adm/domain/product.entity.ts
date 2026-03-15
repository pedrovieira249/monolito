import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import Id from "../../@shared/domain/value-object/id.value-object";

type ProductProps = {
    id?: Id;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}

export default class Product extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _description: string;
    private _purchasePrice: number;
    private _stock: number;

    constructor(props: ProductProps) {
        super(props.id);
        this._name = props.name;
        this._description = props.description;
        this._purchasePrice = props.purchasePrice;
        this._stock = props.stock;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get purchasePrice(): number {
        return this._purchasePrice;
    }
    
    get stock(): number {
        return this._stock;
    }

    set name(value: string) {
        this._name = value;
    }

    set description(value: string) {
        this._description = value;
    }

    set purchasePrice(value: number) {
        this._purchasePrice = value;
    }

    set stock(value: number) {
        this._stock = value;
    }
}