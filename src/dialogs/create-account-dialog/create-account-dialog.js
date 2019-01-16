import {LitElement, html} from 'lit-element';
import '../../components/agave-dialog.js';
import '../../components/snack-bar';
import '../../components/agave-textfield.js';

class CreateAccountDialog extends LitElement {
    static get properties() {
        return {
            _snackbarOpened: Boolean,
            _snackbarMessage: String,
            waiting: Boolean
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
                    margin: 12px 0;
                }

                .main {
                    display: flex;
                    flex-direction: column;
                }
            </style>

            <agave-dialog id="dialog">
                <div class="header" slot="header" main-title>
                    <div class="left">create</div>
                    <div class="right">account</div>
                </div>
                <div slot="main" class="main">
                    <agave-textfield errorMessage="Please enter your complete name." name="cna" label="name" type="text"></agave-textfield>
                    <agave-textfield errorMessage="Please enter your email." name="cem" label="email" type="email"></agave-textfield>
                    <agave-textfield errorMessage="Please check your password." name="cpa" label="password" type="password"></agave-textfield>
                    <agave-textfield errorMessage="Please check your password." name="ccpa" label="confirm password" type="password"></agave-textfield>
                </div>
                <div slot="buttons" class="buttons">
                    <mwc-button @click="${this.close}" class="cancel-button">cancel</mwc-button>
                    <mwc-button @click="${_ => this._onCreateAccountClick()}" class="submit-button" unelevated>${this.waiting ? 'creating...' : 'create account'}</mwc-button>
                </div>
            </agave-dialog>
            
        `;
    }

    show() {
        this.shadowRoot.querySelector('#dialog').show();
    }

    close() {
        this.resetInputs();
        this.shadowRoot.querySelector('#dialog').close();
    }

    resetInputs() {
        var inputsArr = this.shadowRoot.querySelectorAll('agave-textfield');
        inputsArr.forEach(singleInput => {
            singleInput.value = null;
            singleInput.invalid = false;
        });
        this.waiting = false;
    }
    
    _onCreateAccountClick() {
        if (this.waiting) return;

        this.waiting = true;

        var inputsArr = this.shadowRoot.querySelectorAll('agave-textfield');

        var emptyInputs = false;
        var payload = {};

        console.log

        inputsArr.forEach(singleInput => {
            if (!singleInput.value) {
                singleInput.invalid = true;
                emptyInputs = true;
            } else {
                payload[singleInput.name] = {value: singleInput.value, input: singleInput};
            }
        });

        if (emptyInputs) {
            this.waiting = false;
            return;
        }

        console.log('new account sign up:', payload);
        
        if (payload.cpa.value !== payload.ccpa.value) {
            payload.cpa.input.invalid = true;
            payload.ccpa.input.invalid = true;
            this.waiting = false;
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(payload.cem.value, payload.cpa.value).then(response => {
            console.log('account creation success:', response);
            const curUser = response.user;
            const dbUser = {
                name: payload.cna.value,
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