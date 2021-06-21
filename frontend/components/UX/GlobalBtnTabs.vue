<style >
.unselect_icon{
  /* width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  right:0;
  top:0;
  transform: translate(20px,-10px) */
}

.unselect_icon .v-icon{
  /* font-size: 14px;
  position: absolute;
  color:#383838;
  transform: translate(-6px,1px);
  */
  display: none;
}

.custom-badge .v-badge__wrapper .v-badge__badge {
  padding: .5px 1px !important;
  background-color: white !important;
  border-color: white !important;
}
.custom-badge .v-badge__wrapper .v-badge__badge .v-icon {
  font-size: 18px !important;
  color: #000091 !important;
}
.unselectable{
  pointer-events: none;
}
</style>

<template>
  <div
    :id="`globalbtn-tabs-${btn.id}`"
    v-show="canShow"
    :class="`${ isMobileWidth ? btn.btnsRowClassMobile : btn.btnsRowClass }`"
    >

    <!-- TABS BUTTONS -->
    <span
      v-for="(tab, tabIndex) in tabs"
      :key="tab.id"
      class="pr-2"
      >

      <!-- MULTIPLE TABS ARE SELECTED -->
      <v-badge
        v-if="openTabBtns.includes(tab.id) && openTabBtns.length > 1 "
        offset-x="18px"
        offset-y="20px"
        :class="`custom-badge mb-0`"
        icon="icon-times-circle-o"
        >
        <v-btn
          :class="`${btn.btnInnerClass} white--text`"
          :block="btn.block"
          :icon="btn.icon"
          :outlined="btn.outlined"
          :fab="btn.fab"
          :color="btn.color"
          :large="isMobileWidth ? false : btn.large"
          :small="isMobileWidth ? true : btn.small"
          :text="btn.text"
          :dark="btn.dark"
          :tile="btn.tile"
          :rounded="btn.rounded"
          :disabled="btn.disabled"
          @click="runBtnFunctions(btn, tab.id)"
          >
          {{ tab[tabsTitleKey][locale] }}
        </v-btn>
      </v-badge>
    
      <!-- UNSELECTED TABS || SOLE SELECTED TAB -->
      <v-btn
        v-else
        :class="`${btn.btnInnerClass} ${openTabBtns.includes(tab.id) && openTabBtns.length === 1 ? 'white--text' : ''} mb-2`"
        :block="btn.block"
        :icon="btn.icon"
        :outlined="btn.outlined"
        :fab="btn.fab"
        :color="`${openTabBtns.includes(tab.id) && openTabBtns.length === 1 ? btn.color : btn.colorDepressed}`"
        :large="isMobileWidth ? false : btn.large"
        :small="isMobileWidth ? true : btn.small"
        :text="btn.text"
        :dark="btn.dark"
        :tile="btn.tile"
        :rounded="btn.rounded"
        :disabled="btn.disabled"
        @click="runBtnFunctions(btn, tab.id)"
        >
        {{ tab[tabsTitleKey][locale] }}
      </v-btn>

    </span>

    <!-- SELECT ALL FILTERS BUTTON -->
    <v-btn
      v-if="openTabBtns.length < tabs.length"
      :id="`globalbtn-tabs-${btn.id}-select-all`"
      :small="isMobileWidth"
      outlined
      rounded
      color="grey darken-1"
      :class="`${btn.btnInnerClass}`"
      @click="selectAllTabsBtn()"
      >
      <v-icon
        :small="isMobileWidth"
        class="mr-2"
        >
        icon-check-circle
      </v-icon>
      {{ selectAllFiltersText[locale] }}
    </v-btn>

    <!-- RESET FILTERS BUTTON -->
    <div
      v-if="openTabBtns.length > 1"
      :id="`globalbtn-tabs-${btn.id}-reset`"
      :class="`${isMobileWidth ? 'mt-5' : 'mt-4'} pa-0 text-center pa-0 mb-0`"
      >
      <v-btn
        :small="isMobileWidth"
        text
        rounded
        color="primary"
        class="text-none"
        @click="resetTabBtn()"
        >
        <v-icon
          :small="!isMobileWidth"
          :x-small="isMobileWidth"
          class="mr-2"
          >
          icon-times-circle-o
        </v-icon>
        {{ resetFiltersText[locale] }}
      </v-btn>
    </div> 

  </div>
