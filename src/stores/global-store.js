import { members } from "../consts/members";
import { LitElement } from 'lit';
import { en } from "../langs/en";
import { tr } from "../langs/tr";

class GlobalStore extends EventTarget {
    constructor() {
      super();
      
      this._state = {
        items: [...members],
        paginator: 1,
        editingId: null,
        lang: en
      };
      
      this._subscribers = new Set();
    }
    
    get state() {
      return { ...this._state };
    }
    
    get items() {
      return [...this._state.items];
    }
    
    get paginator() {
      return this._state.paginator;
    }
    
    _setState(updates) {
      const oldState = { ...this._state };
      this._state = { ...this._state, ...updates };
      
      this._notifySubscribers(oldState, this._state);
      
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
      
      this._storeUnsubscribe = store.subscribe((newState, oldState) => {
        this._storeState = newState;
        this.storeStateChanged(newState, oldState);
        this.requestUpdate();
      });
    }
    
    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._storeUnsubscribe) {
        this._storeUnsubscribe();
      }
    }
    
    get storeState() {
      return this._storeState;
    }
    
    get store() {
      return store;
    }
    
    storeStateChanged(newState, oldState) {}
  }