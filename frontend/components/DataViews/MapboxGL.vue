<style lang="scss" scoped>
// .spot__map {
//   margin: 0;
//   width: auto;
// }

.mgl-map-wrapper {
  position: absolute;
}

.map {
  height: calc(100vh - 64px);
  /* height: calc(100vh); */
  width: 100%;
  position: relative;
}

.map-blocks {
  height: 200px;
  /* height: calc(100vh); */
  width: 100%;
  position: relative;
}
.hide-map-blocks{
  visibility: hidden;
  height: 200px;
  width: 100%;
  position: absolute; 
  top: 0; 
  z-index: -1;
}

.map-block {
  border: 2px solid white;
}
.map-block-name {
  z-index: 1;
  position: absolute;
  top: 0;
  // width: 100%;
  text-align: center;
  background-color: #ffffff99;
}
.layers-switch-btn {
  background-color: #fff;
}

</style>

<template>
  <div
    :id="`${settings.id}`"
    :style="`${isMobileWidth ? 'margin:0 34px;' : ''}width: 100%`"
    >
    <!-- :style="`width:${isMobileWidth ? '80' : '100'}%;`" -->

    <!-- MAIN MAP -->
    <v-row
      id="mainMapRow"
      class="mx-0"
      v-show="canShow"
      :class="`map ${isMobileWidth ? 'map-mobile' : ''}`"
      :trigger="`${trigger}`"
      :triggerVis="`${triggerVis}`"
      :style="`height:${mapHeight}px!important;max-height:${mapHeight}px`"
      >
      <!-- :style="`height:${mapHeight}px!important;`" -->
      <v-col
        :id="`mainMapColumn`"
        class="pa-0"
        cols="12"
        >
        <!-- :style="`height:${contentWindowHeight}px!important;max-height:${contentWindowHeight}px`" -->
        <!-- LOADER'S CSS -->
        <style type="text/css">
          .lds-roller div:after {
          content: " ";
          display: block;
          position: absolute;
          width: {{ mapUI.loader.width }};
          height: {{ mapUI.loader.height }};
          border-radius: 50%;
          background:  {{ mapUI.loader.color }};
          margin: -3px 0 0 -3px;
          }
          .floating {
          position: absolute;
          z-index: 200;
          top: 50%;
          left: {{ isMobileWidth ? '35%' : '45%' }};
          }
        </style>

        <!-- LOADER -->
        <div v-show="showLoader" id="loader-map" class="lds-roller floating">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>

        <!-- DEBUGGING -->
        <v-layout
          v-if="map && showVersion"
          id="legend-debug"
          :class="`legend-block-debug legend-bottom-left`"
          >
          <div class="content mx-4" v-if="log">
            <p><code>version :<br> {{ appVersion }}</code></p>
            <!-- <p><code>routeParams :<br> {{ routeParams }}</code></p> -->
            <p><code>selectedStateId : {{ selectedStateId }}</code></p>
            <p><code>mapHeight : {{ mapHeight }}</code></p>
            <p><code>mapBlocksHeight : {{ mapBlocksHeight }}</code></p>
            <p><code>showMapBlocks : {{ showMapBlocks }}</code></p>
            <!-- <p><code>currentZoom : {{ currentZoom }}</code></p> -->
            <!-- <p><code>getCurrentZoom() : {{ getCurrentZoom() }}</code></p> -->
            
            <!-- this.$device.isMobileOrTablet : <b>{{ $device.isMobileOrTablet }}</b> -->
          </div>
        </v-layout>

        <!-- MAP SWITCH -->
        <v-layout
          v-if="map && mapsVisibility && mapsVisibility.is_activated"
          id="maps-switch"
          :class="`legend legend-block legend-bottom-left`"
          >
          <div
            class="block-switch mb-0 justify-center "
            >
            <v-btn
              class="justify-center text-none "
              outlined
              small
              block
              @click="switchMapsDrawer()"
              >
              {{ mapsVisibility.title[locale] }}
            </v-btn>

            <div v-show="drawerMapsOpen" class="mt-2 legend-content justify-left">
              <div
                v-for="(mapRef, index) in mapsVisibility.map_switches"
                :key="index"
                class="field"
                >
                <input
                  :id="mapRef.id"
                  class="is-checkradio"
                  :name="mapRef.id"
                  :checked="mapRef.default_visible ? 'checked' : false"
                  type="checkbox"
                  @click="switchMapVisibility(mapRef.id)"
                  >
                  <label :for="mapRef.id">
                    {{ mapRef.label[locale] }}
                  </label>
                </input>
              </div>
            </div>
          </div>
        </v-layout>

        <!-- LAYERS SWITCH -->
        <v-layout
          v-if="map && layersVisibility && layersVisibility.is_activated"
          id="layers-switch"
          :class="`legend legend-block block-switch ${layersVisibility.positionClass ? layersVisibility.positionClass : 'legend-top-right'} ${drawerLayersOpen ? '' : 'bg-transparent' }`"
          >
          <div
            class="block-switch text-center"
            >
            <div
              :class="`pa-0 ${layersVisibility.btnClass.includes('btn-gouv') ? 'btn-borders-min' : ''} mb-0 mt-1`">
              <v-btn
                :class="`text-none btn-switch ${layersVisibility.btnClass} ${layersVisibility.btnClass.includes('btn-gouv') ? 'btn-gouv-translate' : ''}`"
                color="primary"
                outlined
                tile
                block
                small
                :ripple="false"
                @click="switchLayersDrawer()"
                >
                {{ layersVisibility.title[locale] }}
                <v-icon class="ml-1">
                  icon-keyboard_arrow_{{drawerLayersOpen ? 'up' : 'down'}}
                </v-icon>
              </v-btn>
            </div>

            <div v-show="drawerLayersOpen" class="legend-content justify-left">
              <v-radio-group
                v-model="selectedLayersGroup"
                column
                class="caption"
                >
                <v-radio
                  v-for="(layersGroupref, index) in layersVisibility.layers_switches"
                  :key="index"
                  :id="layersGroupref.id"
                  color="primary"
                  off-icon="icon-panorama_fisheye"
                  on-icon="icon-radio_button_on"
                  :value="layersGroupref.id"
                  @change="switchLayersVisibility(layersGroupref.id)"
                  >
                  <template v-slot:label>
                    <div class="caption">
                      {{layersGroupref.label[locale]}}
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </div>
          </div>
        </v-layout>

        <!-- MAP LEGEND -->
        <v-layout
          v-if="map && legendActivated && legendOpen"
          id="legend"
          :class="`legend legend-block legend-bottom-right`"
          >
          <div
            id="map-legend"
            :class="`content mx-1 ${isMobileWidth ? 'caption' : 'body-2' }`"
            >
            <p class="mb-0 font-weight-medium"
              v-html="legendTitle[locale]"
              >
            </p>
            <p class="mb-0"
              v-html="legendSubTitle[locale]"
              >
            </p>
          </div>
        </v-layout>

        <!-- MAIN MAP WITH MAPBOX GL -->
            <!-- height: 100% !important; -->
        <!-- <style>
          .mapboxgl-canvas {
            height: {{ mapHeight }}px!important;
          }
        </style> -->
        <!-- <style>
          .odamap-main-map .mapboxgl-canvas-container .mapboxgl-canvas {
            height: 100% !important;
          }
        </style> -->
        <client-only>
          <MglMap
            class="odamap-main-map"
            ref="mapboxMainDiv"
            :key="mainMapKey"
            access-token=""
            :map-style.sync="mapOptions.mapStyle"
            :center="mapOptions.center"
            :zoom="mapOptions.zoom"
            :max-zoom="mapOptions.maxZoom"
            :min-zoom="mapOptions.minZoom"
            @load="onMapLoaded($event, mapOptions.mapId, true)"
            @resize="handleResize"
            >
            <!-- :height="mapHeight" -->
            <!-- CONTROLS -->
            <MglNavigationControl
              v-if="!isMobileWidth"
              position="bottom-right"
            />
          </MglMap>
        </client-only>
      </v-col>
    </v-row>
    
    <!-- MAP BLOCKS ROW -->
    <client-only
      >
        <!-- v-show="showMapBlocks" -->
        <!-- :class="`justify-center map-blocks my-2`" -->
      <v-row
        v-if="map && mapOptionsBlocks.length && !isMobileWidth"
        :class="`justify-center ${showMapBlocks ? 'map-blocks mt-2' : 'hide-map-blocks'}`"
        no-gutters
        id="blockMapsRow"
        :trigger="`${trigger}`"
        :triggerVis="`${triggerVis}`"
        :style="`height:${mapBlocksHeight}px!important;max-height:${mapBlocksHeight}px;`"
        class="mx-0"
        >
        <!-- visibility:${showMapBlocks ? '' : 'hidden'} -->
        <!-- display:${showMapBlocks ? '' : 'none'} -->
        <v-col
          v-show="canShow"
          v-for="mapBlock in mapOptionsBlocks"
          :key="mapBlock.mapName"
          :id="`blockMapColumn-${mapBlock.mapId}`"
          class="map-block"
          :style="`width:${100/mapOptionsBlocks.length}%!important;`"
          >
          <p
            class="map-block-name text-center"
            :style="`width:${100/mapOptionsBlocks.length}%!important;`"
            >
            {{ mapBlock.mapName }}
          </p>
          <MglMap
            :class="`odamap-block-map-${mapBlock.mapId}`"
            :ref="`mapboxBlockDiv${mapBlock.mapId}`"
            :style="`width:${(100/mapOptionsBlocks.length)-1}%!important;`"
            access-token=""
            :map-style.sync="mapBlock.mapStyle"
            :center="mapBlock.center"
            :zoom="mapBlock.zoom"
            :max-zoom="mapBlock.maxZoom"
            :min-zoom="mapBlock.minZoom"
            :attributionControl="false"
            :scrollZoom="!mapBlock.noScroll"
            :dragRotate="!mapBlock.noScroll"
            @load="onMapLoaded($event, mapBlock.mapId, false)"
            @resize="handleResize"
            >
          </MglMap>
        </v-col>
      </v-row>
    </client-only>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { Mapbox, mapboxgl } from 'mapbox-gl'
