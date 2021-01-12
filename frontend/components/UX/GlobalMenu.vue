<style scoped></style>

<template>
  <v-row
    class="align-center"
    >
    <v-col>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="canShow"
            :class="`${btn.btnInnerClass}`"
            :block="btn.block"
            :icon="btn.icon"
            :outlined="btn.outlined"
            :fab="btn.fab"
            :color="btn.color"
            :large="isMobileWidth ? false : btn.large"
            :small="isMobileWidth ? true : btn.small"
            :dark="btn.dark"
            :tile="btn.tile"
            :rounded="btn.rounded"
            :disabled="btn.disabled"
            v-bind="attrs"
            v-on="on"
            >
            {{ btn.title[locale] }}
            <v-icon v-if="btn.iconTitle">
              {{ btn.iconTitle }}
            </v-icon>
          </v-btn>
        </template>
        <v-list
          dense
          rounded
          >
          <v-subheader v-if="btn.menuSubHeader">
            {{ btn.menuSubHeader[locale] }}
          </v-subheader>
          <v-list-item-group
            v-model="itemSelected"
            color="primary"
            >
            <v-list-item
              v-for="(item, index) in menuItems"
              :key="index"
              @click="runBtnFunctions(btn, item)"
              >
              <v-list-item-title
                >
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-col>

    <!-- DEBUGGING -->
    <!-- <v-col cols="2" class="px-1"> -->
      <!-- trigger : <code>{{ trigger }}</code> -->
      <!-- menuItems : <br>
      <code>
        <pre>
          {{ menuItems }}
        </pre>
      </code> -->
    <!-- </v-col> -->

  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import { objectToUrlParams, sortByFieldName, objectFromQueriesString, stringFromQueriesObject } from '~/utils/utils.js'

