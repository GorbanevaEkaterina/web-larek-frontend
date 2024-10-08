import {Component} from "../base/Component";
import {priceString} from "../../utils/utils";
import {ensureElement} from "../../utils/utils";

interface ISuccess {
    total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
    protected _pricePurchasesTotal: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);
		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._pricePurchasesTotal = ensureElement<HTMLElement>(".order-success__description", this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
	}

	set total(value: number) {
		this._pricePurchasesTotal.textContent = 'Списано ' + priceString(value);
	}
}