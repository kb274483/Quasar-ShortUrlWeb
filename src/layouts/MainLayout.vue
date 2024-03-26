<template>
  <q-layout view="hHh lpR fFf">
    
    <!-- Loading -->
    <div v-if="isLoading" 
      class="tw-absolute tw-z-50 tw-top-0 tw-left-0 tw-w-full tw-h-[100vh] tw-flex tw-justify-center tw-items-center tw-bg-gray-900 tw-opacity-30"
    >
      <q-circular-progress
        indeterminate
        size="50px"
        color="deep-orange"
        class="q-ma-md"
      />
    </div>

    <q-header elevated class="bg-grey-6 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Shorten Url Service
        </q-toolbar-title>
        <q-btn dense flat round icon="account_circle" size="1.3rem" 
          @click="isUserLoginCtl = true" v-if="!isLoginStatus"
        />
        <div class="tw-flex tw-justify-center tw-items-center tw-border tw-border-white tw-px-2 tw-rounded tw-bg-white tw-text-gray-600 hover:tw-bg-gray-200" v-else>
          <q-btn disable dense flat round icon="insert_emoticon" size="1.3rem" />
          <p class="tw-text-xl tw-uppercase">{{loginUserName}}</p>
          <q-btn dense flat round icon="logout" size="1rem" @click="checkLogout" />
        </div>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer()" size="1.3rem" />
      </q-toolbar>
    </q-header>

    <!-- 右側選單 -->
    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <q-list bordered v-if="isLoginStatus">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="deep-orange" name="history" />
          </q-item-section>
          <q-btn color="white" text-color="orange" class="tw-w-full"
            unelevated to="/history" label="History" no-caps @click="rightDrawerOpen = false"
          />
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="deep-orange" name="event_available" />
          </q-item-section>
          <q-btn color="white" text-color="orange" class="tw-w-full"
            unelevated to="/schedule" label="Todo-Schedule" no-caps @click="rightDrawerOpen = false"
          />
        </q-item>
      </q-list>
      <q-list bordered v-else>
        <q-item v-ripple>
          <q-item-section class="tw-text-gray-600">Please login first</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <!-- 登入彈窗 -->
    <q-dialog persistent v-model="isUserLoginCtl">
      <q-card style="min-width: 350px">
        <div class="tw-flex tw-justify-end">
          <q-btn flat label="Create new member" size="sm" v-if="!isCreateMemberCtl"
            class="tw-text-gray-500" @click="isCreateMemberCtl = true" 
          />
        </div>
        <q-card-section>
          <div class="q-mx-auto tw-w-60 text-h5 text-center tw-text-gray-600">
            {{isCreateMemberCtl ? 'Create New Account':'Login'}}
          </div>
        </q-card-section>

        <p v-if="isCreateMemberCtl"
          class="q-mx-auto tw-w-60 tw-text-xs tw-text-gray-500"
        >
          Please enter your account, case sensitive
        </p>
        <q-input class="q-mx-auto tw-w-60" color="orange" filled 
          v-model="memberData.account" label="Account"
        >
          <template v-if="text" v-slot:append>
            <q-icon name="cancel" @click.stop="text = null" class="cursor-pointer" />
          </template>
        </q-input>
        <q-input class="q-mx-auto tw-w-60 tw-mt-2" color="orange" filled
          v-model="memberData.password" :type="isPwd ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-card-actions align="right">
          <q-icon name="fa-brands fa-google" class="tw-text-blue-400" />
          <q-btn flat label="login with google" no-caps
            class="tw-text-gray-600" @click="loginWithGoogle()"  
          />
        </q-card-actions>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="clear()" color="red" />
          <q-btn flat label="Login" @click="login()" color="blue" v-if="!isCreateMemberCtl" />
          <q-btn flat label="Create" @click="createMember()" color="blue" v-else />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 訊息框 -->
    <q-dialog v-model="popup">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h5 text-red-4 tw-flex tw-items-center tw-gap-2">
            <q-icon name="thumb_up_alt" color="blue" v-if="popupIconType === 0" />
            <q-icon name="warning" color="orange" v-if="popupIconType === 1" />
            <q-icon name="error_outline" color="red" v-if="popupIconType === 2" />
            {{popupTitle}}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{popupMessage}}
        </q-card-section>

        <q-card-actions align="right" v-if="isLogout">
          <q-btn flat label="No" color="gary" v-close-popup />
          <q-btn flat label="Yes" color="red" @click="logout()" />
        </q-card-actions>
        <q-card-actions align="right" v-else>
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view @emitLoading="loadingHandler" @emitPopup="popupHandler" />
    </q-page-container>
  </q-layout>
</template>

