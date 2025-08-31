import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { Router } from '@vaadin/router';
import { MainApp } from '../js/main-app.js';

vi.mock('@vaadin/router', () => ({
  Router: vi.fn().mockImplementation(() => ({
    setRoutes: vi.fn()
  }))
}));
Router.go = vi.fn();

vi.mock('../stores/global-store.js', () => {
  const mockStore = {
    setLanguage: vi.fn(),
    state: {
      lang: {
        employees: 'Employees',
        add_new: 'Add New',
        lang: 'en'
      }
    }
  };
  
  return {
    default: mockStore,
    StoreConnectedElement: class extends HTMLElement {
      constructor() {
        super();
        this._storeState = mockStore.state;
      }
      get storeState() {
        return this._storeState;
      }
      connectedCallback() {}
      disconnectedCallback() {}
      requestUpdate() {}
    }
  };
});

describe('MainApp Tests', () => {
  let element;

  beforeEach(() => {
    if (!customElements.get('main-app')) {
      customElements.define('main-app', MainApp);
    }
    
    element = new MainApp();
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.clearAllMocks();
  });

  test('should create element', () => {
    expect(element).toBeInstanceOf(MainApp);
    expect(element.tagName.toLowerCase()).toBe('main-app');
  });

  test('should have store state', () => {
    expect(element.storeState).toBeDefined();
    expect(element.storeState.lang.employees).toBe('Employees');
  });

  test('should navigate to home', () => {
    element.navigate('home');
    
    expect(Router.go).toHaveBeenCalledWith('/');
  });

  test('should navigate to add-new page', () => {
    element.navigate('add-new');
    
    expect(Router.go).toHaveBeenCalledWith('/add-new');
  });

  test('should navigate to add-new for unknown route', () => {
    element.navigate('unknown');
    
    expect(Router.go).toHaveBeenCalledWith('/add-new');
  });

  test('should call setLanguage', async () => {
    const store = (await import('../stores/global-store.js')).default;
    
    element.setLanguage('tr');
    
    expect(store.setLanguage).toHaveBeenCalledWith('tr');
  });

  test('should render template', () => {
    const result = element.render();
    
    expect(result).toBeDefined();
    expect(result.strings).toBeDefined();
  });

  test('should render ING text in template', () => {
    const template = element.render();
    const templateString = template.strings.join('');
    
    expect(templateString).toContain('ING');
  });

  test('should have navigation buttons', () => {
    const template = element.render();
    const templateString = template.strings.join('');
    
    expect(templateString).toContain('<button');
    expect(templateString).toContain('px-nav py-nav');
  });

  test('should have outlet div', () => {
    const template = element.render();
    const templateString = template.strings.join('');
    
    expect(templateString).toContain('id="outlet"');
    expect(templateString).toContain('<div id="outlet">');
  });
});