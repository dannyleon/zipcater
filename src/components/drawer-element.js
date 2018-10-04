import {LitElement} from '@polymer/lit-element';

export class DrawerElement extends LitElement {
    static get properties() {
        return {
            opened: Boolean,
            _snackbarOpened: Boolean,
            _snackbarMessage: String,
        }
    }

    openSnackbar(msg) {
        clearTimeout(this.__snackbarTimer);
        this._snackbarMessage = msg;
        this._snackbarOpened = true;
        this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
    }

}