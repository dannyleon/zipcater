import {LitElement, html} from '@polymer/lit-element';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@material/mwc-button';
import '../snack-bar';

class SignInDrawer extends LitElement {
    static get properties() {
        return {
            opened: Boolean,
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
                .drawer-list {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    padding: 24px;
                    position: relative;
                    background: var(--app-dark-secondary-color);
                    color: white;

                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                }

                app-drawer {
                    z-index: 1;
                }

                [main-title] {
                    font-family: 'Open Sans';
                    text-transform: lowercase;
                    font-size: 24px;
                    text-align: start;
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
                    border: 1px solid white;
                    height: 32px;
                    border-radius: 3px;
                    color: white;                    

                    padding: 4px;
                    font-size: 14px;
                    letter-spacing: 1.5px;
                }

                input::placeholder {
                    color: rgba(360, 360, 360, 0.5);
                }

                mwc-button.create {
                    --mdc-theme-primary: var(--app-tertiary-color);
                    --mdc-theme-on-primary: black;
                    margin-top: 8px;
                }

                mwc-button.sign-in {
                    --mdc-theme-primary: var(--app-primary-color);
                    --mdc-theme-on-primary: black;
                    margin-top: 8px;
                }
            </style>

            <app-drawer align="end" .opened="${this.opened}"
                @opened-changed="${e => this._updateDrawerState(e.target.opened)}">
                    <div class="drawer-list sign-in-container">
                        <div main-title>
                            <span class="left">sign</span><span class="right">in</span>
                        </div>
                        <input id="em" placeholder="email" type="email">
                        <input id="pa" placeholder="password" type="password">
                        <mwc-button @click="${_ => this._onSignInClick()}" class="sign-in" unelevated>sign in</mwc-button>
                        <mwc-button @click="${_ => this._onCreateAccountClick()}" class="create" unelevated>create account</mwc-button>
                        <snack-bar class="drawer" ?active="${this._snackbarOpened}">${this._snackbarMessage}</snack-bar>
                    </div>
            </app-drawer>

        `;
    }

    _updateDrawerState(opened) {
        this.dispatchEvent(new CustomEvent('opened-changed', {detail: {opened: opened}}));
    }

    _onInputChange(value) {
        console.log('on input change:', value)
    }

    _onSignInClick() {
        console.log('on sign in click...')
        let em = this.shadowRoot.querySelector('#em').value;
        let pa = this.shadowRoot.querySelector('#pa').value;
        firebase.auth().signInWithEmailAndPassword(em, pa).then(response => {
            console.log('sign in success:', response)
            this.opened = false;
        }).catch(err => {
            console.log('sign in error:', err)
            this.showErrorSnackbar(err.code);
        });
    }

    _onCreateAccountClick() {
        this.dispatchEvent(new CustomEvent('create-account'));
        this.opened = false;
    }

    showErrorSnackbar(errorCode) {
        var errMessage;
        switch (errorCode) {
            case 'auth/invalid-email':
                errMessage = 'Invalid email address.'
                break;
            case 'auth/user-disabled':
                errMessage = 'Account has been disabled, please contact support.'
                break;
            case 'auth/user-not-found':
                errMessage = 'Unable to sign in. Create an account and try again.'
                break;
            case 'auth/wrong-password':
                errMessage = 'Unable to sign in. Check your password and try again.'
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

customElements.define('sign-in-drawer', SignInDrawer);