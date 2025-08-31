import { html, css } from 'lit';
import './home-components/employee-table';
import './home-components/employee-grid';
import './home-components/edit-form';
import { StoreConnectedElement } from '../stores/global-store';
import store from '../stores/global-store';

export class HomePage extends StoreConnectedElement {
    static properties = {
        viewMode: { type: String }
    };

    static styles = css`
        :host {
            display: block;
            max-width: 1200px;
            margin: 0 auto;
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

        .text-orange-500 {
            color: #f97316;
        }

        .pointer {
            cursor: pointer;
        }

        .f-size {
            font-size: 36px;
        }

        .icon-size {
            width: 36px;
            height: 36px;
        }

        @media (max-width: 480px) {
            .f-size {
                font-size: 24px;
            }
                .icon-size {
                width: 24px;
                height: 24px;
            }
        }
    `;

    constructor() {
        super();
        this.viewMode = 'table';
    }

    setGridMode() {
        this.viewMode = 'grid';
        store.setPaginator(1);
    }

    setTableMode() {
        this.viewMode = 'table';
        store.setPaginator(1);
    }

    renderViewComponent() {        
        return this.viewMode === 'table' ? html`<employee-table></employee-table>` : html`<employee-grid></employee-grid>`;
    }

    render() {
        const { editingId, lang } = this.storeState;

        return editingId ? html`<edit-form></edit-form>`: html`
            <div>
                <div class="flex justify-between items-center">
                    <div style="font-weight: 200;" class="text-orange-500 f-size">${lang.employee_list}</div>
                    <div style="padding-top: .4rem;">
                        <img @click="${this.setTableMode}" src="./src/assets/menu2.png" class="pointer icon-size" style="display: inline;">
                        <img @click="${this.setGridMode}" src="./src/assets/menu1.png" class="pointer icon-size" style="display: inline;  margin-left: 0.5rem;">
                    </div>
                </div>
                <div>
                ${this.renderViewComponent()}
                </div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);