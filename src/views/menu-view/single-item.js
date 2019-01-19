import {LitElement, html} from 'lit-element';

class SingleItem extends LitElement {
    static get properties() {
        return {
            name: String,
            price: Number,
            images: String
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
                    cursor: pointer;
                    transition: box-shadow 0.2s;
                }

                :host(:hover) {
                    box-shadow: var(--app-card-shadow);
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

            <img src="${(this.images && this.images.length) ? this.images[0] : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='}">
            <div class="info-container">
                <div class="name">${this.name}</div>
                <div class="subtitle">${this.price}</div>
            </div>
        `;
    }

}

customElements.define('single-item', SingleItem);