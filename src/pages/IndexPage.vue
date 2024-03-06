<template>
  <q-page class="">
    <div class="flex justify-center tw-py-4">
      <q-input outlined v-model="url" label="Enter your URL" style="width:50%;"/>
      <q-btn flat style="color: #FF0080" label="Generate" @click="generate()" />
    </div>
    <div class="flex justify-center tw-py-4">
      <div class="resultContainer">
        <q-slide-transition>
          <div v-show="getResult">
            <div class="flex justify-between items-center">
              <p class="text-grey-8 q-mb-none text-h6">Your URL :</p>
              <q-icon name="content_copy" @click="copyUrl()" class="text-grey-8"
                style="margin-left:1.5rem; cursor:pointer ; font-size: 1.5em" 
              />
            </div>
            <p class="text-grey-8 text-h6 text-wrap">{{resultUrl}}</p>
          </div>
        </q-slide-transition>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref ,defineEmits} from 'vue'
import {useStore} from 'vuex';
import api from 'src/api/axios';
import { API_ENDPOINTS } from 'src/api/index';

const emit = defineEmits(['emit-loading','emit-popup']);
const vuexStore = useStore()
const url = ref('')
const resultUrl = ref('')
const getResult = ref(false)
const userName = computed(() => vuexStore.state.module.userName);

// 透過API產生短網址
const generate = () => {
  if(isValidUrl(url.value)){
    emit('emit-loading', true)
    api.post(API_ENDPOINTS.GENERATE_SHORTEN_URL,{url:url.value,user:userName.value}
    ).then((res)=>{
      url.value = ''
      resultUrl.value = res.data.short_url
      getResult.value = true
      emit('emit-loading', false)
    }).catch((err)=>{
      console.log(err)
      emit('emit-loading', false)
    })
  }else{
    emit('emit-popup',
      {
        popupTitle: 'Warning',
        popupMessage: 'Please enter a valid URL',
        popup: true,
        popupIconType:1
      }
    )
  }
}
// 初步檢查輸入的字串是否為網址
const isValidUrl = (url)=>{
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=\u4E00-\u9FA5\uF900-\uFA2D]*)?$/;
  return urlPattern.test(url);
}
const clearURLInput = () => {
  url.value = ''
  alert.value = false
}
// 複製短網址
const copyUrl = () => {
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(resultUrl.value).then(()=>{
      emit('emit-popup',
        {
          popupTitle: 'Success',
          popupMessage: 'Please enter a valid URL',
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

<style lang="scss" scoped>
.text-gray-8 {
  color: $grey-8;
}
.text-red-4{
  color: $red-4;
}
.text-wrap{
  overflow-wrap: break-word;
}
.resultContainer{
  width: 60%; 
  border: 1px solid $grey-3;
  border-radius: 5px;
  background-color: $grey-1;
  @media screen and (max-width: $breakpoint-xs-max) {
    width: 95% ;
  }
}
</style>