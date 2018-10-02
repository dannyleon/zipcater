import {html} from '@polymer/lit-element';
import {PageViewElement} from '../page-view-element';
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import {SharedStyles} from '../../styles/shared-styles';
import {repeat} from 'lit-html/directives/repeat'
import '../../components/mwc-tab/mwc-tab'
import './single-item'

class MenuView extends FirestoreMixin(PageViewElement) {
    static get properties() {
        return {
            uid: String,
            selectedCategory: String,
            categories: Array,
            restaurant: {
                type: Object,
                doc: 'restaurants/{uid}',
                live: true
            },
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
                    grid-template-columns: repeat(auto-fill, 250px);
                }

                single-item {
                    background-color: var(--app-fill-color);
                }

                .header {
                    font-weight: 700;
                    font-size: 24px;
                }

                .restaurant-container {
                    display: flex;
                    align-items: center;
                    padding-bottom: 16px;
                }

                .restaurant-container img {
                    width: 250px;
                    height: 165px;
                    object-fit: cover;
                    border-radius: 5px;
                }

                .restaurant-details {
                    display: flex;
                    flex-direction: column;
                    margin-left: 8px;
                }

                .restaurant-details .name {
                    font-size: 40px;
                    font-family: 'Roboto Mono', monospace;
                    line-height: 1;
                }

                .restaurant-details .description {
                    font-size: 18px;
                }

                .restaurant-details .cuisine {
                    font-weight: 700;
                    font-style: italic;
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .category-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    margin-bottom: 16px;
                    border-top: 1px solid var(--app-border-color);
                    border-bottom: 1px solid var(--app-border-color);
                }
            </style>

            <div class="restaurant-container">
                <div class="image-container">
                    <img src="${this._computeImageSrc(this.restaurant)}">
                </div>
                <div class="restaurant-details">
                    <span class="name">${this.restaurant ? this.restaurant.name : ""}</span>
                    <span class="cuisine">${this.restaurant ? this.restaurant.cuisine : ""}</span>
                    <span class="description">${this.restaurant ? this.restaurant.description : ""}</span>
                </div>
            </div>
            
            <div class="category-toolbar">
                <div class="header">Menu</div>
                <nav class="category-tabs">
                    ${this.categories ? (repeat(this.categories, category => html `
                        <mwc-tab @click="${_ => this._onTabClick(category)}" selected="${this.selectedCategory === category}">${category}</mwc-tab>
                    `)) : ""}
                </nav>
            </div>

            <div class="grid-container">
                ${this.menu ? (repeat(this._filterMenu(this.menu, this.selectedCategory), (item) => html `
                    <single-item @click="${_ => this._onSingleItemClick(item, this.uid)}" 
                        .name="${item.name}"
                        .description="${item.description}"
                        .ingredients="${item.ingredients}"
                        .defaultOption="${item.defaultOption}"
                        .options="${item.options}">
                    </single-item>
                `)) : ""}
            </div>
        `;
    }
    
    updated(changedProperties) {
        console.log('changed properties:', changedProperties)
        const uidUpdated = changedProperties.has('uid');
        const menuUpdated = changedProperties.has('menu');
        const categoriesUpdated = changedProperties.has('categories');
        
        if (uidUpdated && this.argsArray) {
            console.log('args array:', this.argsArray);
            this.argsArray.forEach(argsObject => {
                var argsArr = argsObject.args
                this._firestoreUpdateBinding(argsObject.name, ...argsArr.map(x => this[x]))
            });
        }

        if (menuUpdated && this.menu) {
            this.categories = this._extractCategories(this.menu);
        }
        
        if (categoriesUpdated && this.categories) {
            if (!this.selectedCategory) this.selectedCategory = this.categories[0];
        }
    }

    _extractCategories(menu) {
        let categories = []
        menu.forEach(item => {
            if (!categories.includes(item.category)) categories.push(item.category);
        });
        return categories;
    }

    _onSingleItemClick(item, uid) {
        this.dispatchEvent(new CustomEvent('item-click', {detail: {item: item, uid: uid}}));
    }

    _onTabClick(category) {
        this.selectedCategory = category;
    }

    _computeImageSrc(obj) {
        return obj ? obj.image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    }

    _filterMenu(menu, query) {
        console.log('filtering menu...')
        console.log('menu:', menu)
        console.log('query:', query)
        return query ? menu.filter(item => item.category === query) : menu;
    }

}

customElements.define('menu-view', MenuView);