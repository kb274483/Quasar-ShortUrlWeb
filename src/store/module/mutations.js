export const setLoginStatus = (state, status) => {
  state.isLoginStatus = status;
}
export const setLogout = (state) => {
  state.jwtToken = null;
  state.userName = null;
  state.isLoginStatus = false;
}
export const setJWTToken = (state, data) => {
  state.jwtToken = data;
}
export const setUserName = (state, data) => {
  state.userName = data;
}
export const setLocalStorage = (state) => {
  localStorage.setItem('vuex_state', JSON.stringify(state));
}
export const loadLocalStorage = (state, data) => {
  Object.assign(state, data);
  localStorage.removeItem('vuex_state');
}
