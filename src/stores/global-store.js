import { members } from "../consts/members";
import { LitElement } from 'lit';
import { en } from "../langs/en";
import { tr } from "../langs/tr";

class GlobalStore extends EventTarget {
    constructor() {
      super();
      
      // Store state'i
      this._state = {
        items: [...members], // members.js'ten initial değer
        paginator: 1,
        editingId: null,
        lang: en
      };
      
      // Subscribers listesi
      this._subscribers = new Set();
    }
    
    // State getter
    get state() {
      return { ...this._state };
    }
    
    // Items getter
    get items() {
      return [...this._state.items];
    }
    
    // Paginator getter
    get paginator() {
      return this._state.paginator;
    }
    
    // State güncelleme
    _setState(updates) {
      const oldState = { ...this._state };
      this._state = { ...this._state, ...updates };
      
      // Subscribers'ı bilgilendir
      this._notifySubscribers(oldState, this._state);
      
      // Custom event dispatch et
      this.dispatchEvent(new CustomEvent('state-changed', {
        detail: { oldState, newState: this._state }
      }));
    }
    
    add(item) {
      const newItems = [...this._state.items, item];
      this._setState({ items: newItems });
      alert("Save successful!");
    }
    
    remove(id) {
      const newItems = this._state.items.filter(item => item.id !== id);
      this._setState({ items: newItems });
    }
    
    update(id, updates) {
      const newItems = this._state.items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      this._setState({ items: newItems });
    }
    
    previous() {
      if (this._state.paginator > 1) {
        this._setState({ paginator: this._state.paginator - 1 });
      }      
    }
    
    next(totalPages) {                
        if (this.paginator < totalPages) {
            this._setState({ paginator: this._state.paginator + 1 });
        }
    }

    setEditingId(id) {
        this._setState({ editingId: id });
    }

    setLanguage(language) {
        if (language === 'en') {
            this._setState({ lang: en });
        } else {
            this._setState({ lang: tr });
        }
    }

    clearEditingId() {
        this._setState({ editingId: null });
    }
    
    setPaginator(page) {
      if (page >= 1) {
        this._setState({ paginator: page });
      }
    }
    
    subscribe(callback) {
      this._subscribers.add(callback);
      return () => this._subscribers.delete(callback);
    }
     
    _notifySubscribers(oldState, newState) {
      this._subscribers.forEach(callback => {
        try {
          callback(newState, oldState);
        } catch (error) {
          console.error('Store subscriber error:', error);
        }
      });
    }
  }
  
  const store = new GlobalStore();
  
  window.store = store;
  
  export default store;

  export class StoreConnectedElement extends LitElement {
    constructor() {
      super();
      this._storeUnsubscribe = null;
      this._storeState = store.state;
    }
    
    connectedCallback() {
      super.connectedCallback();
      // Store'a abone ol
      this._storeUnsubscribe = store.subscribe((newState, oldState) => {
        this._storeState = newState;
        this.storeStateChanged(newState, oldState);
        this.requestUpdate();
      });
    }
    
    disconnectedCallback() {
      super.disconnectedCallback();
      // Store aboneliğini iptal et
      if (this._storeUnsubscribe) {
        this._storeUnsubscribe();
      }
    }
    
    // Store state'ine erişim
    get storeState() {
      return this._storeState;
    }
    
    // Store'a kolay erişim
    get store() {
      return store;
    }
    
    // Override edilebilir method - alt sınıflar bu method'u override edebilir
    storeStateChanged(newState, oldState) {
      // Component'lerde bu method override edilebilir
    }
  }