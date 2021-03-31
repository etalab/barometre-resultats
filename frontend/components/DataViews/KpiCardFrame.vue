<template>

  <v-container
    v-show="canShow"
    :id="`${settings.id}`"
    :class="`${isMobileWidth ? settings.containerClassMobile : settings.containerClass }`"
    :trigger="`${trigger}`"
    :trigger-vis="`${triggerVis}`"
    >

    <div
      class="full-width"
      >
      
      <v-row>
        <v-col>
          <div>
            KPI CARD FRAME : 
            <!-- <br> - settings : <code><pre>{{settings}}</pre></code> -->
            <!-- <br> - rawDataSerie : <code><pre>{{ rawDataSerie }}</pre></code> -->
            <br> - value : <code>{{ value }}</code>
            <br> - valueDate : <code>{{ valueDate }}</code>
            <br> - kpi : <br><code><pre>{{ kpi }}</pre></code>
          </div>

          <!-- <div>
            <KpiCard 
              :kpi="kpi"
              :blockHeaderDataMainValue="getBlockHeaderData(blockHeaders, 'data-main-value')"
              :blockHeaderDynamicData="getBlockHeaderDynamicData(blockHeaders, 'data-main-value', kpi.fromDatasetKeyValue, props.items)"
              :propsItemValue="getPropsItemValue(props.items, kpi.fromDatasetKeyValue)"
              :ruleValue="getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textSuffixRules)"
              :blockHeaderDataSecondValue="getBlockHeaderData(blockHeaders, 'data-second-value')"
              :triggerTabBtn="triggerTabBtn"
              :isMobileWidth="isMobileWidth"
            />
          </div> -->

        </v-col>
      </v-row>

    </div>
  
  </v-container>

</template>

<script>

import axios from 'axios'

import { objectFromPath } from '~/utils/utils.js'
import { mapState, mapGetters } from 'vuex'

