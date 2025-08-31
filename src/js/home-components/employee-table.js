import { html, css } from 'lit';
import { StoreConnectedElement } from '../../stores/global-store';
import store from '../../stores/global-store';

export class EmployeeTable extends StoreConnectedElement {
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

        .flex {
            display: flex;
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

        .items-center {
            align-items: center;
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

        table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
}

th {
    padding: 12px 8px;
    text-align: left;
    font-weight: 400;
    color: #f97316;
    border-bottom: 1px solid #e5e7eb;
}

th:first-child {
    width: 40px;
    text-align: center;
}

input[type="checkbox"] {
    cursor: pointer;
}

tr td {
    padding-top: .8rem;
    padding-bottom: .8rem;
}

/* Responsive - sadece yatay scroll */
.table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
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

    handleSelectAll(e) {
        const { items } = this.storeState;

        items.forEach(item => {                
            this.store.update(item.id, { checked: e.target.checked });
        });
        this.requestUpdate();
    }

    toggleSelect(e, id) {
        this.store.update(id, { checked: e.target.checked });
        this.requestUpdate();

        // Tüm checkbox'ları kontrol et
        const { items } = this.storeState;
        const checkedItems = items.filter(item => item.checked);
        const selectAllCheckbox = this.shadowRoot.getElementById("selectAll");
        
        if (checkedItems.length === 0) {
            // Hiçbiri seçili değilse
            selectAllCheckbox.checked = false;
            //selectAllCheckbox.indeterminate = false;
        } else if (checkedItems.length === items.length) {
            // Hepsi seçiliyse
            selectAllCheckbox.checked = true;
            //selectAllCheckbox.indeterminate = false;
        } else {
            // Bazıları seçiliyse (indeterminate state)
            selectAllCheckbox.checked = false;
            //selectAllCheckbox.indeterminate = true;
        }
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
        const itemsPerPage = 9;
        const startIndex = (paginator - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageItems = items.slice(startIndex, endIndex);
        
        // Toplam sayfa sayısını hesapla
        const totalPages = Math.ceil(items.length / itemsPerPage);

        const checkedCount = items.filter(item => item.checked).length;
        const allChecked = checkedCount === items.length && items.length > 0;
        
        return html`
            <div class="table-container" style="padding-top: 2rem;">
                <table>
                    <thead>
                        <tr>
                            <th>
                                <input @change=${(e) => this.handleSelectAll(e)} type="checkbox" id="selectAll" ?checked=${allChecked}>
                            </th>
                            <th>${lang.first_name}</th>
                            <th>${lang.last_name}</th>
                            <th>${lang.date_of_employment}</th>
                            <th>${lang.date_of_birth}</th>
                            <th>${lang.phone}</th>
                            <th>${lang.email}</th>
                            <th>${lang.department}</th>
                            <th>${lang.position}</th>
                            <th>${lang.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${currentPageItems.map(person => html`
                        <tr style="text-align: center; font-size: 14px;" class="py-2">
                          <td>
                            <input class="checkboxes"
                              type="checkbox" 
                              .checked=${person.checked}
                              @change=${(e) => this.toggleSelect(e, person.id)}
                            >
                          </td>
                          <td>${person.first_name}</td>
                          <td>${person.last_name}</td>
                          <td>${person.date_of_employment}</td>
                          <td>${person.date_of_birth}</td>
                          <td>${person.phone}</td>
                          <td>${person.email}</td>
                          <td>${person.department}</td>
                          <td>${person.position}</td>
                          <td class="flex justify-center items-center">
                            <img 
                              @click=${() => this.edit(person.id)}  
                              src="./src/assets/edit.png" 
                              class="action-icon"
                              style="display: inline"
                              alt="Edit"
                            >
                            <img 
                              @click=${() => this.openDeleteModal(person.id)}
                              src="./src/assets/trash.png" 
                              class="action-icon pointer"
                              style="display: inline"
                              alt="Delete"
                            >
                          </td>
                        </tr>
                      `)}
                    </tbody>
                </table>
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

customElements.define('employee-table', EmployeeTable);