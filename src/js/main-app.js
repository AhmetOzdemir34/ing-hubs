import { html, css } from 'lit';
import '../stores/global-store.js';
import './home-page.js';
import './add-new-page.js';
import store, { StoreConnectedElement } from '../stores/global-store.js';
import { Router } from '@vaadin/router';

const router = new Router(document.querySelector('#outlet'));
router.setRoutes([
    { path: '/', component: 'home-page' },
    { path: '/add-new', component: 'add-new-page' },
]);

export class MainApp extends StoreConnectedElement {
    static properties = {};

    static styles = css`
        :host {
            display: block;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .bg-white {
            background-color: #ffffff;
        }

        .rounded-lg {
            border-radius: 0.5rem;
        }

        .shadow-lg {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .p-2 {
            padding: 0.5rem;
        }

        .p-6 {
            padding: 1.5rem;
        }

        .flex {
            display: flex;
        }

        .justify-between {
            justify-content: space-between;
        }

        .items-center {
            align-items: center;
        }

        .inline {
            display: inline;
        }

        .w-32 {
            width: 32px;
        }

        .h-32 {
            height: 32px;
        }

        .w-20 {
            width: 20px;
        }

        .h-20 {
            height: 20px;
        }

        .w-28 {
            width: 28px;
        }

        .ml-4 {
            margin-left: 1rem;
        }

        .ml-2 {
            margin-left: 0.5rem;
        }

        .ml-6 {
            margin-left: 1.5rem;
        }

        .px-nav {
            padding-left: 1rem;
            padding-right: 1rem;
        }

        .py-nav {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        .rounded {
            border-radius: 0.25rem;
        }

        .bg-blue-800 {
            background-color: #1e40af;
        }

        .bg-blue-500 {
            background-color: #3b82f6;
        }

        .bg-blue-500:hover {
            background-color: #1d4ed8;
        }

        .transition-colors {
            transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 150ms;
        }

        .text-orange-500 {
            color: #f97316;
        }

        .font-light {
            font-weight: 300;
        }

        .pb-1 {
            padding-bottom: 0.25rem;
        }

        button {
            cursor: pointer;
            border: none;
        }

        .bg-none {
            background-color: transparent;
        }

        .text-orange-300 {
            color: #fdba74;
        }

        @media (max-width: 480px) {
            .px-nav {
            padding-left: 0rem;
            padding-right: 0rem;
        }

        .py-nav {
            padding-top: 0.3rem;
            padding-bottom: 0.3rem; 
        }
        }
    `;

    constructor() {
        super();
    }

    navigate(route) {
        if (route === 'home') {
            Router.go("/");
        } else {
            Router.go("/add-new");
        }
    }

    setLanguage(lng) {        
        store.setLanguage(lng);
    }

    render() {
        const { lang } = this.storeState;
        return html`
            <div class="bg-white" style="width: 100%;">
                <nav class="p-2 flex justify-between">
                    <div class="flex items-center">
                        <img src="./src/assets/image002.png" alt="no-image" class="inline w-32 h-32">
                        <span class="ml-4">ING</span>
                    </div>
                    <div class="flex items-center">
                        <button @click="${() => this.navigate('home')}" class="px-nav py-nav bg-none">
                            <div class="${this.currentRoute === 'home' ? 'text-orange-300' : 'text-orange-500'} font-light flex items-center">
                                <span class="ml-2">${lang.employees}</span>
                            </div>
                        </button>
                        <button @click="${() => this.navigate('add-new')}" class="px-nav py-nav rounded bg-none">
                            <div class="ml-6 ${this.currentRoute === 'add-new' ? 'text-orange-300' : 'text-orange-500'} font-light flex items-center">
                                <span class="ml-2">${lang.add_new}</span>
                            </div>
                        </button>
                        <div class="ml-6">
                                <img @click=${() => this.setLanguage('tr')} src="./src/assets/Flag_of_Turkey.svg.png" alt="no-image" class="w-28 h-20" style="padding-top: 0.5rem">
                                <img @click=${() => this.setLanguage('en')} src="./src/assets/Flag_of_the_United_Kingdom.svg" alt="no-image" class="w-28 h-20" style="padding-top: 0.5rem">
                        </div>
                    </div>
                </nav>
                <div class="p-6">
                    <div id="outlet"></div>
                </div>
            </div>
        `;
    }
}

customElements.define('main-app', MainApp);