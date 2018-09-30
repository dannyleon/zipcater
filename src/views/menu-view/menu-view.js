import {html} from '@polymer/lit-element';
import {PageViewElement} from '../page-view-element';
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import {SharedStyles} from '../../styles/shared-styles';
import {repeat} from 'lit-html/directives/repeat'
import './single-item'

class MenuView extends FirestoreMixin(PageViewElement) {
    static get properties() {
        return {
            uid: String,
            menu: {
                type: Array,
                collection: 'restaurants/{uid}/menu',
                live: true
            },
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
            ${SharedStyles}
            <style>
                .grid-container {
                    display: grid;
                    grid-gap: 16px;
                    grid-template-columns: repeat(auto-fill, 300px);
                }

                single-item {
                    background-color: var(--app-fill-color);
                }

                .header {
                    font-weight: 700;
                    font-size: 28px;
                    padding-top: 8px;
                }

                .offset-header {
                    padding-top: 24px;
                }
            </style>

            <div class="header">Menu</div>
            <div class="grid-container">
                ${this.menu ? (repeat(this.menu, (item) => html `
                    <single-item @click="${_ => this._onSingleItemClick(item)}" 
                        .name="${item.name}">
                    </single-item>
                `)) : ""}
            </div>
            
        `;
    }

    updated(changedProperties) {
        const uidUpdated = changedProperties.has('uid');
        if (uidUpdated && this.argsArray) {
            this.argsArray.forEach(argsObject => {
                var argsArr = argsObject.args
                this._firestoreUpdateBinding(argsObject.name, ...argsArr.map(x => this[x]))
            });
        }
    }

    _onSingleItemClick(item) {
        this.dispatchEvent(new CustomEvent('item-click', {detail: item}));
    }

}

customElements.define('menu-view', MenuView);