</template>

<script>
import { objectToUrlParams, objectFromQueriesString, stringFromQueriesObject } from '~/utils/utils.js'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'GlobalBtnTabs',

  props: [
    'btn',
    'settings',
    'viewConfig'
  ],

  data() {
    return {
      canShow: undefined,

      tabs: [],
      openTabBtns: [],
      
      tabKey: undefined,
      populateSpecialStoreKey: undefined,
      queryArgKey: undefined,
      tabsTitleKey: undefined,

      triggerTabBtn: true,

      selectAllFiltersText: {
        fr: 'Tout sélectionner'
      },
      resetFiltersText: {
        fr: 'Réinitialiser tous les filtres'
      },
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
    // this.log && console.log("\nC-GlobalBuntnTabs / beforeMount ...")

    // set up data constants
    this.tabKey = this.btn.populateTabsParams.fromPropKey
    this.populateSpecialStoreKey = this.btn.populateModelParams.specialStoreId
    this.queryArgKey = this.btn.populateModelParams.specialStoreId
    this.tabsTitleKey = this.btn.populateTabsParams.setTitleFromKey
  },

  mounted() {
    // this.log && console.log("C-GlobalBuntnTabs / mounted ...")
    // this.log && console.log("C-GlobalBuntnTabs / mounted / this.viewConfig : ", this.viewConfig)
    this.getCanShow()

    // populate tabs labels and open tabs from btn settings and url
    if (this.btn.populateTabsParams.from === 'viewConfig' ) {
      this.tabs = this.viewConfig[ this.tabKey ]
    }
    // this.log && console.log("C-GlobalBuntnTabs / mounted / this.tabs : ", this.tabs)

    let familiesFromSpecialStore = this.getSpecialStore[ this.populateSpecialStoreKey ]
    if ( familiesFromSpecialStore )  {
        let familiesToLoad = familiesFromSpecialStore
      // this.log && console.log("C-GlobalBuntnTabs / mounted / familiesToLoad : ", familiesToLoad)
      this.openTabBtns.push(...familiesToLoad)
    } else {
      const defaultTab = this.viewConfig.kpi_families[0].id
      this.openTabBtns.push(defaultTab)
      this.updateSpecialStoreWithKpiFamilies()
    }

    // set store from tabs id and labels
    this.$store.dispatch('buttons/changeTabs', this.tabsObject)

    // trigger component loaded to update iframe size and send it to parent
    this.$store.commit('toggleTriggerComponentLoaded')

  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      routeParams: (state) => state.routeParams,
      queryRouteId: (state) => state.queryRouteId,
    }),

    ...mapGetters({
      getDataViewConfig: 'getDataViewConfig',
      getSpecialStore:'data/getSpecialStore',
      // getDivCurrentVisibility: "getDivCurrentVisibility",
    }),

    // config

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },
  
    tabsObject() {
      let tabsObject = {
        tabsId: this.btn.id,
        tabs: this.tabs,
        openTabsIds: this.openTabBtns
      }
      return tabsObject
    }
  },

  methods: {
    getCanShow() {
      let hideIfs = this.btn.hideIfs
      // this.log && console.log("C-GlobalBtnTbs / getCanShow / this.getSpecialStore : ", this.getSpecialStore)
      let boolsArray = [true]
      if (hideIfs) {
        for (let hideIf of hideIfs) {
          let valueFromSpecialStore = this.getSpecialStore[
            hideIf.specialStoreId
          ]
          // this.log && console.log("C-GlobalBtnTbs / getCanShow / valueFromSpecialStore : ", valueFromSpecialStore)
          let tempBool = hideIf.value == valueFromSpecialStore
          boolsArray.push(!tempBool)
        }
      }
      let checker = boolsArray.every(Boolean)
      this.canShow = checker
    },

    runBtnFunctions(btn, btnId) {
      // this.log && console.log('C-GlobalBtnTbs / runBtnFunctions / btn : ', btn)

      if (btn.functions) {
        for (let fn of btn.functions) {
          // this.log && console.log('C-GlobalBtnTbs / runBtnFunctions / fn.funcName : ', fn.funcName )
          // this.log && console.log('C-GlobalBtnTbs / runBtnFunctions / fn.funcParams : ', fn.funcParams )
          let funcParams = fn.funcParams
          switch (fn.funcName) {
            // case 'resetStore':
            //   this.$store.dispatch("data/resetStore", funcParams)
            //   break

            case 'changeOpenTabs':
              this.changeOpenTabs(btnId)
              break

            // case 'updateUrlPath':
            //   this.updateUrlPath(funcParams)
            //   break

            case 'cleanUrlPath':
              this.cleanUrlPath(funcParams)
              this.$store.commit('buttons/toggleBtnReset')
              break
          }
        }
      }
      // this.$store.commit('buttons/updateResetBtnsExceptions', btn.id)
      this.$store.commit('buttons/toggleBtnTrigger')
      this.$store.commit('toggleTriggerComponentLoaded')
    },

    changeOpenTabs(id) {
      var self = this
      this.log && console.log('C-GlobalBtnTbs / changeOpenTabs / id : ', id )
      if (this.openTabBtns.includes(id)) {
        if (this.openTabBtns.length > 1) {
          this.openTabBtns = this.openTabBtns.filter(btn => btn !== id)
        }
      } else {
        this.openTabBtns.unshift(id)  
      }
      // if (!this.openTabBtns.includes(id)) {
      //   this.openTabBtns = [id]
      // }
      this.triggerTabBtn = !this.triggerTabBtn
      this.updateSpecialStoreWithKpiFamilies()
      this.$store.commit('toggleTriggerComponentLoaded')
      this.$store.dispatch('buttons/changeTabs', this.tabsObject)
      setTimeout(function(){
        self.$store.commit('toggleTriggerResize')
      },100)
      
    },

    selectAllTabsBtn(){
      var self = this
      this.openTabBtns = this.tabs.map( tab => tab.id )
      this.triggerTabBtn = !this.triggerTabBtn
      this.updateSpecialStoreWithKpiFamilies()
      // this.$store.commit('buttons/toggleBtnReset')
      this.$store.commit('toggleTriggerComponentLoaded')
      this.$store.dispatch('buttons/changeTabs', this.tabsObject)
      setTimeout(function(){
        self.$store.commit('toggleTriggerResize')
      },100)
    },

    resetTabBtn(){
      var self = this
      this.openTabBtns = []
      this.openTabBtns.push(this.tabs[0].id)
      this.updateSpecialStoreWithKpiFamilies()
      this.$store.commit('toggleTriggerComponentLoaded')
      this.$store.dispatch('buttons/changeTabs', this.tabsObject)
      setTimeout(function(){
        self.$store.commit('toggleTriggerResize')
      },100)
    },

    updateSpecialStoreWithKpiFamilies() {
      // store new kpi families list in specialStore
      let targetData = {
        specialStoreId: 'kpifamilies',
        value: this.openTabBtns
      }
      // this.log && console.log("\nC-GlobalBuntnTabs / updateSpecialStoreWithKpiFamilies / targetData : ", targetData)
      this.$store.dispatch('data/setNestedData', targetData)

      // update url path with all parameters
      this.updateUrlPath()
    },

    updateUrlPath() {
      // this.log && console.log("\nC-GlobalBuntnTabs / updateUrlPath / ... : ")
      // this.log && console.log("C-GlobalBuntnTabs / updateUrlPath / this.routeConfig : ", this.routeConfig)

      const routePath = this.$route.path
      // this.log && console.log("C-GlobalBuntnTabs / updateUrlPath / routePath : ", routePath)

      let paramsStringKpiFamilies = `kpifamilies=${this.openTabBtns.join(',')}`
      // this.log && console.log("C-GlobalBuntnTabs / updateUrlPath / paramsStringKpiFamilies : ", paramsStringKpiFamilies)

      const routeIdString = this.queryRouteId ? `routeId=${this.queryRouteId}` : undefined
      
      const routeArgs = this.btn.setUpRouteViews.urlArgs
      // this.log && console.log("C-GlobalBuntnTabs / updateUrlPath / routeArgs : ", routeArgs)
      
      let routeQuery = objectFromQueriesString(this.routeParams)
      // this.log && console.log("C-GlobalBuntnTabs / updateUrlPath / routeQuery : ", routeQuery)

      let otherQueriesString = stringFromQueriesObject(routeQuery, ['kpifamilies'] )
      // this.log && console.log("C-GlobalBuntnTabs / updateUrlPath / otherQueriesString : ", otherQueriesString)

      let paramsString = `${paramsStringKpiFamilies}${routeIdString ? '&' + routeIdString : '' }${ otherQueriesString !== '' ? '&' + otherQueriesString : ''}`
      // this.log && console.log("C-GlobalBuntnTabs / updateUrlPath ... paramsString : ", paramsString )
      
      this.$store.dispatch("updateUserRouteParams",`${routePath}?${paramsString}`)	
      // this.log && console.log(`${routePath}?${paramsString}`)

      this.$store.commit('setRouteParams', paramsString)
      history.pushState(
        {},
        null,
        `${routePath}?${paramsString}`
      )
    },

    getSourceData(params, from) {
      let data
      if (from === 'raw') {
        data = params.rawValue
      }
      return data
    },

    updateData(params) {
      // this.log && console.log("\nC-GlobalBtnTbs / updateData  : ", "+ ".repeat(10) )
      // this.log && console.log("C-GlobalBtnTbs / updateData ... params : ", params )

      for (let targetParams of params.targets) {
          // 1 - get data for the update
          targetParams.prop = params.prop
          targetParams.propName = params.propName
          targetParams.props = params.props
          let value = this.getSourceData(targetParams, targetParams.from)
          // this.log && console.log("C-GlobalBtnTbs / updateData ... value : ", value )

          // 2 - then update displayed data
          let targetData = {
            value: value,
            specialStoreId: targetParams.targetSpecialStoreId,
          }
          this.$store.dispatch('data/setNestedData', targetData) // set element in : store.data.sepcialStore
      }
    },

    cleanUrlPath(funcParams) {
      // this.log && console.log("C-GlobalBtnTbs / cleanUrlPath ... funcParams : ", funcParams )
      let routePath = this.$route.path
      // this.log && console.log("C-GlobalBtnTbs / cleanUrlPath ... this.$route : ", this.$route )
      // this.log && console.log("C-GlobalBtnTbs / cleanUrlPath ... this.routeParams : ", this.routeParams )
      
      let routeQuery = objectFromQueriesString(this.routeParams)
      // this.log && console.log("C-GlobalBtnTbs / cleanUrlPath ... routeQuery : ", routeQuery )
      
      let otherQueries = stringFromQueriesObject(routeQuery, [], funcParams.ignoreQueryArgs )
      // this.log && console.log("C-GlobalBtnTbs / cleanUrlPath ... otherQueries : ", otherQueries )

      this.$store.commit('setRouteParams', otherQueries)
      routePath = otherQueries !== '' ? `${routePath}?${otherQueries}` : routePath
      history.pushState({}, null, routePath)
    },


  },
};
</script>
