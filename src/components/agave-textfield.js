import {LitElement, html} from '@polymer/lit-element';

class AgaveTextfield extends LitElement {
    static get properties() {
        return {
            label: String,
            type: String,
            value: String,
            placeholder: String,
            invalid: {
                type: Boolean,
                reflect: true
            },
            readonly: {
                type: Boolean,
                reflect: true
            },
            errorMessage: String
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
                    position: relative;
                    padding-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                }

                input {
                    display: block;
                    font-size: 16px;
                    padding: 0 8px;
                    box-sizing: border-box;
                    height: 56px;
                    border: none;
                    border-radius: 4px 4px 0 0;
                    overflow: hidden;
                    color: var(--agave-theme-color, #FBFBFB);
                    background-color: var(--agave-theme-background-color);
                    border-bottom: 1px solid var(--agave-theme-accent-color, rgba(0, 0, 0, 0.24));
                }

                input:hover {
                    border-color: rgba(0, 0, 0, 0.87)
                }

                input:focus {
                    outline: none;
                    background-color: var(--agave-theme-focus-background-color);
                    border-bottom: 2px solid var(--agave-theme-focus-border-color, rgba(0, 0, 0, 1));
                }

                label {
                    font-size: 12px;
                    color: var(--agave-theme-label-color, #FAFAFA)
                }

                :host([invalid]) input {
                    border-color: #ffd600;
                }

                :host([invalid]) label {
                    color: #ffd600;
                }

                .error-message {
                    color: #ffd600;
                    font-size: 14px;
                    position: absolute;
                    font-weight: 600;
                    bottom: -8px;
                    left: 4px;
                }
            </style>
            
            <label ?hidden="${!this.label}" for="input">${this.label}</label>
            <input placeholder="${this.placeholder}" ?readonly="${this.readonly}" @input="${this._onInput}" ?invalid="${this.invalid}" id="input" type="${this.type}">
            <div class="error-message" ?hidden="${!this.invalid || !this.errorMessage}">${this.errorMessage}</div>
        `;
    }

    constructor() {
        super();
    
        this.label = "";
        this.type = "";
        this.invalid = false;
        this.placeholder = "";
        this.readonly = false;
    }

    get value() {
        return this.shadowRoot.querySelector('input').value;
    }

    set value(val) {
        this.shadowRoot.querySelector('input').value = val;
    }

    _onInput(e) {
        if (e.target.value && this.invalid) this.invalid = false;
    }
}
customElements.define('agave-textfield', AgaveTextfield);