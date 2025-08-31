import { html, css, LitElement } from 'lit';
import store, { StoreConnectedElement } from '../stores/global-store';
import { Router } from '@vaadin/router';
import { validateForm } from '../validation.utils';

class AddNewPage extends StoreConnectedElement {
    static styles = css`
        :host {
            display: block;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .form-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 32px;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 32px;
        }

        .field-group {
            display: flex;
            flex-direction: column;
        }

        .field-label {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 8px;
        }

        .field-input {
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.2s ease;
            background: white;
        }

        .field-input:focus {
            outline: none;
            border-color: #ff6b35;
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .field-input:hover {
            border-color: #d1d5db;
        }

        .date-field {
            position: relative;
        }

        .date-field input[type="date"] {
            -webkit-appearance: none;
            -moz-appearance: textfield;
        }

        .date-field input[type="date"]::-webkit-calendar-picker-indicator {
            position: absolute;
            right: 12px;
            top: 70%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #ff6b35;
            font-size: 18px;
        }

        .select-field {
            position: relative;
        }

        .field-select {
            padding: 12px 16px;
            padding-right: 40px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }

        .field-select:focus {
            outline: none;
            border-color: #ff6b35;
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .select-field::after {
            content: '▼';
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #6b7280;
            font-size: 12px;
        }

        .button-group {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 2px solid transparent;
            min-width: 120px;
        }

        .btn-primary {
            background: #ff6b35;
            color: white;
            border-color: #ff6b35;
        }

        .btn-primary:hover {
            background: #e55a2b;
            border-color: #e55a2b;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .btn-secondary {
            background: white;
            color: #6b7280;
            border-color: #d1d5db;
        }

        .btn-secondary:hover {
            background: #f9fafb;
            border-color: #9ca3af;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
            :host {
                padding: 16px;
            }

            .form-container {
                padding: 24px 20px;
            }

            .form-grid {
                grid-template-columns: 1fr;
                gap: 20px;
                margin-bottom: 24px;
            }

            .field-input,
            .field-select {
                font-size: 16px; /* Prevents zoom on iOS */
                padding: 14px 16px;
            }

            .button-group {
                flex-direction: column;
            }

            .btn {
                width: 100%;
                padding: 16px 32px;
            }
        }

        @media (max-width: 480px) {
            .form-container {
                padding: 20px 16px;
            }

            .form-grid {
                gap: 16px;
            }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
            .form-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (min-width: 1025px) {
            .form-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        .field-input:focus-visible,
        .field-select:focus-visible,
        .btn:focus-visible {
            outline: 2px solid #ff6b35;
            outline-offset: 2px;
        }

        .form-container {
            animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    static properties = {
        formData: { type: Object },
        formErrors: { type: Array }
    };

    constructor() {
        super();
        this.formData = {
            first_name: '',
            last_name: '',
            date_of_employment: '',
            date_of_birth: '',
            phone: '',
            email: '',
            department: '',
            position: ''
        };
        this.formErrors = [];
    }

    render() {
        const { lang } = this.storeState; 
        return html`
            <div class="form-container">
                <div class="form-grid">
                    <div class="field-group">
                        <label class="field-label">${lang.first_name}</label>
                        <input 
                            type="text" 
                            class="field-input"
                            .value="${this.formData.first_name}"
                            @input="${e => this._updateField('first_name', e.target.value)}"
                        />
                        ${this.formErrors.includes('first_name') ? html`<p style="margin: 0; padding: 0; color: red; font-size: 12px;">${lang.first_name_error}</p>`: ''}
                    </div>

                    <div class="field-group">
                        <label class="field-label">${lang.last_name}</label>
                        <input 
                            type="text" 
                            class="field-input"
                            .value="${this.formData.last_name}"
                            @input="${e => this._updateField('last_name', e.target.value)}"
                        />
                        ${this.formErrors.includes('last_name') ? html`<p style="margin: 0; padding: 0; color: red; font-size: 12px;">${lang.last_name_error}</p>`: ''}
                    </div>

