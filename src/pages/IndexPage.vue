<template>
  <q-page class="">
    <div class="flex justify-center q-mt-lg">
      <q-input outlined v-model="url" label="Enter your URL" style="width:50%;"/>
      <q-btn flat style="color: #FF0080" label="Generate" @click="generate()" />
    </div>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
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
import { ref } from 'vue'
import Axios from 'axios'

const alert = ref(false)
const alertMessage = ref('')
const url = ref('')
const generate = () => {
  if(isValidUrl(url.value)){
    // Axios.get('https://kb274483-practice-flaskapp.herokuapp.com/songAPI').then((res)=>{
    //   console.log(res)
    // }).catch((err)=>{
    //   console.log(err)
    // })
  }else{
    alertMessage.value = 'Please enter a valid URL'
    alert.value = true
  }
}

// 初步檢查輸入的字串是否為網址
const isValidUrl = (url)=>{
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
  return urlPattern.test(url);
}
const clearURLInput = () => {
  url.value = ''
  alert.value = false
}

</script>

