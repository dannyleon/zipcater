import {html} from '@polymer/lit-element';
import {PageViewElement} from '../page-view-element';
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import {SharedStyles} from '../../styles/shared-styles';
import '@material/mwc-button';
import '../../components/mwc-textfield/mwc-textfield';
import '@material/mwc-icon';
import '@material/mwc-button';
import { arrowBackIcon } from '../../my-icons';
import '../../components/cart-drawer/single-cart-item.js'
import { repeat } from 'lit-html/directives/repeat';

class CheckoutView extends FirestoreMixin(PageViewElement) {
    static get properties() {
        return {
            uid: String,
            cart: {
                type: Object,
                doc: 'carts/{uid}',
                live: true
            },
            subtotal: Number,
            tax: Number,
            deliveryFee: Number,
            total: Number,
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
            .main-title {
                font-family: 'Roboto Mono', monospace;
                font-size: 32px;
                display: flex;
                align-items: center;
            }

            .arrow-back {
                margin-right: 8px;
            }

            .arrow-back svg {
                height: 32px;
                width: 32px;
            }
            
            .header {
                font-size: 16px;
                font-weight: 700;
                margin-top: 16px;
            }

            mwc-textfield {
                --mdc-theme-primary: black;
                --mdc-label-color: black;
                --mdc-outlined-color: rgba(0, 0, 0, 0.24);
                --mdc-outlined-hover-color: rgba(0, 0, 0, 0.87);
                --mdc-font-family: 'Open Sans', sans-serif;
                margin: 8px 0;
            }

            .delivery-container {
                padding: 0 24px;

                display: flex;
                flex-direction: column;
            }

            select {
                font-size: 1rem;
                background-color: whitesmoke;
                border: none;
                border-bottom: 1px solid;
                border-color: rgba(0, 0, 0, .42);
                width: 100%;
                height: 100%;
                padding: 0 12px;
                box-sizing: border-box;
                border-radius: 4px 4px 0 0;
                font-family: 'Open Sans', sans-serif;
            }
            
            select:hover {
                border-color: rgba(0, 0, 0, .87);
                background-color: rgba(0, 0, 0, .08)
            }
            
            select:focus {
                outline: none;
                border-color: rgba(0, 0, 0, 1);
                background-color: rgba(0, 0, 0, .14)
            }
            
            .select-container {
                height: 48px;
                margin: 8px 0;
            }

            single-cart-item {
                font-weight: 400;
            }

            .summary {
                margin-top: 8px;
                align-self: flex-end;
                align-items: center;
                display: flex;
                width: 30%;
                
                justify-content: space-between;
            }

            .total {
                font-size: 18px;
                font-weight: 700;
                color: var(--app-secondary-color);
            }

            .summary .number {
                font-family: 'Roboto Mono', monospace;
            }

            mwc-button.place-order {
                margin-top: 16px;
                --mdc-theme-primary: var(--app-dark-secondary-color);
                --mdc-theme-on-primary: white;
                align-self: flex-end;
            }

            @media (max-width: 768px) {
                .summary {
                    width: 50%;
                }

                .delivery-container {
                    padding: 0 16px;
                }
                mwc-button.place-order {
                    align-self: stretch;
                }

            }

            @media (max-width: 460px) {
                .summary {
                    width: 100%;
                }
                .delivery-container {
                    padding: 0;
                }
            }

            </style>
            
            <div class="main-title"><mwc-icon class="arrow-back">${arrowBackIcon}</mwc-icon>Checkout</div>
            <div class="container">
                <div class="header">Delivery address</div>
                <div class="delivery-container">
                    <mwc-textfield box fullWidth label="address"></mwc-textfield>
                    <mwc-textfield box fullWidth label="apt number or suite"></mwc-textfield>
                    <mwc-textfield box fullWidth label="name"></mwc-textfield>
                    <mwc-textfield box fullWidth label="phone number"></mwc-textfield>
                    <mwc-textfield textarea box fullWidth label="special instructions" labelAlwaysFloat></mwc-textfield>
                </div>
                <div class="header">Scheduled day and time</div>
                <div class="delivery-container">
                    <div class="select-container">
                        <select>
                            <option value="today">today</option>
                            <option value="tomorrow">tomorrow</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div class="select-container">
                        <select>
                            <option value="1">10:30am - 11:00am</option>
                            <option value="2">11:00am - 11:30am</option>
                            <option value="3">11:30am - 12:00pm</option>
                            <option value="4">12:00pm - 12:30pm</option>
                            <option value="4">12:30pm - 1:00pm</option>
                        </select>
                    </div>
                </div>
                <div class="header">Payment details</div>
                <div class="delivery-container">
                    <slot class="payment-input"></slot>
                </div>
                <div class="header">Order summary</div>
                <div class="delivery-container">
                    ${this.cart ? (repeat(Object.entries(this.cart.items), item => html `
                        <single-cart-item .iid="${item[0]}" .item="${item[1]}"></single-cart-item>
                    `)) : ""}
                    <div ?hidden="${this.cart ? (Object.keys(this.cart.items).length !== 0) : true}" class="empty">Shopping cart is empty</div>
                    
                    <div class="summary subtotal"><div>subtotal</div><div class="number">$${this.subtotal ? this.subtotal.toFixed(2) : ''}</div></div>
                    <div class="summary tax"><div>tax</div><div class="number">$${this.tax ? this.tax.toFixed(2) : ''}</div></div>
                    <div class="summary delivery"><div>delivery</div><div class="number">$${this.deliveryFee ? this.deliveryFee.toFixed(2) : ''}</div></div>
                    <div class="summary total"><div>total</div><div class="number">$${this.total ? this.total.toFixed(2) : ''}</div></div>
                    <mwc-button @click="${_ => this._onPlaceOrderClick()}" class="place-order" raised>place order</mwc-button>
                </div>
            </div>
        `;
    }

    updated(changedProperties) {
        console.log('changed properties:', changedProperties)
        const uidUpdated = changedProperties.has('uid');
        const cartUpdated = changedProperties.has('cart');
       
        if (uidUpdated && this.argsArray) {
            console.log('args array:', this.argsArray);
            this.argsArray.forEach(argsObject => {
                var argsArr = argsObject.args
                this._firestoreUpdateBinding(argsObject.name, ...argsArr.map(x => this[x]))
            });
        }
       
        if (cartUpdated) {
            let subtotal = this._computeCartTotal(this.cart);
            console.log('subtotal:', subtotal)
            let tax = this._computeTax(subtotal);
            let deliveryFee = this._computeDeliveryFee(subtotal);
            let total = this._roundMoney(subtotal + tax + deliveryFee);

            this.subtotal = subtotal;
            this.tax = tax;
            this.deliveryFee = deliveryFee;
            this.total = total;
        }
    }

    _computeCartTotal(cart) {
        console.log('computing cart total:', cart)
        if (!cart) return 0;
        var items = cart.items;
        let total = Object.keys(items).reduce((acc, cur) => {
            let curItem = items[cur];
            return acc + curItem.options[curItem.defaultOption];
        }, 0);
        return total;
    }

    _computeTax(cartTotal) {
        if (!cartTotal) return 0;
        return this._roundMoney(cartTotal * 0.0725);
    }

    _computeDeliveryFee(cartTotal) {
        if (!cartTotal) return 0;
        console.log('computing delivery fee', (cartTotal * 0.1))
        return this._roundMoney(cartTotal * 0.1);
    }

    //to round up to two decimal places
    _roundMoney(num) {
        return Math.round(num * 100) / 100;
    }
}

customElements.define('checkout-view', CheckoutView);