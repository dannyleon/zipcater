import {LitElement, html} from 'lit-element';
import '../../components/agave-dialog.js';
import '../../components/snack-bar';
import '../../components/address-input/address-input';

class CreateAddressDialog extends LitElement {
    static get properties() {
        return {
            _snackbarOpened: Boolean,
            _snackbarMessage: String,
            uid: String
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

                .container {
                    display: flex;
                    flex-direction: column;
                }
            </style>

            <agave-dialog id="dialog">
                    <div class="main">
                        <div main-title>add address</div>
                        <div class="container">
                            <address-input fullWidth id="addressInput"></address-input>
                        </div>
                        <div class="buttons">
                            <mwc-button @click="${_ => this._onCloseDialogClick()}" class="cancel-button">cancel</mwc-button>
                            <mwc-button @click="${_ => this._onAddAddressClick()}" class="submit-button" unelevated>add address</mwc-button>
                        </div>
                        <snack-bar class="drawer" ?active="${this._snackbarOpened}">${this._snackbarMessage}</snack-bar>
                    </div>
            </agave-dialog>
            
        `;
    }

    show() {
        this.shadowRoot.querySelector('#dialog').show();
    }

    close() {
        this.shadowRoot.querySelector('#dialog').close();
    }

    _onCloseDialogClick() {
        this.shadowRoot.getElementById('addressInput').reset();
        this.close();
    }
    
    _onAddAddressClick() {
        let address = this.shadowRoot.getElementById('addressInput').address;
        
        if (!address) return this.showErrorSnackbar('null-inputs');

        const updates = {
            "savedAddresses": firebase.firestore.FieldValue.arrayUnion(address)
        }
        return firebase.firestore().doc(`users/${this.uid}`).update(updates).then(response => {
            this.shadowRoot.getElementById('addressInput').reset();
            this.close();
        }).catch(err => {
            console.log('ERR:', err);
            this.showErrorSnackbar(err.code);
        });
    }

    showErrorSnackbar(errorCode) {
        var errMessage;
        switch (errorCode) {
            case 'null-inputs':
                errMessage = 'Address field is empty.'
                break;
            default:
                errMessage = 'Unable to add address, please try again or contact support.'
                break;
        }
        clearTimeout(this.__snackbarTimer);
        this._snackbarMessage = errMessage;
        this._snackbarOpened = true;
        this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
    }

}

customElements.define('create-address-dialog', CreateAddressDialog);