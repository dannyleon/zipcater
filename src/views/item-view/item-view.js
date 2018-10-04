import {html} from '@polymer/lit-element';
import {PageViewElement} from '../page-view-element';
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import {SharedStyles} from '../../styles/shared-styles';
import '@material/mwc-button';

class ItemView extends FirestoreMixin(PageViewElement) {
    static get properties() {
        return {
            uid: String,
            iid: String,
            quantity: Number,
            item: {
                type: Object,
                doc: 'restaurants/{uid}/menu/{iid}',
                live: true
            },
            argsArray: Array
        }
    }

    /**
     * Implement to describe the element's DOM using lit-html.
     * Use the element current props to return a lit-html template result
     * to render into the element.
     */
    render() {
        return html`
            ${SharedStyles}
            <style>
                .container {
                    display: flex;
                }

                img {
                    width: 400px;
                    height: 265px;
                    object-fit: cover;
                    border-radius: 5px;
                    background-color: var(--app-dark-primary-color);
                }

                .name {
                    font-size: 40px;
                    font-family: 'Roboto Mono', monospace;
                    line-height: 1;
                }

                .info-container {
                    margin-left: 16px;
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 6px;
                }

                .subtitle {
                    font-weight: 700;
                    font-style: italic;
                    font-size: 14px;
                }

                .description {
                    margin-top: 24px;
                    font-size: 18px;
                }

                .button-container {
                    margin-top: auto;
                    align-self: flex-start;
                }

                .price {
                    font-family: 'Roboto Mono', monospace;
                    font-size: 28px;
                }

                mwc-button {
                    --mdc-theme-primary: var(--app-button-background-color);
                    --mdc-theme-on-primary: black;
                }

                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                    }

                    .info-container {
                        margin: 0;
                    }

                    .image-container {
                        width: 100%;
                    }

                    img {
                        width: 100%;
                        height: 300px;
                    }
                }

                @media (max-width: 460px) {
                    img {
                        height: 200px;
                    }

                    .name {
                        font-size: 32px;
                    }

                    .subtitle {
                        font-size: 12px;
                    }

                    .description {
                        font-size: 14px;
                    }

                    .price {
                        font-family: 'Roboto Mono', monospace;
                        font-size: 22px;
                    }
                }
            </style>

            <div class="container">
                <div class="image-container">
                    <img src="${this._computeImageSrc(this.item)}">
                </div>
    
                <div class="info-container">
                    <div class="name">${this.item ? this.item.name : ""}</div>
                    <div class="subtitle">${this._computeIngredients(this.item)}</div>
                    <div class="description">${this.item ? this.item.description : ""}</div>

                    <div class="button-container">
                        <div class="price">${this._computePrice(this.item)}</div>
                        <mwc-button @click="${_ => this._onAddToCartClick(this.item, this.quantity)}" raised>add to cart</mwc-button>
                    </div>
                </div>
            </div>
            
        `;
    }

    /**
      * Instance of the element is created/upgraded. Useful for initializing
      * state, set up event listeners, create shadow dom.
      * @constructor
      */
    constructor() {
        super();
        this.quantity = 1;
    }

    updated(changedProperties) {
        console.log('changed properties:', changedProperties)
        const uidUpdated = changedProperties.has('uid');
        const iidUpdated = changedProperties.has('iid');
        
        if ((uidUpdated || iidUpdated) && this.argsArray) {
            console.log('args array:', this.argsArray);
            this.argsArray.forEach(argsObject => {
                var argsArr = argsObject.args
                this._firestoreUpdateBinding(argsObject.name, ...argsArr.map(x => this[x]))
            });
        }
    }

    _computeImageSrc(obj) {
        console.log('computing img src:', obj)
        return ((obj && obj.image) ? obj.image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }

    _computeIngredients(item) {
        if (item && item.ingredients) return item.ingredients.join(', ')
    }

    _computePrice(item) {
        if (item && item.options && item.defaultOption) {
            let rawPrice = item.options[item.defaultOption];
            return `$${rawPrice.toFixed(2)}`;    
        }
    }

    _onAddToCartClick(item, qty) {
        this.dispatchEvent(new CustomEvent('add-to-cart', {detail: {item: item, qty: qty}}));
    }

}

customElements.define('item-view', ItemView);