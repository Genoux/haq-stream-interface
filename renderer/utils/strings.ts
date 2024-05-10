// Extend String prototype
declare global {
  interface String {
    capitalize(): string;
  }
}

if (!String.prototype.capitalize) {
  Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
  });
}

export {};
