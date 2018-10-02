import {LitElement, html} from '@polymer/lit-element';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@material/mwc-button';

class SignInDrawer extends LitElement {
    static get properties() {
        return {
            opened: Boolean
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

                mwc-button.sign-in {
                    --mdc-theme-primary: var(--app-tertiary-color);
                    --mdc-theme-on-primary: black;
                    margin-top: 8px;
                }

                mwc-button.create {
                    --mdc-theme-primary: var(--app-primary-color);
                    --mdc-theme-on-primary: black;
                    margin-top: 8px;
                }
            </style>

            <app-drawer align="end" .opened="${this.opened}"
                @opened-changed="${e => this._updateDrawerState(e.target.opened)}">
                    <div class="drawer-list">
                        <div main-title>
                            <span class="left">sign</span><span class="right">in</span>
                        </div>
                        <input placeholder="email" type="text">
                        <input placeholder="password" type="text">
                        <mwc-button class="sign-in" unelevated>sign in</mwc-button>
                        <mwc-button class="create" unelevated>create account</mwc-button>
                    </div>
            </app-drawer>
            
        `;
    }

    _updateDrawerState(opened) {
        this.dispatchEvent(new CustomEvent('opened-changed', {detail: {opened: opened}}));
    }

}

customElements.define('sign-in-drawer', SignInDrawer);