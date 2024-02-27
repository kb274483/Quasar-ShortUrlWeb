import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import module from './module'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
let instance;
const initializer = store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      module
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })
  return Store
})

export default function initializeStore() {
  if (!instance) {
    instance = initializer();
  }
  return instance;
}