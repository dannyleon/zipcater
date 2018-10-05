import {html} from '@polymer/lit-element';
import {DrawerElement} from '../drawer-element'
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@material/mwc-button';
import '@material/mwc-icon';
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
            <style>
                .drawer-list {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    color: var(--app-dark-secondary-color);
                    background: white;

                    display: flex;
                    flex-direction: column;
                }

                .content {
                    padding: 0 16px 16px;
                }

                app-drawer {
                    z-index: 1;
                }

                [main-title] {
                    padding: 16px;
                    text-transform: lowercase;
                    font-size: 24px;
                    text-align: start;
                    border-bottom: 1px solid var(--app-border-color);

                    display: flex;
                    align-items: center;
                }                

                [main-title] mwc-icon {
                    fill: var(--app-dark-secondary-color);
                    margin-right: 4px;
                }

                [main-title] .left {
                    font-weight: 300;
                }

                [main-title] .right {
                    font-weight: 800;
                }

                mwc-button.checkout {
                    --mdc-theme-primary: var(--app-dark-secondary-color);
                    --mdc-theme-on-primary: white;
                    --mdc-border-radius: 0;
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

            <app-drawer align="end" .opened="${this.opened}"
                @opened-changed="${e => this._updateDrawerState(e.target.opened)}">
                    <div class="drawer-list">
                        <div main-title>
                            <mwc-icon>${cartIcon}</mwc-icon>
                            <span class="left">shopping</span>
                            <span class="right">cart</span>
                        </div>
                        <div class="content">
                            ${this.cart ? (repeat(Object.entries(this.cart.items), item => html `
                                <single-cart-item @click="${_ => this._onSingleCartItemClick(this.cart.items, item[0])}" .iid="${item[0]}" .item="${item[1]}"></single-cart-item>
                            `)) : ""}
                            <div ?hidden="${this.cart ? (Object.keys(this.cart.items).length !== 0) : true}" class="empty">Shopping cart is empty</div>
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
       
        if (uidUpdated && this.argsArray) {
            console.log('args array:', this.argsArray);
            this.argsArray.forEach(argsObject => {
                var argsArr = argsObject.args
                this._firestoreUpdateBinding(argsObject.name, ...argsArr.map(x => this[x]))
            });
        }
    }

    _updateDrawerState(opened) {
        this.dispatchEvent(new CustomEvent('opened-changed', {detail: {opened: opened}}));
    }

    _onCheckoutClick() {
        console.log('on checkout click...');
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