import {LitElement, html} from '@polymer/lit-element';

class SingleRestaurant extends LitElement {
    static get properties() {
        return {
            name: String,
            cuisine: String,
            image: String
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
                :host {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    width: 250px;
                    border-radius: 5px;
                    overflow: hidden;
                }

                img {
                    width: 250px;
                    height: 165px;
                    object-fit: cover;
                }

                .info-container {
                    margin: 8px;
                }

                .name {
                    font-size: 20px;
                }

                .subtitle {
                    font-size: 12px;
                    font-weight: 300;
                }

                @media (max-width: 768px) {
                    :host {
                        width: 200px;
                    }

                    img {
                        width: 200px;
                        height: 135px;
                    }

                    .name {
                        font-size: 16px;
                    }

                    .subtitle {
                        font-size: 10px;
                    }
                }

                @media (max-width: 460px) {
                    :host {
                        width: 100%;
                    }

                    img {
                        width: 100%;
                    }
                }
            </style>

            <img src="${this.image}">
            <div class="info-container">
                <div class="name">${this.name}</div>
                <div class="subtitle">${this.cuisine}</div>
            </div>
        `;
    }

}

customElements.define('single-restaurant', SingleRestaurant);