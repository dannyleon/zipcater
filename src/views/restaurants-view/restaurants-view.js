import {html} from '@polymer/lit-element';
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
                    font-weight: 700;
                    font-size: 24px;
                    padding-top: 24px;
                }

                .promo-placeholder {
                    width: 100%;
                    height: 200px;
                    background-color: gray;
                }
            </style>

            <div class="promo-placeholder"></div>

            <div class="header">Restaurants</div>
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