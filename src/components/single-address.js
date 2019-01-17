import {LitElement, html} from 'lit-element';
import { minusFilledIcon } from '../my-icons';

class SingleAddress extends LitElement {
    static get properties() {
        return {
            address: String,
            empty: {
                type: Boolean,
                reflect: true
            },
            editing: Boolean,
            selected: Boolean
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
                i {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    fill: var(--icon-color, black);
                    display: none;
                    cursor: pointer;
                }

                :host {
                    font-size: 12px;
                    border-radius: 5px;
                    padding: 8px;
                    text-align: center;
                    color: black;
                    background-color: var(--app-fill-color);
                    position: relative;
                    box-sizing: border-box;
                    border: 2px solid transparent;
                }

                :host([editing]) {
                    cursor: pointer;
                }

                :host([selected]) {
                    background-color: var(--app-dark-tertiary-color);
                    color: var(--app-light-text-color);
                }

                :host([editing]) i {
                    display: block;
                }

                :host([editing]) i:hover {
                    fill: var(--app-tertiary-color);
                    cursor: pointer;
                }
            </style>
            
            <i @click="${_ => this._onDeleteIconClick()}">${minusFilledIcon}</i> 
            <div @click="${_ => this._onAddressClick()}">${this.empty ? 'no address found' : this.address}</div>
        `;
    }

    _onDeleteIconClick() {
        this.dispatchEvent(new CustomEvent('delete-address'));
    }
    
    _onAddressClick() {
        this.dispatchEvent(new CustomEvent('address-click'));
    }

}

customElements.define('single-address', SingleAddress);