export default {
  name: 'GlobalMenu',
  // components: {},
  props: [
    'btn',
    'settings'
  ],

  data() {
    return {
      canShow: true,

      itemSelected: undefined,
      menuItems: [],

    }
  },

  watch: {
    trigger(next, prev) {
      this.getCanShow()
    },
    canShow(next, prev) {
      this.$store.commit('buttons/toggleBtnTrigger')
    },
  },

  beforeMount() {
    // set up view config
    this.viewConfig = this.getLocalConfig
  },

  mounted() {
    // this.log && console.log("C-GlobalMenu / mounted ...")
    // this.log && console.log("C-GlobalMenu / this.btn :", this.btn)
    this.getCanShow()
    this.populateMenu(this.btn.populateMenuParams)
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      routeParams: (state) => state.routeParams,
      queryRouteId: (state) => state.queryRouteId
    }),

    ...mapGetters({
      getSpecialStore: 'data/getSpecialStore',
      getStoreSourceData: 'data/getStoreSourceData',
    }),

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },
  },

  methods: {
    getCanShow() {
      let hideIfs = this.btn.hideIfs
      // this.log && console.log("C-GlobalMenu / canShow / this.getSpecialStore : ", this.getSpecialStore)
      let boolsArray = [true]
      if (hideIfs) {
        for (let hideIf of hideIfs) {
          let valueFromSpecialStore = this.getSpecialStore[
            hideIf.specialStoreId
          ]
          let tempBool = hideIf.value == valueFromSpecialStore
          boolsArray.push(!tempBool)
        }
      }
      let checker = boolsArray.every(Boolean)
      this.canShow = checker
    },

    populateMenu( populateMenuParams ) {
      // this.log && console.log("C-GlobalMenu / populateMenu   ...")

      let data = this.getSourceData(populateMenuParams)
      let menuItems = data.map(item => ({
        title: item[populateMenuParams.setTitleFromKey],
        value: item[populateMenuParams.setValueFromKey],
      }))
      menuItems = sortByFieldName(menuItems, 'title', true)
      // this.log && console.log("C-GlobalMenu / populateMenu / data :", data)
      this.menuItems = menuItems
    },

    getSourceData(params, from = 'store') {
      // this.log && console.log("C-GlobalMenu / getSourceData   ...")
      // this.log && console.log("C-GlobalMenu / getSourceData / params :", params)
      let data
      if (from == 'store') {
        data = this.getStoreSourceData(params)
      }
      if (from == 'prop') {
        data = params.prop
      }
      // this.log && console.log("C-GlobalMenu / getSourceData / data :", data)
      return data
    },

    runBtnFunctions(btn, btnItem) {
      // this.log && console.log('C-GlobalMenu / runBtnFunctions / btn : ', btn)
      // this.log && console.log('C-GlobalMenu / runBtnFunctions / btnItem : ', btnItem)

      for (let fn of btn.functions) {
        // this.log && console.log('C-GlobalMenu / runBtnFunctions / fn.funcName : ', fn.funcName )
        let funcParams = fn.funcParams
        let params = funcParams && {
          propName: funcParams.propName,
          prop: btnItem[funcParams.propName],
          props: btnItem,
          // source: itemSource,
        }
        // this.log && console.log('C-GlobalMenu / runBtnFunctions / params : ', params )
        switch (fn.funcName) {

          case 'resetStore':
            this.$store.dispatch('data/resetStore', funcParams)
            break

          // case "resetMapZoom":
          //   this.$store.dispatch("maps/triggerResetZoom", funcParams)
          //   break

          case 'updateDisplayedData':
            params.targets = funcParams.targets
            this.updateDisplayedData(params)
            break

          case 'updateUrlPath' :
            params.targets = funcParams.targets ;
            this.updateUrlPath(params)
            break

          case 'cleanUrlPath' :
            this.cleanUrlPath(funcParams)
            break
        }
      }
      this.$store.commit('buttons/toggleBtnTrigger')
      this.$store.commit('toggleTriggerComponentLoaded')
    },

    updateUrlPath(params) {
      // this.log && console.log("\nC-GlobalMenu / updateUrlPath  : ", "+ ".repeat(10) )
      // this.log && console.log("C-GlobalMenu / updateUrlPath ... params : ", params )

      for (let targetParams of params.targets) {

        let targetArgs = { ...targetParams.urlArgs }
        // this.log && console.log("C-GlobalMenu / updateUrlPath ... this.$store.state.data[ targetArgs.datastore ] : ", this.$store.state.data[ targetArgs.datastore ] )

        const routePath = this.$route.path
        let paramsString = objectToUrlParams(targetArgs)
        const routeIdString = this.queryRouteId ? `routeId=${this.queryRouteId}` : undefined
        if (routeIdString) {
          paramsString = `${routeIdString}&${paramsString}`
        }
        // this.log && console.log("C-GlobalMenu / updateUrlPath ... paramsString : ", paramsString )
        
        this.$store.commit('setRouteParams', paramsString)
        history.pushState(
          {},
          null,
          `${routePath}?${paramsString}`
        )
      }
    },

    cleanUrlPath(funcParams) {
      let routePath = this.$route.path
      let routeQuery = objectFromQueriesString(this.routeParams)      
      let otherQueries = stringFromQueriesObject(routeQuery, [], funcParams.ignoreQueryArgs )
      this.$store.commit('setRouteParams', otherQueries)
      routePath = otherQueries !== '' ? `${routePath}?${otherQueries}` : routePath
      history.pushState({}, null, routePath)
    },

    updateDisplayedData(params) {
      // this.log && console.log("\nC-GlobalMenu / updateDisplayedData  : ", "+ ".repeat(10) )
      // this.log && console.log("C-GlobalMenu / updateDisplayedData ... params : ", params )
      for (let targetParams of params.targets) {

        // this.log && console.log("\nC-GlobalMenu / updateDisplayedData ... targetParams : ", targetParams )
        // 1 - get data for the update
        targetParams.prop = params.prop
        targetParams.propName = params.propName
        targetParams.props = params.props

        let value = this.getSourceData(targetParams, targetParams.from)
        // this.log && console.log("\nC-GlobalMenu / updateDisplayedData ... value : ", value )

        // 2 - then update displayed data
        let targetData = {
          value: value,
          specialStoreId: targetParams.targetSpecialStoreId,
        }
        this.$store.dispatch('data/setNestedData', targetData) // set element in : store.data.sepcialStore
      }
      this.$store.commit('data/toggleTrigger')
    },

    // resetFitToPolygon() {
    //   this.$store.commit('maps/setFitToPolygon', undefined)
    // },

    // resetSelectedPolygons() {
    //   this.$store.commit('maps/seSelectedStateId', undefined)
    // }

  },
}
</script>
