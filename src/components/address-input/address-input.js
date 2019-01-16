import {LitElement, html} from 'lit-element';
import '../agave-textfield.js';
import {default as loadGoogleMapsApi} from 'load-google-maps-api';
import { repeat } from 'lit-html/directives/repeat';

class AddressInput extends LitElement {
    static get properties() {
        return {
            label: String,
            address: String,
            addressObject: Object,
            geocoder: Object,
            predictions: Array,
            didSelectPrediction: Boolean,
            outlined: Boolean,
            fullWidth: Boolean,
            readonly: Boolean
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
                    display: block;
                }

                .predictions-container {
                    position: absolute;
                    background-color: white;
                    color: black;
                    z-index: 1;
                    border-radius: 3px;
                    border: 1px solid var(--app-border-color);
                    width: calc(100% - 48px);
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                }

                .predictions-container div {
                    cursor: pointer;
                    position: relative;
                    white-space: nowrap; 
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding: 8px 12px;
                    font-size: 14px;
                    border-top: 1px solid var(--app-border-color);
                }

                .predictions-container div:hover {
                    background-color: var(--app-dark-primary-color);
                }

                .predictions-container:first-of-type {
                    border-top: none;
                }

                mwc-textfield {
                    --mdc-theme-primary: black;
                    --mdc-label-color: black;
                    --mdc-outlined-color: rgba(0, 0, 0, 0.24);
                    --mdc-outlined-hover-color: rgba(0, 0, 0, 0.87);
                    --mdc-font-family: 'Open Sans', sans-serif;
                }
            </style>

            <agave-textfield @input-change="${e => this.geocodeAddress(e.detail)}" type="text" id="input" labelAlwaysFloat label="${this.label}" ?readonly="${this.readonly}" outlined="${this.outlined}" fullWidth="${this.fullWidth}" .value="${this.address}"></agave-textfield>
            <div ?hidden="${!this.predictions || !this.predictions.length}" class="predictions-container">
                ${this.predictions ? repeat(this.predictions, (prediction) => html `<div @click="${ _ => this._onSinglePredictionClick(prediction)}">${prediction.description}</div>`) : ''}
            </div>

            
        `;
    }

    /**
      * Instance of the element is created/upgraded. Useful for initializing
      * state, set up event listeners, create shadow dom.
      * @constructor
      */
    constructor() {
        super();
        this.address = "";
        this.label = "";
    }

    _onSinglePredictionClick(prediction) {
        console.log('single prediction click:', prediction)
        this.address = prediction.description;
        this.addressObject = {
            main: prediction.structured_formatting.main_text,
            secondary: prediction.structured_formatting.secondary_text
        }
        this.didSelectPrediction = true;
        this.predictions = [];
    }
    
    firstUpdated() {
        if (!this.geocoder) this.initGeocoder();
    }

    reset() {
        this.shadowRoot.getElementById('input').value = null;
    }

    initGeocoder() {
        const options = {
            key: 'AIzaSyDTjf7otOimiuCvCNUGTU_trStez72dLbI',
            libraries: ['places']
        };
        loadGoogleMapsApi(options).then(googleMaps => {
            console.log('google maps api loaded!')
            this.geocoder = new googleMaps.places.AutocompleteService();
        });
    }

    geocodeAddress(address) {
        console.log('geocoding address:', address)
        this.dispatchEvent(new CustomEvent('address-change', {detail: {value: address}}));
        if (this.didSelectPrediction) {
            this.didSelectPrediction = false;
            return;
        }
        if (!address || !this.geocoder) {
            this.predictions = [];
            return;
        };
        let geocoderRequest = {
            input: address,
            options: {
                types: ['address']
            }
        }
        this.geocoder.getQueryPredictions(geocoderRequest, (predictions, status) => {
            console.log('prediction:', predictions)
            if (status === 'OK') this.predictions = (predictions ? [...predictions] : []);
            if (status !== 'OK') {
                this.predictions = [];
            }
        });
    }

    resetValues() {
        this.address = null;
        this.addressObject = null;
        this.predictions = [];
    }
}

customElements.define('address-input', AddressInput);