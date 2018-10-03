/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

//Legacy polymer-element components, replace ASAP
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

// These are the elements needed by this element.
import { profileIcon, cartIcon } from './my-icons.js';
import './components/snack-bar.js';
import '@material/mwc-fab';
import { ButtonSharedStyles } from './styles/button-shared-styles.js';
import './components/sign-in-drawer/sign-in-drawer';
import './components/account-drawer/account-drawer';
import './dialogs/create-account-dialog/create-account-dialog';

class MyApp extends LitElement {
  render() {
    const {_page, _snackbarOpened, _offline, _signInDrawerOpened, _accountDrawerOpened, signedIn, user} = this;
    // Anything that's related to rendering should be done in here.
    return html`
    ${ButtonSharedStyles}
    <style>
      :host {
        --app-drawer-width: 320px;
        display: block;

        --app-primary-color: #fafafa;
        --app-light-primary-color: #ffffff;
        --app-dark-primary-color: #c7c7c7;
        --app-secondary-color: #d50000;
        --app-light-secondary-color: #ff5131;
        --app-dark-secondary-color: #9b0000;
        --app-tertiary-color: #FF9100;
        --app-dark-tertiary-color: #c56200;
        --app-light-text-color: #ffffff;
        --app-dark-text-color: #000000;
        --app-fill-color: #EEEEEE;

        --app-section-even-color: #f7f7f7;
        --app-section-odd-color: white;

        --app-border-color: var(--app-dark-primary-color);

        --app-header-background-color: var(--app-primary-color);
        --app-header-text-color: var(--app-dark-text-color);
        --app-header-selected-color: var(--app-secondary-color);

        --app-footer-background-color: #293237;
        --app-footer-text-color: var(--app-light-text-color);

        --app-button-background-color: var(--app-tertiary-color);
      }

      app-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color);
        border-bottom: 1px solid #eee;
      }

      .toolbar-top {
        background-color: var(--app-header-background-color);
      }

      .main-title {
        margin-right: auto;
      }

      .main-title button {
        font-family: 'Open Sans';
        text-transform: lowercase;
        font-size: 24px;
        text-align: start;
        color: var(--app-secondary-color);
      }

      .main-title .left {
        font-weight: 300;
      }

      .main-title .right {
        font-weight: 800;
      }

      /* Workaround for IE11 displaying <main> as inline */
      main {
        display: block;
      }

      .main-content {
        padding-top: 64px;
        min-height: calc(100vh - 64px);
      }

      .page {
        display: none;
      }

      .page[active] {
        display: block;
      }

      footer {
        padding: 4px;
        background: var(--app-footer-background-color);
        color: var(--app-footer-text-color);
        text-align: center;
      }

      .profile-icon svg {
        height: 32px;
        width: 32px;
      }

      mwc-fab {
        --mdc-theme-secondary: var(--app-secondary-color);
        position: fixed;
        bottom: 16px;
        right: 16px;
      }

      /* Wide layout: when the viewport width is bigger than 460px, layout
      changes to a wide layout. */
      @media (min-width: 460px) {
      }
    </style>

    <!-- Header -->
    <app-header condenses reveals effects="waterfall">
      <app-toolbar class="toolbar-top">
        <div class="main-title">
          <button @click="${_ => this._homeButtonClick()}">
            <span class="left">nine2five</span><span class="right">catering</span>
          </button>
        </div>
        <button @click="${_ => this._updateDrawerState(true, signedIn)}" class="profile-icon">${profileIcon}</button>
      </app-toolbar>
    </app-header>

    <sign-in-drawer 
      @opened-changed="${e => this._updateDrawerState(e.detail.opened, signedIn)}"
      @create-account="${e => this._openCreateAccountDialog()}" 
      .opened="${_signInDrawerOpened}">
    </sign-in-drawer>

    <account-drawer 
      @opened-changed="${e => this._updateDrawerState(e.detail.opened, signedIn)}"
      .opened="${_accountDrawerOpened}"
      .user="${user}">
    </account-drawer>

    <!-- Main content -->
    <main role="main" class="main-content">
      <restaurants-view class="page" ?active="${_page === 'restaurants'}" @restaurant-click="${e => this._onRestaurantClick(e.detail)}"></restaurants-view>
      <menu-view id="menu" class="page" ?active="${_page === 'menu'}" @item-click="${e => this._onItemClick(e.detail.item, e.detail.uid)}"></menu-view>
      <item-view id="item" class="page" ?active="${_page === 'item'}"></item-view>
      <error-view class="page" ?active="${_page === 'error'}"></error-view>
    </main>
    
    <create-account-dialog id="createAccountDialog"></create-account-dialog>

    <mwc-fab ?hidden="${this._signInDrawerOpened}">${cartIcon}</mwc-fab>

    <snack-bar ?active="${_snackbarOpened}">
        You are now ${_offline ? 'offline' : 'online'}.</snack-bar>
    `;
  }

  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean },
      _signInDrawerOpened: { type: Boolean },
      _accountDrawerOpened: { type: Boolean },
      user: {type: Object},
      signedIn: {type: Boolean}
    }
  }

  constructor() {
    super();
    this._signInDrawerOpened = false;
    this._accountDrawerOpened = false;
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);

    firebase.auth().onAuthStateChanged(user => {
      console.log('on auth state changed:', user)
      if (user) {
        let userDetails = {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
        this.user = userDetails;
        this.signedIn = true;
      } else {
        this.user = {};
        this.signedIn = false;
      }
    });
  }

  firstUpdated() {
    installRouter((location) => this._locationChanged(location));
    installOfflineWatcher((offline) => this._offlineChanged(offline));
    installMediaQueryWatcher(`(min-width: 460px)`,
        (matches) => this._layoutChanged(matches));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _layoutChanged(isWideLayout) {
    // The drawer doesn't make sense in a wide layout, so if it's opened, close it.
    this._updateDrawerState(false, this.signedIn);
  }

  _offlineChanged(offline) {
    const previousOffline = this._offline;
    this._offline = offline;

    // Don't show the snackbar on the first load of the page.
    if (previousOffline === undefined) {
      return;
    }

    clearTimeout(this.__snackbarTimer);
    this._snackbarOpened = true;
    this.__snackbarTimer = setTimeout(() => { this._snackbarOpened = false }, 3000);
  }

  _locationChanged() {
    const path = window.decodeURIComponent(window.location.pathname);
    const splitPath = path.split('/');
    var page;

    let mainPage = splitPath[1];
    let uid = splitPath[2];
    let subPage = splitPath[3];
    let iid = splitPath[4];

    const payload = {
      uid: uid,
      iid: iid
    }
    
    if (path === '/') {
      page = 'restaurants';
    } else if (iid) {
      page = 'item';
    } else if (subPage) {
      page = subPage;
    } else {
      page = mainPage;
    }
    
    this._loadPage(page, payload);
  }

  _updateDrawerState(opened, signedIn) {
    if (!signedIn) {
      if (opened !== this._signInDrawerOpened) {
        this._signInDrawerOpened = opened;
      }
    } else {
        if (opened !== this._accountDrawerOpened) {
          this._accountDrawerOpened = opened;
        }
    }
  }

  _loadPage(page, payload) {
    switch(page) {
      case 'restaurants':
        import('./views/restaurants-view/restaurants-view.js').then((module) => {
          // Put code in here that you want to run every time when
          // navigating to view1 after my-view1.js is loaded.
        });
        break;
      case 'menu':
        import('./views/menu-view/menu-view.js').then((module) => {
          this.shadowRoot.querySelector('#menu').uid = payload.uid;
        });
        break;
      case 'item':
        import('./views/item-view/item-view.js').then((module) => {
          var itemElement = this.shadowRoot.querySelector("#item");
          itemElement.uid = payload.uid;
          itemElement.iid = payload.iid;
        });
        break;
      default:
        page = 'error';
        import('./views/error-view/error-view.js');
    }
    this._page = page;
  }

  _onRestaurantClick(restaurant) {
    console.log('on restaurant click event:', restaurant);
    window.history.pushState({}, '', `/restaurants/${restaurant.__id__}/menu`);
    this._locationChanged();
  }

  _onItemClick(item, uid) {
    console.log('on item click event:', item);
    window.history.pushState({}, '', `/restaurants/${uid}/menu/${item.__id__}`);
    this._locationChanged();
  }

  _homeButtonClick() {
    console.log('home button click event...');
    window.history.pushState({}, '', '/');
    this._locationChanged();
  }

  _openCreateAccountDialog() {
    console.log('create account event...');
    this.shadowRoot.querySelector('#createAccountDialog').show();
    // import('./dialogs/create-account-dialog/create-account-dialog.js').then((module) => {
    //   console.log('create-account-dialog imported:', module)
    //   this.shadowRoot.querySelector('#createAccountDialog').show();
    // }).catch((err) => {
    //   console.log('err importing create-account-dialog:', err)
    // });
  }
}

window.customElements.define('my-app', MyApp);
