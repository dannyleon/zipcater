import {LitElement, html} from '@polymer/lit-element';

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
            </style>
            
            <div>${this.item.quantity}</div>
            <div class="name">${this.item.name}</div>
            <div class="price">$${(this.item.options[this.item.defaultOption]).toFixed(2)}</div>
        `;
    }

}

customElements.define('single-cart-item', SingleCartItem);