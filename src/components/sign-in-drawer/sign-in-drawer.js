import {html} from '@polymer/lit-element';
import {DrawerElement} from '../drawer-element'
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@material/mwc-button';
import '../../components/mwc-textfield/mwc-textfield';
import '../snack-bar';

class SignInDrawer extends DrawerElement {
    static get properties() {
        return {
            persistent: Boolean,
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
                    background: white;
                    color: var(--app-tertiary-color);
                    padding-top: var(--content-padding-top);

                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                }

                app-drawer {
                    z-index: var(--drawer-z-index, 1);
                }

                [main-title] {
                    font-family: 'Open Sans';
                    text-transform: lowercase;
                    font-size: 24px;
                    text-align: start;
                    padding: 14px 0;
                }

                [main-title] .left {
                    font-weight: 300;
                }

                [main-title] .right {
                    font-weight: 800;
                }

                mwc-textfield {
                    --mdc-theme-primary: black;
                    --mdc-label-color: rgb(0, 0, 0);
                    --mdc-outlined-color: rgba(0, 0, 0, 0.24);
                    --mdc-outlined-hover-color: rgba(0, 0, 0, 0.87);
                    margin: 8px 0;
                }

                mwc-button.create {
                    --mdc-theme-primary: var(--app-tertiary-color);
                    --mdc-theme-on-primary: black;
                    margin-top: 8px;
                }

                mwc-button.sign-in {
                    --mdc-theme-primary: black;
                    margin-top: 8px;
                }
            </style>

            <app-drawer .persistent="${this.persistent}" align="end" .opened="${this.opened}"
                @opened-changed="${e => this._updateDrawerState(e.target.opened)}">
                    <div class="drawer-list sign-in-container">
                        <div main-title>
                            <span class="left">sign</span><span class="right">in</span>
                        </div>
                        <mwc-textfield id="em" outlined fullWidth label="email"></mwc-textfield>
                        <mwc-textfield id="pa" outlined fullWidth label="password" type="password"></mwc-textfield>
                        <mwc-button @click="${_ => this._onSignInClick()}" class="sign-in" outlined>sign in</mwc-button>
                        <mwc-button @click="${_ => this._onCreateAccountClick()}" class="create" unelevated>create account</mwc-button>
                        <snack-bar class="drawer" ?active="${this._snackbarOpened}">${this._snackbarMessage}</snack-bar>
                    </div>
            </app-drawer>

        `;
    }

    _updateDrawerState(opened) {
        this.dispatchEvent(new CustomEvent('opened-changed', {detail: {opened: opened}}));
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

    updated(changedProperties) {
        console.log('changed properties:', changedProperties) 
        const openedUpdated = changedProperties.has('opened');
       
        if (openedUpdated) {
            if (!this.opened) this._resetInputs();
        }
    }

    _resetInputs() {
        this.shadowRoot.querySelector('#em').value = null;
        this.shadowRoot.querySelector('#pa').value = null;
    }

    _onCreateAccountClick() {
        this.dispatchEvent(new CustomEvent('create-account'));
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
        this.openSnackbar(errMessage);
    }

}

customElements.define('sign-in-drawer', SignInDrawer);