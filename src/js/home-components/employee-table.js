import { html, css } from 'lit';
import { StoreConnectedElement } from '../../stores/global-store';
import store from '../../stores/global-store';
import './delete-modal';
import './home-paginator';

export class EmployeeTable extends StoreConnectedElement {
    static properties = {
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

        const { items } = this.storeState;
        const checkedItems = items.filter(item => item.checked);
        const selectAllCheckbox = this.shadowRoot.getElementById("selectAll");
        
        if (checkedItems.length === 0) {
            selectAllCheckbox.checked = false;
        } else if (checkedItems.length === items.length) {
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.checked = false;
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
            ${this.showModal ? html`<delete-modal @save-modal=${this._save} @close-modal=${this._closeModal}></delete-modal>` : ''}
            <home-paginator count=${itemsPerPage}></home-paginator>
        `;
    }

    _closeModal() {
        this.showModal = false;
      }
}

customElements.define('employee-table', EmployeeTable);