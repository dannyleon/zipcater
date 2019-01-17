import {html} from 'lit-element';
import {PageViewElement} from '../page-view-element';
import {FirestoreMixin} from '../../mixins/firestore-mixin/firestore-mixin';
import {SharedStyles} from '../../styles/shared-styles';
import {repeat} from 'lit-html/directives/repeat'
import './single-restaurant'

class RestaurantsView extends FirestoreMixin(PageViewElement) {
    static get properties() {
        return {
            restaurants: {
                type: Array,
                collection: 'restaurants',
                live: true
            }
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

                single-restaurant {
                    background-color: var(--app-fill-color);
                }

                .header {
                    padding-top: 24px;
                }

                .promo-placeholder {
                    width: 100%;
                    height: 200px;
                    background-color: gray;
                    border-radius: 5px;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 768px) {
                    .grid-container {
                        grid-template-columns: repeat(auto-fill, 200px);
                    }

                    .promo-placeholder {
                        height: 150px;
                    }
                }

                @media (max-width: 460px) {
                    .grid-container {
                        grid-template-columns: repeat(1, 1fr);
                        grid-gap: 8px;
                    }
                }
            </style>

            <div class="promo-placeholder">promo placeholder</div>

            <div class="header">Categories</div>
            <div class="grid-container">
                ${this.restaurants ? (repeat(this.restaurants, (restaurant) => html `
                    <single-restaurant @click="${_ => this._onSingleRestaurantClick(restaurant)}" 
                        .name="${restaurant.name}"
                        .cuisine="${restaurant.cuisine}"
                        .image="${restaurant.image}">
                    </single-restaurant>
                `)) : ""}
            </div>
        `;
    }

    _onSingleRestaurantClick(restaurant) {
        this.dispatchEvent(new CustomEvent('restaurant-click', {detail: restaurant}))
    }

}

customElements.define('restaurants-view', RestaurantsView);