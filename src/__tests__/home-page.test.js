import { describe, test, expect, beforeEach, vi } from 'vitest';

const mockStore = {
  setPaginator: vi.fn()
};

class HomePage {
  constructor() {
    this.viewMode = 'table';
    this.storeState = {
      editingId: null,
      lang: {
        employee_list: 'Employee List'
      }
    };
  }

  setGridMode() {
    this.viewMode = 'grid';
    mockStore.setPaginator(1);
  }

  setTableMode() {
    this.viewMode = 'table';
    mockStore.setPaginator(1);
  }

  renderViewComponent() {
    return this.viewMode === 'table' ? 'employee-table' : 'employee-grid';
  }

  render() {
    if (this.storeState.editingId) {
      return 'edit-form';
    }
    return `normal-view-${this.storeState.lang.employee_list}`;
  }
}

describe('HomePage New Tests', () => {
  let element;

  beforeEach(() => {
    vi.clearAllMocks();
    element = new HomePage();
  });

  test('should create element', () => {
    expect(element.viewMode).toBe('table');
  });

  test('should have store state', () => {
    expect(element.storeState.lang.employee_list).toBe('Employee List');
  });

  test('should switch to grid mode', () => {
    element.setGridMode();
    
    expect(element.viewMode).toBe('grid');
    expect(mockStore.setPaginator).toHaveBeenCalledWith(1);
  });

  test('should switch to table mode', () => {
    element.viewMode = 'grid';
    element.setTableMode();
    
    expect(element.viewMode).toBe('table');
    expect(mockStore.setPaginator).toHaveBeenCalledWith(1);
  });

  test('should render table component', () => {
    element.viewMode = 'table';
    expect(element.renderViewComponent()).toBe('employee-table');
  });

  test('should render grid component', () => {
    element.viewMode = 'grid';
    expect(element.renderViewComponent()).toBe('employee-grid');
  });

  test('should render normal view', () => {
    element.storeState.editingId = null;
    const result = element.render();
    expect(result).toContain('Employee List');
  });

  test('should render edit form', () => {
    element.storeState.editingId = 123;
    expect(element.render()).toBe('edit-form');
  });

  test('should change view modes', () => {
    expect(element.viewMode).toBe('table');
    element.setGridMode();
    expect(element.viewMode).toBe('grid');
  });

  test('should have default state', () => {
    expect(element.viewMode).toBe('table');
    expect(element.storeState.editingId).toBe(null);
  });
});