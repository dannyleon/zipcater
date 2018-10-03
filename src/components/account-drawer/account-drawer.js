import {LitElement, html} from '@polymer/lit-element';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@material/mwc-button';
import '../snack-bar';

class AccountDrawer extends LitElement {
    static get properties() {
        return {
            opened: Boolean,
            user: Object,
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

                img {
                    width: 100%;
                    height: 165px;
                    object-fit: cover;
                    border-radius: 5px;
                    background-color: var(--app-dark-primary-color);
                }

                [main-title] {
                    font-weight: 300;
                    font-size: 14px;
                    text-align: start;
                }

                mwc-button.sign-out {
                    --mdc-theme-primary: var(--app-primary-color);
                    --mdc-theme-on-primary: black;
                    margin-top: auto;
                }
            </style>

            <app-drawer align="end" .opened="${this.opened}"
                @opened-changed="${e => this._updateDrawerState(e.target.opened)}">
                    <div class="drawer-list">
                        <div class="image-container">
                            <img src="${this._computeImageSrc(this.user)}">
                        </div>
                        <div main-title>${this.user ? this.user.email : ""}</div>
                        <mwc-button @click="${_ => this._onSignOutClick()}" class="sign-out" unelevated>log out</mwc-button>
                        <snack-bar class="drawer" ?active="${this._snackbarOpened}">${this._snackbarMessage}</snack-bar>
                    </div>
            </app-drawer>

        `;
    }

    _updateDrawerState(opened) {
        this.dispatchEvent(new CustomEvent('opened-changed', {detail: {opened: opened}}));
    }

    _onSignOutClick() {
        console.log('on sign out click...')
        firebase.auth().signOut();
        this.opened = false;
    }

    _computeImageSrc(obj) {
        console.log('computing img src:', obj)
        return ((obj && obj.image) ? obj.image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
}

customElements.define('account-drawer', AccountDrawer);