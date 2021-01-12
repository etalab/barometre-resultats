<style scoped></style>

<template>
  <v-container
    :id="`rawdata-${settings.id}`"
    :trigger="`${trigger}`"
    :class="`${settings.containerClass}`"
    :trigger-vis="`${triggerVis}`"
    >
    <!-- v-show="canShow" -->

    <div
      v-show="!isLoading"
      >
      <h4>
        RawData <br>
        - routeId : {{ routeId }}<br>
        - settings.id : {{ settings.id }}<br>
        <!-- - settings: <br>
        <code>
          <pre>
            {{ settings }}
          </pre>
        </code> -->
      </h4>
      <br>

      <!-- <p> viewConfig :<br>
        <code>
          <pre>
            {{ viewConfig }}
          </pre>
        </code>
      </p> -->
      <p> localRawData :<br>
        <code>
          <pre>
            {{ localRawData }}
          </pre>
        </code>
      </p>

    </div>

    <!-- LOADER -->
    <div
      v-show="isLoading"
      class="flex-grow text-center py-3 px-5"
      >
      <LoaderCircular
        :size="70"
        :width="7"
        >
      </LoaderCircular>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

// import LoaderCircular from '~/components/UX/LoaderCircular.vue'

export default {
  name: 'RawData',

  components: {
    LoaderCircular: () => import('@/components/UX/LoaderCircular.vue')
  },

  props: ['settings', 'routeId'],

  data() {
    return {
      dataViewType: 'rawdatas',
      viewConfig: undefined,
      canShow: undefined,
      isLoading: false,

      datasetMappers: undefined,

      localRawData: undefined
    }
  },

  watch: {

  },

  beforeMount() {
    // set up view config
    this.viewConfig = this.getLocalConfig
    this.datasetMappers = this.viewConfig && this.viewConfig.datasetMappers
  },

  mounted() {
    // this.log && console.log("C-RawData / mounted ...")
    let newRawData = this.getRawData()
    // this.log && console.log("C-RawData / mounted ... newRawData :", newRawData)
    this.localRawData = newRawData
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      triggerVis: (state) => state.triggerVisChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      // isRouteLoading: (state) => state.isRouteLoading,
    }),

    ...mapGetters({
      // getCurrentLocale: "getCurrentLocale",
      getDataViewConfig: 'getDataViewConfig',
      // getSpecialStore: "data/getSpecialStore",
      // getFromInitData: "data/getFromInitData",
      // getFromDisplayedData: "data/getFromDisplayedData",
      getFromSpecialStoreData: 'data/getFromSpecialStoreData',
      // windowSize: "getWindowsSize",
      getDivCurrentVisibility: 'getDivCurrentVisibility',
    }),

    // config
    getLocalConfig() {
      let viewId = {
        dataViewType: this.dataViewType,
        id: this.settings.id,
      }
      let localConfig = this.getDataViewConfig(viewId)
      return localConfig
    },

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },

  },

  methods: {
    getCanShow() {
      let breakpoint = this.$vuetify.breakpoint.name
      let isVisible = this.getDivCurrentVisibility({
        div: { id: this.settings.id, routeId: this.routeId },
        breakpoint: breakpoint,
      })
      this.canShow = isVisible
    },

    getRawData() {
      this.isLoading = true

      const specialStoreId = this.datasetMappers.specialStoreId
      const fromDatasetKey = this.datasetMappers.fromDatasetKey
      const seriesMappers = this.datasetMappers.seriesMappers
      const formatterOpts = this.datasetMappers.format

      let dataSeries = []

      for (let mapper of seriesMappers) {
        // get serie values
        let rawDataSerie = this.getSpecialStoreData({
          id: specialStoreId,
          key: fromDatasetKey,
          sortParams: mapper && mapper.sortDataSerieBy,
        })
        // this.log && console.log('C-RawData / getRawData / rawDataSerie : ', rawDataSerie )
        
        let dataFromKey = mapper.dataFromKey
        let valuesSerie

        if (rawDataSerie && dataFromKey) {
          let tempSerie = []

        //   // 2 - get serie
        //   rawDataSerie.forEach((i) => {
        //     // this.log && console.log('\nC-ApexChart / getSeries / i : ', i )
        //     let value = i[dataFromKey]
        //     if (value && mapper.format) {
        //       value = switchFormatFunctions(value, mapper.format)
        //     }
        //     // if (value && formatterOpts) {
        //     //   this.log && console.log('\nC-ApexChart / getSeries / formatterOpts : ', formatterOpts )
        //     //   value = numberToString(value, formatterOpts)
        //     // }
        //     // this.log && console.log('C-ApexChart / getSeries / value : ', value )

        //     // 2bis - rebuild categories on x-axis
        //     if (mapper.buildAxisCategsX) {
        //       let settingsAxisX = mapper.buildAxisCategsXsettings
        //       let categ = i[settingsAxisX.fromKey]

        //       if (settingsAxisX.splitBy) {
        //         categ = splitMulti(
        //           categ,
        //           settingsAxisX.splitBy,
        //           settingsAxisX.splitGlue,
        //           settingsAxisX.capitalize
        //         )
        //         if (categ.length <= 1) {
        //           categ = categ.join("")
        //         }
        //       }
        //       // this.log && console.log('C-ApexChart / getSeries / categ : ', categ )
        //       let newValue = { x: categ, y: value }
        //       value = newValue
        //     }

        //     // 2ter - rebuild categories as labels
        //     if (mapper.buildLabels) {
        //       let settingsLabels = mapper.buildLabelsSettings
        //       let label = i[settingsLabels.fromKey]

        //       if (settingsLabels.splitBy) {
        //         label = splitMulti(
        //           label,
        //           settingsLabels.splitBy,
        //           settingsLabels.splitGlue,
        //           settingsLabels.capitalize
        //         )
        //         if (label.length <= 1) {
        //           label = label.join("")
        //         }
        //       }
        //       // this.log && console.log('C-ApexChart / getSeries / label : ', label )
        //       let newLabel = label
        //       dataLabels.push(newLabel)
        //     }

        //     // this.log && console.log('\nC-ApexChart / getSeries / value (bis) : ', value )
        //     tempSerie.push(value)

        //     // 2ter - rebuild colors on x-axis
        //     if (mapper.buildColorsAxisX) {
        //       let categCode = i[colorFromKey]
        //       // this.log && console.log('C-ApexChart / getSeries / categCode : ', categCode )

        //       // get referencial dataset
        //       let categColor = colorsReferences.find(
        //         (color) => color[colorMatchKey] == categCode
        //       )
        //       categColor = categColor
        //         ? categColor[colorValueFromKey]
        //         : colorFallback
        //       // this.log && console.log('C-ApexChart / getSeries / categColor : ', categColor )
        //       newColors.push(categColor)
        //     }
        //   })

        //   // this.log && console.log('\nC-ApexChart / getSeries / tempSerie : ', tempSerie )
        //   valuesSerie = tempSerie
          valuesSerie = rawDataSerie
        } else {
          valuesSerie = rawDataSerie
        }

        let dataSerie = {
          name: mapper.serieName,
          data: valuesSerie,
        }
        dataSeries.push(dataSerie)
      }

      this.isLoading = false
      return dataSeries
    },

    getSpecialStoreData(params) {
      // this.log &&
      //   console.log("C-RawData / getSpecialStoreData / params : ", params)
      let obj = this.getFromSpecialStoreData({
        id: params.id,
        key: params.key,
        sortParams: params.sortParams,
      })
      return obj
    },

  },
}
</script>
