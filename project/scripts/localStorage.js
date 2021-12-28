export default class LocalStorage {
   getObject(name) {
      let json = localStorage.getItem(name);
      return json == undefined ? {} : JSON.parse(json);
   }

   setObject(name, value) {
      localStorage.setItem(name,JSON.stringify(value));
   }

   getArray(name) {
      let json = localStorage.getItem(name);
      return json == undefined ? [] : JSON.parse(json);
   }

   setArray(name, value) {
      localStorage.setItem(name,JSON.stringify(value));
   } 
   
   getItem(name) {
      return localStorage.getItem(name);
   }

   setItem(name,value) {
      localStorage.setItem(name,value);
   }

   setCompressedObject(name, value) {
      value = LZString.compress(JSON.stringify(value));
      this.setItem(name, value);
   }

   getCompressedObject(name) {
      let value = this.getItem(name);
      if (value === null) return {};
      let json = LZString.decompress(value);
      return JSON.parse(json);
   }

   setCompressedArray(name, value) {
      value = LZString.compress(JSON.stringify(value));
      this.setItem(name, value);
   }

   getCompressedArray(name) {
      let value = this.getItem(name);
      if (value === null) return [];
      let json = LZString.decompress(value);
      return JSON.parse(json);
   }
}