<template>
  <q-page class="tw-pt-1">
    <div class="tw-grid tw-grid-cols-3 tw-gap-2">
      <q-btn color="white" text-color="orange" class="tw-text-lg"
        unelevated to="/" label="<Back" no-caps
      />
      <h3 class="tw-text-gray-600 tw-text-xl tw-flex tw-justify-center tw-items-center">{{selectedMonth}}</h3>
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
          <div class="tw-px-2 tw-py-4 tw-text-gray-600 tw-text-center tw-border-r-2 tw-border-gray-600 tw-rounded tw-transition-all tw-duration-500 tw-ease-linear"
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
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {useStore} from 'vuex';
import api from 'src/api/axios';
import { API_ENDPOINTS } from 'src/api/index';
import {formatDate} from 'assets/formatDateToString'
import { Swiper, SwiperSlide } from 'swiper/vue';// Import Swiper Vue.js components
import 'swiper/css';

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

</script>
