import {html} from '@polymer/lit-element';
import {DrawerElement} from '../drawer-element'
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@material/mwc-button';
import '../../components/mwc-textfield/mwc-textfield.js';
import '../../components/address-input/address-input.js';
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import '../snack-bar';
import { editIcon } from '../../my-icons.js';

class AccountDrawer extends FirestoreMixin(DrawerElement) {
    static get properties() {
        return {
            editing: {
                type: Boolean,
                reflect: true
            },
            uid: String,
            user: {
                type: Object,
                doc: 'users/{uid}',
                live: true
            },
            placeholderName: String,
            placeholderEmail: String,
            placeholderPhone: String,
            argsArray: Array
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
                    position: relative;
                    background: linear-gradient(to right, white 50%, var(--app-dark-secondary-color) 50%);
                    background-size: 200% 100%;
                    background-position: left bottom;
                    transition: all 0.4s ease;
                    color: black;

                    display: flex;
                    flex-direction: column;
                    align-items: stretch;

                    text-align: start;
                }

                :host([editing]) .drawer-list {
                    background-position: right bottom;
                    color: white;
                }

                :host([editing]) mwc-textfield.details {
                    --mdc-theme-primary: white;
                    --mdc-label-color: white;
                    --mdc-outlined-color: rgba(360, 360, 360, 0.24);
                    --mdc-outlined-hover-color: rgba(360, 360, 360, 0.87);
                }

                app-drawer {
                    z-index: 1;
                }

                .image-container {
                    padding: 16px 16px 0;
                }

                img {
                    width: 100%;
                    height: 165px;
                    object-fit: cover;
                    border-radius: 5px;
                    background-color: var(--app-dark-primary-color);
                }

                .account-details {
                    padding: 0 16px 16px;
                    display: flex;
                    flex-direction: column;
                }

                .header, .address-header {
                    font-size: 18px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .address-header {
                    height: 32px;
                }

                address-input {
                    margin: 8px 0;
                }

                mwc-textfield.details {
                    margin: 8px 0;
                    --mdc-theme-primary: black;
                    --mdc-label-color: black;
                    --mdc-outlined-color: rgba(0, 0, 0, 0.24);
                    --mdc-outlined-hover-color: rgba(0, 0, 0, 0.87);
                    --mdc-font-family: 'Open Sans', sans-serif;
                }

                :host([editing]) mwc-button {
                    --mdc-theme-primary: white;
                    --mdc-theme-on-primary: black;
                }

                mwc-button {
                    --mdc-theme-primary: var(--app-dark-secondary-color);
                    --mdc-border-radius: 0;
                    --mdc-button-height: 48px;
                }

                mwc-button.edit-profile, mwc-button.discard-changes {
                    margin-top: auto;
                }

                mwc-button.add-address {
                    --mdc-border-radius: 24px;
                }

                [hidden] {
                    display: none;
                }
            </style>

            <app-drawer align="end" .opened="${this.opened}"
                @opened-changed="${e => this._updateDrawerState(e.target.opened)}">
                    <div class="drawer-list">
                        <div class="image-container">
                            <img src="${this._computeImageSrc(this.user)}">
                        </div>
                        
                        <div class="account-details">
                            <div class="header">${this.editing ? 'Editing account' : 'Account details'}</div>
                            <mwc-textfield id="userName" labelAlwaysFloat ?readonly="${!this.editing}" label="name" class="details" outlined fullWidth placeholder="${(this.user && this.user.name) ? this.user.name : "add name"}"></mwc-textfield>
                            <mwc-textfield id="userEmail" labelAlwaysFloat ?readonly="${!this.editing}" label="email" class="details" outlined fullWidth placeholder="${(this.user && this.user.email) ? this.user.email : "add email"}"></mwc-textfield>
                            <mwc-textfield id="userPhone" labelAlwaysFloat ?readonly="${!this.editing}" label="phone" class="details" outlined fullWidth placeholder="${(this.user && this.user.phone) ? this.user.phone : "add phone"}"></mwc-textfield>
                        </div>

                        <div class="account-details">
                            <div class="address-header">Saved addresses<mwc-button ?hidden="${!this.editing}" icon="add" @click="${_ => this._onAddAddress()}" class="add-address" dense outlined>add</mwc-button></div>
                            <address-input .readonly="${!this.editing}" outlined fullWidth label="add address"></address-input>
                        </div>

                        <mwc-button ?hidden="${!this.editing}" @click="${_ => this._onDiscardChanges()}" class="discard-changes">cancel</mwc-button>
                        <mwc-button ?hidden="${!this.editing}" icon="save" @click="${_ => this._onSaveEdits()}" class="save-edits" unelevated>save changes</mwc-button>
                        <mwc-button ?hidden="${this.editing}" icon="edit" @click="${_ => this._onEditProfileClick()}" class="edit-profile">edit profile</mwc-button>
                        <mwc-button ?hidden="${this.editing}" icon="exit_to_app" @click="${_ => this._onSignOutClick()}" class="sign-out" unelevated>log out</mwc-button>
                        <snack-bar class="drawer" ?active="${this._snackbarOpened}">${this._snackbarMessage}</snack-bar>
                    </div>
            </app-drawer>

        `;
    }

    updated(changedProperties) {
        console.log('changed properties:', changedProperties)
        
        const uidUpdated = changedProperties.has('uid');
        const openedUpdated = changedProperties.has('opened');
        const editingUpdated = changedProperties.has('editing');
       
        if (uidUpdated && this.argsArray) {
            if (!this.uid) {
                if (this.user) this.user  = null;
                return;
            }
            console.log('args array:', this.argsArray);
            this.argsArray.forEach(argsObject => {
                var argsArr = argsObject.args
                this._firestoreUpdateBinding(argsObject.name, ...argsArr.map(x => this[x]))
            });
        }
       
        if (openedUpdated) {
            if (!this.opened) this.editing = false;
        }
       
        if (editingUpdated) {
            if (!this.editing) this._resetInputs();
            if (this.editing) this._fillInputs();
        }
    }

    _resetInputs() {
        this.shadowRoot.getElementById('userName').value = null;
        this.shadowRoot.getElementById('userEmail').value = null;
        this.shadowRoot.getElementById('userPhone').value = null;
    }

    _fillInputs() {
        if (this.user.name) {
            this.shadowRoot.getElementById('userName').value = this.user.name;
        }
        if (this.user.email) {
            this.shadowRoot.getElementById('userEmail').value = this.user.email;
        }
        if (this.user.phone) {
            this.shadowRoot.getElementById('userPhone').value = this.user.phone;
        }
    }

    _updateDrawerState(opened) {
        this.dispatchEvent(new CustomEvent('opened-changed', {detail: {opened: opened}}));
    }

    _onSignOutClick() {
        console.log('on sign out click...')
        firebase.auth().signOut();
        this.opened = false;
    }

    _onEditProfileClick() {
        if (!this.editing) this.editing = true;
    }

    _onDiscardChanges() {
        if (this.editing) this.editing = false;
    }

    _onSaveEdits() {
        console.log('save edits...')

        let name = this.shadowRoot.getElementById('userName').value;
        let email = this.shadowRoot.getElementById('userEmail').value;
        let phone = this.shadowRoot.getElementById('userPhone').value;
        
        let updates = {}
        if (name) {
            updates['name'] = name;
        }
        if (email) {
            updates['email'] = email.trim();
        }
        if (phone) {
            updates['phone'] = phone;
        }
        
        return firebase.firestore().doc(`users/${this.uid}`).update(updates).then(response => {
            this.openSnackbar('Your changes have been saved.')
            this.editing = false;
        });
    }

    _computeImageSrc(obj) {
        console.log('computing img src:', obj)
        return ((obj && obj.image) ? obj.image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
}

customElements.define('account-drawer', AccountDrawer);