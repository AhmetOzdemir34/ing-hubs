import { html, css } from 'lit';
import { StoreConnectedElement } from '../../stores/global-store';
import store from '../../stores/global-store';

export class EmployeeGrid extends StoreConnectedElement {
    static properties = {
        currentRoute: { type: String },
        showModal: { type: Boolean },
        deleteId: { type: Number | null }
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

    /* Modal Content */
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

    /* Buttons */
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
        this.showModal = false;
        this.deleteId = null;
    }

    openDeleteModal(id) {
        this.showModal = true;
        this.deleteId = id;
    }

    setPaginator(page) {
        store.setPaginator(page);
    }

    _save() {
        store.remove(this.deleteId);
        this.deleteId = null;
        this.showModal = false;
    }

    edit(id) {
        store.setEditingId(id);
    }

    render() {
        const { items, paginator, lang } = this.storeState;
        const itemsPerPage = 4;
        const startIndex = (paginator - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageItems = items.slice(startIndex, endIndex);
        
        // Toplam sayfa sayısını hesapla
        const totalPages = Math.ceil(items.length / itemsPerPage);
        return html`
            <div style="padding-top: 2rem;">
                <div class="flex justify-around items-center">
                ${currentPageItems.map(person => html`
                    <div class="w-single flex card" style="margin-bottom: 2rem;">
                        <div class="w-half">
                            <div style="padding-bottom: .8rem;">
                                <span style="font-weight: 300; color: gray; padding: 0; margin: 0;">${lang.first_name}:</span>
                                <p style="padding: 0; margin: 0;">${person.first_name}</p>
                            </div>
                            <div style="padding-bottom: .8rem;">
                                <span style="font-weight: 300; color: gray; padding: 0; margin: 0;">${lang.date_of_employment}:</span>
                                <p style="padding: 0; margin: 0;">${person.date_of_employment}</p>
                            </div>
                            <div style="padding-bottom: .8rem;">
                                <span style="font-weight: 300; color: gray; padding: 0; margin: 0;">${lang.phone}:</span>
                                <p style="padding: 0; margin: 0;">${person.phone}</p>
                            </div>
                            <div style="padding-bottom: .8rem;">
                                <span style="font-weight: 300; color: gray; padding: 0; margin: 0;">${lang.department}:</span>
                                <p style="padding: 0; margin: 0;">${person.department}</p>
                            </div>
                        </div>
                        <div class="w-half">
                            <div style="padding-bottom: .8rem;">
                                <span style="font-weight: 300; color: gray; padding: 0; margin: 0;">${lang.last_name}:</span>
                                <p style="padding: 0; margin: 0;">${person.last_name}</p>
                            </div>
                            <div style="padding-bottom: .8rem;">
                                <span style="font-weight: 300; color: gray; padding: 0; margin: 0;">${lang.date_of_birth}:</span>
                                <p style="padding: 0; margin: 0;">${person.date_of_birth}</p>
                            </div>
                            <div style="padding-bottom: .8rem;">
                                <span style="font-weight: 300; color: gray; padding: 0; margin: 0;">${lang.email}:</span>
                                <p style="padding: 0; margin: 0;">${person.email}</p>
                            </div>
                            <div style="padding-bottom: .8rem;">
                                <span style="font-weight: 300; color: gray; padding: 0; margin: 0;">${lang.position}:</span>
                                <p style="padding: 0; margin: 0;">${person.position}</p>
                            </div>
                        </div>
                        <div>
                            <button style="background-color: #8B5CF6; border: none; outline: none; border-radius: 4px;">
                                <div @click=${() => this.edit(person.id)} class="flex justify-center items-center">
                                    <img 
                                    src="./src/assets/white-edit.png" 
                                    class="action-icon"
                                    style="display: inline; width: 20px; height: 20px;"
                                    alt="Edit"
                                > <span style="color: white; padding: .4rem">${lang.edit}</span>
                                </div>
                            </button>
                            <button @click=${() => this.openDeleteModal(person.id)} style="background-color: #f97316; border: none; outline: none; border-radius: 4px;">
                                <div class="flex justify-center items-center">
                                    <img 
                                    src="./src/assets/white-trash.png" 
                                    class="action-icon"
                                    style="display: inline; width: 20px; height: 20px;"
                                    alt="Delete"
                                > <span style="color: white; padding: .4rem">${lang.delete}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    `)}
                </div>
            </div>
            ${this.showModal ? html`
                <div class="modal-overlay" @click=${this._closeModal}>
                  <div class="modal" @click=${(e) => e.stopPropagation()}>
                    <h3>${lang.are_you_sure}</h3>
                    <p>${lang.delete_message}</p>
                    
                    <div style="margin-top: 20px;">
                    <button style="width: 100%; padding: 12px; border: none; background-color: #f97316; color: white; border-radius: 8px;" @click=${this._save}>
                    ${lang.proceed}
                      </button>  
                    <button style="width: 100%; padding: 12px; border: 1px solid #8B5CF6; background-color: #f3f4f6; color: #8B5CF6; border-radius: 8px; margin-top: 10px;" @click=${this._closeModal}>
                    ${lang.cancel}
                    </button>
                    </div>
                  </div>
                </div>
              ` : ''}
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

    _closeModal() {
        this.showModal = false;
      }
}

customElements.define('employee-grid', EmployeeGrid);