import {LitElement, html} from 'lit-element';

class AgaveTextfield extends LitElement {
    static get properties() {
        return {
            name: String,
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
                    font-family: 'Open Sans', sans-serif;
                }

                .input-container {
                    position: relative;
                    display: flex;
                    height: 56px;
                    background-color: whitesmoke;
                    border-radius: 4px 4px 0 0;
                }

                :host(:not([readonly])) .input-container:hover {
                    background-color: #ededed;
                }

                :host(:not([readonly])) .input-container:focus-within {
                    background-color: #dddddd;
                }

                :host(:not([readonly])) .input-container:focus-within label {
                    opacity: 0.87;
                }

                :host(:not([readonly])) .input-container:focus-within .line-ripple {
                    transform: scaleX(1);
                    opacity: 1;
                }

                input {
                    border: none;
                    width: 100%;
                    background-color: transparent;
                    padding: 20px 12px 6px;
                    font-family: inherit;

                    box-sizing: border-box;
                    border-bottom: 1px solid;
                    border-bottom-color: #9d9d9d;

                    font-size: 1rem;
                    line-height: 1.75rem;
                    font-weight: 400;
                    letter-spacing: 0.009375em;
                }

                input:focus {
                    outline: none;
                }

                label {
                    position: absolute;
                    left: 12px;
                    top: 6px;

                    font-family: inherit;

                    font-size: 12px;
                    color: var(--primary-theme, rgb(0, 0, 0));
                    opacity: 0.6;
                }

                .line-ripple {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    transform: scaleX(0);
                    transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0;
                    z-index: 2;
                    background-color: var(--primary-theme, rgb(0,0,0));
                }

                :host([invalid]) input {
                    border-color: #d50000;
                }

                :host([invalid]) label {
                    color: #d50000;
                }

                :host([invalid]) .line-ripple {
                    background-color: #d50000;
                }

                .error-message {
                    color: #d50000;
                    font-size: 12px;
                    position: absolute;
                    font-weight: 400;
                    bottom: -20px;
                    left: 4px;
                }
            </style>

            <div class="input-container">
                <label ?hidden="${!this.label}" for="input">${this.label}</label>
                <input placeholder="${this.placeholder}" ?readonly="${this.readonly}" @input="${this._onInput}" ?invalid="${this.invalid}" id="input" type="${this.type}">
                <div class="line-ripple"></div>
                <div class="error-message" ?hidden="${!this.invalid || !this.errorMessage}">${this.errorMessage}</div> 
            </div>
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
        console.log('getting value:', this.shadowRoot.querySelector('input'))
        let input = this.shadowRoot.querySelector('input');
        if (input) return input.value;
    }
    
    set value(val) {
        let input = this.shadowRoot.querySelector('input');
        if (input) input.value = val;
    }

    _onInput(e) {
        console.log('input focused/blur')
        if (e.target.value && this.invalid) this.invalid = false;
    }
}
customElements.define('agave-textfield', AgaveTextfield);