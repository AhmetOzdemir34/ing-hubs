import { html, css } from 'lit';
import { StoreConnectedElement } from '../../stores/global-store';
import store from '../../stores/global-store';
import './delete-modal';

export class HomePaginator extends StoreConnectedElement {
    static properties = {
        count: { type: Number }
    };

    static styles = css`
        :host {
            display: block;
            max-width: 1200px;
            margin: 0 auto;
            box-sizing: border-box;
        }

        .selected {
            color: white;
            border-radius: 50%;
            background-color: #f97316;
            height: 30px;
            width: 30px;
            text-align: center;
            padding-top: .2rem;
        }

        .justify-center {
            justify-content: center;
        }

        .orange {
            color: #f97316;
        }

        .pointer {
            cursor: pointer;
        }

        .ml {
            margin-left: 1rem;
        }

        .mr {
            margin-right: 1rem;
        }

        .flex {
            display: flex;
            flex-wrap: wrap;
        }

        .justify-around {
            justify-content: space-around;
        }

        .items-center {
            align-items: center;
        }

        .w-single {
            width: 83.333333%;
        }

        .w-half {
            width: 50%;
        }

        @media (min-width: 768px) {
            .w-single {
                width: 40%;
            }
        }
        
        .card {
            border: 1px solid #e5e7eb;
            box-shadow: 0 5px 3px rgba(0, 0, 0, 0.3);
            padding: 1rem;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal {
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .btn {
            padding: 10px 20px;
            margin: 5px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
        }

        .btn-primary {
            background: #8B5CF6;
            color: white;
        }

        .btn-primary:hover {
            background: #7C3AED;
        }

        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
    `;

    constructor() {
        super();
    }

    setPaginator(page) {
        store.setPaginator(page);
    }

    render() {
        const { items, paginator } = this.storeState;
        const totalPages = Math.ceil(items.length / this.count);

        return html`
            <div class="flex justify-center items-center">
                <span ?disabled=${paginator <= 1} class="orange pointer mr"
                    @click=${() => this.store.previous()}><</span>
                
                ${(paginator+1 > totalPages) && !(paginator-4 <= 0) ? html`
                    <span @click=${() => this.setPaginator(paginator-4)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${paginator-4}</span>
                `: ''}
                ${(paginator+2 > totalPages) && !(paginator-3 <= 0) ? html`
                    <span @click=${() => this.setPaginator(paginator-3)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${paginator-3}</span>
                `: ''}
                ${(paginator+3 > totalPages) && !(paginator-2 <= 0) ? html`
                    <span @click=${() => this.setPaginator(paginator-2)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${paginator-2}</span>
                `: ''}
                ${(paginator+4 > totalPages) && !(paginator-1 <= 0) ? html`
                    <span @click=${() => this.setPaginator(paginator-1)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${paginator-1}</span>
                `: ''}
                <span class="selected pointer">${paginator}</span>
                ${paginator+1 <= totalPages ? html`
                    <span @click=${() => this.setPaginator(paginator+1)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${paginator+1}</span>
                `: ''}
                ${paginator+2 <= totalPages ? html`
                    <span @click=${() => this.setPaginator(paginator+2)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${paginator+2}</span>
                `: ''}
                ${paginator+3 <= totalPages ? html`
                    <span @click=${() => this.setPaginator(paginator+3)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${paginator+3}</span>
                `: ''}
                ${paginator+4 <= totalPages ? html`
                    <span @click=${() => this.setPaginator(paginator+4)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${paginator+4}</span>
                `: ''}
                ${paginator+4 < totalPages ? html`
                    <span @click=${() => this.setPaginator(paginator+5)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">...</span>
                    <span @click=${() => this.setPaginator(totalPages)} class="orange pointer" style="padding-left: .5rem; padding-right: .5rem">${totalPages}</span>
                `: ''}
                <span ?disabled=${paginator >= totalPages} class="orange pointer ml"
                    @click=${() => this.store.next(totalPages)}>></span>
            </div>
        `;
    }
}

customElements.define('home-paginator', HomePaginator);