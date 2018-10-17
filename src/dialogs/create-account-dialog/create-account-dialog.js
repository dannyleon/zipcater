import {LitElement, html} from '@polymer/lit-element';
import '../../components/mwc-dialog/mwc-dialog';
import '../../components/snack-bar';
import '../../components/mwc-textfield/mwc-textfield';

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

            <mwc-dialog id="dialog"
                @closed="${e => this._onDialogClosed(e)}">
                    <div slot="header" main-title>
                        <div class="left">create</div>
                        <div class="right">account</div>
                    </div>
                    <div class="container">
                        <mwc-textfield fullWidth box id="cem" label="email" type="email"></mwc-textfield>
                        <mwc-textfield fullWidth box id="cpa" label="password" type="password"></mwc-textfield>
                        <mwc-textfield fullWidth box id="ccpa" label="confirm password" type="password"></mwc-textfield>
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
        this.shadowRoot.querySelector('#cpa').value = null;
        this.shadowRoot.querySelector('#ccpa').value = null;
    }
    
    _onCreateAccountClick() {
        let cem = this.shadowRoot.querySelector('#cem').value;
        let cpa = this.shadowRoot.querySelector('#cpa').value;
        let ccpa = this.shadowRoot.querySelector('#ccpa').value;
        
        if (!ccpa || !cem || !cpa) return this.showErrorSnackbar('null-inputs');
        if (cpa !== ccpa) return this.showErrorSnackbar('mismatched-passwords');

        firebase.auth().createUserWithEmailAndPassword(cem, cpa).then(response => {
            console.log('account creation success:', response);
            const curUser = response.user;
            const dbUser = {
                email: curUser.email
            }
            return firebase.firestore().doc(`users/${curUser.uid}`).set(dbUser);
        }).then(response => {
            console.log('user saved to db:', response);
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
            case 'mismatched-passwords':
                errMessage = 'Unable to create account, passwords do not match.'
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