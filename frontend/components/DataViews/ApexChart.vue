<style scoped>
  .custom-min-height {
    min-height: 150px;
  }
  .custom-min-height-drawer {
    min-height: 280px;
  }
  .hide {
    display: none;
  }
  .border-1 {
    border-style: solid;
    border-width: 1px;
    border-color: #EEEEEE;
  }
  .chart-panel-content > * {
    padding-right: 0px !important;
    padding-left: 0px !important;
    padding-bottom: 0px !important;
  }
</style>

<template>
  <v-container
    v-show="canShow"
    :id="`${settings.id}-container`"
    :triggerChange="`${triggerChange}`"
    :class="`${isMobileWidth ? settings.containerClassMobile : settings.containerClass} ${fromKpiTable ? 'px-4 pt-0 pb-3' : ''}`"
    :trigger-vis="`${triggerVis}`"
    >

    <!-- APEX CHART -->
    <div
      v-show="!isLoading"
      :id="`${settings.id}-chart-contents`"
      >

      <v-divider v-if="!fromKpiTable && viewConfig.dividers.before" />

      <v-layout
        v-if="!hideTitle"
        :class="`${!fromKpiTable && viewConfig.dividers.before ? 'mt-4' : 'mb-2 mt-0'}`"
        >
        <div
          :class="`chart-title ${!fromKpiTable && viewConfig.chartTitleClass ? viewConfig.chartTitleClass : 'grey--text text--darken-2' }`"
          >
          <span 
            v-if="viewConfig.titlePreffixSpecialStoreId"
            :class="`chartTitlePrefix ${!fromKpiTable && viewConfig.titlePreffixClass ? viewConfig.titlePreffixClass : ''}`"
            >
            {{ getSpecialStore[viewConfig.titlePreffixSpecialStoreId] }}
          </span>

          <!-- DEBUG -->
          <!-- {{ $vuetify.breakpoint.name }} -  -->

          <span 
            class="chartTitle"
            v-html="viewConfig.chartTitle[locale]"
            />
          <span
            v-if="viewConfig.titleSuffixSpecialStoreId"
            :class="`chartTitleSuffix ${!fromKpiTable && viewConfig.titleSuffixClass ? viewConfig.titleSuffixClass  : 'grey--text text--darken-2'}`"
            >
            {{ getSpecialStore[viewConfig.titleSuffixSpecialStoreId] }}
          </span>
        </div>
      </v-layout>

      <!-- {{ $vuetify.breakpoint.name }}<br> -->
      <!-- {{ localSeriesHasData }}<br> -->
      <!-- <v-layout> -->
        <!-- <code> -->
          <!-- <pre> -->
            <!-- {{ localSeries }} -->
            <!-- {{localChartOptions}} -->
            <!-- {{localChartOptions.xaxis}} -->
          <!-- </pre> -->
        <!-- </code> -->
        <!-- <code>{{ chartHeight }}</code><br> -->
        <!-- <code>{{ localChartOptions.chart.height }}</code><br> -->
      <!-- </v-layout> -->

      <v-layout
        v-if="canShow"
        :class="`${asDrawer ? '' : 'custom-min-height border-1'} mx-0`"
        >

        <!-- NO DRAWER -->
        <v-row
          v-if="!asDrawer"
          class="justify-center align-center" 
          >

          <!-- HAS DATA / NO DRAWER -->
          <v-col
            v-if="localChartOptions && localSeries && localSeriesHasData"
            :id="`${settings.id}-chart`"
            cols=12
            class="d-flex justify-center text-center py-0"
            >
            <apexchart
              :style="`width: ${fromKpiTable ? widthsFromKpi[$vuetify.breakpoint.name] : widthsFromMap[$vuetify.breakpoint.name]}px !important;`"
              v-if="canDrawChart"
              :ref="settings.id"
              :series="localSeries"
              :options="localChartOptions"
              :type="localChartOptions.chart.type"
              :height="localChartOptions.chart.height"
              :width="'100%'"
            />
              <!-- :width="localChartOptions.chart.width" -->
              <!-- :width="fromKpiTable ? `${widthsFromKpi[$vuetify.breakpoint.name]}px` : `${widthsFromMap[$vuetify.breakpoint.name]}px`" -->
              <!-- :width="chartDivWidth" -->
          </v-col>

          <!-- NO DATA / NO DRAWER -->
          <v-col
            v-if="!localSeries && !localSeriesHasData && !fromKpiTable && !asDrawer"
            :id="`${settings.id}-chart`"
            cols=12
            class="d-flex justify-center text-center py-0"
            >
            <p
              class="text-center my-0"
              >
              <v-icon
                medium
                color="warning"
                >
                icon-warning
              </v-icon><br>
              <i>{{ noDataText[locale] }}</i>
            </p>
          </v-col>

          <!-- SUBTITLE -->
          <v-col
            v-if="localChartOptions && localSeries && localSeriesHasData && viewConfig.chartSubtitleUnit"
            class="py-0"
            cols=12
            >
            <p
              class="mb-2 text-center caption text-weight-bold font-italic"
              >
              {{ unitsText[locale] }}
              {{ viewConfig.chartSubtitleUnit[locale] }}
              <!-- - {{ $vuetify.breakpoint.name }} -->
              <!-- - {{ triggerChange }} -->
            </p>
          </v-col>

        </v-row>

        <!-- IN DRAWER -->
        <v-expansion-panels
          v-if="asDrawer"
          :id="`${settings.id}-chart-contents-drawer`"
          focusable
          flat
          tile
          :class="`flex-grow-1 ${drawerClassOverride ? drawerClassOverride : 'borders-b-only'}`"
          >
          <v-expansion-panel
            color="white"
            @change="panel = !panel"
            >
            <v-expansion-panel-header
              :disable-icon-rotate="settings.drawerIcon ? true : false"
              :id="`${settings.id}-drawer-expansion-panel-header`"
              :class="`${panel ? 'pt-5' : 'py-0'} no-background-color ${isMobileWidth && fromKpiTable ? 'px-1' : ''} ${isMobileWidth && !fromKpiTable ? 'px-4' : ''}`"
              style="min-height: 33px;"
              :color="`white`"
              >
              <template v-slot:actions>
                <v-icon color="grey" small>
                  {{ currentDrawerIcon }}
                </v-icon>
              </template>
              <span
                :class="`${panel ? 'font-weight-bold' : ''} ${drawerTitleTextColor} ${isMobileWidth ? 'text-caption' : ''}`"
                >
                {{ settings.drawerTitle[locale] }}
                <!-- - {{ $vuetify.breakpoint.name }} -->
                <!-- - {{ fromKpiTable ? `${widthsFromKpi[$vuetify.breakpoint.name]}px` : `${widthsFromMap[$vuetify.breakpoint.name]}px` }} -->
              </span>
            </v-expansion-panel-header>

            <!-- HAS DATA / IN DRAWER -->
            <v-expansion-panel-content
              v-if="localChartOptions && localSeries && localSeriesHasData"
              :id="`${settings.id}-chart`"
              class="mt-0 px-0 chart-panel-content custom-min-height-drawer"
              eager
              >
              <div 
                class="d-flex justify-center container-chart-drawer"
                >
                <apexchart
                  v-if="panel && canDrawChart"
                  :style="`width: ${fromKpiTable ? widthsFromKpi[$vuetify.breakpoint.name] : widthsFromMap[$vuetify.breakpoint.name]}px !important;`"
                  :ref="settings.id"
                  :series="localSeries"
                  :options="localChartOptions"
                  :type="localChartOptions.chart.type"
                  :height="localChartOptions.chart.height"
                  :width="'100%'"
                />
                  <!-- :width="localChartOptions.chart.width" -->
                  <!-- :width="fromKpiTable ? `${widthsFromKpi[$vuetify.breakpoint.name]}px` : `${widthsFromMap[$vuetify.breakpoint.name]}px`" -->
                  <!-- :width="chartDivWidth" -->
                  <!-- :height="chartHeight ? chartHeight : localChartOptions.chart.height" -->
              </div>
              <p
                v-if="viewConfig.chartSubtitleUnit"
                class="text-center caption text-weight-bold font-italic"
                >
                {{ unitsText[locale] }}
                {{ viewConfig.chartSubtitleUnit[locale] }}
                <!-- - {{ triggerChange }} -->
              </p>
            </v-expansion-panel-content> 

            <!-- NO DATA / IN DRAWER -->
            <v-expansion-panel-content
              v-if="!localSeriesHasData && !fromKpiTable && asDrawer"
              :id="`${settings.id}-chart`"
              class="mt-0 px-0 chart-panel-content"
              eager
              >
              <p 
                class="text-center my-5"
                >
                <v-icon
                  medium
                  color="warning"
                  >
                  icon-warning
                </v-icon><br>
                <i>{{ noDataText[locale] }}</i>
              </p>
            </v-expansion-panel-content> 


          </v-expansion-panel>
        </v-expansion-panels>
      
      </v-layout>

      <v-divider
        v-if="
          !fromKpiTable &&
          !(isMobileWidth && viewConfig.dividers.afterHideOnMobile) &&
          viewConfig.dividers.after
        "
      />
    </div>

    <!-- LOADER -->
    <div
      v-show="isLoading && !localSeries"
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
import axios from 'axios'

