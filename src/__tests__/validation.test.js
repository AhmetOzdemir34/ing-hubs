import { describe, test, expect } from 'vitest';
import { validateForm } from '../validation.utils.js';

describe('Real Validation Tests', () => {
  
  test('should validate all fields correctly', () => {
    const validForm = {
      first_name: 'Ahmet',
      last_name: 'Özdemir',
      date_of_employment: '2025-01-01',
      date_of_birth: '2000-07-05',
      phone: '+90 (555) 123 45 67',
      email: 'ahmet@gmail.com',
      department: 'Tech',
      position: 'Senior'
    };
    
    const result = validateForm(validForm);
    expect(result).toEqual([]);
  });

  test('should catch all validation errors', () => {
    const invalidForm = {
      first_name: '',
      last_name: '', 
      date_of_employment: '',
      date_of_birth: '',
      phone: 'invalid-phone',
      email: 'invalid-email',
      department: 'InvalidDept',
      position: 'InvalidPos'
    };
    
    const result = validateForm(invalidForm);
    expect(result).toHaveLength(8);
    expect(result).toContain('first_name');
    expect(result).toContain('last_name');
    expect(result).toContain('date_of_employment');
    expect(result).toContain('date_of_birth');
    expect(result).toContain('phone');
    expect(result).toContain('email');
    expect(result).toContain('department');
    expect(result).toContain('position');
  });

  test('should validate phone regex correctly', () => {
    const validPhones = [
      '+90 (555) 123 45 67',
      '+90 (212) 456 78 90',
      '+90 (534) 999 88 77'
    ];
    
    const invalidPhones = [
      '05551234567',
      '+90 555 123 45 67',
      '+90(555)1234567',
      '90 (555) 123 45 67'
    ];

    validPhones.forEach(phone => {
      const form = { 
        first_name: 'Deneme', last_name: 'Deneme', 
        date_of_employment: '2023-01-01', date_of_birth: '1990-01-01',
        phone, email: 'deneme@gmail.com', department: 'Tech', position: 'Junior' 
      };
      expect(validateForm(form)).not.toContain('phone');
    });

    invalidPhones.forEach(phone => {
      const form = { 
        first_name: 'Deneme', last_name: 'Deneme',
        date_of_employment: '2023-01-01', date_of_birth: '1990-01-01', 
        phone, email: 'test@test.com', department: 'Tech', position: 'Junior' 
      };
      expect(validateForm(form)).toContain('phone');
    });
  });

  test('should validate email regex correctly', () => {
    const validEmails = [
      'test@example.com',
      'user@domain.co.uk', 
      'name.surname@company.org'
    ];
    
    const invalidEmails = [
      'invalid',
      '@domain.com',
      'user@',
      'user@domain'
    ];

    validEmails.forEach(email => {
      const form = { 
        first_name: 'Deneme', last_name: 'Deneme',
        date_of_employment: '2023-01-01', date_of_birth: '1990-01-01',
        phone: '+90 (555) 123 45 67', email, department: 'Tech', position: 'Junior' 
      };
      expect(validateForm(form)).not.toContain('email');
    });

    invalidEmails.forEach(email => {
      const form = { 
        first_name: 'Deneme', last_name: 'Deneme',
        date_of_employment: '2023-01-01', date_of_birth: '1990-01-01',
        phone: '+90 (555) 123 45 67', email, department: 'Tech', position: 'Junior' 
      };
      expect(validateForm(form)).toContain('email');
    });
  });

  test('should validate department enum', () => {
    ['Analytics', 'Tech'].forEach(department => {
      const form = { 
        first_name: 'Test', last_name: 'Test',
        date_of_employment: '2023-01-01', date_of_birth: '1990-01-01',
        phone: '+90 (555) 123 45 67', email: 'test@test.com', 
        department, position: 'Junior' 
      };
      expect(validateForm(form)).not.toContain('department');
    });

    ['Marketing', 'Sales', ''].forEach(department => {
      const form = { 
        first_name: 'Test', last_name: 'Test',
        date_of_employment: '2023-01-01', date_of_birth: '1990-01-01',
        phone: '+90 (555) 123 45 67', email: 'test@test.com', 
        department, position: 'Junior' 
      };
      expect(validateForm(form)).toContain('department');
    });
  });

  test('should validate position enum', () => {
    ['Junior', 'Medior', 'Senior'].forEach(position => {
      const form = { 
        first_name: 'Test', last_name: 'Test',
        date_of_employment: '2023-01-01', date_of_birth: '1990-01-01',
        phone: '+90 (555) 123 45 67', email: 'test@test.com', 
        department: 'Tech', position 
      };
      expect(validateForm(form)).not.toContain('position');
    });

    ['Manager', 'Director', ''].forEach(position => {
      const form = { 
        first_name: 'Test', last_name: 'Test',
        date_of_employment: '2023-01-01', date_of_birth: '1990-01-01',
        phone: '+90 (555) 123 45 67', email: 'test@test.com', 
        department: 'Tech', position 
      };
      expect(validateForm(form)).toContain('position');
    });
  });

  test('should handle empty and null values', () => {
    const emptyForm = {
      first_name: null,
      last_name: undefined,
      date_of_employment: '',
      date_of_birth: null,
      phone: '',
      email: '',
      department: '',
      position: ''
    };
    
    const result = validateForm(emptyForm);
    expect(result.length).toBeGreaterThan(5);
  });

  test('should validate individual fields independently', () => {
    let form = { 
      first_name: '', last_name: 'Test', date_of_employment: '2023-01-01', 
      date_of_birth: '1990-01-01', phone: '+90 (555) 123 45 67', 
      email: 'test@test.com', department: 'Tech', position: 'Junior' 
    };
    let result = validateForm(form);
    expect(result).toEqual(['first_name']);

    form = { 
      first_name: 'Test', last_name: 'Test', date_of_employment: '2023-01-01',
      date_of_birth: '1990-01-01', phone: '+90 (555) 123 45 67', 
      email: 'invalid', department: 'Tech', position: 'Junior' 
    };
    result = validateForm(form);
    expect(result).toEqual(['email']);
  });

  test('should return errors in consistent order', () => {
    const form = {
      first_name: '',
      last_name: '',  
      date_of_employment: '',
      date_of_birth: '',
      phone: 'invalid',
      email: 'invalid',
      department: 'invalid',
      position: 'invalid'
    };
    
    const result = validateForm(form);
    const expectedOrder = [
      'first_name', 'last_name', 'date_of_employment', 
      'date_of_birth', 'phone', 'email', 'department', 'position'
    ];
    
    expect(result).toEqual(expectedOrder);
  });
});