# 試玩一下Quasar
主要目的試用Quasar，建立一個簡單的頁面，POST網址給自己的Golang server取回短網址並顯示。
## 練習以Golang 搭配Gin框架建立一個後端伺服器，並使用Quasar 建立前端的輸入畫面取得處理過後的短網址。
整個網站建置於 AWS EC2上透過 Nginx 代理前端與後端，並使用supervisor監聽golang運行狀況，
再將資料儲存於 AWS dynamoDB。
後續為了讓整體看起來更完整一些，使用Aws Route53購買了最便宜的網域，以及加上SSL憑證。

最近想為這個網站增加點功能，並針對API做統一管理以及新增Axios攔截器，處理JWT token
目前是將JWT Token儲存在Vuex之中，並且沒有做持久化處理，所以當重新整理後就會登出並回到首頁

目前增加功能有：
* 新增登入者
* 增加登入功能
* 登入後便可以查詢該帳號過往使用過短網址紀錄

## 新增串接google OAuth2.0登入功能
* 這邊實作方式為選擇google登入後經由後端回傳google授權用的網址並跳轉過去，取得使用者信任。
* 並讓google回傳授權碼至前端頁面，前端頁面則在每次進入首頁時檢查網址是否夾帶google授權碼。
* 有授權碼時取出授權碼發送至後端，由後端透過授權碼取得google發送的token，
* 後端再使用這個token向google資源伺服器獲取用戶資訊，成功後並將資訊與JWT token回傳給前端。

* 我的資料庫中並沒有保存google這邊回傳的用戶資訊，僅留下Email中帳戶名稱的部位，紀錄在歷史紀錄中而已，可以放心試用。

# 試用的話可以用這個帳號！：
* 帳號：demo
* 密碼：demo123
* 當然也可以自己建立一個新的

# Quasar App (quasat-app)

A Quasar Project

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
