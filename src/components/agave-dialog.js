import {LitElement, html} from 'lit-element';

class AgaveDialog extends LitElement {
    static get properties() {
        return {
            open: {
                type: Boolean,
                reflect: true
            }
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
                    display: none;
                    z-index: 1;
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;

                    flex-direction: column;
                    justify-content: flex-end;

                }

                .dialog {
                    box-sizing: border-box;
                    padding: 24px;
                    z-index: 2;
                    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
                    width: 600px;
                    max-width: calc(100% - 32px);
                    max-height: calc(100% - 32px);
                    margin: auto;

                    display: flex;
                    
                    position: relative;
                    
                    font-family: "Open Sans", sans-serif;
                    background-color: white;
                    color: black;
                }

                :host([open]) {
                    background-color: rgba(0,0,0,0.4);
                    pointer-events: auto;
                    display: flex;
                }
            </style>

            <div class="dialog" role="alertdialog">
                <slot></slot>
            </div>
            

        `;
    }

    show() {
        this.open = true;
    }
    
    close() {
        this.open = false;
    }
}
customElements.define('agave-dialog', AgaveDialog);