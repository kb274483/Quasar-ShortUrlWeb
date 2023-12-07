<template>
  <q-page class="">
    <div class="flex justify-center q-mt-lg">
      <q-input outlined v-model="url" label="Enter your URL" style="width:50%;"/>
      <q-btn flat style="color: #FF0080" label="Generate" @click="generate()" />
    </div>
    <div class="flex justify-center q-mt-lg">
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
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6 text-red-4">{{alertTitle}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{alertMessage}}
        </q-card-section>
        <q-card-actions align="right" @click="clearURLInput()">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Axios from 'axios'

const alert = ref(false)
const alertMessage = ref('')
const alertTitle = ref('')
const url = ref('')
const resultUrl = ref('')
const getResult = ref(false)
// 透過API產生短網址
const generate = () => {
  if(isValidUrl(url.value)){
    // 13.115.250.182/
    Axios.post('http://13.115.250.182/url_api/generate_short_url',{url:url.value}
    ).then((res)=>{
      url.value = ''
      resultUrl.value = res.data.short_url
      getResult.value = true
    }).catch((err)=>{
      console.log(err)
    })
  }else{
    alertTitle.value = 'Warning'
    alertMessage.value = 'Please enter a valid URL'
    alert.value = true
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
  navigator.clipboard.write([new ClipboardItem({ "text/plain": new Blob([resultUrl.value], { type: "text/plain" }) })])
  .then(() => {
    alertTitle.value = 'Success'
    alertMessage.value = 'Copied to clipboard'
    alert.value = true
  })
  .catch((err) => {
    console.log(err);
    alertTitle.value = 'Warning'
    alertMessage.value = 'Copy failed，Http does not support'
    alert.value = true
  });
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
  padding: 10px;
  background-color: $grey-1;
  @media screen and (max-width: $breakpoint-xs-max) {
    width: 95% ;
  }
}
</style>