<style scoped>
  .has-scrollbar {
    overflow-y: scroll !important;
  }
  /* .no-right-margin {
    margin-left: 0px !important;
    margin-right: 0px !important;
  } */
</style>

<template>
  <div
    :id="routeConfig.id"
    :triggerVis="`${triggerVis}`"
    class="odm-index pb-5"
    :style="`height:${contentWindowHeight ? contentWindowHeight + 'px' : 'none'};`"
    >

    <!-- triggerVis: <code>{{triggerVis}}</code> -->
    <!-- getDivVisibilityArray: <br><code>{{getDivVisibilityArray}}</code> -->
    <!-- {{ contentWindowHeightPx() }}  -->
    $vuetify.breakpoint.name : {{ $vuetify.breakpoint.name }}<br>

    <v-row
      v-for="(row, index) in routeConfig.pageRows"
      :id="`R${index}`"
      :key="`R${index}`"
      :class="`odm-row justify-center ${isMobileWidth ? '' : ''}`"
      >
      <!-- no-gutters -->
      <template v-if="row.activated">
        <v-col
          v-for="(col, i) in row.columns"
          :id="`R${index}-C${i}`"
          :key="`R${index}-C${i}`"
          :class="`odm-col ${col.colClass ? col.colClass : ''} ${isMobileWidth && !col.colAddPadding ? 'px-0' : ''} ${col.colAddPadding ? 'odm-col-padding-' + $vuetify.breakpoint.name :  ''}`"
          :cols="breakpoint && col.colSizes ? col.colSizes[breakpoint] : 12"
          >
          <!-- :style="`height:${contentWindowHeight + 'px'};`" -->
          <!-- :style="`height:${forceFullHeigth(col) ? '100%' : contentWindowHeight + 'px'};`" -->
          <template v-if="col.activated">
            <!-- {{ windowSize }} -->
            <!-- $device : {{ $device }}<br> -->


            <!-- hasScrollbar : {{ col.hasScrollbar }} -->
            <!--  contentWindowHeight : {{ contentWindowHeight }} -->
            <div
              :id="`R${index}-C${i}-div`"
              :class="`${col.hasScrollbar ? 'has-scrollbar' : ''}`"
              :style="`${col.hasScrollbar ? 'max-height:' + contentWindowHeight + 'px;': ''}`"
              >
              <!-- :style="`${col.hasScrollbar ? 'max-height:' + contentWindowHeight + 'px;': ''}`" -->
              <v-row
                v-for="(colRow, iRow) in col.colRows"
                :id="`R${index}-C${i}-CR${iRow}`"
                :key="`R${index}-C${i}-CR${iRow}`"
                no-gutters
                :align="colRow.align"
                :class="`odm-colrow odm-colrow-${colRow.component} justify-${colRow.justify} ${colRow.class ? colRow.class : ''}`"
                >

                <ReturnBtn
                  v-if="colRow.activated && colRow.component == 'returnBtn'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                 />

                <TextFrame
                  v-if="colRow.activated && colRow.component == 'text'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                  :isBrief="colRow.textBrief"
                  :drawerIcon="colRow.settings.drawerIcon"
                  :drawerIconOff="colRow.settings.drawerIconOff"
                  :drawerClassOverride="colRow.settings.drawerClassOverride"
                  :drawerTextClassOverride="colRow.settings.drawerTextClassOverride"
                 />

                <GlobalButtons
                  v-if="colRow.activated && colRow.component == 'globalButtons'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                 />

                <Numbers
                  v-if="colRow.activated && colRow.component == 'numbers'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                />

                <MapboxGL
                  v-if="colRow.activated && colRow.component == 'map'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                />

                <ApexChart
                  v-if="colRow.activated && colRow.component == 'apexchart'"
                  :settings="colRow.settings"
                  :hideTitle="colRow.settings.hideTitle"
                  :route-id="routeConfig.id"
                />

                <InfoBox
                  v-if="colRow.activated && colRow.component == 'infoBox'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                />

                <!-- <Table
                  v-if="colRow.activated && colRow.component == 'table'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                /> -->

                <!-- <RawData
                  v-if="colRow.activated && colRow.component == 'rawData'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                /> -->

                <KpiTable
                  v-if="colRow.activated && colRow.component == 'kpiTable'"
                  :settings="colRow.settings"
                  :route-id="routeConfig.id"
                />

              </v-row>
            </div>
          </template>
        </v-col>
      </template>
    </v-row>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Homepage',
  scrollToTop: true,

  components: {
    MapboxGL: () => import(/* webpackChunkName: "MapboxGL" */ '@/components/DataViews/MapboxGL.vue'),
    KpiTable: () => import(/* webpackChunkName: "KpiTable" */ '@/components/DataViews/KpiTable.vue'),
  },

  data() {
    return {
      fixed: false,
      breakpoint: undefined,
      window: {
        width: 0,
        height: 0,
      },
      contentWindowHeight: undefined
    }
  },

  watch: {
    trigger(next, prev) {
      this.handleResize()
    },
    getActivatedCurrentNavbarFooter(next, prev) {
      let fallback = '/'
      if (next && typeof prev !== 'undefined') {
        // show navbarFooter => mobile
        fallback = this.getCurrentNavbarFooter.redirectAtBreakShow.path
          ? this.getCurrentNavbarFooter.redirectAtBreakShow.path
          : '/'
      } else {
        // don't show navbarFooter => desktop
        fallback = this.getCurrentNavbarFooter.redirectAtBreakNoShow.path
          ? this.getCurrentNavbarFooter.redirectAtBreakNoShow.path
          : '/'
      }
    },
  },

  created() {
    // this.log && console.log("P-Homepage / created ...")
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },

  beforeMount() {
    this.$store.dispatch('setRouteDivsVisibility', this.routeConfig)
  },

  mounted() {
    //   this.log && console.log("P-Homepage / mounted ...")
    this.$store.commit('toggleTriggerComponentLoaded')
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      isIframe: (state) => state.isIframe,
      configUX: (state) => state.configUX,

      // vuetifyThemeIsSet: (state) => state.configs.vuetifyThemeIsSet,
      // configUI: (state) => state.configUI,

      backendApi: (state) => state.data.backendApi,
      filters: (state) => state.data.filters,

      initData: (state) => state.data.initData,
      data: (state) => state.data.displayedData,

      navbarHeight: (state) => state.navbar.height,
      defaultOdamapHeight: (state) => state.defaultOdamapHeight,
      // currentNavbarFooter : state => state.currentNavbarFooter,
      divsVisibility: (state) => state.divsVisibility,
      triggerVis: (state) => state.triggerVisChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
    }),

    ...mapGetters({
      // getCurrentLocale: "getCurrentLocale",
      routeConfig: 'getLocalRouteConfig',
      // windowSize: "getWindowsSize",
      getCurrentNavbarFooter: 'getCurrentNavbarFooter',
      getActivatedCurrentNavbarFooter: 'getActivatedCurrentNavbarFooter',
      // isMobileWidth : 'isMobileWidth',
      // getDivVisibilityArray: "getDivVisibilityArray",
    }),

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },

  },

  methods: {
    ...mapActions({
      setCurrentWindowSize: 'setCurrentWindowSize',
    }),
    forceFullHeigth(col) {
      let forceFullHeigth = false
      if (col.forceFullHeight && !this.isMobileWidth) {
        forceFullHeigth = true
      }
      return forceFullHeigth
    },
    handleResize() {
      this.computedContentWindowHeight()
      this.window.width = window.innerWidt
      this.window.height = window.innerHeight
      this.breakpoint = this.$vuetify.breakpoint.name
      this.setCurrentWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        breakpointName: this.$vuetify.breakpoint.name,
        isMobile: this.$device,
        routeConfig: this.routeConfig,
      })
      this.$store.commit('toggleVisTrigger')
    },
    computedContentWindowHeight() {
      // check if forceFullHeight is needed
      // console.log('\nP-Homepage / contentWindowHeight / this.routeConfig : ', this.routeConfig)
      // const forceFullHeight = this.isIframe && this.routeConfig.forceHeightIfIframe
      const forceFullHeight = this.routeConfig.forceFullHeightMobile
      // console.log('P-Homepage / contentWindowHeight / forceFullHeight : ', forceFullHeight)

      // check if overrideIframeMaxHeight is precised
      const overrideIframeMaxHeight = this.configUX.overrideIframeMaxHeight
      // console.log('P-Hompage /contentWindowHeight / overrideIframeMaxHeight : ', overrideIframeMaxHeight)

      let winHeight = window.innerHeight
      // console.log("P-Homepage / contentWindowHeight ... winHeight : ", winHeight )
      
      let ODAMAP_height = document.getElementById('ODAMAP-root') ? document.getElementById('ODAMAP-root').clientHeight : undefined 
      // console.log("P-Homepage / contentWindowHeight ... ODAMAP_height : ", ODAMAP_height )

      let height
      if (!this.isIframe) {
        
        if (this.isMobileWidth) {
          if (forceFullHeight) {
            winHeight = undefined // this.defaultOdamapHeight
          } else {
            winHeight = ODAMAP_height ? ODAMAP_height : winHeight 
          }
        }
        // winHeight = ODAMAP_height ? ODAMAP_height : winHeight

        let docNavbars = document.querySelectorAll(`.odm-navbar`)
        // this.log && console.log("P-Homepage / contentWindowHeight ... docNavbars : ", docNavbars )
        let docNavbarsArray = Array.prototype.slice.call(docNavbars)
        let sumNavbarsHeights = docNavbarsArray
          .map((i) => i.offsetHeight)
          .reduce((prev, curr) => prev + curr, 0)
        // this.log && console.log("P-Homepage / contentWindowHeight ... sumNavbarsHeights : ", sumNavbarsHeights )
        height = winHeight && winHeight - sumNavbarsHeights

      } else {
        height = this.defaultOdamapHeight
        if (this.isMobileWidth) {
          if (forceFullHeight) {
            height = undefined
          }
        }
      }

      // console.log("P-Homepage / contentWindowHeight ... height : ", height )
      // return height
      this.contentWindowHeight = height
    },

  },
}
</script>
