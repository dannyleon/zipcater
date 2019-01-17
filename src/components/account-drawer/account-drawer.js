import {html} from 'lit-element';
import {DrawerElement} from '../drawer-element'
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@material/mwc-button';
import '../../components/agave-textfield.js';
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import '../snack-bar';
import '../single-address';
import { repeat } from 'lit-html/directives/repeat';

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
            selectedAddress: Number,
            placeholderSelectedAddress: Number,
            argsArray: Array,
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
                .drawer-list {
                    box-sizing: border-box;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    /* background: linear-gradient(to right, white 50%, var(--app-dark-secondary-color) 50%); */
                    /* background-size: 200% 100%; */
                    /* background-position: left bottom; */
                    background: white;
                    transition: all 0.4s ease;
                    color: black;

                    display: flex;
                    flex-direction: column;
                    align-items: stretch;

                    text-align: start;
                }

                .scrollable {
                    height: calc(100% - 283px);
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                /* :host([editing]) .drawer-list {
                    background-position: right bottom;
                    color: white;
                } */

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

                .delivery-details {
                    padding: 0 16px;
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

                :host([editing]) .header, :host([editing]) .address-header {
                    color: var(--app-dark-secondary-color);
                }

                .address-header {
                    margin-bottom: 8px;
                    height: 32px;
                }

                address-input {
                    margin: 8px 0;
                }

                agave-textfield.details {
                    margin-top: 8px;
                }

                mwc-button {
                    --mdc-theme-primary: var(--app-dark-secondary-color);
                }

                mwc-button.edit-profile, mwc-button.discard-changes {
                    margin-top: auto;
                }

                mwc-button.add-address {
                    --mdc-theme-primary: black;
                }

                single-address {
                    margin: 4px 0;
                }

                [hidden] {
                    display: none;
                }
            </style>

            <app-drawer align="end" disable-swipe .opened="${this.opened}"
                @opened-changed="${e => this._updateDrawerState(e.target.opened)}">
                    <div class="drawer-list">
                        <div class="image-container">
                            <img src="${this._computeImageSrc(this.user)}">
                        </div>

                        <div class="scrollable">
                            <div class="account-details">
                                <div class="header">${this.editing ? 'Edit account details' : 'Account details'}</div>
                                <agave-textfield id="userName" ?readonly="${!this.editing}" label="name" class="details" placeholder="${(this.user && this.user.name) ? this.user.name : "add name"}"></agave-textfield>
                                <agave-textfield type="email" id="userEmail" ?readonly="${!this.editing}" label="email" class="details" placeholder="${(this.user && this.user.email) ? this.user.email : "add email"}"></agave-textfield>
                                <agave-textfield type="tel" id="userPhone" ?readonly="${!this.editing}" label="phone" class="details" placeholder="${(this.user && this.user.phone) ? this.user.phone : "add phone"}"></agave-textfield>
                            </div>

                            <div class="delivery-details">
                                <div class="address-header">${this.editing ? 'Edit saved addresses' : 'Saved addresses'}<mwc-button ?hidden="${this.editing}" icon="add" @click="${_ => this._onAddAddress()}" class="add-address" dense outlined>add</mwc-button></div>
                                ${(this.user && this.user.savedAddresses) ? 
                                    (repeat(this.user.savedAddresses, (curAddress, index) => 
                                        html `<single-address ?selected="${this.editing ? this.selectedAddress === index : this.user.selectedAddress === index}" @address-click="${_ => this._onSingleAddressClick(curAddress, index)}" @delete-address="${_ => this._deleteSingleAddress(curAddress, index)}" ?editing="${this.editing}" .address="${curAddress}"></single-address>`)) : ''}
                                <single-address empty ?hidden="${this.user && this.user.savedAddresses && this.user.savedAddresses.length}"></single-address>
                            </div>
                        </div>                        

                        <mwc-button ?hidden="${!this.editing}" @click="${_ => this._onDiscardChanges()}" class="discard-changes">cancel</mwc-button>
                        <mwc-button ?hidden="${!this.editing}" icon="save" @click="${_ => this._onSaveEdits()}" class="save-edits" unelevated>${this.waiting ? 'saving...' : 'save changes'}</mwc-button>
                        <mwc-button ?hidden="${this.editing}" icon="edit" @click="${_ => this._onEditProfileClick()}" class="edit-profile">edit profile</mwc-button>
                        <mwc-button ?hidden="${this.editing}" icon="exit_to_app" @click="${_ => this._onSignOutClick()}" class="sign-out" unelevated>log out</mwc-button>
                        <snack-bar class="drawer" ?active="${this._snackbarOpened}">${this._snackbarMessage}</snack-bar>
                    </div>
            </app-drawer>

        `;
    }

    _onAddAddress() {
        this.dispatchEvent(new CustomEvent('create-address', {detail: {uid: this.uid}}));
    }

    _onSingleAddressClick(address, idx) {
        if (!this.editing) return;
        console.log('on single single address click:', address, idx)
        this.placeholderSelectedAddress = idx;
        this.selectedAddress = idx;
    }

    _deleteSingleAddress(address, idx) {
        console.log('deleting single address click:', address, idx)
        this.dispatchEvent(new CustomEvent('confirm-deletion', {detail: {data: {value: address, index: idx}, type: 'address'}}));
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
        this.selectedAddress = null;
        this.placeholderSelectedAddress = null;
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
        if (this.user.selectedAddress >= 0) {
            this.selectedAddress = this.user.selectedAddress;
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

        if (this.waiting) return;

        this.waiting = true;

        let name = this.shadowRoot.getElementById('userName').value;
        let email = this.shadowRoot.getElementById('userEmail').value;
        let phone = this.shadowRoot.getElementById('userPhone').value;
        let selectedAddress = this.placeholderSelectedAddress;
        
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
        if (selectedAddress >= 0) {
            updates['selectedAddress'] = selectedAddress;
        }
        
        return firebase.firestore().doc(`users/${this.uid}`).update(updates).then(response => {
            this.openSnackbar('Your changes have been saved.')
            this.editing = false;
        }).catch(err => {
            console.log('err', err);
            this.openSnackbar('Unable to save changes, please refresh and try again.')
        }).then( () => {
            this.waiting = false;
        });
    }

    _computeImageSrc(obj) {
        console.log('computing img src:', obj)
        return ((obj && obj.image) ? obj.image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
}

customElements.define('account-drawer', AccountDrawer);