                    <div class="field-group date-field">
                        <label class="field-label">${lang.date_of_employment}</label>
                        <input 
                            type="date" 
                            class="field-input"
                            .value="${this.formData.date_of_employment}"
                            @input="${e => this._updateField('date_of_employment', e.target.value)}"
                        />
                        ${this.formErrors.includes('date_of_employment') ? html`<p style="margin: 0; padding: 0; color: red; font-size: 12px;">${lang.date_of_employment_error}</p>`: ''}
                    </div>

                    <div class="field-group date-field">
                        <label class="field-label">${lang.date_of_birth}</label>
                        <input 
                            type="date" 
                            class="field-input"
                            .value="${this.formData.date_of_birth}"
                            @input="${e => this._updateField('date_of_birth', e.target.value)}"
                        />
                        ${this.formErrors.includes('date_of_birth') ? html`<p style="margin: 0; padding: 0; color: red; font-size: 12px;">${lang.date_of_birth_error}</p>`: ''}
                    </div>

                    <div class="field-group">
                        <label class="field-label">${lang.phone}</label>
                        <input 
                            type="tel" 
                            class="field-input"
                            .value="${this.formData.phone}"
                            @input="${e => this._updateField('phone', e.target.value)}"
                            placeholder="+90 (555) 000 00 00"
                        />
                        ${this.formErrors.includes('phone') ? html`<p style="margin: 0; padding: 0; color: red; font-size: 12px;">${lang.phone_error}</p>`: ''}
                    </div>

                    <div class="field-group">
                        <label class="field-label">${lang.email}</label>
                        <input 
                            type="email" 
                            class="field-input"
                            .value="${this.formData.email}"
                            @input="${e => this._updateField('email', e.target.value)}"
                            placeholder="example@company.com"
                        />
                        ${this.formErrors.includes('email') ? html`<p style="margin: 0; padding: 0; color: red; font-size: 12px;">${lang.email_error}</p>`: ''}
                    </div>

                    <div class="field-group">
                        <label class="field-label">${lang.department}</label>
                        <select 
                            class="field-select"
                            .value="${this.formData.department}"
                            @change="${e => this._updateField('department', e.target.value)}"
                        >
                            <option value="">${lang.please_select}</option>
                            <option value="Analytics">Analytics</option>
                            <option value="Tech">Tech</option>
                        </select>
                        ${this.formErrors.includes('department') ? html`<p style="margin: 0; padding: 0; color: red; font-size: 12px;">${lang.department_error}</p>`: ''}
                    </div>

                    <div class="field-group">
                        <label class="field-label">${lang.position}</label>
                        <select 
                            class="field-select"
                            .value="${this.formData.position}"
                            @change="${e => this._updateField('position', e.target.value)}"
                        >
                            <option value="">${lang.please_select}</option>
                            <option value="Junior">Junior</option>
                            <option value="Medior">Medior</option>
                            <option value="Senior">Senior</option>
                        </select>
                        ${this.formErrors.includes('position') ? html`<p style="margin: 0; padding: 0; color: red; font-size: 12px;">${lang.position_error}</p>`: ''}
                    </div>
                </div>

                <div class="button-group">
                    <button class="btn btn-primary" @click="${this._handleSave}">
                    ${lang.save}
                    </button>
                    <button class="btn btn-secondary" @click="${this._handleCancel}">
                    ${lang.cancel}
                    </button>
                </div>
            </div>
        `;
    }

    _updateField(field, value) {
        this.formData = { ...this.formData, [field]: value };
    }

    _handleSave() {
        const validationErrors = validateForm(this.formData);
        if (validationErrors.length > 0) {
            this.formErrors = validationErrors;
            return;
        }
        store.add({...this.formData, id: store.items.length+1, checked: false});

        this.formData = {
            first_name: '',
            last_name: '',
            date_of_employment: '',
            date_of_birth: '',
            phone: '',
            email: '',
            department: '',
            position: ''
        };       
        Router.go("/");
    }

    _handleCancel() {
        this.formData = {
            first_name: '',
            last_name: '',
            date_of_employment: '',
            date_of_birth: '',
            phone: '',
            email: '',
            department: '',
            position: ''
        };
    }
}

customElements.define('add-new-page', AddNewPage);