import {LitElement, html} from '@polymer/lit-element';

class MwcTabs extends LitElement {
    static get properties() {
        return {
            selected: Number
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
                ::slotted(*) {
                    display: inline-block;
                    color: var(--app-header-text-color);
                    text-decoration: none;
                    line-height: 30px;
                    padding: 4px 24px;
                }
                ::slotted(*)[selected] {
                    color: var(--app-header-selected-color);
                    border-bottom: 4px solid var(--app-header-selected-color);
                }
            </style>

            <slot></slot>
            
        `;
    }

}

customElements.define('mwc-tabs', MwcTabs);