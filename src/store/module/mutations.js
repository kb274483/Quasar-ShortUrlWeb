export const setLoginStatus = (state, status) => {
  state.isLoginStatus = status;
}
export const setJWTToken = (state, data) => {
  state.jwtToken = data;
}
export const setUserName = (state, data) => {
  state.userName = data;
}