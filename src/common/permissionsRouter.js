import store from '@/store';

export default ({ from, to }, next) => {
  if (to.meta.functionCode) {
    if (store.getters.userInfo.functions.filter(v => v.functionCode === to.meta.functionCode)[0]) {
      next();
    } else {
      next({ name: 'NotFount' });
    }
  } else {
    next();
  }
};