<script >
import { defineComponent, ref,computed, onBeforeUnmount, onMounted } from 'vue'
import {useStore} from 'vuex';
import EssentialLink from 'components/EssentialLink.vue'
import api from 'src/api/axios';
import { API_ENDPOINTS } from 'src/api/index';
const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },

  setup () {
    const isLoading = ref(false)
    const vuexStore = useStore()
    const isLoginStatus = computed(() => vuexStore.state.module.isLoginStatus);
    const loginUserName = computed(() => vuexStore.state.module.userName);
    const isLogout = ref(false)
    const isPwd = ref(true)
    // 用戶登入資料
    const memberData = ref({
      account : '',
      password : ''
    })
    // 右側選單開關
    const rightDrawerOpen = ref(false)
    // 新增會員彈窗控制
    const isCreateMemberCtl = ref(false)
    const createMember = ()=>{
      if(memberData.value.account === '' || memberData.value.password === ''){
        popupHandler({
          popup: true,
          popupTitle: 'Warning',
          popupMessage: 'Please enter account and password',
          popupIconType: 1
        })
        return
      }
      api.post(API_ENDPOINTS.CREATE_MEMBER,memberData.value).then((res)=>{
        if(res.status === 200){
          popupHandler({
            popup: true,
            popupTitle: 'Success',
            popupMessage: res.data.msg,
            popupIconType: 0
          })
          isCreateMemberCtl.value = false
          memberData.value.account = ''
          memberData.value.password = ''
        }
      }).catch((err)=>{
        console.log(err)
        popupHandler({
          popup: true,
          popupTitle: 'Error',
          popupMessage: `${err.response.statusText}-${err.response.data.error}`,
          popupIconType: 2
        })
      })
    }
    // 登入視窗控制
    const isUserLoginCtl = ref(false)
    // 登入
    const login = () => {
      if(memberData.value.account === '' || memberData.value.password === ''){
        popupHandler({
          popup: true,
          popupTitle: 'Warning',
          popupMessage: 'Please enter account and password',
          popupIconType: 1
        })
        return
      }
      api.post(API_ENDPOINTS.LOGIN,memberData.value).then((res)=>{
        if(res.status === 200){
          vuexStore.commit('module/setLoginStatus', true);
          vuexStore.commit('module/setJWTToken', res.data.token);
          vuexStore.commit('module/setUserName', res.data.user_name);
          isUserLoginCtl.value = false
          popupHandler({
            popup: true,
            popupTitle: 'Success',
            popupMessage: res.data.msg,
            popupIconType: 0
          })
        }
      }).catch((err)=>{
        console.log(err)
        vuexStore.commit('module/setLoginStatus', false);
        isUserLoginCtl.value = false
        popupHandler({
          popup: true,
          popupTitle: 'Error',
          popupMessage: `${err.response.statusText}-${err.response.data.error}`,
          popupIconType: 2
        })
      })
    }
    // google OAuth登入
    const loginWithGoogle = ()=>{
      api.get(API_ENDPOINTS.GOOGLE_LOGIN).then((res)=>{
        if(res.status === 200) window.location.href = res.data.redirectUrl
      }).catch((err)=>{
        console.log(err)
        popupHandler({
          popup: true,
          popupTitle: 'Error',
          popupMessage: `${err.response.statusText}-${err.response.data.error}`,
          popupIconType: 2
        })
      })
    }
    // 登出
    const checkLogout = ()=>{
      isLogout.value = true
      popupHandler({
        popup: true,
        popupTitle: 'Warning',
        popupMessage: 'Are you sure to logout?',
        popupIconType: 1
      })
    }
    const logout = ()=>{
      vuexStore.commit('module/setLogout')
      isLogout.value = false
      popup.value = false
      window.location.href = '/'
    }
    // 清空欄位
    const clear = ()=>{
      if(isCreateMemberCtl.value){
        isCreateMemberCtl.value = false
      }else{
        isUserLoginCtl.value = false
      }
      memberData.value.account = ''
      memberData.value.password = ''
    }
    // 訊息彈窗
    const popup = ref(false)
    const popupMessage = ref('')
    const popupTitle = ref('')
    const popupIconType = ref(0) // 0:succes, 1:warning, 2:error
    // Loading
    const loadingHandler = (status) => {
      isLoading.value = status
    }
    const popupHandler = (status) =>{
      popup.value = status.popup
      popupTitle.value = status.popupTitle
      popupMessage.value = status.popupMessage
      popupIconType.value = status.popupIconType
    }
    // 檢查是否有收到google回傳的授權碼
    const checkGoogleCode = ()=>{
      let url = new URL(window.location.href)
      let state = url.searchParams.get('state')
      let code = url.searchParams.get('code')
      if(code != null){
        api.get(`${API_ENDPOINTS.GET_GOOGLE_TOKEN}?state=${state}&code=${code}`).then((res)=>{
          if(res.status === 200){
            vuexStore.commit('module/setLoginStatus', true);
            vuexStore.commit('module/setJWTToken', res.data.token);
            vuexStore.commit('module/setUserName', res.data.user_name);
            popupHandler({
              popup: true,
              popupTitle: 'Success',
              popupMessage: res.data.msg,
              popupIconType: 0
            })
            // 清除網址中的授權碼，避免重新整理時再次發送請求
            const newURL = window.location.href.split('?')[0];
            window.history.replaceState({}, document.title, newURL);
          }
        }).catch((err)=>{
          console.log(err)
          vuexStore.commit('module/setLoginStatus', false);
          popupHandler({
            popup: true,
            popupTitle: 'Error',
            popupMessage: `${err.response.statusText}-${err.response.data.error}`,
            popupIconType: 2
          })
        })
      }
    }
    // 重新整理監聽
    const beforeUnload = ()=>{
      vuexStore.commit('module/setLocalStorage')
    }
    onMounted(() => {
      checkGoogleCode()
      window.addEventListener('beforeunload', beforeUnload);
    })
    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', beforeUnload);
    })

    return {
      essentialLinks: linksList,
      isLoading,
      popup,
      popupTitle,
      popupMessage,
      popupIconType,
      isLoginStatus,
      isLogout,
      isCreateMemberCtl,
      isUserLoginCtl,
      loginUserName,
      isPwd,
      memberData,
      rightDrawerOpen,
      createMember,
      login,
      loginWithGoogle,
      logout,
      checkLogout,
      clear,
      popupHandler,
      loadingHandler,
      beforeUnload,
      checkGoogleCode,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
})
</script>