import { mapState, mapGetters } from 'vuex'
import { switchFormatFunctions, splitMulti, numberToString, numberToStringBasic, minMaxFloors } from '~/utils/utils.js'

// import LoaderCircular from '~/components/UX/LoaderCircular.vue'

// ONLY DISPLAY DATA FROM data.specialStore

export default {
  name: 'ApexChart',

  components: {
    // LoaderCircular: () => import(/* webpackChunkName: "LoaderCircular" */ '@/components/UX/LoaderCircular.vue')
  },

  props: [
    'settings',
    'routeId',
    'fromKpiTable',
    'forceShow',
    'hideTitle',
    'reloadData',
    'chartHeight',
    'fallbackData',
    'forceDrawer',
    'drawerClassOverride'
  ],

  data() {
    return {
      dataViewType: 'charts',
      viewConfig: undefined,
      canShow: undefined,
      isLoading: false,
      asDrawer: false,

      kpiFamilyId: undefined,
      kpiGroupIdDataset: undefined,
      kpiGroupId: undefined,
      sourcesIds: undefined,

      mappers: undefined,
      datasetMappers: undefined,

      maxValue: 0,
      minValue: 0,
      // annotationLabel: undefined,

      canDrawChart: false,
      rawDataSerie: undefined,
      // rawTarget: undefined,
      localRawSerie: undefined,
      localSeries: [],
      localChartOptions: undefined,

      noDataText: {
        fr: '(pas de données pour ce niveau)'
      },
      unitsText: {
        fr: 'Unité : '
      },

      isFloat: false,
      defaultFormatter: {
        type: 'integer',
        sepThousands: ' '
      },

      panel: false,
      drawerTitleIconColor: 'grey darken-1',
      drawerTitleTextColor: 'grey--darken-1--text',

      chartDivWidth: '100%',
      // chartPadding: 68,
      widthsFromMap: {
        'xs' : 200,
        'sm' : 350,
        'md' : 310,
        'lg' : 320,
        'xl' : 360,
      },
      widthsFromKpi: {
        'xs' : 230,
        'sm' : 350,
        'md' : 275,
        'lg' : 380,
        'xl' : 500,
      },

      fallbackDict: {
        nat : 'national',
        reg : 'regional',
        dep : 'departemental'
      }
    }
  },

  watch: {
    triggerTabs(next, prev) {
      // this.log && console.log("\nC-ApexChart / watch / triggerTabs / this.settings.id : ", this.settings.id)
      this.updatesGlobal()
    },
    canShow(next, prev) {
      if (next) {
        // this.log && console.log("\nC-ApexChart / watch / canShow / this.settings.id : ", this.settings.id)
        this.updatesGlobal()
      }
    },
    triggerBtnReset(next) {
      // this.log && console.log("\nC-ApexChart / watch / triggerBtnReset / this.settings.id :", this.settings.id)
      this.updatesGlobal()
    },
    rawDataSerie(next, prev) {
      // this.log && console.log("\nC-ApexChart / watch / rawDataSerie / this.settings.id :", this.settings.id)
      this.updatesGlobal(true)
    },
    triggerVis(next, prev) {
      // this.log && console.log("\nC-ApexChart / watch / triggerVis / this.settings.id :", this.settings.id)
      // this.updatesGlobal()
      this.getCanShow()
    },
    triggerChange(next, prev) {
      // this.log && console.log("\nC-ApexChart / watch / triggerChange / this.settings.id :", this.settings.id)
      this.updatesGlobal()
    },
    isRouteLoading (next, prev) {
      this.isLoading = true
    },
    panel(next, prev) {
      this.$store.commit('toggleTriggerResizeNoScroll')
    }
  },

  created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },

  beforeMount() {
    // set up view config
    // this.log && console.log("C-ApexChart / beforeMount ... ")
    this.viewConfig = this.getLocalConfig
    // this.log && console.log("C-ApexChart / beforeMount / this.viewConfig : ", this.viewConfig)

    this.asDrawer = this.forceDrawer ? true : this.settings.asDrawer
    this.kpiFamilyId = this.viewConfig.kpiFamilyId
    this.kpiGroupIdDataset = this.viewConfig.keyKpiGroupIdDataset
    this.kpiGroupId = this.viewConfig.keyKpiGroupId
    this.sourcesIds = this.viewConfig.sourcesIds
    this.datasetMappers = this.viewConfig.datasetMappers
    this.localChartOptions = this.datasetMappers.chartOptions

  },

  mounted() {
    // this.log && console.log("\nC-ApexChart / mounted ... this.settings.id :", this.settings.id)
    this.getCanShow()
    this.$store.commit('toggleTriggerComponentLoaded')
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      triggerChange: (state) => state.data.triggerChange,
      triggerVis: (state) => state.triggerVisChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      isRouteLoading: (state) => state.isRouteLoading,

      routesData: (state) => state.data.routesData,
      triggerBtnReset: (state) => state.buttons.triggerBtnReset,
      triggerTabs: (state) => state.buttons.triggerTabs,
      specialStore: (state) => state.data.specialStore,
    }),

    ...mapGetters({
      // getCurrentLocale: "getCurrentLocale",
      getDataViewConfig:'getDataViewConfig',
      getSpecialStore:'data/getSpecialStore',
      getFromInitData:'data/getFromInitData',
      // getFromDisplayedData: "data/getFromDisplayedData",
      getFromSpecialStoreData:'data/getFromSpecialStoreData',
      // windowSize: "getWindowsSize",
      getDivCurrentVisibility:'getDivCurrentVisibility',
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

    localSeriesHasData() {
      let hasData = false
      const series = this.localSeries && this.localSeries[0]
      if (series) {
        if (series.data) {
          hasData = series.data.length
        }
      }
      return hasData
    },

    currentDrawerIcon() {
      let icon = 'icon-keyboard_arrow_down'
      if (this.settings.drawerIcon) {
        icon = this.panel ? this.settings.drawerIconOff : this.settings.drawerIcon
      }
      return icon
    }
  },

  methods: {
    getCanShow() {
      // this.log && console.log("\nC-ApexChart / getCanShow / this.settings.id : ", this.settings.id )
      if (this.forceShow) {
        this.canShow = true
      } else {
        let breakpoint = this.$vuetify.breakpoint.name
        let isVisible = this.getDivCurrentVisibility({
          div: { id: this.settings.id, routeId: this.routeId },
          breakpoint: breakpoint,
        })
        // this.log && console.log("C-ApexChart / getCanShow / isVisible :", isVisible )
        this.canShow = isVisible
      }
    },

    getSeries() {
      // this.log && console.log("\nC-ApexChart / getSeries ... ")
      this.isLoading = true

      const specialStoreId = this.datasetMappers.specialStoreId
      const fromDatasetKey = this.datasetMappers.fromDatasetKey
      const seriesMappers = this.datasetMappers.seriesMappers
      const formatterOpts = this.datasetMappers.format
      const valType = this.datasetMappers.valType
      // this.log && console.log('C-ApexChart / getSeries / specialStoreId : ', specialStoreId )
      // this.log && console.log('C-ApexChart / getSeries / fromDatasetKey : ', fromDatasetKey )
      // this.log && console.log('C-ApexChart / getSeries / seriesMappers : ', seriesMappers )
      // this.log && console.log('C-ApexChart / getSeries / formatterOpts : ', formatterOpts )

      const chartOptions = this.localChartOptions
      const pieChartTypes = ['donut', 'pie']

      let dataSeries = []
      let maxValue = 0
      let minValue = 0
      let minFirstRound = true
      let newColors = []
      let dataLabels = []

      for (let mapper of seriesMappers) {
        // get serie values
        let rawDataSerie

        if (this.reloadData) {
          // this.log && console.log('C-ApexChart / getSeries / this.viewConfig.sourcesIds : ', this.viewConfig.sourcesIds )
          rawDataSerie = this.rawDataSerie[fromDatasetKey]
        } else {
          rawDataSerie = this.getSpecialStoreData({
            id: specialStoreId,
            key: fromDatasetKey,
            sortParams: mapper && mapper.sortDataSerieBy,
          })
        }
        // this.log && console.log('\nC-ApexChart / getSeries / rawDataSerie : ', rawDataSerie )
        
        let dataFromKey = mapper.dataFromKey
        let valuesSerie

        let settingsColors,
          colorFromKey,
          colorMatchKey,
          colorValueFromKey,
          colorFallback,
          colorsReferences

        // get colors references for x-axis
        if (mapper.buildColorsAxisX) {
          settingsColors = mapper.buildColorsAxisXsettings
          colorFromKey = settingsColors.fromKey
          colorMatchKey = settingsColors.matchKey
          colorValueFromKey = settingsColors.getValueFromKey
          colorFallback = settingsColors.fallbackColor
          // get referencial dataset from initData
          let colorsReferencesDataset = this.getFromInitData(
            settingsColors.matchWithDatasetId
          )
          colorsReferences =
            colorsReferencesDataset && colorsReferencesDataset.data
          // this.log && console.log('C-ApexChart / getSeries / colorsReferences : ', colorsReferences )
        }

        if (rawDataSerie && dataFromKey) {
          let tempSerie = []

          // 2 - get serie
          rawDataSerie.forEach((i) => {
            // this.log && console.log('\nC-ApexChart / getSeries / i : ', i )
            let value = i[dataFromKey]
            if (value && mapper.format) {
              value = switchFormatFunctions(value, mapper.format)
            }
            maxValue = value > maxValue ? value  : maxValue
            minValue = minFirstRound ? value : minValue
            minValue = value < minValue ? value  : minValue
            minFirstRound = false
            // this.log && console.log('C-ApexChart / getSeries / value : ', value )

            // 2bis - rebuild categories on x-axis
            if (mapper.buildAxisCategsX) {
              let settingsAxisX = mapper.buildAxisCategsXsettings
              let categ = i[settingsAxisX.fromKey]

              if (settingsAxisX.splitBy) {
                categ = splitMulti(
                  categ,
                  settingsAxisX.splitBy,
                  settingsAxisX.splitGlue,
                  settingsAxisX.capitalize
                )
                if (categ.length <= 1) {
                  categ = categ.join("")
                }
              }
              // this.log && console.log('C-ApexChart / getSeries / categ : ', categ )
              if (mapper.buildAxisCategsOnlyYearAndMonth) {
                // categ = categ.substring(0,7)
                categ = new Date(categ.substring(0,7))
                let dateOptions = { year: 'numeric', month: 'long' }
                categ = categ.toLocaleDateString('fr-FR', dateOptions)
              }
              let newValue = { x: categ, y: value }
              value = newValue
            }

            // 2ter - rebuild categories as labels
            if (mapper.buildLabels) {
              let settingsLabels = mapper.buildLabelsSettings
              let label = i[settingsLabels.fromKey]

              if (settingsLabels.splitBy) {
                label = splitMulti(
                  label,
                  settingsLabels.splitBy,
                  settingsLabels.splitGlue,
                  settingsLabels.capitalize
                )
                if (label.length <= 1) {
                  label = label.join("")
                }
              }

              if (mapper.buildAxisCategsOnlyYearAndMonth) {
                label = new Date(label.substring(0,7))
                let dateOptions = { year: 'numeric', month: 'long' }
                label = label.toLocaleDateString('fr-FR', dateOptions)
              }

              // this.log && console.log('C-ApexChart / getSeries / label : ', label )
              let newLabel = label
              dataLabels.push(newLabel)
            }

            // this.log && console.log('C-ApexChart / getSeries / value (bis) : ', value )
            tempSerie.push(value)

            // 2ter - rebuild colors on x-axis
            if (mapper.buildColorsAxisX) {
              let categCode = i[colorFromKey]
              // this.log && console.log('C-ApexChart / getSeries / categCode : ', categCode )

              // get referencial dataset
              let categColor = colorsReferences.find(
                (color) => color[colorMatchKey] == categCode
              )
              categColor = categColor
                ? categColor[colorValueFromKey]
                : colorFallback
              // this.log && console.log('C-ApexChart / getSeries / categColor : ', categColor )
              newColors.push(categColor)
            }
          })

          // this.log && console.log('\nC-ApexChart / getSeries / tempSerie : ', tempSerie )
          valuesSerie = tempSerie
        } else {
          valuesSerie = rawDataSerie
        }

        // this.log && console.log('C-ApexChart / getSeries / valuesSerie (1) : ', valuesSerie )

        let dataSerie = {
          name: mapper.serieName,
          data: valuesSerie,
        }
        dataSeries.push(dataSerie)
      }

      // flatten dataSeries if chart type needs only one
      if ( pieChartTypes.includes(chartOptions.chart.type) ) {
        let dataSeriesFirst = dataSeries[0]
        dataSeries = dataSeriesFirst.data
      }

      // flag as loading finished and show
      this.isLoading = false
      let [newMax, newMin, isFloat] = minMaxFloors(maxValue, minValue, this.settings.id)
      if (isFloat || valType === 'float') {
        this.defaultFormatter.type = 'float'
        this.defaultFormatter.sepComma = ','
        maxValue = Math.ceil(maxValue).toFixed(1)
        minValue = Math.floor(minValue).toFixed(1)
      }
      this.maxValue = maxValue
      this.minValue = minValue
      // this.maxValue = isFloat ? Number(maxValue.toFixed(1)) : Number(maxValue)
      // this.minValue = isFloat ? Number(minValue.toFixed(1)) : Number(minValue)
      // this.maxValue = Number(newMax)
      // this.minValue = Number(newMin)
      this.isFloat = isFloat
      // this.log && console.log('\nC-ApexChart / getSeries / this.maxValue : ', this.maxValue )
      // this.log && console.log('C-ApexChart / getSeries / this.minValue : ', this.minValue )

      return { dataSeries: dataSeries, colors: newColors, labels: dataLabels }
    },

    updateOptionsColor(colors) {
      if (colors.length > 0) {
        this.localChartOptions = { ...this.localChartOptions, colors: colors }
      }
    },
    updateOptionsLabels(labels) {
      // this.log && console.log("C-ApexChart / updateOptionsLabels / labels : ", labels)
      if (labels.length > 0) {
        let localChartOptions = { ...this.localChartOptions }
        // this.log && console.log("C-ApexChart / updateOptionsLabels / localChartOptions : ", localChartOptions)
        // localChartOptions.labels = labels
        localChartOptions.xaxis.categories = labels
        this.localChartOptions = localChartOptions
      }
    },
    updateOptionsFormatter() {
      const formatterOpts = this.datasetMappers.format
      let localChartOptions = { ...this.localChartOptions }
      // this.log && console.log("\nC-ApexChart / updateOptionsFormatter / localChartOptions : ", localChartOptions)
      if (formatterOpts) {
        localChartOptions.dataLabels.formatter = (val, opts) => {
          return numberToString(val, formatterOpts)
        }
        this.localChartOptions = localChartOptions
      }
    },
    updateTooltip() {
      // this.log && console.log("\nC-ApexChart / updateTooltip / this.settings.id : ", this.settings.id)
      let localChartOptions = { ...this.localChartOptions }
      localChartOptions.tooltip = { ...localChartOptions.tooltip }
      // this.log && console.log("C-ApexChart / updateTooltip / localChartOptions.tooltip : ", localChartOptions.tooltip)

      const unit = this.datasetMappers.unit
      const format = this.datasetMappers.format
      // const unit = localChartOptions.tooltip.y && localChartOptions.tooltip.y.unit
      // const format = localChartOptions.tooltip.y && localChartOptions.tooltip.y.format

      // this.log && console.log("C-ApexChart / updateTooltip / unit : ", unit)
      // this.log && console.log("C-ApexChart / updateTooltip / format : ", format)
      localChartOptions.tooltip.y = {
        formatter: (value) => {
          const val = numberToString(value, format)
          let valString = `${val} ${unit ? unit : ''}`
          return valString
        },
        title: {
          formatter: (serieName) => {
            return `${serieName}`
          }
        }
      }
      this.localChartOptions = localChartOptions
    },
    updateAnnotations() {
      const formatterOpts = this.datasetMappers.format
      let localChartOptions = { ...this.localChartOptions }
      // this.log && console.log("C-ApexChart / updateAnnotations / localChartOptions : ", localChartOptions)

      // deep copy vuex object to simple object
      if (localChartOptions.annotationsOptions) {
        let annotationsOptions = JSON.parse(JSON.stringify(localChartOptions.annotationsOptions.annotations))
        // this.log && console.log("C-ApexChart / updateAnnotations / annotationsOptions : ", annotationsOptions)
  
        const annotationsSettings = localChartOptions.annotationsOptions.settings
        let YvalueParams = {
          id: annotationsSettings.specialStoreId,
          key: annotationsSettings.fromDatasetKey
        }
        // this.log && console.log("C-ApexChart / updateAnnotations / annotationsSettings : ", annotationsSettings)
  
        let rawData
        let annotationValue
        if (this.reloadData) {
          rawData = this.rawDataSerie && this.rawDataSerie[annotationsSettings.fromDatasetKey]
        } else {
          rawData = this.getSpecialStoreData(YvalueParams)
        }
  
        // let rawData = this.getSpecialStoreData(YvalueParams)
        annotationValue = rawData && rawData[annotationsSettings.fromDatasetInnerKey] && rawData[annotationsSettings.fromDatasetInnerKey][annotationsSettings.yValue]
        // this.log && console.log("C-ApexChart / updateAnnotations / rawData : ", rawData)
        
        // this.log && console.log("C-ApexChart / updateAnnotations / annotationValue : ", annotationValue)
  
        if (annotationValue) {
          annotationsOptions.yaxis[0].y = annotationValue
          let annotationsOptionsYLabel = { ...annotationsOptions.yaxis[0].label }
          let annotationValueFormatted = numberToString(annotationValue, this.defaultFormatter)
          let newLabelText = `${annotationsSettings.yTextDefault} : ${annotationValueFormatted} ${annotationsSettings.yUnit}`
          annotationsOptions.yaxis[0].label.text = newLabelText
          localChartOptions.annotations = { ...annotationsOptions }
          localChartOptions = { ...localChartOptions, annotations: annotationsOptions }
  
          if (annotationValue > this.maxValue) {
            let [newMax, newMin, isFloat] = minMaxFloors(annotationValue, this.minValue)
            // let annotationValueDecimals = Math.ceil(Math.log(annotationValue)/Math.log(10)) - 1
            // let annotationValuePow = Math.pow(10, annotationValueDecimals)
            // let newMax = Math.ceil(annotationValue / annotationValuePow) * annotationValuePow
            // let newMin = Math.floor(this.minValue / annotationValuePow) * annotationValuePow
            localChartOptions = { ...localChartOptions, yaxis: { max: newMax, min: newMin } }
          }
        } else {
          localChartOptions = { ...localChartOptions, annotations: undefined }
        }
      }
      // this.log && console.log("C-ApexChart / updateAnnotations / localChartOptions : ", localChartOptions)
      this.localChartOptions = localChartOptions
    },
    updateYaxis() {
      // format y axis values
      let localChartOptions = { ...this.localChartOptions }
      localChartOptions.chart.width = this.fromKpiTable ? `${this.widthsFromKpi[this.$vuetify.breakpoint.name]}px` : `${this.widthsFromMap[this.$vuetify.breakpoint.name]}px`
      localChartOptions.yaxis = localChartOptions.yaxis ? localChartOptions.yaxis : {}
      localChartOptions.yaxis.tickAmount = 6
      localChartOptions.yaxis.max = this.isFloat ? Number(this.maxValue + 1 ) : Number(this.maxValue) 
      localChartOptions.yaxis.min = this.isFloat ? Number(this.minValue - 1 ) : Number(this.minValue)
      if (localChartOptions.chart.type === 'bar') {
        localChartOptions.yaxis.min = 0
      }
      localChartOptions.yaxis.forceNiceScale = true
      localChartOptions.yaxis.labels = {
        formatter: (val) => {
          return numberToString(val, this.defaultFormatter, true, this.settings.id)
          // return numberToStringBasic(val, this.defaultFormatter.type, true, this.settings.id)
        }
      }
      this.localChartOptions = localChartOptions
      // this.log && console.log("C-ApexChart / updateYaxis / this.defaultFormatter : ", this.defaultFormatter)
      // this.log && console.log("C-ApexChart / updateYaxis / localChartOptions.chart.width : ", localChartOptions.chart.width)
      // this.log && console.log("C-ApexChart / updateYaxis / localChartOptions.yaxis : ", localChartOptions.yaxis)
    },
    updatesGlobal( ignoreReload = false ) {
      // this.log && console.log("C-ApexChart / updatesGlobal / this.localChartOptions : ", this.localChartOptions)
      this.localChartOptions = this.datasetMappers.chartOptions
      this.localSeries = undefined
      this.canDrawChart = false
     if (this.reloadData && !ignoreReload) {
        // this.log && console.log("\nC-ApexChart / updatesGlobal / this.reloadData && !ignoreReload ...")
        this.reloadDataFromSource().then((v) => {
          // this.log && console.log("C-ApexChart / updatesGlobal / this.reloadData && !ignoreReload ... then ...")
        })
      } else {
        // this.log && console.log("\nC-ApexChart / updatesGlobal / else ...")
        let newSeries = this.getSeries()
        this.localSeries = newSeries && newSeries.dataSeries
        this.updateOptionsColor(newSeries.colors)
        this.updateOptionsLabels(newSeries.labels)
        this.updateOptionsFormatter()
        this.updateTooltip()
        this.updateAnnotations()
        this.updateYaxis()
        this.canDrawChart = true
      }
      // let newSeries = this.getSeries()
      // this.localSeries = newSeries && newSeries.dataSeries
      // this.updateOptionsColor(newSeries.colors)
      // this.updateOptionsLabels(newSeries.labels)
      // this.updateOptionsFormatter()
      // this.updateTooltip()
      // this.updateAnnotations()
      // this.updateYaxis()
      // this.$store.commit('toggleTriggerVis')
      // this.$store.commit('toggleTriggerComponentLoaded')
    },

    getSpecialStoreData(params) {
      // this.log && console.log("\nC-ApexChart / getSpecialStoreData / params : ", params)
      let obj = this.getFromSpecialStoreData({
        id: params.id,
        key: params.key,
        sortParams: params.sortParams,
      })
      return obj
    },

    async reloadDataFromSource() {
      
      const kpiFamilies = this.specialStore.kpifamilies
      let specialStore = this.specialStore
      let levelValue = this.specialStore.value
      let levelCode = this.specialStore.levelcode
      let levelName = this.specialStore.levelname
      const fromSpecialStoreKey = this.datasetMappers.fromSpecialStoreKey
      const fromDatasetKey = this.datasetMappers.fromDatasetKey
      const reloadRules = this.datasetMappers.reloadRules

      const log = this.log && this.fallbackData.rules
      let rawDataSerie = this.rawDataSerie

      let newLevelCodeObj
      let newLevel
      let newLevelCode

      if ( kpiFamilies.includes(this.kpiFamilyId) ) {
        
        // log && console.log("C-ApexChart / reloadDataFromSource ... ")
        // log && console.log("C-ApexChart / reloadDataFromSource / this.settings.id : ", this.settings.id)
        // log && console.log("C-ApexChart / reloadDataFromSource / kpiFamilies : ", kpiFamilies)

        // log && console.log("C-ApexChart / reloadDataFromSource / this.kpiFamilyId : ", this.kpiFamilyId)
        // log && console.log("C-ApexChart / reloadDataFromSource / this.kpiGroupIdDataset : ", this.kpiGroupIdDataset)
        // log && console.log("C-ApexChart / reloadDataFromSource / this.kpiGroupId : ", this.kpiGroupId)
        // log && console.log("C-ApexChart / reloadDataFromSource / this.sourcesIds : ", this.sourcesIds)

        if (this.fallbackData && this.fallbackData.rules) {
          // log && console.log("C-ApexChart / reloadDataFromSource / this.fallbackData : ", this.fallbackData)
          // log && console.log("C-ApexChart / reloadDataFromSource / levelCode : ", levelCode)

          newLevelCodeObj = this.fallbackData.rules.conditions.find( (c) => c.itemId === 'from_level' )
          // log && console.log("C-ApexChart / reloadDataFromSource / newLevelCodeObj : ", newLevelCodeObj)
          
          newLevelCode = newLevelCodeObj && this.fallbackDict[newLevelCodeObj.itemValue]
          // log && console.log("C-ApexChart / reloadDataFromSource / newLevelCode : ", newLevelCode)
          levelCode = newLevelCode ? newLevelCode : levelCode

          newLevel = this.fallbackData.reload.valueReload
        }
        const RoutesDataList = this.routesData.initData.store
        const sourceToLoad = this.sourcesIds && RoutesDataList && RoutesDataList.find(dataset => {
          let sourcesIdsList = this.sourcesIds.map( s => s.sourceId )
          return dataset.levelcode === levelCode && sourcesIdsList.includes(dataset.id)
        })
        // log && console.log("C-ApexChart / reloadDataFromSource / sourceToLoad : ", sourceToLoad)
  
        const dataResponse = this.loadUrlSource(sourceToLoad).then((resp) => {
          // log && console.log("\nC-ApexChart / reloadDataFromSource / resp : ", resp)
          // log && console.log("C-ApexChart / reloadDataFromSource / specialStore : ", specialStore)
          // log && console.log("C-ApexChart / reloadDataFromSource / levelValue : ", levelValue)
          // log && console.log("C-ApexChart / reloadDataFromSource / levelCode : ", levelCode)
          // log && console.log("C-ApexChart / reloadDataFromSource / levelName : ", levelName)
          // log && console.log("C-ApexChart / reloadDataFromSource / fromSpecialStoreKey : ", fromSpecialStoreKey)
          // log && console.log("C-ApexChart / reloadDataFromSource / fromDatasetKey : ", fromDatasetKey)
          // log && console.log("C-ApexChart / reloadDataFromSource / reloadRules : ", reloadRules)

          let rawResponse = resp[0] && resp[0][0]
          // log && console.log("C-ApexChart / reloadDataFromSource / rawResponse : ", rawResponse)

          let currrentRule = reloadRules[levelCode]
          // log && console.log("C-ApexChart / reloadDataFromSource / currrentRule : ", currrentRule)
          
          let level = this.specialStore[currrentRule.findBy]
          // log && console.log("C-ApexChart / reloadDataFromSource / level : ", level)
          let rawResponseRequested = resp && resp[0]
          // log && console.log("C-ApexChart / reloadDataFromSource / rawResponseRequested (start) : ", rawResponseRequested)

          if (currrentRule.findByIndex)  {
            rawResponseRequested = rawResponseRequested && rawResponseRequested[currrentRule.findBy]
          } else {
            let reloadKey = currrentRule.key
            if (newLevelCodeObj) {
              // log && console.log("C-ApexChart / reloadDataFromSource / rawResponseRequested (start) / newLevelCodeObj : ", newLevelCodeObj)
              level = newLevel
            }
            rawResponseRequested = rawResponseRequested && rawResponseRequested.find((ds) => ds[reloadKey] === level )
          }

          // log && console.log("C-ApexChart / reloadDataFromSource / rawResponseRequested (end) : ", rawResponseRequested)

          // this.rawDataSerie = rawResponse
          this.rawDataSerie = rawResponseRequested
        })
      }
    },

    loadUrlSource (sourceToLoad) {
      const log = this.log
      const promisesArray = []
      let dataset
      const dataFromUrlPromise = axios
        .get(sourceToLoad.url)
        .then((resp) => {
          // log && console.log("C-ApexChart / loadUrlSource / resp : ", resp)
          return resp.data
        })
        .catch((err) => {
          // console.log( 'C- ApexChart / loadUrlSource / error while loading from sourceToLoad.url :', err )
        })
      promisesArray.push(dataFromUrlPromise)
      return Promise.all(promisesArray)
    },

    async handleResize() {

      let chartDivWidthPx = 100

      let breakpoint = this.$vuetify.breakpoint.name
      // console.log("\nC-ApexChart / handleResize ... breakpoint : ", breakpoint )
      let defaultWidth = this.widthsFromKpi[breakpoint]
      // console.log("C-ApexChart / handleResize ... defaultWidth : ", defaultWidth )
      
      if (this.canShow && this.localSeries) {
        let chartDiv = document.getElementsByClassName(this.settings.sizeRefClass)
        chartDiv = chartDiv[0]
        // console.log("C-ApexChart / handleResize ... chartDiv : ", chartDiv )
        let chartDivWidth = chartDiv && chartDiv.offsetWidth
        // console.log("C-ApexChart / handleResize ... chartDivWidth : ", chartDivWidth )
        chartDivWidthPx = chartDivWidth - (2 * this.settings.chartPadding)
        // console.log("C-ApexChart / handleResize ... chartDivWidthPx : ", chartDivWidthPx )
        chartDivWidthPx = chartDivWidthPx < 0 ? defaultWidth : chartDivWidthPx
      } 
      else {
        chartDivWidthPx = defaultWidth
      }
      
      // console.log("C-ApexChart / handleResize ... chartDivWidthPx : ", chartDivWidthPx )
      // this.chartDivWidth = '100%'
      this.chartDivWidth = chartDivWidthPx
      // this.chartDivWidth = defaultWidth

    }
  }
}
</script>
