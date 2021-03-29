<style scoped>
</style>

<template>
  <v-container
    v-show="!isRouteLoading && canShow"
    :id="`globalButtons-${settings.id}`"
    :class="`${settings.containerClass} ${isMobileWidth ? 'py-0' : ''}`"
    :trigger="`${trigger}`"
    >
    <v-divider v-if="viewConfig.dividers.before && !isMobileWidth" />

    <v-row 
      v-if="!viewConfig.buttonsVertical"
      :class="`${viewConfig.btnsRowClass} ${isMobileWidth ? viewConfig.btnsRowClassMobile : ''}`"
      >
      <v-col
        v-for="(btn, index) in viewConfig.componentButtons"
        :key="`B-${btn.id}-${index}-horizontal`"
        :id="`B-${btn.id}-${index}-horizontal`"
        :class="`${isMobileWidth ? btn.btnClassMobile : btn.btnClass }`"
        :cols="12"
        :md="btn.cols ? btn.cols : 12"
        >
        <GlobalMenu
          v-if="btn.btnType === 'menuBtn'"
          :btn="btn" 
          :settings="settings"
        />
        <GlobalSearchAutoComplete
          v-if="btn.btnType === 'searchAutocompleteBtn'"
          :btn="btn" 
          :settings="settings"
        />
        <GlobalBtn
          v-if="btn.btnType === 'simpleBtn'"
          :btn="btn" 
          :settings="settings"
        />
        <GlobalBtnTabs
          v-if="btn.btnType === 'tabsBtns'"
          :btn="btn" 
          :settings="settings"
        />
      </v-col>
    </v-row>

    <v-row 
      v-else
      :class="`${viewConfig.btnsRowClass} ${isMobileWidth ? viewConfig.btnsRowClassMobile : 'mt-1 mx-3'}`"
      v-for="(btn, index) in viewConfig.componentButtons"
      :key="`B-${btn.id}-${index}-vertical`"
      :id="`B-${btn.id}-${index}-vertical`"
      >
      <v-col
        :class="`flex-grow-1 ${isMobileWidth ? btn.btnClassMobile : btn.btnClass }`"
        :cols="12"
        :md="btn.cols"
        >
        <GlobalMenu
          v-if="btn.btnType === 'menuBtn'"
          :btn="btn" 
          :settings="settings"
        />
        <GlobalSearchAutoComplete
          v-if="btn.btnType === 'searchAutocompleteBtn'"
          :btn="btn" 
          :settings="settings"
        />
        <GlobalBtn
          v-if="btn.btnType === 'simpleBtn'"
          :btn="btn" 
          :settings="settings"
        />
        <GlobalBtnTabs
          v-if="btn.btnType === 'tabsBtns'"
          :btn="btn" 
          :settings="settings"
          :viewConfig="viewConfig"
        />
      </v-col>
    </v-row>

    <v-divider v-if="getLocalConfig.dividers.after && !isMobileWidth" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'GlobalButtons',

  components: {
    GlobalMenu: () => import(/* webpackChunkName: "GlobalMenu" */ '@/components/UX/GlobalMenu.vue'),
    GlobalSearchAutoComplete: () => import(/* webpackChunkName: "GlobalSearchAutoComplete" */ '@/components/UX/GlobalSearchAutoComplete.vue'),
    GlobalBtn: () => import(/* webpackChunkName: "GlobalBtn" */ '@/components/UX/GlobalBtn.vue'),
    GlobalBtnTabs: () => import(/* webpackChunkName: "GlobalBtnTabs" */ '@/components/UX/GlobalBtnTabs.vue'),
  },

  props: ['settings', 'routeId'],

  data() {
    return {
      dataViewType: 'globalButtons',
      canShow: undefined,
      viewConfig: undefined,
      isLoading: false
    }
  },

  watch: {
    trigger(next, prev) {
      this.getCanShow()
    },
    triggerVis(next, prev) {
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
    // this.log && console.log("\nC-GlobalButtons / mounted ...")
    this.getCanShow()
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      triggerVis: (state) => state.triggerVisChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      isRouteLoading: (state) => state.isRouteLoading,
    }),

    ...mapGetters({
      // getCurrentLocale: 'getCurrentLocale',
      getDataViewConfig: 'getDataViewConfig',
      // selectFromDisplayedData: "data/selectFromDisplayedData",
      getSpecialStore: 'data/getSpecialStore',
      // getFromSpecialStoreData: "data/getFromSpecialStoreData",
      getDivCurrentVisibility: "getDivCurrentVisibility",
      // windowSize: 'getWindowsSize',
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
      // this.log && console.log("\nC-GlobalButtons / getCanShow ...")
      let breakpoint = this.$vuetify.breakpoint.name
      let boolsArray = [true]
      // this.log && console.log("C-GlobalButtons / getCanShow / breakpoint : ", breakpoint)
      // this.log && console.log("C-GlobalButtons / getCanShow / this.settings : ", this.settings)
      // this.log && console.log("C-GlobalButtons / getCanShow / this.routeId : ", this.routeId)
      let isVisible = this.getDivCurrentVisibility({
        div: { id: this.settings.id, routeId: this.routeId },
        breakpoint: breakpoint,
      })
      boolsArray.push(isVisible)
      // this.log && console.log("\nC-GlobalBtn / getCanShow / isVisible : ", isVisible)

      let hideIfs = this.viewConfig.hideIfs
      if (hideIfs) {
        for (let hideIf of hideIfs) {
          let valueFromSpecialStore = this.getSpecialStore[
            hideIf.specialStoreId
          ]
          // this.log && console.log("C-GlobalBtn / getCanShow / valueFromSpecialStore : ", valueFromSpecialStore)
          let tempBool = hideIf.value == valueFromSpecialStore
          // this.log && console.log("C-GlobalBtn / getCanShow / tempBool : ", tempBool)
          boolsArray.push(!tempBool)
        }
      }
      let checker = boolsArray.every(Boolean)
      // this.log && console.log("C-GlobalBtn / getCanShow / checker : ", checker)

      // this.log && console.log("C-GlobalButtons / getCanShow / isVisible : ", isVisible)
      // this.canShow = isVisible
      this.canShow = checker
    },
  },
}
</script>
