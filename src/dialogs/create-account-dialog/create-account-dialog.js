import {LitElement, html} from '@polymer/lit-element';
import '../../components/mwc-dialog/mwc-dialog';
import '../../components/snack-bar';

class CreateAccountDialog extends LitElement {
    static get properties() {
        return {
            _snackbarOpened: Boolean,
            _snackbarMessage: String,
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
                    --mdc-theme-primary: var(--app-dark-tertiary-color);
                    --mdc-theme-on-primary: white;
                }

                [main-title] {
                    font-family: 'Open Sans';
                    text-transform: lowercase;
                    font-size: 32px;
                    text-align: start;
                    display: flex;
                    color: black;
                }

                [main-title] .left {
                    font-weight: 300;
                }

                [main-title] .right {
                    font-weight: 800;
                }

                input {
                    margin-bottom: 8px;
                    background: transparent;
                    border: 1px solid black;
                    height: 32px;
                    border-radius: 3px;
                    color: black;                    

                    padding: 4px;
                    font-size: 14px;
                    letter-spacing: 1.5px;
                }

                input::placeholder {
                    color: rgba(0, 0, 0, 0.5);
                }

                .container {
                    display: flex;
                    flex-direction: column;
                }
            </style>

            <mwc-dialog id="dialog"
                @closed="${e => this._onDialogClosed(e)}">
                    <div slot="header" main-title>
                        <div class="left">create</div>
                        <div class="right">account</div>
                    </div>
                    <div class="container">
                        <input id="cem" placeholder="email" type="email">
                        <input id="ccem" placeholder="confirm email" type="email">
                        <input id="cpa" placeholder="password" type="password">
                    </div>
                    <div class="buttons" slot="footer">
                        <mwc-button @click="${_ => this._onCloseDialogClick()}" class="cancel-button" data-mdc-dialog-action="close">cancel</mwc-button>
                        <mwc-button @click="${_ => this._onCreateAccountClick()}" class="submit-button" unelevated>create account</mwc-button>
                    </div>
                    <snack-bar class="drawer" ?active="${this._snackbarOpened}">${this._snackbarMessage}</snack-bar>
            </mwc-dialog>
            
        `;
    }

    show() {
        this.shadowRoot.querySelector('#dialog').show();
    }

    close() {
        this.shadowRoot.querySelector('#dialog').close();
    }

    _onCloseDialogClick() {
        this.shadowRoot.querySelector('#cem').value = null;
        this.shadowRoot.querySelector('#ccem').value = null;
        this.shadowRoot.querySelector('#cpa').value = null;
    }
    
    _onCreateAccountClick() {
        let cem = this.shadowRoot.querySelector('#cem').value;
        let ccem = this.shadowRoot.querySelector('#ccem').value;
        let cpa = this.shadowRoot.querySelector('#cpa').value;
        
        if (!ccem || !cem || !cpa) return this.showErrorSnackbar('null-inputs');
        if (cem !== ccem) return this.showErrorSnackbar('mismatched-emails');

        firebase.auth().createUserWithEmailAndPassword(cem, cpa).then(response => {
            console.log('account creation success:', response);
            this.close();
        }).catch(err => {
            console.log('account creation error:', err)
            this.showErrorSnackbar(err.code);
        });
    }

    showErrorSnackbar(errorCode) {
        var errMessage;
        switch (errorCode) {
            case 'auth/email-already-in-use':
                errMessage = 'Unable to create account, email already exists.'
                break;
            case 'auth/invalid-email':
                errMessage = 'Unable to create account, invalid email.'
                break;
            case 'auth/weak-password':
                errMessage = 'Unable to create account, password not strong enough.'
                break;
            case 'mismatched-emails':
                errMessage = 'Unable to create account, emails do not match.'
                break;
            case 'null-inputs':
                errMessage = 'Unable to create account, please fill out every field.'
                break;
            default:
                errMessage = 'Unable to sign in, please try again or contact support.'
                break;
        }
        clearTimeout(this.__snackbarTimer);
        this._snackbarMessage = errMessage;
        this._snackbarOpened = true;
        this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
    }

    _onDialogClosed(e) {
        console.log('on dialog closed:', e)
    }

}

customElements.define('create-account-dialog', CreateAccountDialog);