export default {

  name: 'KpiCardFrame',

  props: [
    'settings',
    'routeId'
  ],

  data() {
    return {
      // dataViewType: 'kpiCards',
      // viewConfig: undefined,
      canShow: true,
      isLoading: false,

      sourcesToLoad: undefined,
      rawDataSerie: undefined,
      kpi: undefined,

      value: undefined,
      valueDate: undefined,

      kpiFamilyId: undefined,
      kpiGroupId: undefined,
      kpiId: undefined,

      blockHeaderDataMainValue: undefined,
      blockHeaderDynamicData: undefined,
      propsItemValue: undefined,
      ruleValue: undefined,
      blockHeaderDataSecondValue: undefined,
      triggerTabBtn: undefined,
    }
  },

  watch: {
    isRouteLoading(next, prev) {
      this.isLoading = true
    },

    trigger (next, prev) {
      this.log && console.log("\nC-KpiCardFrame / watch / trigger / ... ")
      this.updateGlobal()
    },

    triggerVis(next, prev) {
      this.log && console.log("\nC-KpiCardFrame / watch / triggerVis / ... ")
      // this.getCanShow()
    },

  },

  beforeMount() {
    // this.log && console.log("\nC-KpiCardFrame / beforeMount / ... ")
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.state :", this.state)
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.configsData :", this.configsData)
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.configs : ", this.configs)

    this.kpiFamilyId = this.settings.kpiConfigFrom.kpiFamilyId
    this.log && console.log("C-KpiCardFrame / beforeMount / this.kpiFamilyId : ", this.kpiFamilyId)

    this.kpiGroupId = this.settings.kpiConfigFrom.kpiGroupId
    this.log && console.log("C-KpiCardFrame / beforeMount / this.kpiGroupId : ", this.kpiGroupId)

    this.kpiId = this.settings.kpiConfigFrom.kpiId
    this.log && console.log("C-KpiCardFrame / beforeMount / this.kpiId : ", this.kpiId)

    // this.log && console.log("C-KpiCardFrame / beforeMount / this.sourcesToLoad :", this.sourcesToLoad)
    this.updateGlobal()
  },

  created() {
    // this.log && console.log("C-KpiCardFrame / created / ...")
    // this.log && console.log("C-KpiCardFrame / created / this.specialStore : ", this.specialStore)
    this.sourcesToLoad = this.settings.kpiDataFrom.sourcesIds
    // find kpi settings from kpiTable config
    this.kpi = this.getKpiConfig
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      triggerVis: (state) => state.triggerVisChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      isRouteLoading: (state) => state.isRouteLoading,

      configs: (state) => state.configs,
      specialStore: (state) => state.data.specialStore,

      // state: (state) => state,
      // configsData: (state) => state.configsData,
      // storeData: (state) => state.data,
    }),

    ...mapGetters({
      getDataViewConfig: 'getDataViewConfig',
      getSpecialStore: 'data/getSpecialStore',
    }),

    getKpiConfig() {
      // this.log && console.log("C-KpiCardFrame / getKpiConfig / this.settings :", this.settings)
      const kpiConfigFrom = this.settings.kpiConfigFrom
      let viewId = {
        dataViewType: kpiConfigFrom.dataViewType,
        id: kpiConfigFrom.kpiTableId,
      }
      // this.log && console.log("C-KpiCardFrame / getKpiConfig / viewId :", viewId)
      
      let kpiTableConfig = this.getDataViewConfig(viewId)
      // this.log && console.log("C-KpiCardFrame / getKpiConfig / kpiTableConfig :", kpiTableConfig)
      
      let kpiFamily = kpiTableConfig[kpiConfigFrom.kpiFamiliesField].find( kpiFam => kpiFam.id === kpiConfigFrom.kpiFamilyId )
      // this.log && console.log("C-KpiCardFrame / getKpiConfig / kpiFamily :", kpiFamily)

      let kpiGroup = kpiFamily[kpiConfigFrom.kpiGroupsField].find( kpiGroup => kpiGroup.id === kpiConfigFrom.kpiGroupId )
      // this.log && console.log("C-KpiCardFrame / getKpiConfig / kpiGroup :", kpiGroup)

      // this.log && console.log("C-KpiCardFrame / getKpiConfig / kpiConfigFrom.kpiId :", kpiConfigFrom.kpiId)
      // this.log && console.log("C-KpiCardFrame / getKpiConfig / kpiConfigFrom.kpiIdFull :", kpiConfigFrom.kpiIdFull)
      let kpi = kpiGroup[kpiConfigFrom.kpisField].find( kpi => kpi.id === kpiConfigFrom.kpiIdFull)
      // this.log && console.log("C-KpiCardFrame / getKpiConfig / kpi :", kpi)
      return kpi
    },

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },


  },

  methods: {

    updateGlobal() {
      this.isLoading = true

      const log = this.log
      this.reloadDataFromSource().then((resp) => {
        log && console.log("\C-KpiCardFrame / updateGlobal / resp : ", resp)
        
        let value = objectFromPath(resp.obj, resp.sourceToLoadBasic.returnPathValue)
        let valueDate = objectFromPath(resp.obj, resp.sourceToLoadBasic.returnPathDate)
        log && console.log("\C-KpiCardFrame / updateGlobal / value : ", value)
        log && console.log("\C-KpiCardFrame / updateGlobal / valueDate : ", valueDate)
        this.value = value
        this.valueDate = valueDate

        this.isLoading = false
      })

    },

    async reloadDataFromSource() {

      this.log && console.log("\nC-KpiCardFrame / reloadDataFromSource / ... ")

      const kpiDataFrom = this.settings.kpiDataFrom
      this.log && console.log("C-KpiCardFrame / reloadDataFromSource / kpiDataFrom : ", kpiDataFrom)

      this.log && console.log("C-KpiCardFrame / reloadDataFromSource / this.specialStore : ", this.specialStore)

      let levelName = this.specialStore.levelname
      let levelCode = this.specialStore.levelcode
      // let levelCode = kpiDataFrom.forceLevelCode ? kpiDataFrom.forceLevelCode.value : this.specialStore.levelcode
      this.log && console.log("C-KpiCardFrame / reloadDataFromSource / levelCode : ", levelCode)

      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / this.sourcesToLoad : ", this.sourcesToLoad)
      let sourceToLoadBasic = this.sourcesToLoad.find( src => src.levelcode === levelCode)
      this.log && console.log("C-KpiCardFrame / reloadDataFromSource / sourceToLoadBasic : ", sourceToLoadBasic)
      
      let sourceToLoadId = sourceToLoadBasic.sourceId
      this.log && console.log("C-KpiCardFrame / reloadDataFromSource / sourceToLoadId : ", sourceToLoadId)

      const loadFrom = kpiDataFrom.loadFrom
      this.log && console.log("C-KpiCardFrame / reloadDataFromSource / loadFrom : ", loadFrom)

      let dataConfigs = objectFromPath(this.configs, loadFrom.modulePath )
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / dataConfigs : ", dataConfigs)

      let sourceToLoad = dataConfigs.find( conf => conf.id === sourceToLoadId )
      this.log && console.log("C-KpiCardFrame / reloadDataFromSource / sourceToLoad : ", sourceToLoad )

      // let sourceToLoadUrl = sourceToLoad.url
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / sourceToLoadUrl : ", sourceToLoadUrl )

      const log = this.log
      const dataResponse = this.loadUrlSource(sourceToLoad).then((resp) => {
        log && console.log("\C-KpiCardFrame / reloadDataFromSource / resp : ", resp)
        let rawResponse
        switch (sourceToLoadBasic.findBy) {
          case 'index':
            rawResponse = resp[0][sourceToLoadBasic.index]
            break
          case 'fieldmatch':
            let fieldSource = sourceToLoadBasic.fieldSource
            let targetValue = this.specialStore[sourceToLoadBasic.fieldTarget]
            rawResponse = resp[0].find( r => r[fieldSource] === targetValue)
            break
        }

        log && console.log("C-KpiCardFrame / reloadDataFromSource / rawResponse : ", rawResponse )
        this.rawDataSerie = rawResponse
        return { obj: rawResponse, sourceToLoadBasic: sourceToLoadBasic }
      })
      return dataResponse

    },

    loadUrlSource (sourceToLoad) {
      const log = this.log
      const promisesArray = []
      const dataFromUrlPromise = axios
        .get(sourceToLoad.url)
        .then((resp) => {
          // log && console.log("C-KpiCardFrame / loadUrlSource / resp : ", resp)
          return resp.data
        })
        .catch((err) => {
          console.log( 'C- KpiCardFrame / loadUrlSource / error while loading from sourceToLoad.url :', err )
        })
      promisesArray.push(dataFromUrlPromise)
      return Promise.all(promisesArray)
    },

  }

}

</script>
