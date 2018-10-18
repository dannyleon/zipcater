import {LitElement, html} from '@polymer/lit-element';
import '../../components/mwc-dialog/mwc-dialog';

class ConfirmDeletionDialog extends LitElement {
    static get properties() {
        return {
            deleteHeader: String,
            deleteMessage: String,
            type: String,
            dataToDelete: Object
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
                .cancel-button {
                    --mdc-theme-primary: black;
                }
                
                .submit-button {
                    --mdc-theme-primary: var(--app-tertiary-color);
                    --mdc-theme-on-primary: black;
                }

                [main-title] {
                    font-family: 'Open Sans';
                    text-transform: lowercase;
                    font-size: 24px;
                    text-align: start;
                    display: flex;
                    color: black;
                    font-weight: 700;
                }

                [main-title] .left {
                    font-weight: 300;
                }

                [main-title] .right {
                    font-weight: 800;
                }

                mwc-textfield {
                    --mdc-theme-primary: black;
                    --mdc-label-color: black;
                    --mdc-outlined-color: rgba(0, 0, 0, 0.24);
                    --mdc-outlined-hover-color: rgba(0, 0, 0, 0.87);
                    margin: 8px 0;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                }
            </style>

            <mwc-dialog id="dialog">
                    <div slot="header" main-title>${this.deleteHeader ? this.deleteHeader : 'Are you sure you want to delete this?'}</div>
                    <div class="container">${this.deleteMessage ? this.deleteMessage : 'This action cannot be reverted.'}</div>
                    <div class="buttons" slot="footer">
                        <mwc-button @click="${_ => this._onCloseDialogClick()}" class="cancel-button" data-mdc-dialog-action="close">cancel</mwc-button>
                        <mwc-button @click="${_ => this._onConfirmDeletionClick()}" class="submit-button" unelevated>delete</mwc-button>
                    </div>
            </mwc-dialog>
            
        `;
    }

    show() {
        this.shadowRoot.querySelector('#dialog').show();
    }

    close() {
        this.shadowRoot.querySelector('#dialog').close();
        this.resetValues();
    }

    _onCloseDialogClick() {
        console.log('closing confirm deletion dialog...')
        this.resetValues();
    }

    resetValues() {
        this.deleteHeader = null;
        this.deleteMessage = null;
        this.type = null;
        this.dataToDelete = null;
    }

    _onConfirmDeletionClick() {
        console.log('confirm deletion click...')
        this.dispatchEvent(new CustomEvent('deletion-confirmed', {detail: {type: this.type, data: this.dataToDelete}}));
        this.close();
    }
}

customElements.define('confirm-deletion-dialog', ConfirmDeletionDialog);