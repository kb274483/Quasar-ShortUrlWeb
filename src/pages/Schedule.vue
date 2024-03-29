<template>
  <q-page class="tw-pt-2 tw-pb-6">
    <!-- 返回 ＆ 日期 -->
    <div class="tw-grid tw-grid-cols-3 md:tw-grid-cols-5 tw-gap-2">
      <q-btn color="white" text-color="orange" class="tw-text-lg"
        unelevated to="/" label="<Back" no-caps
      />
      <h3 class="tw-text-gray-600 tw-text-xl tw-flex tw-justify-center tw-items-center md:tw-col-span-3">
        {{selectedMonth}}
      </h3>
      <q-btn icon="event" round color="orange" 
        class="tw-w-4 tw-place-self-center"
      >
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="selectedDate" color="orange" minimal>
            <div class="row items-center justify-end q-gutter-sm ">
              <q-btn label="OK" color="orange" flat @click="saveDate" v-close-popup />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-btn>
    </div>
    <!-- Swiper -->
    <div class="tw-w-4/5 tw-mx-auto tw-flex tw-justify-center">
      <swiper
        ref="swiper"
        centeredSlides
        :initialSlide="dateInit"
        :slides-per-view="5"
        :space-between="10"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        slideToClickedSlide
      > 
        <swiper-slide v-for="date in datesArray" :key="date.dateStr" v-slot="{ isActive }">
          <div class="tw-p-2 tw-text-gray-600 tw-text-center tw-border-r-2 tw-border-gray-600 tw-rounded tw-transition-all tw-duration-500 tw-ease-linear"
            :class="isActive ? 'tw-bg-orange-300' : 'tw-bg-orange-100 tw-opacity-30'"
          >
            <div>
              {{date.date}}
            </div>
            <div>
              {{date.dayOfWeek}}
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 行程卡片 -->
    <div class="tw-mx-2 tw-mt-2">
      <Card
        v-for="card in scheduleCardArr" :key="card.Timestamp"
        @updateEdit="updateEdit"
        @deleteCard="deleteCard"
        :timestamp="card.Timestamp"
        :title="card.Title"
        :content="card.Content"
        :date="card.Date"
        :time="card.Time"
        :status="card.Status"
      />
      <div class="tw-w-full tw-mt-4 tw-border tw-border-teal-500 tw-rounded">
        <q-btn
          class="tw-w-full" 
          label="Add Event" 
          color="teal" 
          flat 
          icon="note_add"
          @click="isAddEventModel = true" 
        />
      </div>
    </div>
    <!-- 設定事件 -->
    <q-dialog v-model="isAddEventModel">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6 text-red-5 tw-flex tw-items-center tw-gap-2">
            <q-input dense label="Title" 
              standout="bg-teal-4 text-white" 
              v-model="eventObject.title"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input label="Event content"
            standout="bg-teal-4 text-white" 
            autogrow
            v-model="eventObject.content"
          />
          <q-input label="Time" dense v-model="eventObject.time" mask="time" :rules="['time']">
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="eventObject.time" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="gary" @click="clearAddEvent()" />
          <q-btn flat label="Add Event" color="red" @click="addNewEvent()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {useStore} from 'vuex';
import api from 'src/api/axios';
import { API_ENDPOINTS } from 'src/api/index';
import {formatDate} from 'assets/formatDateToString';
import { Swiper, SwiperSlide } from 'swiper/vue';// Import Swiper Vue.js components
import 'swiper/css';
import Card from 'components/ScheduleCard.vue';

const vuexStore = useStore()
const emit = defineEmits(['emit-loading','emit-popup']);

