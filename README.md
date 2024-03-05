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

# 新增串接google OAuth2.0登入功能
這邊實作

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
