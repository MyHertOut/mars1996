const directives = {
  install (Vue, store) {
    Vue.directive('permissions', {
      inserted (el, binding) {
        const userFunction = store.getters.userInfo.functions;
        if (userFunction && !userFunction.filter(v => v.functionCode === binding.value)[0]) {
          el.remove();
        }
      }
    });
  }
};

export default directives;
