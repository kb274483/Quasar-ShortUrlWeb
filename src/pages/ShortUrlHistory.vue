<template>
  <q-page class="">
    <q-btn color="white" text-color="orange" class="tw-text-lg"
      unelevated to="/" label="<Back" no-caps
    />

    <q-dialog v-model="alert">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-red-4">{{alertTitle}}</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{alertMessage}}
        </q-card-section>
        <q-card-actions align="right" >
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {useStore} from 'vuex';
import api from 'src/api/axios';
import { API_ENDPOINTS } from 'src/api/index';

const vuexStore = useStore()
const alert = ref(false)
const alertMessage = ref('')
const alertTitle = ref('')
const userName = computed(() => vuexStore.state.module.userName);

onMounted(() => {
  api.post(API_ENDPOINTS.GET_MEMBER_HISTORY,{user:userName.value}
  ).then((res)=>{
    console.log(res.data)
    historyArr.value = res.data.data.Items
  }).catch((err)=>{
    console.log(err)
  })
})

</script>
