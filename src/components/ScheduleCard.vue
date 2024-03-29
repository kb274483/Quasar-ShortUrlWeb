<template>
  <q-slide-item
    class="tw-my-2 tw-shadow-xl"
    left-color="teal"
    right-color="red"
    @left="editCardItem" 
    @right="isDeleteCard"
  >
    <template v-slot:left>
      <q-icon name="edit" />
    </template>
    <template v-slot:right>
      <q-icon name="delete_forever" />
    </template>
    <q-card class="tw-border-b-4 tw-border-r-4 tw-border-gray-500"
      :class="{
        'tw-opacity-50' : cardStatus ,
        'tw-bg-red-50' : isEdit
      }"
    >
      <q-card-section horizontal >
        <q-card-section class="tw-p-2 tw-w-full">
          <div class=" tw-text-gray-600 tw-text-lg tw-flex tw-justify-between tw-items-center">
            <q-input v-if="isEdit" dense v-model="cardTitle" label="Title" />
            <div v-else>
              {{props.title}}
            </div>
          </div>
          <q-input v-if="isEdit"
            v-model="cardContent"
            autogrow
          />
          <div v-else class="text-caption text-grey">
            {{props.content}}
          </div>
        </q-card-section>
      </q-card-section>
      <q-separator v-if="!isEdit" />
      <q-card-actions class="tw-flex tw-justify-between tw-items-center">
        <q-input v-if="isEdit" dense v-model="cardTime" mask="time" :rules="['time']">
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="cardTime" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-btn flat v-else>
          {{props.time}}
        </q-btn>
        <div v-if="isEdit">
          <q-btn flat @click="updateCardEdit()">
            Save
          </q-btn>
        </div>
        <div v-else>
          <label class="tw-text-gray-600 tw-font-semibold">Status：</label>
          <q-checkbox
            @click="updateCardEdit()"
            v-model="cardStatus"
            color="teal"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-slide-item>
  <!-- 刪除確認 -->
  <q-dialog persistent v-model="popup">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6 text-red-5 tw-flex tw-items-center tw-gap-2">
          <q-icon name="help_outline" color="red"/>
          {{popupTitle}}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{popupMessage}}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="No" color="gary" @click="resetSlideItem(tempReset)" v-close-popup />
        <q-btn flat label="Yes" color="red" @click="deleteCard(props.timestamp)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {useStore} from 'vuex';
import { useQuasar } from 'quasar';
import api from 'src/api/axios';
import { API_ENDPOINTS } from 'src/api/index';
import {formatDate} from 'assets/formatDateToString';

const emit = defineEmits(['update-edit','delete-card']);
const props = defineProps({
  timestamp:Number,
  title:String,
  content:String,
  date:String,
  time:String,
  status:Boolean,
})
const vuexStore = useStore();
// 訊息彈窗
const popup = ref(false)
const popupMessage = ref('')
const popupTitle = ref('')
// 卡片修改資訊
const cardStatus = ref(null);
const cardTitle = ref(null);
const cardContent = ref(null);
const cardTime = ref(null);
const isEdit = ref(false)
onMounted(()=>{
  cardStatus.value = props.status;
  cardTitle.value = props.title;
  cardContent.value = props.content;
  cardTime.value = props.time;
})
// 回傳修改
const updateCardEdit = ()=>{
  emit('update-edit',{
    timestamp:props.timestamp,
    status:cardStatus.value,
    title:cardTitle.value,
    content:cardContent.value,
    time:cardTime.value,
    isEdit:false,
    status:cardStatus.value,
  })
  isEdit.value = false
}
// 刪除卡片
const isDeleteCard = ({ reset })=>{
  tempReset.value = reset
  popup.value = true
  popupMessage.value = "Please confirm whether to delete this itinerary"
  popupTitle.value = "Question"
}
const deleteCard = (timestamp)=>{
  emit('delete-card',timestamp)
}
const tempReset = ref(null)
const resetSlideItem = (reset)=>{
  if(tempReset != null) reset()
}
// 編輯卡片
const editCardItem = ({ reset })=>{
  isEdit.value = true
  tempReset.value = reset
  resetSlideItem(tempReset.value)
}

</script>
