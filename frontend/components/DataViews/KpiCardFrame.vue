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
        <v-col class="py-0">

          <!-- <br> - settings : <code><pre>{{settings}}</pre></code> -->
          <!-- <div v-if="kpi && rawDataSerie"> -->
            <!-- KPI CARD FRAME :  -->

            <!-- <hr> -->

            <!-- <br> - mainValue : <code>{{ mainValue }}</code> -->
            <!-- <br> - mainValueDate : <code>{{ mainValueDate }}</code> -->
            
            <!-- <br><hr> -->

            <!-- <br> - blockHeaderDataMainValue : <code>{{ getBlockHeaderData(kpi.headers, 'data-main-value', settings.kpiMappers.selectHeaderMainValue) }}</code> -->
            <!-- <br> - blockHeaderDataSecondValue : <code>{{ getBlockHeaderData(kpi.headers, 'data-second-value', settings.kpiMappers.selectHeaderSecondValue) }}</code> -->
            
            <!-- <br> - blockHeaderDynamicData : <code>{{ getBlockHeaderDynamicData(kpi.headers, 'data-main-value', settings.kpiMappers.selectHeaderMainValue ) }}</code> -->
            
            <!-- <br> - ruleValue : <code>{{ getRuleValue(mainValue, kpi.textSuffixRules ) }}</code> -->

            <!-- <br><hr> -->

            <!-- <br> - buildPropsItemValue() : <code><pre>{{ buildPropsItemValue() }}</pre></code> -->
            <!-- <br> - rawDataSerie : <code><pre>{{ rawDataSerie }}</pre></code> -->
            <!-- <hr> -->
            <!-- <br> - kpi : <br><code><pre>{{ kpi }}</pre></code> -->
          <!-- </div> -->

          <div v-if="kpi && rawDataSerie">

            <KpiCard 
              :kpi="kpi"

              :blockHeaderDataMainValue="getBlockHeaderData(kpi.headers, 'data-main-value', settings.kpiMappers.selectHeaderMainValue)"
              :blockHeaderDataSecondValue="getBlockHeaderData(kpi.headers, 'data-second-value', settings.kpiMappers.selectHeaderSecondValue)"
              
              :blockHeaderDynamicData="getBlockHeaderDynamicData(kpi.headers, 'data-main-value', settings.kpiMappers.selectHeaderMainValue)"
              
              :propsItemValue="buildPropsItemValue()"

              :ruleValue="getRuleValue(mainValue, kpi.textSuffixRules)"

              :triggerTabBtn="trigger"
              :isMobileWidth="isMobileWidth"
              :addCardClass="'borders-b-only'"
            />

          </div>

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

      mainValue: undefined,
      mainValueDate: undefined,
      secondValue: undefined,
      secondValueDate: undefined,

      kpiFamilyId: undefined,
      kpiGroupId: undefined,
      kpiId: undefined,

      blockHeaderDataMainValue: undefined,
      blockHeaderDynamicData: undefined,
      propsItemValue: undefined,
      ruleValue: undefined,
      blockHeaderDataSecondValue: undefined,
      // triggerTabBtn: true,
    }
  },

  watch: {
    isRouteLoading(next, prev) {
      this.isLoading = true
    },

    trigger (next, prev) {
      // this.log && console.log("\nC-KpiCardFrame / watch / trigger / ... ")
      this.updateGlobal()
    },

    triggerVis(next, prev) {
      // this.log && console.log("\nC-KpiCardFrame / watch / triggerVis / ... ")
      // this.getCanShow()
    },

  },

  beforeMount() {
    // this.log && console.log("\nC-KpiCardFrame / beforeMount / ... ")
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.state :", this.state)
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.configsData :", this.configsData)
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.configs : ", this.configs)

    this.kpiFamilyId = this.settings.kpiConfigFrom.kpiFamilyId
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.kpiFamilyId : ", this.kpiFamilyId)

    this.kpiGroupId = this.settings.kpiConfigFrom.kpiGroupId
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.kpiGroupId : ", this.kpiGroupId)

    this.kpiId = this.settings.kpiConfigFrom.kpiId
    // this.log && console.log("C-KpiCardFrame / beforeMount / this.kpiId : ", this.kpiId)

    // this.log && console.log("C-KpiCardFrame / beforeMount / this.sourcesToLoad :", this.sourcesToLoad)
    this.updateGlobal()
  },

  created() {
    // this.log && console.log("C-KpiCardFrame / created / ...")
    // this.log && console.log("C-KpiCardFrame / created / this.specialStore : ", this.specialStore)
    this.sourcesToLoad = this.settings.kpiDataFrom.sourcesIds
    // find kpi settings from kpiTable config
    let kpi = { ...this.getKpiConfig }
    delete kpi.charts
    delete kpi.afterTitleComponents
    this.kpi = kpi
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
    
    getBlockHeaderData(headerList, blockInnerTarget, targetValue) {
      // this.log && console.log("\nC-KpiCardFrame / getBlockHeaderData / headerList : ", headerList)
      // this.log && console.log("C-KpiCardFrame / getBlockHeaderData / blockInnerTarget : ", blockInnerTarget)
      let headerData = headerList.find(header => header.blockInnerTarget === blockInnerTarget && header.value === targetValue)
      return headerData
    },

    // getBlockHeaderDynamicData (headerList, blockInnerTarget, fromDatasetKeyValue, items) {
    getBlockHeaderDynamicData (headerList, blockInnerTarget, targetValue) {
      // this.log && console.log("\nC-KpiCardFrame / getBlockHeaderDynamicData / targetValue : ", targetValue)
      
      const header = this.getBlockHeaderData(headerList, blockInnerTarget, targetValue)
      // this.log && console.log("C-KpiCardFrame / getBlockHeaderDynamicData / header : ", header)
      
      let value = header.text[this.locale]
      // this.log && console.log("C-KpiCardFrame / getBlockHeaderDynamicData / value : ", value)

      const itemValue = this.buildPropsItemValue()

      if (header.textValue) {
        let valueRewrite
        // const itemValue = items.find(item => item.odmKeyfield === fromDatasetKeyValue )
        if ( itemValue[header.textValue] ) {
          let addon = itemValue[header.textValue]
          if( header.textFormat === 'datetime' ) {
            addon = new Date(addon)
            let dateOptions = {  year: 'numeric', month: 'long' }
            addon = addon.toLocaleDateString('fr-FR',dateOptions)
          }
          valueRewrite = `${value} ${addon}`
        } else {
          valueRewrite = header.textDefault[this.locale]
        }
        value = valueRewrite
      }

      let forceLevelCode = this.settings.kpiDataFrom.forceLevelCode
      if (forceLevelCode) {
        let addonSuffix = forceLevelCode.forceSuffix[this.locale]
        value = `${value} ${addonSuffix}`
      }

      return value
    },

    buildPropsItemValue() {
      let kpiMappers = this.settings.kpiMappers
      let propItem = { 
        odmFormat: this.kpi.kpiFormat,
        odmKeyfield: this.kpi.fromDatasetKeyValue, //"km-amenagement-cyclables-securises", 
        odmDialogKey: `${this.kpi.fromDatasetKeyValue}-${this.kpi.id}`, // "km-amenagement-cyclables-securises-plan-velo-km-amenagement-cyclables-securises", 
      }
      propItem[kpiMappers.selectHeaderMainValue] = this.mainValue  // "latest_value": this.mainValue, 
      propItem[kpiMappers.selectHeaderMainValueDate] = this.mainValueDate  // "latest_value_date": this.mainValueDate,

        // "ovq-name": "Déployer le plan vélo", 
        // "initial_value": 269, 
        // "initial_value_date": "2017-12-31", 
        // "progression_percentage": 41, 
        // "progression": 111, 
        // "from_level": "dep", 
        // "from_code": "01", 
        // "target": 372, 
        // "target_percentage": 108, 
        // "target_date": "2022-03-31", 
        // indicateurs: this.kpi.kpiTitle[this.locale] // "Kilomètres d'aménagements cyclables sécurisés" 

      return propItem
    },

    getRuleValue(item, rules, returnClass = false, returnFallback = false) {
      // this.log && console.log("\nC-KpiCardFrame / getRuleValue / item : ", item)
      // this.log && console.log("C-KpiCardFrame / getRuleValue / rules : ", rules)
      let fix = ''
      let value = ''

      let keyReload = ''
      let valueReload = ''

      const specialStore = this.getSpecialStore

      let localeRules = rules && rules[this.locale]
      const localeRulesList = localeRules.rules
      // this.log && console.log("C-KpiCardFrame / getRuleValue / localeRulesList : ", localeRulesList)

      // filter out applying rules' conditions 
      let rulesToApply = localeRulesList.filter(rule => {
        const conditions = rule.conditions
        let boolArray = []
        for (const cond of conditions) {
          let boolVal
          // if (cond.specialStoreId) {
          //   boolVal = specialStore[cond.specialStoreId] === cond.specialStoreValue
          // }
          // if (cond.itemId) {
          //   boolVal = item[cond.itemId] === cond.itemValue
          // }
          // boolArray.push(boolVal)
        }
        return boolArray.every(v => v === true)
      })
      // this.log && console.log("C-KpiCardFrame / getRuleValue / rulesToApply : ", rulesToApply)


      if (!returnFallback) {
        return `${fix} ${value}`
      } else {
      //   // this.log && console.log("C-KpiCardFrame / rulesToApply (end) : ", rulesToApply)
      //   // this.log && console.log("C-KpiCardFrame / valueReload (end) : ", valueReload)
        return {
          rules: rulesToApply[0],
          // reload: {
          //   value: value,
          //   fix: fix,
          //   key: keyReload,
          //   valueReload: valueReload
          // }
        }
      }

    },

    updateGlobal() {
      this.isLoading = true

      const log = this.log
      this.reloadDataFromSource().then((resp) => {
        // log && console.log("\nC-KpiCardFrame / updateGlobal / resp : ", resp)
        
        let value = objectFromPath(resp.obj, resp.sourceToLoadBasic.returnPathValue)
        let valueDate = objectFromPath(resp.obj, resp.sourceToLoadBasic.returnPathDate)
        // log && console.log("C-KpiCardFrame / updateGlobal / value : ", value)
        // log && console.log("C-KpiCardFrame / updateGlobal / valueDate : ", valueDate)
        this.mainValue = value
        this.mainValueDate = valueDate

        this.isLoading = false
      })

    },

    async reloadDataFromSource() {

      // this.log && console.log("\nC-KpiCardFrame / reloadDataFromSource / ... ")

      const kpiDataFrom = this.settings.kpiDataFrom
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / kpiDataFrom : ", kpiDataFrom)

      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / this.specialStore : ", this.specialStore)

      let levelName = this.specialStore.levelname

      // force levelcode to overwrite 
      // let levelCode = this.specialStore.levelcode
      let levelCode = kpiDataFrom.forceLevelCode ? kpiDataFrom.forceLevelCode.value : this.specialStore.levelcode
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / levelCode : ", levelCode)

      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / this.sourcesToLoad : ", this.sourcesToLoad)
      let sourceToLoadBasic = this.sourcesToLoad.find( src => src.levelcode === levelCode)
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / sourceToLoadBasic : ", sourceToLoadBasic)
      
      let sourceToLoadId = sourceToLoadBasic.sourceId
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / sourceToLoadId : ", sourceToLoadId)

      const loadFrom = kpiDataFrom.loadFrom
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / loadFrom : ", loadFrom)

      let dataConfigs = objectFromPath(this.configs, loadFrom.modulePath )
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / dataConfigs : ", dataConfigs)

      let sourceToLoad = dataConfigs.find( conf => conf.id === sourceToLoadId )
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / sourceToLoad : ", sourceToLoad )

      // let sourceToLoadUrl = sourceToLoad.url
      // this.log && console.log("C-KpiCardFrame / reloadDataFromSource / sourceToLoadUrl : ", sourceToLoadUrl )

      const log = this.log
      const dataResponse = this.loadUrlSource(sourceToLoad).then((resp) => {
        // log && console.log("\C-KpiCardFrame / reloadDataFromSource / resp : ", resp)
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

        // log && console.log("C-KpiCardFrame / reloadDataFromSource / rawResponse : ", rawResponse )
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
