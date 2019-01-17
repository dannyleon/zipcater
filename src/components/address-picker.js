import {LitElement, html} from 'lit-element';
import '@material/mwc-button/mwc-button.js';
import { plusIcon } from '../my-icons';
import { repeat } from 'lit-html/directives/repeat';
import '../components/single-address.js';

class AddressPicker extends LitElement {
    static get properties() {
        return {
            addressArray: {
                type: Array
            },
            selectedAddress: {
                type: Number,
                reflct: true
            },
            uid: String
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
                    display: grid;
                    grid-gap: 8px;
                }

                mwc-button {
                    --mdc-theme-primary: var(--app-dark-secondary-color);
                    --mdc-theme-on-primary: var(--app-light-text-color);
                }

                single-address {
                    cursor: pointer;
                }
            </style>
            
            <mwc-button @click="${this._onAddAddress}" icon="add" outlined>add address</mwc-button>

            ${repeat(this.addressArray, (address, index) => html `
                <single-address 
                    class="single-address"
                    @address-click="${_ => this._onSingleAddressClick(index)}" 
                    @delete-address="${_ => this._deleteSingleAddress(address, index)}"
                    ?selected="${this.selectedAddress === index}" 
                    .address="${address}"></single-address>
            `)}
        `;
    }

    constructor() {
        super();
        this.addressArray = [];
    }

    reset() {
        const oldImageArray = [...this.addressArray];
        this.addressArray = [];
        this.requestUpdate('addressArray', oldImageArray)
    }

    _onAddAddress() {
        this.dispatchEvent(new CustomEvent('create-address', {detail: {uid: this.uid}, bubbles: true, composed: true}));
    }

    _onSingleAddressClick(idx) {
        this.selectedAddress = idx;
    }

    _deleteSingleAddress(address, idx) {
        console.log('deleting single address click:', address, idx)
        this.dispatchEvent(new CustomEvent('confirm-deletion', {detail: {data: {value: address, index: idx}, type: 'address'}, bubbles: true, composed: true} ));
    }

}

customElements.define('address-picker', AddressPicker);