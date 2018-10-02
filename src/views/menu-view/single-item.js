import {LitElement, html} from '@polymer/lit-element';

class SingleItem extends LitElement {
    static get properties() {
        return {
            name: String,
            description: String,
            ingredients: Array,
            defaultOption: String,
            options: Object
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
                    border-radius: 5px;
                    padding: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .description {
                    font-size: 12px;
                }

                .price {
                    font-family: 'Roboto Mono', monospace;
                }
            </style>
            
            <div>
                <div class="name">${this.name}</div>
                <div class="description">${this._computeIngredients(this.ingredients)}</div>
            </div>
            <div class="price">${this._computePrice(this.defaultOption, this.options)}</div>
        `;
    }

    _computeIngredients(ingredients) {
        if (ingredients) return ingredients.join(', ')
    }

    _computePrice(defaultOption, options) {
        let rawPrice = options[defaultOption];
        return `$${rawPrice.toFixed(2)}`;
    }

}

customElements.define('single-item', SingleItem);