import {LitElement, html} from '@polymer/lit-element';
import '@material/mwc-icon'
import { minusIcon } from '../../my-icons';

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
                mwc-icon {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    fill: white;
                    display: var(--single-address-icon-display, block);
                }

                mwc-icon:hover {
                    fill: var(--app-fill-color);
                    cursor: pointer;
                }

            </style>
            
            <mwc-icon @click="${_ => this._onDeleteIconClick()}">${minusIcon}</mwc-icon>
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