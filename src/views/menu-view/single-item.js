import {LitElement, html} from '@polymer/lit-element';

class SingleItem extends LitElement {
    static get properties() {
        return {
            name: String
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
            </style>
            
            <div>${this.name}</div>
        `;
    }

}

customElements.define('single-item', SingleItem);