import {html} from 'lit-element';
import {DrawerElement} from '../drawer-element'
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@material/mwc-button';
import '../snack-bar';
import './single-cart-item';
import { cartIcon } from '../../my-icons';
import { repeat } from 'lit-html/directives/repeat';

class CartDrawer extends FirestoreMixin(DrawerElement) {
    static get properties() {
        return {
            uid: String,
            cart: {
                type: Object,
                doc: 'carts/{uid}',
                live: true
            },
            argsArray: Array,
            persistent: Boolean,
            cartLength: Number
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
                .drawer-list {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    color: var(--app-dark-secondary-color);
                    background: white;
                    padding-top: var(--content-padding-top);

                    display: flex;
                    flex-direction: column;
                }

                .drawer-list.sign-in-view {
                    color: black;
                    font-size: 20px;
                    align-items: center;
                    justify-content: center;
                }

                .content {
                    padding: 0 16px 16px;
                }

                app-drawer {
                    z-index: var(--drawer-z-index, 1);
                }

                [main-title] {
                    padding: 14px 16px;
                    text-transform: lowercase;
                    font-size: 24px;
                    text-align: start;
                    border-bottom: 1px solid var(--app-border-color);

                    display: flex;
                    align-items: center;
                }                

                [main-title] i {
                    fill: var(--app-dark-secondary-color);
                    margin-right: 4px;
                    display: flex;
                }

                [main-title] .left {
                    font-weight: 300;
                }

                [main-title] .right {
                    font-weight: 800;
                }

                mwc-button {
                    --mdc-theme-primary: var(--app-dark-secondary-color);
                    --mdc-theme-on-primary: white;

                    margin: 0 24px 8px;
                }

                single-cart-item {
                    color: black;
                }

                .total {
                    color: black;
                    font-family: 'Roboto Mono', monospace;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    
                    padding: 8px 24px;
                    font-size: 24px;
                    margin-top: auto;
                }

                .empty {
                    text-align: center;
                    border-bottom: 1px solid var(--app-border-color);
                    padding: 16px 0;
                    font-weight: 700;
                }
            </style>

            <app-drawer .persistent="${this.persistent}" align="end" .opened="${this.opened}"
                @opened-changed="${e => this._updateDrawerState(e.target.opened)}">
                    <div class="drawer-list">
                        <div main-title>
                            <i>${cartIcon}</i>
                            <span class="left">shopping</span>
                            <span class="right">cart</span>
                        </div>
                        <div class="content">
                            ${this.cart ? (repeat(Object.entries(this.cart.items), item => html `
                                <single-cart-item @remove-item="${_ => this._onSingleCartItemClick(this.cart.items, item[0])}" .iid="${item[0]}" .item="${item[1]}"></single-cart-item>
                            `)) : ""}
                            <div ?hidden="${this.cartLength !== 0}" class="empty">Shopping cart is empty</div>
                        </div>
                        <div class="total">subtotal<div class="total-number">${this._computeCartTotal(this.cart)}</div></div>
                        <mwc-button @click="${_ => this._onCheckoutClick()}" class="checkout" unelevated>checkout</mwc-button>
                        <snack-bar class="drawer" ?active="${this._snackbarOpened}">${this._snackbarMessage}</snack-bar>
                    </div>
            </app-drawer>   
        `;
    }
    
    updated(changedProperties) {
        console.log('changed properties:', changedProperties)
        const uidUpdated = changedProperties.has('uid');
        const cartUpdated = changedProperties.has('cart');
       
        if (uidUpdated && this.argsArray) {
            if (!this.uid) {
                if (this.cart) this.cart = null;
                return;
            }
            console.log('args array:', this.argsArray);
            this.argsArray.forEach(argsObject => {
                var argsArr = argsObject.args
                this._firestoreUpdateBinding(argsObject.name, ...argsArr.map(x => this[x]))
            });
        }

        if (cartUpdated) {
            let cartLength = (this.cart && this.cart.items) ? Object.keys(this.cart.items).length : 0;
            this.dispatchEvent(new CustomEvent('cart-length', {detail: cartLength}))
            this.cartLength = cartLength;
        }
    }

    _updateDrawerState(opened) {
        this.dispatchEvent(new CustomEvent('opened-changed', {detail: {opened: opened}}));
    }

    _onCheckoutClick() {
        if (!this.cartLength) return this.openSnackbar('Add items before checking out.');
        this.dispatchEvent(new CustomEvent('checkout'));
    }

    _computeCartTotal(cart) {
        console.log('computing cart total:', cart)
        if (!cart) return;
        var items = cart.items;
        let total = Object.keys(items).reduce((acc, cur) => {
            let curItem = items[cur];
            return acc + curItem.options[curItem.defaultOption];
        }, 0);
        return `$${total.toFixed(2)}`;
    }

    _onSingleCartItemClick(items, iid) {
        console.log('on single cart item click:', items, iid);
        delete items[iid]
        this.dispatchEvent(new CustomEvent('delete-cart-item', {detail: items}))
    }

}

customElements.define('cart-drawer', CartDrawer);