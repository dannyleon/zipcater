import {html} from 'lit-element';
import {PageViewElement} from '../page-view-element';
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import {SharedStyles} from '../../styles/shared-styles';
import {repeat} from 'lit-html/directives/repeat';
import '../../components/mwc-tabs/mwc-tab';
import './single-item';

class MenuView extends FirestoreMixin(PageViewElement) {
    static get properties() {
        return {
            uid: String,
            selectedCategory: String,
            categories: Array,
            restaurant: {
                type: Object,
                doc: 'categories/{uid}',
                live: true
            },
            menu: {
                type: Array,
                collection: 'categories/{uid}/products',
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
                    text-transform: capitalize;
                }

                .restaurant-details .description {
                    font-size: 18px;
                    margin-top: 12px;
                }

                .restaurant-details .cuisine {
                    font-weight: 300;
                    margin-bottom: 12px;
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

                .category-tabs {
                    display: flex;
                    align-items: center;
                    overflow-x: auto;
                }

                @media (max-width: 768px) {
                    .restaurant-details .name {
                        font-size: 32px;
                    }

                    .restaurant-container img {
                        width: 200px;
                        height: 135px;
                    }

                    .restaurant-details .description {
                        font-size: 14px;
                    }

                    .restaurant-details .cuisine {
                        font-size: 12px;
                    }

                    single-item {
                        font-size: 14px;
                    }

                    mwc-tab {
                        --mdc-tab-font-size: 12px;
                    }
                }

                @media (max-width: 460px) {
                    .restaurant-container {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .restaurant-container img {
                        width: 100%;
                    }

                    .category-tabs {
                        flex: 1;
                        justify-content: space-around;
                    }

                    .grid-container {
                        grid-template-columns: repeat(1, 1fr);
                        grid-gap: 8px;
                    }
                }
            </style>

            <div class="restaurant-container">
                <div class="image-container">
                    <img src="${this._computeImageSrc(this.restaurant)}">
                </div>
                <div class="restaurant-details">
                    <span class="name">${this.restaurant ? this.restaurant.name : ""}</span>
                    <span class="description">${this.restaurant ? this.restaurant.description : ""}</span>
                </div>
            </div>
            
            <div class="category-toolbar">
                <div class="header">Products</div>
            </div>

            <div class="grid-container">
                ${this.menu ? (repeat(this.menu, (item) => html `
                    <single-item @click="${_ => this._onSingleItemClick(item, this.uid)}" 
                        .name="${item.name}"
                        .price="${item.price}"
                        .images="${item.images}"
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