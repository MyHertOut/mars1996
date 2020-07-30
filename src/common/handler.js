export default class Handler {
  constructor (...interceptors) {
    this.interceptors = [].concat(interceptors);
  }

  use (interceptor) {
    this.interceptors.push(interceptor);
  }

  handle (to, from, next) {
    let index = 0;
    const context = Object.assign({}, { to, from });

    const run = function (args) {
      const interceptor = this.interceptors[index++];

      if (args === undefined) {
        if (interceptor) {
          interceptor(context, run);
        } else {
          next();
        }
      } else {
        next(args);
      }
    }.bind(this);

    run();
  }
}
