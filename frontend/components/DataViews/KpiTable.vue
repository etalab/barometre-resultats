<style scoped>
.has-scrollbar {
  overflow-y: scroll !important;
}
.kpi-group{
  border-bottom: 1px solid;
  border-color: #BDBDBD;
}
.kpi-headers{
  border-bottom: 1px solid;
}
.kpi-indicator{
  border-bottom: 1px dashed;
}
.transparent {
  color: rgba(0, 0, 0, 0)
}
.light-shadow {
  box-shadow: none !important;
}
.simple-link {
  text-decoration: none;
}
.rotate-div-180 {
  transform: rotate(180deg);
}
.flip {
  transform: scaleX(-1) rotate(180deg);
}
</style>

<template>
  <v-container
    :id="`kpi-table-${settings.id}`"
    :trigger="`${trigger}`"
    :class="`${settings.containerClass}`"
    :trigger-vis="`${triggerVis}`"
    >
    
    <!-- KPI DATA -->
    <div
      v-show="!isLoading"
      class="pt-0"
      >

      <v-divider v-if="viewConfig.dividers.before" />

      <!-- MAIN KPI TITLE -->
      <v-row
        v-if="viewConfig.kpiTitle && viewConfig.kpiTitle[locale]"
        class="justify-center odm-kpi-head"
        >
        <v-col
          cols="12"
          class=""
          >
          <div
            :class="`kpi-title ${viewConfig.kpiTitleClass}`"
            >
            <span 
              v-if="viewConfig.titlePreffixSpecialStoreId"
              :class="viewConfig.titlePreffixClass"
              >
              {{ getSpecialStore[viewConfig.titlePreffixSpecialStoreId] }}
            </span>
            <span v-html="viewConfig.kpiTitle[locale]" />
            <span 
              v-if="viewConfig.titleSuffixSpecialStoreId"
              :class="viewConfig.titleSuffixClass"
              >
              {{ getSpecialStore[viewConfig.titleSuffixSpecialStoreId] }}
            </span>
          </div>
        </v-col>
      </v-row>

      <!-- KPI FAMILIES -->

      <KpiTableSimple
        v-if="viewConfig.kpiComponentType === 'KpiTableSimple'"
        :viewConfig="viewConfig"
        :datasetMappers="datasetMappers"
        :isLoading="isLoading"
        :isLoadingNewData="isLoadingNewData"
        :localRawData="localRawData"
        :routeId="routeId"
        >
      </KpiTableSimple>

      <KpiTableBlocks
        v-if="viewConfig.kpiComponentType === 'KpiTableBlocks'"
        :viewConfig="viewConfig"
        :datasetMappers="datasetMappers"
        :isLoading="isLoading"
        :isLoadingNewData="isLoadingNewData"
        :localRawData="localRawData"
        :routeId="routeId"
        >
      </KpiTableBlocks>

      <br><br><br>

      <!-- DEBBUGGING -->
      <!-- <hr> -->
      <!-- <h4>
        KPI table <br>
        - routeId : {{ routeId }}<br>
        - settings.id : {{ settings.id }}<br>
        - settings: <br>
        <code>
          <pre>
            {{ settings }}
          </pre>
        </code>
      </h4>
      <br> -->

      <!-- <v-row>
        <v-col cols="6">
          <p> viewConfig :<br>
            <code>
              <pre>
                {{ viewConfig }}
              </pre>
            </code>
          </p>
        </v-col>
        <v-col cols="6">
          <p> localRawData :<br>
            <code>
              <pre>
                {{ localRawData }}
              </pre>
            </code>
          </p>
        </v-col>
      </v-row> -->

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
import { switchFormatFunctions, objectFromPath, findElementFromArrayAndId, objectToUrlParams } from '~/utils/utils'
import { mapState, mapGetters } from 'vuex'

// import KpiTableSimple from '~/components/DataViews/KpiTableSimple.vue'
// import KpiTableBlocks from '~/components/DataViews/KpiTableBlocks.vue'

// import TextFrame from '~/components/DataViews/TextFrame.vue'
// import KpiProgressBar from '~/components/DataViews/KpiProgressBar.vue'
// import KpiProgressPie from '~/components/DataViews/KpiProgressPie.vue'

// import LoaderCircular from '~/components/UX/LoaderCircular.vue'
// import LoaderLinear from '~/components/UX/LoaderLinear.vue'