const dayAbbr = ref(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
const monthAbbr = ref(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
// 根據當日與前幾天(start)、後幾天(end)產生日期陣列
const generateDatesArr = (setDate,start,end)=>{
  const arr = [];
  const today = new Date(setDate);
  const oneDay = 24 * 60 * 60 * 1000;
  for (let i = start; i <= end; i++) {
    const dateStr = formatDate(new Date(today.getTime() + (i * oneDay)));
    const date = new Date(today.getTime() + (i * oneDay)).getDate();
    const dayOfWeekNum = new Date(today.getTime() + (i * oneDay)).getDay()
    const dayOfWeek = dayAbbr.value[dayOfWeekNum]
    arr.push({
      dateStr,
      date,
      dayOfWeek,
    });
  }
  return arr;
}
const userName = computed(() => vuexStore.state.module.userName);
// 選擇的日期
const selectedDate = ref(formatDate(new Date()));
watch(selectedDate,(newVal)=>{
  let dateArrIdx = datesArray.value.findIndex(item=>item.dateStr == newVal)
  if(dateArrIdx == -1){
    datesArray.value = generateDatesArr(newVal,-7,7)
    swiperIns.value.slideTo(7)
  }else{
    swiperIns.value.slideTo(dateArrIdx)
  }
  getDailyScheduleData()
})
const selectedMonth = ref(monthAbbr.value[new Date().getMonth()]);
const datesArray = ref(generateDatesArr(selectedDate.value,-7,7));
// 當天日期初始值
const dateInit = ref(null);
dateInit.value = datesArray.value.findIndex(item => item.dateStr == selectedDate.value);

// Swiper
const swiperIns = ref(null)
const onSwiper = (swiper)=>{
  swiperIns.value = swiper
}
const onSlideChange = (swiper) => {
  let date = datesArray.value[swiper.activeIndex].dateStr;
  selectedDate.value = date;
  selectedMonth.value = monthAbbr.value[new Date(date).getMonth()];
  if(swiper.activeIndex == 0){
    datesArray.value.unshift(...generateDatesArr(selectedDate.value,-7,-1))
    swiperIns.value.slideTo(7)
  }else if(swiper.activeIndex == datesArray.value.length-1){
    datesArray.value.push(...generateDatesArr(selectedDate.value,1,7))
  }
};
const dataFilterName = ref(['Account','Content','Date','Status','Time','Timestamp','Title'])
// 取得當日行程資料
const getDailyScheduleData = ()=>{
  emit('emit-loading',true)
  api.post(API_ENDPOINTS.GET_DAILY_SCHEDULE,{
    account : userName.value,
    date : selectedDate.value
  }).then((res)=>{ 
    if(res.data.data !== null){
      // 篩選掉golang回傳null的值
      scheduleCardArr.value = res.data.data.Items.map(item=>{
        dataFilterName.value.forEach((filter)=>{
          let val = Object.values(item[filter]).filter(val=>val !== null)
          item[filter] = val[0]
        })
        item.Timestamp = parseInt(item.Timestamp)
        return item
      })
      // 發現不能依靠時間戳來判斷先後順序，改用時間
      scheduleCardArr.value.sort((a, b) => {
        const time2Min = (time) => {
          const [hr, min] = time.split(':').map(Number);
          return hr * 60 + min;
        };
        return time2Min(a.Time) - time2Min(b.Time);
      });
    }
    emit('emit-loading', false)
  }).catch((err)=>{
    console.log(err)
    emit('emit-loading', false)
    emit('emit-popup',
      {
        popupTitle: 'Warning', 
        popupMessage: err.response?.data?.error || 'Server Error', 
        popup: true,
        popupIconType:1,
        tokenExpired:true
      }
    )
  })
}
// 行程卡片陣列
const scheduleCardArr = ref([])
// 更新卡片
const updateEdit = (content)=>{
  emit('emit-loading', true)
  api.post(API_ENDPOINTS.UPDATE_DAILY_SCHEDULE,content).then((res)=>{
    let idx = scheduleCardArr.value.findIndex(item=>item.Timestamp == content.timestamp)
    if(idx != -1){
      scheduleCardArr.value[idx].Title = content.title
      scheduleCardArr.value[idx].Content = content.content
      scheduleCardArr.value[idx].Status = content.status
      scheduleCardArr.value[idx].Time = content.time
    }
    emit('emit-loading', false)
  }).catch((err)=>{
    console.log(err)
    emit('emit-loading', false)
    emit('emit-popup',
      {
        popupTitle: 'Warning', 
        popupMessage: err.response?.data?.error || 'Server Error', 
        popup: true,
        popupIconType:1,
      }
    )
  })
}
const deleteCard = (timestamp)=>{
  emit('emit-loading', true)
  api.post(API_ENDPOINTS.DELETE_DAILY_SCHEDULE,{timestamp}).then((res)=>{
    let idx = scheduleCardArr.value.findIndex(item=>item.Timestamp === timestamp)
    scheduleCardArr.value.splice(idx,1)
    emit('emit-loading', false)
  }).catch((err)=>{
    console.log(err)
    emit('emit-loading', false)
    emit('emit-popup',
      {
        popupTitle: 'Warning', 
        popupMessage: err.response?.data?.error || 'Server Error', 
        popup: true,
        popupIconType:1,
      }
    )
  })
}
// 新增事件
const isAddEventModel = ref(false)
const eventObject = ref({
  account:userName.value,
  timestamp:"",
  title:"",
  content:"",
  status:false,
  date:selectedDate.value,
  time:"07:00",
  idEdit:false
})
const checkEvent = ()=>{
  if(eventObject.value.title == "" || eventObject.value.content == "" || eventObject.value.time == ""){
    return true;
  }else return false;
}
const addNewEvent = ()=>{
  if(checkEvent()){
    emit('emit-popup',
      {
        popupTitle: 'Warning', 
        popupMessage: 'You missed some parts', 
        popup: true,
        popupIconType:1
      }
    )
    return;
  }
  eventObject.value.timestamp = Date.now();
  emit('emit-loading',true)
  api.post(API_ENDPOINTS.ADD_DAILY_SCHEDULE,eventObject.value).then((res)=>{ 
    emit('emit-loading', false)
    getDailyScheduleData()
  }).catch((err)=>{
    console.log(err)
    emit('emit-loading', false)
  })
  clearAddEvent()
}
// 清空新增欄位
const clearAddEvent = ()=>{
  isAddEventModel.value = false
  eventObject.value = {
    account:userName.value,
    timestamp:null,
    title:"",
    content:"",
    status:false,
    date:selectedDate.value,
    time:"07:00",
    idEdit:false
  }
}

onMounted(()=>{
  getDailyScheduleData()
})

</script>
