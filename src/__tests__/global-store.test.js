import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Real GlobalStore Tests', () => {
  let store;
  let StoreConnectedElement;
  let originalAlert;

  beforeEach(async () => {
    originalAlert = global.alert;
    global.alert = vi.fn();

    const module = await import('../stores/global-store.js');
    store = module.default;
    StoreConnectedElement = module.StoreConnectedElement;
    
    store.setPaginator(1);
    store.clearEditingId();
  });

  afterEach(() => {
    global.alert = originalAlert;
  });

  test('should have store instance', () => {
    expect(store).toBeDefined();
    expect(store.state).toBeDefined();
    expect(typeof store.add).toBe('function');
  });

  test('should have correct initial state', () => {
    const state = store.state;
    expect(state.items).toBeDefined();
    expect(Array.isArray(state.items)).toBe(true);
    expect(state.paginator).toBe(1);
    expect(state.editingId).toBe(null);
    expect(state.lang).toBeDefined();
  });

  test('should return items array', () => {
    const items = store.items;
    expect(Array.isArray(items)).toBe(true);
    expect(items).not.toBe(store.state.items);
  });

  test('should add new item', () => {
    const initialLength = store.items.length;
    const newItem = { id: 999, name: 'Test User', email: 'test@example.com' };
    
    store.add(newItem);
    
    expect(store.items.length).toBe(initialLength + 1);
    expect(store.items[store.items.length - 1]).toEqual(newItem);
    expect(global.alert).toHaveBeenCalledWith("Save successful!");
  });

  test('should remove item by id', () => {
    const items = store.items;
    if (items.length > 0) {
      const firstItemId = items[0].id;
      const initialLength = items.length;
      
      store.remove(firstItemId);
      
      expect(store.items.length).toBe(initialLength - 1);
      expect(store.items.find(item => item.id === firstItemId)).toBeUndefined();
    }
  });

  test('should update existing item', () => {
    const items = store.items;
    if (items.length > 0) {
      const firstItemId = items[0].id;
      const updates = { name: 'Updated Name' };
      
      store.update(firstItemId, updates);
      
      const updatedItem = store.items.find(item => item.id === firstItemId);
      expect(updatedItem.name).toBe('Updated Name');
    }
  });

  test('should handle pagination correctly', () => {
    store.next(5);
    expect(store.paginator).toBe(2);
    
    store.previous();
    expect(store.paginator).toBe(1);
    
    store.previous();
    expect(store.paginator).toBe(1);
    
    store.setPaginator(3);
    expect(store.paginator).toBe(3);
  });

  test('should manage editing state', () => {
    expect(store.state.editingId).toBe(null);
    
    store.setEditingId(123);
    expect(store.state.editingId).toBe(123);
    
    store.clearEditingId();
    expect(store.state.editingId).toBe(null);
  });

  test('should switch languages', () => {
    store.setLanguage('en');
    expect(store.state.lang.lang).toBe('en');
    
    store.setLanguage('tr');
    expect(store.state.lang.lang).toBe('tr');
    
    store.setLanguage('en');
    expect(store.state.lang.lang).toBe('en');
  });
});