export default {
  name: 'KpiTable',

  components: {
    KpiTableSimple: () => import(/* webpackChunkName: "KpiTableSimple" */ '@/components/DataViews/KpiTableSimple.vue'),
    KpiTableBlocks: () => import(/* webpackChunkName: "KpiTableBlocks" */ '@/components/DataViews/KpiTableBlocks.vue'),
    // LoaderCircular: () => import(/* webpackChunkName: "LoaderCircular" */ '@/components/UX/LoaderCircular.vue'),
  },

  props: ['settings', 'routeId'],

  data() {
    return {
      dataViewType: 'kpitables',
      viewConfig: undefined,
      canShow: undefined,
      isLoading: false,
      isLoadingNewData: false,
      delay: 250,

      dialog: false,
      dialogs: {},

      datasetMappers: undefined,
      localRawData: undefined,

      infosText: {
        fr: 'infos'
      },
      noDataText: {
        fr: '-'
      },
      noLocalDataText: {
        fr: 'pas de données'
      },
  
      itemsPerPage: 100,

    }
  },

  watch: {
    trigger (next, prev) {
      // this.log && console.log("C-KpiTable / watch / trigger ...")
      this.isLoadingNewData = true
      let newRawData = this.getRawData()
      this.localRawData = newRawData
      setTimeout(() => (this.isLoadingNewData = false), this.delay)
    },
  },

  beforeMount() {
    // this.log && console.log("C-KpiTable / beforeMount ...")
    // set up view config
    this.viewConfig = this.getLocalConfig
    this.datasetMappers = this.viewConfig && this.viewConfig.datasetMappers

    // this.log && console.log("C-KpiTable / beforeMount / this.$store.state.data : ", this.$store.state.data )
  },

  mounted() {
    // this.log && console.log("C-KpiTable / mounted ...")
    this.isLoading = true
    let newRawData = this.getRawData()
    // this.log && console.log("C-KpiTable / mounted ... newRawData :", newRawData)
    this.localRawData = newRawData
    setTimeout(() => (this.isLoading = false), this.delay)
    // this.isLoading = false
    this.$store.commit('toggleTriggerComponentLoaded')
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
      getSpecialStore: 'data/getSpecialStore',
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

    // isMobileWidth() {
    //   let breakpoints = this.mobileBreakpoints
    //   let currentBreakpoint = this.$vuetify.breakpoint.name
    //   return breakpoints.includes(currentBreakpoint)
    // },

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
      const specialStoreId = this.datasetMappers.specialStoreId
      const fromDatasetKey = this.datasetMappers.fromDatasetKey
      const seriesMappers = this.datasetMappers.seriesMappers
      const formatterOpts = this.datasetMappers.format

      let dataSeries = []

      for (let mapper of seriesMappers) {
        let rawDataSerie = this.getSpecialStoreData({
          id: specialStoreId,
          key: fromDatasetKey,
          sortParams: mapper && mapper.sortDataSerieBy,
        })
        // this.log && console.log('C-KpiTable / getRawData / rawDataSerie : ', rawDataSerie )
        
        let dataFromKey = mapper.dataFromKey
        let valuesSerie

        if (rawDataSerie && dataFromKey) {
          let tempSerie = []
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

      return dataSeries
    },

    getSpecialStoreData(params) {
      // this.log &&
      //   console.log("C-KpiTable / getSpecialStoreData / params : ", params)
      let obj = this.getFromSpecialStoreData({
        id: params.id,
        key: params.key,
        sortParams: params.sortParams,
      })
      return obj
    },

    // getKpiSettingsTexts(kpi, componentType = 'text') {
    //   let textSettingsArray = kpi.afterTitleComponents && kpi.afterTitleComponents.filter(comp => comp.component === componentType)
    //   return textSettingsArray
    // },

  //   getKpisFromKpiGroup (kpiGroup, item, field) {
  //     // this.log && console.log("\nC-KpiTable / getKpisFromKpiGroup / kpiGroup : ", kpiGroup)
  //     // this.log && console.log("C-KpiTable / getKpisFromKpiGroup / item : ", item)
  //     // this.log && console.log("C-KpiTable / getKpisFromKpiGroup / field : ", field)
  //     // this.log && console.log("C-KpiTable / getKpisFromKpiGroup / item.odmKeyfield : ", item.odmKeyfield)
  //     let kpis = kpiGroup.kpis
  //     // this.log && console.log("C-KpiTable / getKpisFromKpiGroup / kpis : ", kpis)
  //     let kpi = kpis && kpis.find((kpi) => kpi.fromDatasetKeyValue === item['odmKeyfield'])
  //     // this.log && console.log("C-KpiTable / getKpisFromKpiGroup / kpi : ", kpi)

  //     // let kpiModalsParams = kpis.find((kpi) => kpi.dialogComponent && kpi.fromDatasetKeyValue === item['odmKeyfield'] && kpi.dialogComponent.onHeader === field)
  //     let kpiModalsParams = kpi && kpi.dialogComponents && kpi.dialogComponents.find((dialogComp) => dialogComp.onHeader === field)
  //     // this.log && console.log("C-KpiTable / getKpisFromKpiGroup / kpiModalsParams : ", kpiModalsParams)
  //     return kpiModalsParams
  //   },

  //   formatKpiData(kpiFamily, kpiGroupSettings) {
  //     // this.log && console.log("\nC-KpiTable / formatKpiData / kpiFamily : ", kpiFamily)
  //     // this.log && console.log("C-KpiTable / formatKpiData / kpiGroupSettings : ", kpiGroupSettings)
  //     // get kpi serie data
  //     const data = this.localRawData && this.localRawData[0].data
  //     // this.log && console.log("C-KpiTable / formatKpiData / data : ", data)

  //     let serie = []

  //     // reformat data
  //     if (data) {
  //       const kpiDataKey = kpiGroupSettings.kpiDataFromDatasetKey
  //       const kpiDatasetKey = kpiGroupSettings.fromDatasetKey
  //       const kpiDatasetKeyValue = kpiGroupSettings.fromDatasetKeyValue
  //       const headers = kpiGroupSettings.headers
  //       const kpiDataFormat = kpiGroupSettings.formatKpis
  //       // this.log && console.log("C-KpiTable / formatKpiData / kpiDataKey : ", kpiDataKey)
  //       // this.log && console.log("C-KpiTable / formatKpiData / kpiDatasetKey : ", kpiDatasetKey)
  //       // this.log && console.log("C-KpiTable / formatKpiData / kpiDatasetKeyValue : ", kpiDatasetKeyValue)
  //       // this.log && console.log("C-KpiTable / formatKpiData / headers : ", headers)

  //       let series = data && data.find(item => item[kpiDatasetKey] === kpiDatasetKeyValue)
  //       // // this.log && console.log("C-KpiTable / formatKpiData / series : ", series)

  //       let kpiGroupSerie = series && series[kpiDataKey]

  //       if (kpiGroupSerie) {
  //         kpiGroupSettings.kpis.forEach(kpi => {
  //           // this.log && console.log("C-KpiTable / formatKpiData / kpi : ", kpi)
  //           const kpiKey = kpi.fromDatasetKeyValue
  //           // this.log && console.log("C-KpiTable / formatKpiData / kpiKey : ", kpiKey)
  //           const rawValues = kpiGroupSerie.find(item => Object.keys(item).includes(kpiKey) )
  //           let values = rawValues[kpiKey][0]
  //           if (kpiGroupSettings.appendKeyToValues) {
  //             values[kpiDataKey] = kpi.kpiTitle[this.locale]
  //           }
  //           const formattedVals = {}
  //           for(let [k, v] of Object.entries(values)) {
  //             const formatSettings = kpiDataFormat.find(format => format.key === k)
  //             if ( !v ) {
  //               formattedVals[k] = this.noDataText[this.locale]
  //             } 
  //             else if (formatSettings) {
  //               formattedVals[k] = switchFormatFunctions(v, formatSettings.format)
  //             } else {
  //               formattedVals[k] = v
  //             }
  
  //             // append odm keyfield
  //             formattedVals['odmKeyfield'] = kpiKey
  //             formattedVals['odmDialogKey'] = `${kpiKey}-${kpi.id}`

  //             // append family and group values if necessary
  //             let headerKpiFamily = headers.find((header) => header.from === 'kpi-family')
  //             if (headerKpiFamily) {
  //               formattedVals[headerKpiFamily.value] = kpiFamily.kpiTitle[this.locale]
  //             }

  //             let headerKpiGroup = headers.find((header) => header.from === 'kpi-group')
  //             if (headerKpiGroup) {
  //               formattedVals[headerKpiGroup.value] = kpiGroupSettings.kpiTitle[this.locale]
  //             }
  
  //             // append dialog option
  //             const kpiId = `${kpiKey}-${kpi.id}`
  //             this.dialogs[kpiId] = false
  //           }
  //           // this.log && console.log("C-KpiTable / formatKpiData / formattedVals : ", formattedVals)
  //           serie.push(formattedVals)
  //         })
  //       }
  //     }

  //     // this.log && console.log("C-KpiTable / formatKpiData / serie : ", serie)
  //     return serie
  //   },

  //   formatValue (item, header) {
  //     // this.log && console.log("\nC-KpiTable / formatValue / header.value : ", header.value)
  //     let value = item[header.value]
  //     // this.log && console.log("C-KpiTable / formatValue / value : ", value)
  //     const format = header.format
  //     // this.log && console.log("\nC-KpiTable / formatValue / format : ", format)
  //     if (typeof format !== 'undefined' && value && !isNaN(value)) {
  //       switch (format) {
  //         case 'integer':
  //           value = parseInt(value)
  //           break
  //         case 'float':
  //           value = parseFloat(value)
  //           break
  //         case 'percent':
  //           value = parseFloat(value)
  //           break
  //       }
  //     } else if (!format && value) {
  //       value = value
  //     } else {
  //       value = this.noDataText[this.locale]
  //     }
  //     return value
  //   },

  //   numberToString (number, format) {
  //     let numberAsString = number.toString()
  //     const withComma = ['percent', 'float']
  //     numberAsString = numberAsString.replace(
  //       /(\d)(?=(\d{3})+(?!\d))/g,
  //       '$1' + ' '
  //     )
  //     if (withComma.includes(format)) {
  //       numberAsString = numberAsString.replace('.', ',')
  //     }
  //     return numberAsString
  //   },

  //   getColor (value, header) {
  //     const switchColor = header.switchColor
  //     if (switchColor) {
  //       let color
  //       // this.log && console.log("\nC-KpiTable / getColor / value : ", value)
  //       const switchParams = header.switchParams
  //       const condition = switchParams.limit
  //       const conditionMedium = switchParams.limitMedium
  //       // this.log && console.log("C-KpiTable / getColor / condition : ", condition)
  //       // this.log && console.log("C-KpiTable / getColor / conditionMedium : ", conditionMedium)
  //       if (value > condition) {
  //         color = switchParams.positiveColor
  //       }
  //       if (value < condition) {
  //         color = switchParams.negativeColor
  //       }
  //       if (value === condition) {
  //         color = switchParams.limitColor
  //       }
  //       if (conditionMedium && value > condition && conditionMedium > value ) {
  //         color = switchParams.limitMediumColor
  //       }
  //       if (conditionMedium && value === conditionMedium ) {
  //         color = switchParams.limitMediumColor
  //       }
  //       if (value === this.noDataText[this.locale]) {
  //         color = 'grey'
  //       }
  //       // this.log && console.log("C-KpiTable / getColor / color : ", color)
  //       return color
  //     } else {
  //       return header.class
  //     }
  //   },

    // updateUrlPath(params) {
    //   // TO DO 

    //   for (let targetParams of params.targets) {
    //     // 1 - get data for the update
    //     targetParams.prop = params.prop
    //     targetParams.propName = params.propName
    //     targetParams.props = params.props

    //     // 2 - then update value data in targetParams

    //     // 3 - update url path

    //     const routePath = this.$route.path
    //     let paramsString = objectToUrlParams(targetArgs)
    //     const routeIdString = this.queryRouteId ? `routeId=${this.queryRouteId}` : undefined
    //     if (routeIdString) {
    //       paramsString = routeIdString + '&' + paramsString
    //     }
    //     this.$store.commit('setRouteParams', paramsString)
    //     history.pushState(
    //       {},
    //       null,
    //       routePath + '?' + paramsString
    //     )
    //   }
    // },

    // contentWindowHeight() {
    //   let winHeight = window.innerHeight
    //   let ODAMAP_height = document.getElementById('ODAMAP-root') ? document.getElementById('ODAMAP-root').clientHeight : undefined 
    //   winHeight = ODAMAP_height ? ODAMAP_height : winHeight 

    //   var docNavbars = document.querySelectorAll(`.odm-navbar`)
    //   let docNavbarsArray = Array.prototype.slice.call(docNavbars)
    //   let sumNavbarsHeights = docNavbarsArray
    //     .map((i) => i.offsetHeight)
    //     .reduce((prev, curr) => prev + curr, 0)

    //   var docKpiHead = document.querySelectorAll(`.odm-kpi-head`)
    //   let docKpiHeadArray = Array.prototype.slice.call(docKpiHead)
    //   let sumKpiHeadHeights = docKpiHeadArray
    //     .map((i) => i.offsetHeight)
    //     .reduce((prev, curr) => prev + curr, 0)

    //   let height = winHeight - sumNavbarsHeights - sumKpiHeadHeights
    //   return height
    // },

  },
}
</script>