import { MglMap } from 'vue-mapbox'

let _map
let _maps = []

import bbox from '@turf/bbox'

import axios from 'axios'
// import { getDataFromUrl } from '~/utils/getData.js'
// import { transformDataset, buildProperties } from '~/utils/mapbox.js'
import { transformDataset } from '~/utils/mapbox.js'

// import { objectFromPath, switchFormatFunctions, objectToUrlParams } from '~/utils/utils.js'
import { switchFormatFunctions, objectToUrlParams } from '~/utils/utils.js'

import { StylesOSM } from '~/configs/mapboxVectorStyles.js'

export default {
  name: 'MapboxGL',

  props: ['settings', 'routeId'],

  data() {
    return {
      dataViewType: 'maps',
      viewConfig: undefined,
      canShow: undefined,
      showVersion: false,

      // available styles : EtalabFile | EtalabPositronFile | testRasterVoyager | RasterVoyager
      // defaultMapStyle: StylesOSM[ 'EtalabUrl' ],
      defaultMapStyle: StylesOSM[ 'EtalabFile' ],
      // defaultMapStyle: StylesOSM[ 'EtalabPositronUrl' ],
      // defaultMapStyle: StylesOSM[ 'EtalabPositronFile' ],
      // defaultMapStyle: StylesOSM[ 'EtalabRaw' ],
      // defaultMapStyle: StylesOSM[ 'RasterVoyager' ],
      // defaultMapStyle: StylesOSM[ 'testRasterVoyager' ],

      // BUGS XXX
      // defaultMapStyle: StylesOSM[ 'Basic' ],
      // defaultMapStyle: StylesOSM[ 'OSMliberty' ],

      canvasHeight: undefined,
      mapHeight: undefined,
      mapBlocksHeight: 200,
      showLoader: true,

      // MAPBOX MAP OBJECT
      mainMapKey: 0,
      map: undefined,
      mainMapId: undefined,
      originalCenter: undefined,
      originalZoom: undefined,
      currentZoom: undefined,

      // MAPBOX MAP BLOCKS OBJECTS
      activateShowMapBlocks: undefined,
      showMapBlocksOptions: undefined,
      showMapBlocks: true,
      mapBlocks: undefined,
      mapOptions: {
        mapStyle: undefined,
        zoom: undefined,
        maxZoom: undefined,
        minZoom: undefined,
        currentZoom: undefined,
        center: undefined,
        currentCenter: undefined,
      },
      mapOptionsBlocks: [],

      // DRAWERS
      legendActivated: undefined,
      legendTitle: undefined,
      legendSubTitle: undefined,
      legendOpen: true,

      mapsVisibility: undefined,
      drawerMapsOpen: undefined,
      layersVisibility: undefined,
      drawerLayersOpen: undefined,
      selectedLayersGroup: undefined,

      // LAYERS & SOURCES
      sources: undefined,
      maps: undefined,
      layers: undefined,
      paramsReset: { fullParams: { layersReset: ['regions-fill', 'departements-fill'] } },

      // UX
      hoveredStateId: {},
      selectedStateId: {},
    }
  },

  watch: {
    triggerVis(next, prev) {
      this.log && console.log('C-MapboxGL / watch - triggerVis / next :', next)
      this.getCanShow()
      this.handleResize()
    },

    triggerBtn(next, prev) {
      this.log && console.log('C-MapboxGL / watch - triggerBtn / next :', next)
      this.handleResize()
    },

    showMapBlocks(next, prev) {
      let isMapLoaded = this.map
      let areAllBlocksAreLoaded = this.mapOptionsBlocks.every( m => m.isLoaded === true)  
      if (isMapLoaded && areAllBlocksAreLoaded) {
        this.log && console.log("C-MapboxGL / watch - showMapBlocks... ")
        // this.log && console.log("C-MapboxGL / watch - showMapBlocks > need redraw ??? ")

        this.$nextTick().then(() => {
          this.log && console.log("C-MapboxGL / watch - showMapBlocks / nextTick... ")
          // this.handleResize()
          _map.resize()
        })

        // this.$store.commit('toggleVisTrigger')
        // let evt = window.document.createEvent('UIEvents')
        // evt.initUIEvent('resize', true, false, window, -1)
        // window.dispatchEvent(evt)
        // window.dispatchEvent(new Event('resize'))
        // let evt2 = window.document.createEvent('UIEvents')
        // evt2.initUIEvent('resize', true, false, window, 1)
        // window.dispatchEvent(evt2)
        // window.dispatchEvent(new Event('resize'))

        // _map.resize()
        // this.handleResize()
        // let mapbox = _map
        // this.log && console.log("C-MapboxGL / watch - showMapBlocks - > mapbox : ", mapbox)
        // if (mapbox) {
        //   mapbox.resize()
        // }
      }
    },

    map(next, prev) {
      this.handleResize()
      if (next && !prev) {
        this.log && console.log("C-MapboxGL / watch - map - has changed... ")
        this.redraw(true)
      }
    },
    mapBlocks(next, prev) {
      this.handleResize()
      this.log && console.log("\nC-MapboxGL / watch - mapBlocks - has changed... next :", next)
      this.log && console.log("C-MapboxGL / watch - mapBlocks - this.mapOptionsBlocks : ", this.mapOptionsBlocks)
      let areAllBlocksAreLoaded = this.mapOptionsBlocks.every( m => m.isLoaded === true)  
      // this.log && console.log("C-MapboxGL / watch - mapBlocks - areAllBlocksAreLoaded : ", areAllBlocksAreLoaded)
      if (areAllBlocksAreLoaded) {
        this.redraw(false)
      }
    },
    getResetZoomTrigger(next, prev) {
      this.log && console.log('C-MapboxGL / watch - getResetZoomTrigger / next :', next)
      this.handleResize()
      this.resetZoom()
      this.resetAllSelected()
    },

    storeSelectedStateId(next, prev) {
      if (typeof next === 'undefined') {
        // this.resetZoom()
        this.resetAllSelected()
      }
    }

  },

  created() {
    this.log && console.log("C-MapboxGL / created ...")
    window.addEventListener('resize', this.handleResize(true))
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },

  beforeMount() {
    this.log && console.log("\n- + - MapboxGL component - + - + - + - + - + - + ")
    this.log && console.log("C-MapboxGL / beforeMount ... ")

    // reset internal map objects
    _map = undefined
    _maps = []

    // set up view config
    this.viewConfig = this.getLocalConfig
    this.log && console.log("C-MapboxGL / beforeMount / this.viewConfig : ", this.viewConfig)
    this.handleResize(true)

    // set div visibility in store
    this.$store.commit('setDivVisibility', this.settings)

    // set up MAPBOX options
    const mapOptionsRoute = this.viewConfig.map_options
    const mapOptionsBlocksRoute = this.viewConfig.map_blocks
    this.log && console.log("C-MapboxGL / beforeMount / mapOptionsRoute : ", mapOptionsRoute)
    this.log && console.log("C-MapboxGL / beforeMount / mapOptionsBlocksRoute : ", mapOptionsBlocksRoute)

    this.activateShowMapBlocks = this.viewConfig.maps_blocks_toogle_show
    this.showMapBlocksOptions = this.viewConfig.maps_blocks_toggle_options

    // Main map
    let mapOptions = {
      mapId: mapOptionsRoute.mapId,
      mapName: mapOptionsRoute.mapName,

      mapStyle: this.defaultMapStyle,
      // mapStyle: StylesOSM[mapOptionsRoute.mapStyle], // EtalabFile | testRasterVoyager | RasterVoyager

      zoom: this.isMobileWidth ? mapOptionsRoute.zoomMobile : mapOptionsRoute.zoom,
      noScroll: mapOptionsRoute.noScroll,
      maxZoom: mapOptionsRoute.maxZoom,
      minZoom: mapOptionsRoute.minZoom,
      // currentZoom: mapOptionsRoute.currentZoom,
      center: [mapOptionsRoute.center[1], mapOptionsRoute.center[0]],
      currentCenter: mapOptionsRoute.currentCenter,
    }
    this.mapOptions = mapOptions
    this.mainMapId = mapOptionsRoute.mapId

    // Block maps
    for (let mapBlock of mapOptionsBlocksRoute) {
      let mapOptionsBlock = {
        mapId: mapBlock.mapId,
        mapName: mapBlock.mapName,
        mapStyle: this.defaultMapStyle,
        // mapStyle: StylesOSM[mapBlock.mapStyle],
        zoom: this.isMobileWidth ? mapBlock.zoomMobile : mapBlock.zoom,
        noScroll: mapBlock.noScroll,
        maxZoom: mapBlock.maxZoom,
        minZoom: mapBlock.minZoom,
        center: [mapBlock.center[1], mapBlock.center[0]],
        currentCenter: mapBlock.currentCenter,
        isLoaded: false,
        isDrawn: false
      }
      this.mapOptionsBlocks.push(mapOptionsBlock)
      // this.log && console.log("C-MapboxGL / beforeMount / this.mapBlocks : ", this.mapBlocks)
    }
    this.mapBlocks = -1

    // setup sources
    this.sources = this.viewConfig.sources
    this.originalCenter = [mapOptionsRoute.center[1], mapOptionsRoute.center[0]]
    this.originalZoom = mapOptionsRoute.zoom
    this.currentZoom = mapOptionsRoute.zoom

    // setup maps
    this.maps = this.viewConfig.maps

    // setup layers
    this.layers = this.viewConfig.layers

    // setup drawers switch map
    this.mapsVisibility = this.viewConfig.maps_visibility
    this.drawerMapsOpen =
      this.mapsVisibility && this.mapsVisibility.is_drawer_open
    
    // setup drawers switch layers
    this.layersVisibility = this.viewConfig.layers_visibility
    this.drawerLayersOpen =
      this.layersVisibility && this.layersVisibility.is_drawer_open
    let selectedLayersGroup = this.layersVisibility && this.layersVisibility.layers_switches.find((layerGroup) => layerGroup.default_visible === true)
    this.selectedLayersGroup = selectedLayersGroup && selectedLayersGroup.id

    // setup legend
    this.legendActivated = this.viewConfig.legend && this.viewConfig.legend.activated 
    this.legendTitle = this.viewConfig.legend && this.viewConfig.legend.legend_title
    this.legendSubTitle = this.viewConfig.legend && this.viewConfig.legend.legend_subtitle
  },

  mounted() {
    this.log && console.log("C-MapboxGL / mounted ...")
    this.handleResize(true)
    this.getCanShow()
    this.$store.commit('toggleTriggerComponentLoaded')
  },

  computed: {
    ...mapState({
      appVersion: (state) => state.appVersion,
      log: (state) => state.log,
      locale: (state) => state.locale,
      isIframe: (state) => state.isIframe,
      routeParams: (state) => state.routeParams,
      queryRouteId: (state) => state.queryRouteId,

      fitToPolygon: (state) => state.maps.fitToPolygon,
      storeSelectedStateId: (state) => state.maps.selectedStateId,
      noMapScroll: (state) => state.maps.noMapScroll,

      mapUI: (state) => state.configUI.map,
      trigger: (state) => state.data.triggerChange,
      triggerVis: (state) => state.triggerVisChange,
      triggerBtn: (state) => state.buttons.triggerBtnChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      defaultOdamapHeight: (state) => state.defaultOdamapHeight,
    }),

    ...mapGetters({
      // routeConfig: 'getLocalRouteConfig',
      getDataViewConfig: 'getDataViewConfig',
      getStoreSourceData: 'data/getStoreSourceData',
      getSpecialStore: 'data/getSpecialStore',
      windowSize: 'getWindowsSize',
      getCurrentNavbarFooter: 'getCurrentNavbarFooter',
      getDivCurrentVisibility: 'getDivCurrentVisibility',
      getResetZoomTrigger: 'maps/getResetZoomTrigger',
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

    contentWindowHeight() {
      let height = this.windowSize.height - this.navbarHeight
      if (
        this.getCurrentNavbarFooter &&
        this.getCurrentNavbarFooter.activated
      ) {
        height = height - this.getCurrentNavbarFooter.height
      }
      return height
    },

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },

  },

  methods: {
    // ...mapActions({
    //   setNestedData: "data/setNestedData",
    // }),

    getCanShow() {
      let breakpoint = this.$vuetify.breakpoint.name
      let isVisible = this.getDivCurrentVisibility({
        div: { id: this.settings.id, routeId: this.routeId },
        breakpoint: breakpoint,
      })
      // this.log && console.log("C-MapboxGL / canShow ... isVisible : ", isVisible )
      this.canShow = isVisible
    },
    getShowBlocks() {
      // hide / show map blocks row
      let boolArray = []
      let showMapBlocks = true
      if( this.activateShowMapBlocks ) {
        for (let showOption of this.showMapBlocksOptions) {
          // this.log && console.log("......C-MapboxGL / handleResize ... showOption : ", showOption )
          let canShow = [true]
          showOption.rules.forEach(rule => {
            // this.log && console.log("C-MapboxGL / handleResize ... rule : ", rule )
            let condition = rule.specialStoreValues.includes(this.getSpecialStore[rule.specialStoreField])
            condition = showOption.behavior === 'hide' ? !condition : condition
            // this.log && console.log("C-MapboxGL / handleResize ... condition : ", condition )
            canShow.push(condition)
            // this.log && console.log("C-MapboxGL / handleResize ... canShow : ", canShow )
          })
          let isRuleFulfilled = canShow.every(v => v === true)
          boolArray.push(isRuleFulfilled)
        }
        // this.log && console.log("C-MapboxGL / handleResize ... boolArray : ", boolArray )
        showMapBlocks = boolArray.some(v => v === true)
      }
      this.log && console.log("C-MapboxGL / handleResize ... showMapBlocks : ", showMapBlocks )
      return showMapBlocks
    },
    handleResize(ignoreBlocks = false) {
      let mapbox = _map
      let mapboxBlocks = _maps
      this.log && console.log("\nC-MapboxGL / handleResize ... " )
      this.log && console.log("C-MapboxGL / handleResize / ignoreBlocks : ", ignoreBlocks )
      // this.log && console.log("C-MapboxGL / handleResize ... this.getSpecialStore : ", this.getSpecialStore )
      // this.log && console.log("C-MapboxGL / handleResize ... this.activateShowMapBlocks : ", this.activateShowMapBlocks )
      // this.log && console.log("C-MapboxGL / handleResize ... this.showMapBlocksOptions : ", this.showMapBlocksOptions )

      // hide / show map blocks row
      let showMapBlocks = this.getShowBlocks()
      this.log && console.log("C-MapboxGL / handleResize ... showMapBlocks : ", showMapBlocks )

      // compute maps heigths
      let mapHeight = 0

      let ODAMAP_height = document.getElementById('ODAMAP-root') ? document.getElementById('ODAMAP-root').clientHeight : undefined 
      let docNavbars = document.querySelectorAll(`.odm-navbar`)
      // this.log && console.log("C-MapboxGL / handleResize ... docNavbars : ", docNavbars )
      let docNavbarsArray = Array.prototype.slice.call(docNavbars)
      let sumNavbarsHeights = docNavbarsArray
        .map((i) => i.offsetHeight)
        .reduce((prev, curr) => prev + curr, 0)
      // this.log && console.log("C-MapboxGL / handleResize ... sumNavbarsHeights : ", sumNavbarsHeights )

      let winHeight = window.innerHeight
      // this.log && console.log("C-MapboxGL / handleResize ... this.isIframe : ", this.isIframe )
      // this.log && console.log("C-MapboxGL / handleResize ... winHeight : ", winHeight )

      if (this.isIframe) {
        mapHeight = this.defaultOdamapHeight
      } else {
        if (this.isMobileWidth && !this.settings.mobileHeight) {
          winHeight = ODAMAP_height ? ODAMAP_height : winHeight
        }
        mapHeight = winHeight
      }
      // this.log && console.log("C-MapboxGL / handleResize ... mapHeight (A): ", mapHeight )

      let mapsBlocksHeights = 0
      if (this.mapOptionsBlocks.length > 0) {
        mapsBlocksHeights = this.mapBlocksHeight
      }

      if (this.isMobileWidth) {
        let docComponents = document.querySelectorAll(`.odm-colrow:not(.odm-colrow-map)`)
        this.log && console.log("C-MapboxGL / handleResize ... docComponents : ", docComponents )
        let docComponentsArray = Array.prototype.slice.call(docComponents)
        let sumComponentsHeights = docComponentsArray
          .map((i) => i.offsetHeight)
          .reduce((prev, curr) => prev + curr, 0)
        this.log && console.log("C-MapboxGL / handleResize ... sumComponentsHeights : ", sumComponentsHeights )

        mapHeight = mapHeight - sumNavbarsHeights - sumComponentsHeights - 110 //- navbarsHeights
        // this.canvasHeight = mapHeight
      } else {
        // this.canvasHeight = mapHeight - sumNavbarsHeights
        mapHeight = mapHeight - sumNavbarsHeights - mapsBlocksHeights - 10
        // mapHeight = showMapBlocks ? mapHeight - sumNavbarsHeights - mapsBlocksHeights : mapHeight - sumNavbarsHeights
      }

      if (this.isMobileWidth && this.settings.mobileHeight) {
        mapHeight = this.settings.mobileHeight
      }
      // this.showMapBlocks = ignoreBlocks ? false : showMapBlocks
      this.showMapBlocks = showMapBlocks
      // this.mapHeight = (this.isMobileWidth && this.settings.mobileHeight) ? mapHeight : mapHeight + mapsBlocksHeights
      this.mapHeight = this.showMapBlocks || (this.isMobileWidth && this.settings.mobileHeight) ? mapHeight : mapHeight + mapsBlocksHeights
      this.log && console.log("C-MapboxGL / handleResize ... this.mapHeight (end): ", this.mapHeight )
      // this.log && console.log("C-MapboxGL / handleResize ... mapbox (end): ", mapbox )

      // if (mapbox) mapbox.resize()
      // mapboxBlocks.forEach( mapBlock => {
      //   if (mapBlock) mapBlock.map.resize()
      // })

      // little hack to redraw window on safari IOS
      // let isMobileOrTablet = this.$device.isMobileOrTablet
      // // let isMobileOrTablet = true
      // if (isMobileOrTablet){
      //   this.log && console.log("C-MapboxGL / handleResize ... this.$device : ", this.$device )
      //   const int = setInterval(() => {
      //     window.scrollTo(0, 0)
      //   }, 100)
      // }

    },
    getCurrentCenter() {
      // let mapbox = this.map
      let mapbox = _map
      // let mapboxBlocks = _maps

      let currrentCenter = mapbox.getCenter()
      // this.log && console.log("C-MapboxGL / getCurrentCenter ... currrentCenter : ", currrentCenter )
      this.currrentCenter = currrentCenter
      // this.$store.commit('maps/setStateObject', { field: 'currentCenter', value: currentCenter})
      return currrentCenter
    },
    getCurrentZoom() {
      // let mapbox = this.map
      let mapbox = _map
      // let mapboxBlocks = _maps

      let currentZoom = mapbox.getZoom()
      // this.log && console.log("C-MapboxGL / getCurrentZoom ... currentZoom : ", currentZoom )
      this.currentZoom = currentZoom
      // this.$store.commit('maps/setStateObject', { field: 'currentZoom', value: currentZoom})
      return currentZoom
    },

    // INITIIALIZATION - - - - - - - - - - - - - - - - - - //

    onMapLoaded(event, mapId, mainMap = true) {
      // this.log && console.log("\nC-MapboxGL / onMapLoaded ... ")
      // this.log && console.log("C-MapboxGL / onMapLoaded / event : ", event)
      // this.log && console.log("C-MapboxGL / onMapLoaded / mapId : ", mapId)

      if (mainMap) {
        // store main map in component
        this.map = true
        _map = event.map
  
        // in store => WARNING : object too complex to be stored/mutated in vuex so far
        // check : https://ypereirareis.github.io/blog/2017/04/25/vuejs-two-way-data-binding-state-management-vuex-strict-mode/
  
        // disable scroll zoom if noScroll
        if (this.noMapScroll || this.mapOptions.noScroll ) {
          _map.scrollZoom.disable()
        }
      }

      else {
        this.mapBlocks = this.mapBlocks * -1
        let blockMap = event.map
        blockMap.dragPan.disable()

        // store block map in component
        _maps.push({
          id:  mapId,
          map: blockMap
        })

        // this.log && console.log("C-MapboxGL / onMapLoaded / this.mapOptionsBlocks : ", this.mapOptionsBlocks)
        let mapBlockInfo = this.mapOptionsBlocks.find((mapBlock) => mapBlock.mapId === mapId)
        mapBlockInfo.isLoaded = true
        // this.log && console.log("C-MapboxGL / onMapLoaded / mapBlockInfo : ", mapBlockInfo)

      }

    },

    redraw(mainMap = true) {
      // this.log && console.log("\nC-MapboxGL / redraw - mainMap : ", mainMap)
      // this.log && console.log("C-MapboxGL / redrawing mainMap...")
      // this.log && console.log("C-MapboxGL / redraw - this.mainMapId : ", this.mainMapId)
      let storeSourcesArray = this.sources.filter((s) => s.from === "store")
      let urlSourcesArray = this.sources.filter((s) => s.from === "url")
      
      // TO DO - reset sources and layers from previous maps
      
      this.loadStoreSources(storeSourcesArray, mainMap)
      this.loadUrlSources(urlSourcesArray, mainMap).then(() => {
        this.loadLayers(this.layers, mainMap)
        this.loadClicEvents(this.maps, mainMap)
        // set up view 
        if (this.fitToPolygon) {
          // this.log && console.log("C-MapboxGL / redraw - map / this.fitToPolygon : ", this.fitToPolygon)
          if (this.fitToPolygon.zoomBy === 'polygon') {
            let newParams = { ...this.fitToPolygon, ...this.paramsReset }
            this.goToPolygon({}, newParams)
          } else if (this.fitToPolygon.zoomBy === 'centerAndZoom') {
            const center = this.fitToPolygon.center
            const zoom = this.fitToPolygon.zoom
            this.flyTo( center, zoom, true )
          }
        }

        // set up selected polygons
        if (this.storeSelectedStateId) {
          this.setSelectedPolygons(this.storeSelectedStateId)
        }
        // flag as loading finished
        this.showLoader = false
      })
    
    },

    isInZoomRange(zoomRange) {
      // this.log && console.log("\nC-MapboxGL / isInZoomRange ... zoomRange : ", zoomRange )

      let currentZoom = this.getCurrentZoom()
      // this.log && console.log("C-MapboxGL / isInZoomRange ... currentZoom : ", currentZoom )

      let isInZoomRangeBoolean = true
      if (zoomRange) {
        let maxZoom = zoomRange.maxZoom ? zoomRange.maxZoom : 18
        let minZoom = zoomRange.minZoom ? zoomRange.minZoom : 0
        if (currentZoom >= maxZoom || currentZoom <= minZoom) {
          isInZoomRangeBoolean = false
        }
      }
      // this.log && console.log("C-MapboxGL / isInZoomRange ... isInZoomRangeBoolean : ", isInZoomRangeBoolean )
      return isInZoomRangeBoolean
    },

    // LOADERS - - - - - - - - - - - - - - - - - - //

    loadStoreSources(sourcesArray, mainMap = true) {
      // this.log && console.log("\nC-MapboxGL / loadStoreSources ", "... ".repeat(10))
      // this.log && console.log("\nC-MapboxGL / loadStoreSources / sourcesArray :", sourcesArray)

      let mapbox = _map
      let mapboxBlocks = _maps
      let store = this.$store

      let promisesArray = []

      // STORE SOURCES (loaded as initData @ middleware GetInitData.js )
      for (let source of sourcesArray) {
        let mapBoxSrcObj = {
          type: source.type,
        }

        // debug
        const debug = source.debug

        // retrieve source from store 'state.data.initData'
        let dataset = store.getters['data/getFromInitData'](source.fromId)
        // this.log && console.log("\nC-MapboxGL / loadStoreSources - store ... dataset.id : ", dataset.id)
        // this.log && console.log("C-MapboxGL / loadStoreSources - store ... dataset : ", dataset)

        // transform to source.type if necessary
        if (source.needTransform) {
          let geoCanvas = store.getters['data/getFromInitData'](
            source.transformTo.geoCanvasId
          )
          // this.log && console.log("C-MapboxGL / loadStoreSources - store ... geoCanvas : ", geoCanvas)
          let geoCanvasData = geoCanvas.data
          // this.log && console.log("C-MapboxGL / loadStoreSources - store ... geoCanvasData : ", geoCanvasData)
          dataset = transformDataset(source, dataset, geoCanvasData, debug)
        }
        // this.log && console.log("C-MapboxGL / loadStoreSources - store ... dataset : ", dataset)

        // add source to map
        // this.log && console.log("C-MapboxGL / loadStoreSources - store ... addSource to map... / source.id :", source.id)
        mapBoxSrcObj.data = { ...dataset }
        if (source.generateId) mapBoxSrcObj.generateId = source.generateId

        if (mainMap) {
          mapbox.addSource(source.id, mapBoxSrcObj)
          // add source to store
          store.dispatch('data/setDisplayedDataset', {
            id: source.id,
            data: dataset,
          })
        } else {
          mapboxBlocks.forEach(mapBlock => {
            mapBlock.map.addSource(source.id, mapBoxSrcObj)
          })
        }

      }
    },
    loadUrlSources(sourcesArray, mainMap = true) {
      // this.log && console.log("\nC-MapboxGL / loadUrlSources ", "... ".repeat(10))
      let mapbox = _map
      let mapboxBlocks = _maps
      let store = this.$store

      // URL SOURCES
      let promisesArray = []
      for (let source of sourcesArray) {
        // this.log && console.log("\nC-MapboxGL / loadUrlSources - url ... source.id : ", source.id)
        // this.log && console.log( "C-MapboxGL / loadUrlSources - url ... source.help : ", source.help)
        let mapBoxSrcObj = {
          type: source.type,
        }

        if (source.loadInStore) {
          let resp = axios.get(source.url)
          resp.then((r) => {
            let dataset = r.data
            // this.log && console.log("C-MapboxGL / loadUrlSources - url ... dataset : ", dataset)

            // add source to map
            // this.log && console.log("C-MapboxGL / loadUrlSources - url ... addSource ...")
            mapBoxSrcObj.data = { ...dataset }
            if (source.generateId) mapBoxSrcObj.generateId = source.generateId

            if (mainMap) {
              mapbox.addSource(source.id, mapBoxSrcObj)
              // add source to store - displayedData
              store.dispatch('data/setDisplayedDataset', {
                id: source.id,
                data: dataset,
              })
            } else {
              mapboxBlocks.forEach(mapBlock => {
                mapBlock.map.addSource(source.id, mapBoxSrcObj)
              })
            }
          })
          promisesArray.push(resp)
        } else {
          // add source to map
          // this.log && console.log("C-MapboxGL / loadUrlSources - url (!loadInStore) ... addSource ...")
          mapBoxSrcObj.data = source.url
          if (source.generateId) mapBoxSrcObj.generateId = source.generateId
          if (mainMap) {
            mapbox.addSource(source.id, mapBoxSrcObj)
          } else {
            mapboxBlocks.forEach(mapBlock => {
              mapBlock.map.addSource(source.id, mapBoxSrcObj)
            })
          }
        }
      }
      return Promise.all(promisesArray)
    },
    loadLayers(layersArray, mainMap = true) {
      let mapbox = _map
      let mapboxBlocks = _maps
      // this.log && console.log("\nC-MapboxGL / loadLayers ", "... ".repeat(10))
      // this.log && console.log("\n")

      // ADDING LAYERS TO MAP
      for (let layer of layersArray) {
        // this.log && console.log("\nC-MapboxGL / loadLayers ... layer.id : ", layer.id)
        // this.log && console.log("C-MapboxGL / loadLayers ... layer : ", layer)
        if (mainMap) {
          mapbox.addLayer(layer)
        } else {
          mapboxBlocks.forEach(mapBlock => {
            mapBlock.map.addLayer(layer)
          })
        }
      }
    },
    loadClicEvents(mapsArray, mainMap = true ) {
      // let mapbox = this.map
      let mapbox = _map
      let mapboxBlocks = _maps
      // this.log && console.log("\nC-MapboxGL / loadClicEvents ", "... ".repeat(10))

      for (let mapRef of mapsArray) {
        if (mapRef.clicEvents) {
          for (const clicEvent of mapRef.clicEvents) {
            // this.log &&
            //   console.log(
            //     "\nC-MapboxGL / loadClicEvents ... clicEvent.layer : ",
            //     clicEvent.layer,
            //     " / event :",
            //     clicEvent.event
            //   )
            // this.log && console.log("C-MapboxGL / loadClicEvents ... clicEvent : ", clicEvent)

            let clickFunctions = clicEvent.functions
            
            if (mainMap) {            
              mapbox.on(clicEvent.event, clicEvent.layer, (e) => {
                let featuresItem = mapbox.queryRenderedFeatures(e.point, {
                  layers: [clicEvent.layer],
                })

                if (
                  typeof featuresItem !== 'undefined' &&
                  featuresItem.length > 0
                ) {
                  let item = featuresItem[0]
                  let itemSource = item.source
                  let itemLayer = item.layer
                  let itemProps = item.properties

                  // DEBUGGING
                  // this.log && console.log( "... clicEvent : ", clicEvent )
                  // this.log && console.log( "... clicEvent.event : ", clicEvent.event )
                  // this.log && console.log( "... itemProps : ", itemProps )
                  // this.log && console.log( "... itemLayer : ", itemLayer )
                  // this.log && console.log( "... clicEvent.layer : ", clicEvent.layer )
                  // if( clicEvent.event === 'click' ) {
                    // this.log && console.log( "... featuresItem : ", featuresItem )
                    // this.log && console.log( "... itemSource : ", itemSource )
                  // }

                  for (let fn of clickFunctions) {
                    // this.log && console.log( "... fn : ", fn )
                    let funcParams = fn.funcParams
                    // this.log && console.log( "... funcParams : ", funcParams )

                    let params = funcParams && {
                      zoomRange: funcParams.zoomRange,
                      source: itemSource,
                      prop: itemProps[funcParams.propName],
                      propName: funcParams.propName,
                      fullParams: funcParams,
                      props: itemProps,
                    }

                    switch (fn.funcName) {
                      case 'goToPolygon':
                        this.goToPolygon(e,params)
                        break

                      case 'setChildrenPolygons':
                        params.targets = funcParams.targets
                        this.setChildrenPolygons(params)
                        break

                      case 'updateData':
                        params.targets = funcParams.targets
                        this.updateData(params)
                        break

                      case 'updateDisplayedData':
                        params.targets = funcParams.targets
                        this.updateDisplayedData(params)
                        break

                      case 'updateUrlPath':
                        params.targets = funcParams.targets
                        // this.log && console.log( "... MapboxGL / clicEvent / updateUrlPath / params : ", params )
                        this.updateUrlPath(params)
                        break

                      case 'toggleHighlightOn':
                        this.toggleHighlightOn(e, itemSource, params)
                        break

                      case 'toggleHighlightOff':
                        this.toggleHighlightOff(e, itemSource, params)
                        break

                      case 'toggleSelectedOn':
                        this.toggleSelectedOn(e, itemSource, params)
                        break

                      // case 'toggleSelectedOff' :
                      //   this.toggleSelectedOff(e, itemSource ) ;
                      //   break ;
                    }
                  }
                  // this.handleResize()
                  if (clicEvent.event === 'click') {
                    this.handleResize()
                  }
                }
              })
            } else {
              mapboxBlocks.forEach( mapBlock => {
                mapBlock.map.on(clicEvent.event, clicEvent.layer, (e) => {
                  let featuresItem = mapBlock.map.queryRenderedFeatures(e.point, {
                    layers: [clicEvent.layer],
                  })

                  if (
                    typeof featuresItem !== 'undefined' &&
                    featuresItem.length > 0
                  ) {
                    let item = featuresItem[0]
                    let itemSource = item.source
                    let itemLayer = item.layer
                    let itemProps = item.properties

                    for (let fn of clickFunctions) {
                      let funcParams = fn.funcParams

                      let params = funcParams && {
                        zoomRange: funcParams.zoomRange,
                        source: itemSource,
                        prop: itemProps[funcParams.propName],
                        propName: funcParams.propName,
                        fullParams: funcParams,
                        props: itemProps,
                      }

                      switch (fn.funcName) {
                        case 'goToPolygon':
                          this.goToPolygon(e, params)
                          break

                        case 'setChildrenPolygons':
                          params.targets = funcParams.targets
                          this.setChildrenPolygons(params)
                          break

                        case 'updateData':
                          params.targets = funcParams.targets
                          this.updateData(params)
                          break

                        case 'updateDisplayedData':
                          params.targets = funcParams.targets
                          this.updateDisplayedData(params)
                          break

                        case 'updateUrlPath' :
                          params.targets = funcParams.targets
                          this.updateUrlPath(params)
                          break

                        case 'toggleHighlightOn':
                          this.toggleHighlightOn(e, itemSource, params)
                          break

                        case 'toggleHighlightOff':
                          this.toggleHighlightOff(e, itemSource, params)
                          break

                        case 'toggleSelectedOn':
                          this.toggleSelectedOn(e, itemSource, params)
                          break
                      }
                    }
                    if (clicEvent.event === 'click') {
                      this.handleResize()
                    }
                  }
                })
              })
            }

          }
        }
      }
    },

    // DATA INTERACTIONS - - - - - - - - - - - - - - - - - - //

    getSourceData(params, from="map") {
      // this.log && console.log("\nC-MapboxGL / getSourceGeoData ... from : ", from)
      // this.log && console.log("C-MapboxGL / getSourceGeoData ... params : ", params)

      let mapbox = _map
      let data

      if (from === 'map') {
        let sourcesList = mapbox.getStyle().sources
        // this.log && console.log("C-MapboxGL / getSourceGeoData ... sourcesList : ", sourcesList)
        let source = sourcesList && sourcesList[params.source]
        // this.log && console.log("C-MapboxGL / getSourceGeoData ... source : ", source)
        data =
          source && source.data.features.find(
            (feat) => feat.properties[params.propName] == params.prop
          )
        // this.log && console.log("C-MapboxGL / getSourceGeoData ... data - A : ", data)
      }

      if (from === 'store') {
        data = this.getStoreSourceData(params)
      }

      if (from === 'prop') {
        data = params.prop
      }

      if (from === 'raw') {
        data = params.rawValue
      }

      if (params.format) {
        data = switchFormatFunctions(data, params.format)
      }
      // this.log && console.log("C-MapboxGL / getSourceGeoData ... data - B : ", data)
      return data
    },
    updateData(params, toggleTriger = false) {
      // this.log && console.log("\nC-MapboxGL / updateData  : ", "+ ".repeat(10) )
      // this.log && console.log("C-MapboxGL / updateData ... params : ", params )
      // this.log && console.log("C-MapboxGL / updateData ... this.getSpecialStore : ", this.getSpecialStore )
      let isFnInZoomRange = this.isInZoomRange(params.zoomRange)
      if (isFnInZoomRange) {
        for (let targetParams of params.targets) {

          // 1 - get data for the update
          targetParams.prop = params.prop
          targetParams.propName = params.propName
          targetParams.props = params.props
          let value = this.getSourceData(targetParams, targetParams.from)
          // this.log && console.log("C-MapboxGL / updateData ... value : ", value )

          // 2 - then update displayed data
          let targetData = {
            value: value,
            specialStoreId: targetParams.targetSpecialStoreId,
          }
          this.$store.dispatch('data/setNestedData', targetData) // set element in : store.data.sepcialStore
        }
        if (toggleTriger) {
          // this.$store.commit('data/toggleTrigger')
          this.$store.dispatch('data/toggleTrigger')
        }
      }
    },
    updateDisplayedData(params) {
      this.updateData(params, true)
    },
    updateUrlPath(params) {
      // this.log && console.log('\nC-MapboxGL / updateUrlPath  : ', '+ '.repeat(10) )
      // this.log && console.log('C-MapboxGL / updateUrlPath ... params : ', params )
      let isFnInZoomRange = this.isInZoomRange(params.zoomRange)
      // this.log && console.log('C-MapboxGL / updateUrlPath ... isFnInZoomRange : ', isFnInZoomRange )

      if (isFnInZoomRange) {

        for (let targetParams of params.targets) {
          // 1 - get data for the update
          targetParams.prop = params.prop
          targetParams.propName = params.propName
          targetParams.props = params.props
          // this.log && console.log('C-MapboxGL / updateUrlPath ... targetParams : ', targetParams )

          let value = this.getSourceData(targetParams, targetParams.from)
          // this.log && console.log('C-MapboxGL / updateUrlPath ... value : ', value )

          // 2 - then update value data in targetParams
          let targetArgs = { ...targetParams.urlArgs }
          targetArgs.value = value

          // 2bis - set zoom and center params in url
          targetArgs.zoom = this.getCurrentZoom().toFixed(2)
          const currentCenter = this.getCurrentCenter() //
          targetArgs.centerlng = currentCenter.lng.toFixed(4)
          targetArgs.centerlat = currentCenter.lat.toFixed(4)

          // 2ter - set highlighted polygons in url params
          // this.log && console.log('C-MapboxGL / updateUrlPath ... this.selectedStateId : ', this.selectedStateId )
          let selectedTranslated = []
          for ( let key in this.selectedStateId ) {
            selectedTranslated.push( `${key}:${this.selectedStateId[key]}` ) 
          }
          // this.log && console.log('C-MapboxGL / updateUrlPath ... selectedTranslated : ', selectedTranslated )
          targetArgs.selected = selectedTranslated

          // 3 - update url path
          // this.log && console.log('C-MapboxGL / updateUrlPath ... targetArgs : ', targetArgs )
          const routePath = this.$route.path
          let paramsString = objectToUrlParams(targetArgs)
          const routeIdString = this.queryRouteId ? `routeId=${this.queryRouteId}` : undefined
          if (routeIdString) {
            paramsString = `${routeIdString}&${paramsString}`
          }
          // this.log && console.log('C-MapboxGL / updateUrlPath ... paramsString : ', paramsString )

          this.$store.commit('setRouteParams', paramsString)
          history.pushState(
            {},
            null,
            `${routePath}?${paramsString}`
          )
        }
      }
    },

    // TO DO ...
    setChildrenPolygons(params) {
      // this.log && console.log("\nC-MapboxGL / setChildrenPolygons ... params : ", params )
      let isFnInZoomRange = this.isInZoomRange(params.zoomRange)
      let geodata = this.getSourceData(params)
    },

    // TO DO ...
    updateQuery(params) {
      // this.log && console.log("\nC-MapboxGL / updateQuery ... params : ", params )
      let isFnInZoomRange = this.isInZoomRange(params.zoomRange)
      let geodata = this.getSourceData(params)
    },

    // UX FUNCTIONS - - - - - - - - - - - - - - - - - - //

    // ZOOM FUNCTIONS

    fit(geojson) {
      // this.log && console.log('\nC-MapboxGL / fit ... geojson : ', geojson )
      let mapbox = _map
      var _bbox = bbox(geojson)
      let options = { padding: 20, animate: true }
      mapbox.fitBounds(_bbox, options)
    },
    flyTo(center, zoom, convertToLngLat=false) {
      // this.log && console.log('\nC-MapboxGL / flyTo ... center : ', center )
      // this.log && console.log('C-MapboxGL / flyTo ... zoom : ', zoom )
      let mapbox = _map
      if (zoom > 0 && center) {
        mapbox.flyTo({
          center: center,
          zoom: zoom,
        })
      }
    },
    goToPolygon(event, params) {
      // this.log && console.log("\nC-MapboxGL / goToPolygon ... params : ", params )
      // this.log && console.log("C-MapboxGL / goToPolygon ... event.features : ", event.features )
      let mapbox = _map
      let isFnInZoomRange = this.isInZoomRange(params.zoomRange)
      // this.log && console.log("C-MapboxGL / goToPolygon ... isFnInZoomRange : ", isFnInZoomRange )

      let eventProps = event.features && event.features[0] && event.features[0].properties
      // this.log && console.log("C-MapboxGL / goToPolygon ... eventProps : ", eventProps )
      const zoomExceptions = params && params.fullParams && params.fullParams.zoomExceptions
      const zoomExceptionsKey = params && params.fullParams && params.fullParams.zoomExceptionsKey
      // this.log && console.log("C-MapboxGL / goToPolygon ... zoomExceptions : ", zoomExceptions )
      if ( zoomExceptions && zoomExceptions.includes(eventProps[zoomExceptionsKey]) ) {
        isFnInZoomRange = true
      }

      if (isFnInZoomRange) {
        let geodata = this.getSourceData(params)
        // this.log && console.log("C-MapboxGL / goToPolygon ... geodata : ", geodata )
        let geojson = {
          type: 'FeatureCollection',
          features: [geodata],
        }
        this.fit(geojson)

        // find corresponding data in map
        let source = params.source
        // this.log && console.log("C-MapboxGL / goToPolygon ... source : ", source )
        let sourceFeatures = mapbox.querySourceFeatures( source, { sourceLayer: `${source}-fill` } )
        // this.log && console.log("C-MapboxGL / goToPolygon ... sourceFeatures : ", sourceFeatures )
        
        let selectedPolygon = sourceFeatures.find((feat) => feat.properties.code === geodata.properties.code)
        // this.log && console.log("C-MapboxGL / goToPolygon ... selectedPolygon : ", selectedPolygon )

        // toggle selected on
        if (selectedPolygon) {
          let pseudoEvent = {
            features: [selectedPolygon]
          }
          // this.log && console.log("C-MapboxGL / goToPolygon ... pseudoEvent : ", pseudoEvent )
          this.toggleSelectedOn(pseudoEvent, source, params)
        }
      }
    },
    resetZoom() {
      // this.log && console.log("\nC-MapboxGL / resetZoom ... " )
      this.flyTo(this.originalCenter, this.originalZoom)
    },

    // HIGHLIGHTS FUNCTIONS

    toggleHighlightOn(event, source, params) {
      // this.log && console.log("\nC-MapboxGL / toggleHighlightOn ... " )
      // this.log && console.log("C-MapboxGL / toggleHighlightOn / source :", source )
      // this.log && console.log("C-MapboxGL / toggleHighlightOn / event.features[0] :", event.features[0] )
      // this.log && console.log("C-MapboxGL / toggleHighlightOn / this.hoveredStateId :", this.hoveredStateId )
      let mapbox = _map
      let mapboxBlocks = _maps
      const canvas = mapbox.getCanvas()
      canvas.style.cursor = 'pointer'
      
      // clear all layers and sources
      this.toggleHighlightOff(event, source, params)

      if (event.features[0]) {
        this.hoveredStateId[source] = event.features[0].id
        mapbox.setFeatureState(
          { source: source, id: this.hoveredStateId[source] },
          { hover: true }
        )
        mapboxBlocks.forEach(mapBlock => {
          mapBlock.map.setFeatureState(
            { source: source, id: this.hoveredStateId[source] },
            { hover: true }
          )
        })
      }
    },
    toggleHighlightOff(event, source, params) {
      // this.log && console.log("\nC-MapboxGL / toggleHighlightOff ... " )
      // this.log && console.log("C-MapboxGL / toggleHighlightOff / source : ", source )
      // this.log && console.log("C-MapboxGL / toggleHighlightOff / params : ", params )
      // this.log && console.log("C-MapboxGL / toggleHighlightOff / event.features[0].properties : ", event.features[0].properties )
      // this.log && console.log("C-MapboxGL / toggleHighlightOff / event : ", event )
      // this.log && console.log("C-MapboxGL / toggleHighlightOff / event.features : ", event.features )
      // this.log && console.log("C-MapboxGL / toggleHighlightOff / this.hoveredStateId[source] : ", this.hoveredStateId[source] )
      let mapbox = _map
      let mapboxBlocks = _maps

      let layers = params.fullParams.layersReset

      const canvas = mapbox.getCanvas()
      canvas.style.cursor = ''

      // clean all sources froom hover state
      const layersView = this.layers.map( lay => lay.id )
      const filteredLayers = layers.filter(lay => layersView.includes(lay))

      let features = mapbox.queryRenderedFeatures({ layers: [...filteredLayers] })
      features.forEach( feat => {
        mapbox.setFeatureState(
          { source: feat.source, id: feat.id },
          { hover: false }
        )
      })
      mapboxBlocks.forEach(mapBlock => {
        let featuresBlocks = mapBlock.map.queryRenderedFeatures({ layers: [...filteredLayers] })
        featuresBlocks.forEach( featBlock => {
          mapBlock.map.setFeatureState(
            { source: featBlock.source, id: featBlock.id },
            { hover: false }
          )
        })
      })
    },

    // SELECTED POLYGONS
    resetAllSelected() {
      // this.log && console.log('C-MapboxGL / resetAllSelected ... this.selectedStateId : ', this.selectedStateId )
      for (let source in this.selectedStateId) {
        // this.toggleHighlightOff(source)
        let featureId = this.selectedStateId[source]
        this.resetSelectedPolygons(source, this.paramsReset)
      }
      this.selectedStateId = {}
    },
    resetSelectedPolygons(source, params) {
      // this.log && console.log('C-MapboxGL / resetSelectedPolygons ...' )
      // this.log && console.log('C-MapboxGL / resetSelectedPolygons ... source : ', source )
      // this.log && console.log('C-MapboxGL / resetSelectedPolygons ... params : ', params )
      // this.log && console.log('C-MapboxGL / resetSelectedPolygons ... featureId : ', featureId )
      // this.log && console.log('C-MapboxGL / resetSelectedPolygons ... this.selectedStateId : ', this.selectedStateId )
      let mapbox = _map
      let mapboxBlocks = _maps

      // clean all sources froom hover state
      this.toggleHighlightOff({}, source, this.paramsReset)

      // clean all sources froom selected state
      let layers = params.fullParams.layersReset
      const layersView = this.layers.map( lay => lay.id )
      const filteredLayers = layers.filter(lay => layersView.includes(lay))

      const sources = ['regions', 'departements']
      // this.log && console.log('C-MapboxGL / resetSelectedPolygons ... sources : ', sources )
      const sourcesView = this.sources.map(src => src.id)
      // this.log && console.log('C-MapboxGL / resetSelectedPolygons ... sourcesView : ', sourcesView )
      const filteredSources = sources.filter(src => sourcesView.includes(src))
      // this.log && console.log('C-MapboxGL / resetSelectedPolygons ... filteredSources : ', filteredSources )
      
      filteredSources.forEach(src => {
        mapbox.removeFeatureState({ source: src })
        mapboxBlocks.forEach(mapBlock => {
          mapBlock.map.removeFeatureState({ source: src })
        })
      })

      // let features = mapbox.queryRenderedFeatures({ layers: [...filteredLayers] })
      // features.forEach( feat => {
      //   mapbox.setFeatureState(
      //     { source: feat.source, id: feat.id },
      //     { selected: false }
      //   )
      // })
      // mapboxBlocks.forEach(mapBlock => {
      //   let featuresBlocks = mapBlock.map.queryRenderedFeatures({ layers: [...filteredLayers] })
      //     featuresBlocks.forEach( featBlock => {
      //       // this.log && console.log('C-MapboxGL / resetSelectedPolygons ... featBlock : ', featBlock )
      //       mapBlock.map.setFeatureState(
      //         { source: featBlock.source, id: featBlock.id },
      //         { selected: false }
      //       )
      //   })
      // })
    },
    setSelectedPolygons(selected, params = this.paramsReset) {
      // this.log && console.log('\nC-MapboxGL / setSelectedPolygons ... selected : ', selected )
      // this.log && console.log('C-MapboxGL / setSelectedPolygons ... params : ', params )
      let mapbox = _map
      let mapboxBlocks = _maps
      // clean all features from selected state
      this.resetSelectedPolygons({}, this.paramsReset)
      let selectedSources = Object.keys(selected)
      // this.log && console.log('C-MapboxGL / setSelectedPolygons ... selectedSources : ', selectedSources )
      selectedSources.forEach( src => {
        // this.log && console.log('C-MapboxGL / setSelectedPolygons ... src : ', src )
        let featureId = parseInt( selected[src] )
        // this.log && console.log('C-MapboxGL / setSelectedPolygons ... featureId : ', featureId )
        this.selectedStateId[src] = featureId
        // this.log && console.log('C-MapboxGL / setSelectedPolygons ... this.selectedStateId : ', this.selectedStateId )
        mapbox.setFeatureState(
          { source: src, id: featureId },
          { selected: true }
        )
        mapboxBlocks.forEach(mapBlock => {
          mapBlock.map.setFeatureState(
            { source: src, id: featureId },
            { selected: true }
          )
        })
      })
    },
    toggleSelectedOn(event, source, params) {
      // this.log && console.log('\nC-MapboxGL / toggleSelectedOn ... event : ', event )
      // this.log && console.log('C-MapboxGL / toggleSelectedOn ... params : ', params )
      // this.log && console.log('C-MapboxGL / toggleSelectedOn ... source : ', source )
      // this.log && console.log('C-MapboxGL / toggleSelectedOn ... event.features : ', event.features )
      // this.log && console.log('C-MapboxGL / toggleSelectedOn ... this.selectedStateId : ', this.selectedStateId )
      let mapbox = _map
      let mapboxBlocks = _maps
      this.resetSelectedPolygons(source, params)
      
      if (event.features) {
        // this.log && console.log('C-MapboxGL / toggleSelectedOn ... event.features[0] : ', event.features[0] )
        // this.log && console.log('C-MapboxGL / toggleSelectedOn ... this.selectedStateId - 1 : ', this.selectedStateId )

        // clean all sources froom selected state
        this.selectedStateId[source] = event.features[0] && event.features[0].id

        // this.log && console.log('C-MapboxGL / toggleSelectedOn ... this.selectedStateId - 2 : ', this.selectedStateId )
        
        let sources = Object.keys(this.selectedStateId)
        // this.log && console.log('C-MapboxGL / toggleSelectedOn ...sources :', sources )
        sources.forEach(src => {
          // this.log && console.log('C-MapboxGL / toggleSelectedOn ...src :', src )
          mapbox.setFeatureState(
            { source: src, id: this.selectedStateId[src] },
            { selected: true }
          )
          mapboxBlocks.forEach(mapBlock => {
            mapBlock.map.setFeatureState(
              { source: src, id: this.selectedStateId[src] },
              { selected: true }
            )
          })
        })

      }
    },

    // VISIBILITY FUNCTIONS

    switchMapVisibility(mapSelectedId) {
      let mapbox = _map
      let mapboxBlocks = _maps

      let MapVisibilityConfig = this.mapsVisibility.map_switches.find(
        (item) => item.id === mapSelectedId
      )
      // this.log && console.log("C-MapboxGL / switchMapVisibility / MapVisibilityConfig : ", MapVisibilityConfig)

      let mapSelected = this.maps.find(
        (m) => m.id === MapVisibilityConfig.mapId
      )

      for (let layerId of mapSelected.layers) {
        let visibility = mapbox.getLayoutProperty(layerId, 'visibility')
        if (visibility === 'visible') {
          mapbox.setLayoutProperty(layerId, 'visibility', 'none')
          mapboxBlocks.forEach(mapBlock => {
            mapBlock.map.setLayoutProperty(layerId, 'visibility', 'none')
          })
        } else {
          mapbox.setLayoutProperty(layerId, 'visibility', 'visible')
          mapboxBlocks.forEach(mapBlock => {
            mapBlock.map.setLayoutProperty(layerId, 'visibility', 'visible')
          })
        }
      }
    },
    switchLayersVisibility(layersSetSelectedId) {
      // this.log && console.log("\nC-MapboxGL / switchLayersVisibility / layersSetSelectedId : ", layersSetSelectedId)

      let mapbox = _map
      let mapboxBlocks = _maps
      // this.log && console.log("C-MapboxGL / switchLayersVisibility / mapbox : ", mapbox)

      let LayersVisibilityConfig = this.layersVisibility.layers_switches.find(
        (item) => item.id === layersSetSelectedId
      )
      // this.log && console.log("C-MapboxGL / switchLayersVisibility / LayersVisibilityConfig : ", LayersVisibilityConfig)

      // 1 - set all layers from layersIds_full_set as invisibble first
      for (let layerId of this.layersVisibility.layersIds_full_set) {
        mapbox.setLayoutProperty(layerId, 'visibility', 'none')
        mapboxBlocks.forEach(mapBlock => {
          mapBlock.map.setLayoutProperty(layerId, 'visibility', 'none')
        })
      }

      // 2 - set layersSelected as visibble
      let layersSelected = LayersVisibilityConfig.layersIds
      // this.log && console.log("C-MapboxGL / switchLayersVisibility / layersSelected : ", layersSelected)
      
      for (let layerId of layersSelected) {
        // this.log && console.log("C-MapboxGL / switchLayersVisibility / layerId : ", layerId)
        mapbox.setLayoutProperty(layerId, 'visibility', 'visible')
        mapboxBlocks.forEach(mapBlock => {
          mapBlock.map.setLayoutProperty(layerId, 'visibility', 'visible')
        })
      }
      // 3 - update legend
      // this.log && console.log("C-MapboxGL / switchLayersVisibility / LayersVisibilityConfig.legend : ", LayersVisibilityConfig.legend)
      this.legendTitle = LayersVisibilityConfig.legend.legend_title
      this.legendSubTitle = LayersVisibilityConfig.legend.legend_subtitle

    },
    switchMapsDrawer() {
      this.drawerMapsOpen = !this.drawerMapsOpen
    },
    switchLayersDrawer() {
      this.drawerLayersOpen = !this.drawerLayersOpen

      // hide/show legend block if layers drawer is open/close
      this.legendOpen = !this.drawerLayersOpen
    }
    // switchLegendDrawer(){
    //   this.drawerScalesOpen = !this.drawerScalesOpen
    // }

  },
}
</script>

<style>
.app-loader {
  margin: 1.5em;
  padding: 1.5em;
}

/* cf : https://docs.mapbox.com/mapbox-gl-js/example/updating-choropleth/ */

.bg-transparent {
  background-color: transparent !important;
}

.block-switch {
  min-width: 150px;;
  max-width: 320px;
}

.btn-switch {
  display:inline-block;
  min-width: 130px;;
  max-width: 300px;
  background-color: #fff;
}

.legend {
  background-color: #fff;
  border-radius: 3px;
  /* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); */
  /* font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif; */
  padding: 10px;
  /* right: 10px; */
  max-width: 320px;
}

.legend-block {
  position: absolute;
  z-index: 2;
}

#legend-debug {
  position: absolute;
  z-index: 3;
  bottom: 100px;
  max-width: 400px;
}

