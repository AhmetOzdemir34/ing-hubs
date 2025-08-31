global.alert = vi.fn();

if (!global.customElements) {
  global.customElements = {
    define: vi.fn(),
    get: vi.fn()
  };
}

document.querySelector = vi.fn((selector) => {
  if (selector === '#outlet') {
    return document.createElement('div');
  }
  return null;
});