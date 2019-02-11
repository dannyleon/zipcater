import {LitElement, html} from 'lit-element';
import { minusIcon } from '../../my-icons';

class SingleCartItem extends LitElement {
    static get properties() {
        return {
            item: Object,
            iid: String
        }
    }

    /**
     * Implement to describe the element's DOM using lit-html.
     * Use the element current props to return a lit-html template result
     * to render into the element.
     */
    render() {
        return html`
            <style>
                :host {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid var(--app-border-color);
                    padding: 16px 0;
                    font-weight: 500;
                    font-size: 14px;
                }

                .price {
                    font-family: 'Roboto Mono', monospace;
                }

                .name {
                    margin-left: 24px;
                    flex: 1;
                    text-align: start;
                }

                i {
                    margin-left: 16px;
                    display: flex;
                }

                i:hover svg {
                    fill: var(--app-secondary-color);
                }

                :host([noRemoveIcon]) i {
                    display: none;
                }
            </style>
            
            <div>${this.item.quantity} x</div>
            <div class="name">${this.item.name}</div>
            <div class="price">$${this.item.price}</div>
            <i @click="${_ => this._onRemoveItemClick()}">${minusIcon}</i>
        `;
    }

    _onRemoveItemClick() {
        this.dispatchEvent(new CustomEvent('remove-item'));
    }

}

customElements.define('single-cart-item', SingleCartItem);