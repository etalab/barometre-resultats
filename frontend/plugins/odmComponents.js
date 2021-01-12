
import Vue from 'vue'

const components = {

  ReturnBtn: () => import(/* webpackChunkName: "ReturnBtn" */ '@/components/UX/ReturnBtn.vue'),

  GlobalButtons: () => import(/* webpackChunkName: "GlobalButtons" */ '@/components/UX/GlobalButtons.vue'),
  Numbers: () => import(/* webpackChunkName: "Numbers" */ '@/components/DataViews/Numbers.vue'),
  ApexChart: () => import(/* webpackChunkName: "ApexChart" */ '@/components/DataViews/ApexChart.vue'),
  TextFrame: () => import(/* webpackChunkName: "TextFrame" */ '@/components/DataViews/TextFrame.vue'),
  InfoBox: () => import(/* webpackChunkName: "InfoBox" */ '@/components/UI/InfoBox.vue'),

  LoaderCircular: () => import(/* webpackChunkName: "LoaderCircular" */ '@/components/UX/LoaderCircular.vue'),
  LoaderLinear: () => import(/* webpackChunkName: "LoaderLinear" */ '@/components/UX/LoaderLinear.vue'),

  KpiProgressBar: () => import(/* webpackChunkName: "KpiProgressBar" */ '@/components/DataViews/KpiProgressBar.vue'),
  KpiProgressPie: () => import(/* webpackChunkName: "KpiProgressPie" */ '@/components/DataViews/KpiProgressPie.vue'),
  KpiValue: () => import(/* webpackChunkName: "KpiValue" */ '@/components/DataViews/KpiValue.vue')

}

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
