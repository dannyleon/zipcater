import {LitElement, html} from '@polymer/lit-element';
import '@material/mwc-icon'
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
                    font-weight: 700;
                }

                .price {
                    font-family: 'Roboto Mono', monospace;
                }

                .name {
                    margin-left: 24px;
                    flex: 1;
                    text-align: start;
                }

                mwc-icon {
                    margin-left: 16px;
                }

                mwc-icon:hover svg {
                    fill: var(--app-secondary-color);
                }

                :host([noRemoveIcon]) mwc-icon {
                    display: none;
                }
            </style>
            
            <div>${this.item.quantity} x</div>
            <div class="name">${this.item.name}</div>
            <div class="price">$${(this.item.options[this.item.defaultOption]).toFixed(2)}</div>
            <mwc-icon @click="${_ => this._onRemoveItemClick()}">${minusIcon}</mwc-icon>
        `;
    }

    _onRemoveItemClick() {
        this.dispatchEvent(new CustomEvent('remove-item'));
    }

}

customElements.define('single-cart-item', SingleCartItem);