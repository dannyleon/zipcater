import {LitElement, html} from '@polymer/lit-element';
import '@material/mwc-button'

class MwcTab extends LitElement {
    static get properties() {
        return {
            selected: String
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
                    justify-content: center;
                }
                mwc-button {
                    --mdc-theme-primary: var(--app-header-text-color);
                    --mdc-font-size: var(--mdc-tab-font-size, 16px);
                }

                :host([selected="true"]) mwc-button {
                    --mdc-theme-primary: var(--app-header-selected-color);
                    border-bottom: 4px solid var(--app-header-selected-color);
                }
            </style>
            
            <mwc-button>
                <slot>button</slot>
            </mwc-button>
        `;
    }

}

customElements.define('mwc-tab', MwcTab);