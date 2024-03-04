export default ({ store }) => {
  const vuexState = localStorage.getItem('vuex_state');
  if(vuexState){
    store.commit('module/loadLocalStorage',JSON.parse(vuexState));
  }
};