export const API_ENDPOINTS = {
  // generate short url
  GENERATE_SHORTEN_URL: `/generate_short_url`,
  // 登入
  LOGIN : `/login`,
  // 新增會員
  CREATE_MEMBER : `/create_member`,
  // 取得會員紀錄
  GET_MEMBER_HISTORY : `/member_history`,
  // google第三方登入
  GOOGLE_LOGIN : `/google_login`,
  // 透過授權碼取得Token與使用者資訊
  GET_GOOGLE_TOKEN : `/google_call_back`,
  // 取得當日行程
  GET_DAILY_SCHEDULE : `/get_itinerary`,
  // 新增當日行程
  ADD_DAILY_SCHEDULE : `/add_itinerary`,
  // 更新行程
  UPDATE_DAILY_SCHEDULE : `/update_itinerary`,
  // 刪除行程
  DELETE_DAILY_SCHEDULE : `/delete_itinerary`,
};