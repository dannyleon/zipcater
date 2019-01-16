import {LitElement, html} from 'lit-element';
import { minusFilledIcon } from '../../my-icons';

class SingleAddress extends LitElement {
    static get properties() {
        return {
            address: String
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
                    display: var(--single-address-icon-display, block);
                    cursor: pointer;
                }
            </style>
            
            <i @click="${_ => this._onDeleteIconClick()}">${minusFilledIcon}</i>
            <div @click="${_ => this._onAddressClick()}">${this.address}</div>
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