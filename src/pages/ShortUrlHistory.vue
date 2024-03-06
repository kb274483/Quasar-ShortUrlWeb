<template>
  <q-page class="">
    <q-btn color="white" text-color="orange" class="tw-text-lg"
      unelevated to="/" label="<Back" no-caps
    />
    <div class="tw-flex tw-justify-center">
      <div class="tw-w-full lg:tw-w-3/4 tw-border tw-shadow-inner tw-rounded tw-p-4">
        <p class="tw-text-gray-600 tw-text-xl tw-text-center">Your History Record</p>
        <q-list bordered class="tw-rounded tw-shadow-inner tw-mt-4">
          <q-item clickable v-ripple class="tw-border-b-2 tw-border-gray-200">
            <div class="tw-w-full tw-grid tw-grid-cols-4 md:tw-grid-cols-6 tw-gap-2 tw-place-items-center">
              <span class="tw-col-span-2 md:tw-col-span-1">Date</span>
              <span class="tw-col-span-3 tw-hidden md:tw-block">Original</span>
              <span>Link</span>
              <span>Copy</span>
            </div>
          </q-item>
          <q-item clickable v-ripple class="tw-border-b-2 tw-border-gray-200"
            v-for="item in historyArr" :key="item.ID.S"
          >
            <div class="tw-w-full tw-grid tw-grid-cols-4 md:tw-grid-cols-6 tw-gap-2 tw-place-items-center">
              <span class="tw-col-span-2 md:tw-col-span-1">{{item.Date.S}}</span>
              <span style="word-break: break-all;"
                class="tw-w-full tw-col-span-3 tw-hidden md:tw-block"
              >
                {{item.Url.S}}
              </span>
              <q-btn color="white" text-color="orange" class="tw-text-lg" target="_blank"
                unelevated :href="`https://brief-url.link/url_api/${item.ID.S}`" 
                icon="link"
              />
              <q-btn color="white" text-color="orange" class="tw-text-base"
                unelevated icon="content_copy" @click="copyUrl(item.ID.S)"
              />
            </div>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {useStore} from 'vuex';
import api from 'src/api/axios';
import { API_ENDPOINTS } from 'src/api/index';

const emit = defineEmits(['emit-loading','emit-popup']);
const vuexStore = useStore()
const userName = computed(() => vuexStore.state.module.userName);
const historyArr = ref([])
const isLoading = ref(false)

onMounted(() => {
  emit('emit-loading', true)
  getHistory()
})
// 取得歷史紀錄
const getHistory = () => {
  api.post(API_ENDPOINTS.GET_MEMBER_HISTORY,{user:userName.value}
  ).then((res)=>{ 
    historyArr.value = res.data.data.Items.reverse()
    emit('emit-loading', false)
  }).catch((err)=>{
    console.log(err)
    emit('emit-loading', false)
  })
}
// 複製短網址
const copyUrl = (copyValue) => {
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(`https://brief-url.link/url_api/${copyValue}`).then(()=>{
      emit('emit-popup',
        {
          popupTitle: 'Success',
          popupMessage: 'Copied to clipboard',
          popup: true,
          popupIconType:0
        }
      )
    }).catch((err)=>{
      console.log(err)
      emit('emit-popup',
        {
          popupTitle: 'Warning', 
          popupMessage: 'Copy failed，Http does not support', 
          popup: true,
          popupIconType:1
        }
      )
    })
  }else{
    emit('emit-popup', 
      {
        popupTitle: 'Warning',
        popupMessage: 'Copy failed，Http does not support', 
        popup: true,
        popupIconType:1
      }
    )
  } 
}
</script>
