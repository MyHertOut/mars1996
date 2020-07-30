import store from '@/store/index.js';
import elements from './element.js';
import filters from './filter.js';
import directive from './directive.js';

const pluginArray = [filters, elements, directive];

export default {
  install (Vue) {
    pluginArray.forEach(item => item.install(Vue, store));
  }
};
