<template>
  <q-layout view="hHh lpR fFf">

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
        <q-card-section>
          <div class="text-h5 text-center">Login</div>
        </q-card-section>

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

        <q-card-actions align="right" class="text-red">
          <q-btn flat label="Cancel" v-close-popup @click="clear()" />
          <q-btn flat label="Login" @click="login()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 訊息框 -->
    <q-dialog v-model="popup">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Message</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{popupMessage}}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script >
import { defineComponent, ref,computed, onMounted } from 'vue'
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
    const vuexStore = useStore()
    const isLoginStatus = computed(() => vuexStore.state.module.isLoginStatus);
    const loginUserName = computed(() => vuexStore.state.module.userName);
    const isPwd = ref(true)
    // 用戶登入資料
    const memberData = ref({
      account : '',
      password : ''
    })
    // 右側選單開關
    const rightDrawerOpen = ref(false)
    // 登入視窗控制
    const isUserLoginCtl = ref(false)
    // 登入
    const login = () => {
      if(memberData.value.account === '' || memberData.value.password === ''){
        popupMessage.value = 'Please enter account and password'
        popup.value = true
        return
      }
      api.post(API_ENDPOINTS.LOGIN,memberData.value).then((res)=>{
        if(res.status === 200){
          vuexStore.commit('module/setLoginStatus', true);
          vuexStore.commit('module/setJWTToken', res.data.token);
          vuexStore.commit('module/setUserName', res.data.user_name);
          isUserLoginCtl.value = false
          popupMessage.value = res.data.msg
          popup.value = true
        }
      }).catch((err)=>{
        console.log(err)
        vuexStore.commit('module/setLoginStatus', false);
        isUserLoginCtl.value = false
        popupMessage.value = `${err.response.statusText}-${err.response.data.error}`
        popup.value = true
      })
    }
    // 清空欄位
    const clear = ()=>{
      memberData.value.account = ''
      memberData.value.password = ''
    }
    // 訊息彈窗
    const popup = ref(false)
    const popupMessage = ref('')
    return {
      essentialLinks: linksList,
      popup,
      popupMessage,
      isLoginStatus,
      isUserLoginCtl,
      loginUserName,
      isPwd,
      memberData,
      rightDrawerOpen,
      login,
      clear,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
})
</script>