.legend-bottom-left {
  bottom: 30px;
  left: 10px;
}

.legend-bottom-right {
  bottom: 30px;
  right: 50px;
}

.legend-top-left {
  top: 10px;
  left: 10px;
}

.legend-top-right {
  top: 10px;
  right: 10px;
}
/* .layer-switch {
  margin-bottom: 10px;
} */

.legend-content {
  margin-top: 0.7em;
}

.legend h4 {
  margin: 0 0 10px;
}

.legend div span {
  border-radius: 50%;
  /* display: inline-block; */
  height: 10px;
  /* margin-right: 5px; */
  /* width: 10px; */
}

/* LOADERS */

/* from : https://loading.io/css/ */
.lds-roller {
  display: inline-block;
  /* position: absolute;
    z-index:200;
    top: 50%;
    left: 50%; */
  /* margin-top: -40px; */
  margin-left: 30px;
  height: 80px;
  width: 100px;
  border-radius: 10px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 32px 32px;
}

.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 50px;
  left: 50px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 54px;
  left: 45px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 57px;
  left: 39px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 58px;
  left: 32px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 57px;
  left: 25px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 54px;
  left: 19px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 50px;
  left: 14px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 45px;
  left: 10px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.map .count-and-tabs-container {
  position: absolute;
  top: 1rem;
  width: 100%;
}

.map .count-and-tabs-container .result-count-parent,
.map .count-and-tabs-container .buttons {
  z-index: 2;
}

.map .cis-marker-cluster {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  background-color: #a174ac;
  color: white;

  font-size: 16px;
  font-weight: bold;

  border-radius: 50%;
}

.highlighted-project {
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
}

.highlighted-project button.close {
  margin: 0.5em 0;
  background-color: transparent;
  border: 0;

  align-self: flex-end;
}

.highlighted-project .card {
  font-size: 0.9em;

  box-shadow: none;
}

.highlighted-project .card .card-content {
  padding: 0.2em 0.5em;
}

.highlighted-project .card .card-content:first-of-type {
  padding-top: 0.5em;
}
.highlighted-project .card .card-content:last-of-type {
  padding-bottom: 0.5em;
}

.highlighted-project .card .card-content h1 {
  font-size: 1.1em;
  font-weight: bold;
}

/* TODO SASS : share this style with search result project card tag style */
.highlighted-project .tag {
  margin-right: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.2em 1em;
  background-color: #767676;
  color: white;
}
</style>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>
