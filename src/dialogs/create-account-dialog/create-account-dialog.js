import {LitElement, html} from 'lit-element';
import '../../components/agave-dialog.js';
import '../../components/snack-bar';
import '../../components/agave-textfield.js';

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

                agave-textfield {
                    margin: 8px 0;
                }

                .container {
                    display: flex;
                    flex-direction: column;
                }
            </style>

            <agave-dialog id="dialog">
                <div class="main">
                    <div main-title>
                        <div class="left">create</div>
                        <div class="right">account</div>
                    </div>

                    <div class="container">
                        <agave-textfield fullWidth box id="cna" label="name" type="text"></agave-textfield>
                        <agave-textfield fullWidth box id="cem" label="email" type="email"></agave-textfield>
                        <agave-textfield fullWidth box id="cpa" label="password" type="password"></agave-textfield>
                        <agave-textfield fullWidth box id="ccpa" label="confirm password" type="password"></agave-textfield>
                    </div>
                    <div class="buttons">
                        <mwc-button @click="${_ => this._onCloseDialogClick()}" class="cancel-button">cancel</mwc-button>
                        <mwc-button @click="${_ => this._onCreateAccountClick()}" class="submit-button" unelevated>create account</mwc-button>
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
        this.shadowRoot.querySelector('#cna').value = null;
        this.shadowRoot.querySelector('#cem').value = null;
        this.shadowRoot.querySelector('#cpa').value = null;
        this.shadowRoot.querySelector('#ccpa').value = null;

        this.close();
    }
    
    _onCreateAccountClick() {
        let cna = this.shadowRoot.querySelector('#cna').value;
        let cem = this.shadowRoot.querySelector('#cem').value;
        let cpa = this.shadowRoot.querySelector('#cpa').value;
        let ccpa = this.shadowRoot.querySelector('#ccpa').value;
        
        if (!cna || !ccpa || !cem || !cpa) return this.showErrorSnackbar('null-inputs');
        if (cpa !== ccpa) return this.showErrorSnackbar('mismatched-passwords');

        firebase.auth().createUserWithEmailAndPassword(cem, cpa).then(response => {
            console.log('account creation success:', response);
            const curUser = response.user;
            const dbUser = {
                name: cna,
                email: curUser.email,
                image: 'https://firebasestorage.googleapis.com/v0/b/zipcater.appspot.com/o/default-profile-picture.jpg?alt=media&token=e98ce754-9c36-49dd-82c5-ba332b49f4ab'
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
}

customElements.define('create-account-dialog', CreateAccountDialog);