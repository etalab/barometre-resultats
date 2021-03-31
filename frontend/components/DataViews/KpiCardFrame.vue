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
            <br> - kpi : <code><pre>{{kpi}}</pre></code>
          </div>
        </v-col>
      </v-row>

    </div>
  
  </v-container>

</template>

<script>

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

      kpi: undefined,
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

    // triggerVis(next, prev) {
    //   this.getCanShow()
    // },

  },

  beforeMount() {
    this.log && console.log("C-KpiCardFrame / beforeMount / this.configsData :", this.configsData)
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

      configsData: (state) => state.configsData,
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

}

</script>
