<style scoped>
.footerAdjustClass {
  margin-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  margin-bottom: env(safe-area-inset-bottom); /* iOS 11.2 */
}
</style>

<template>
  <v-footer
    v-if="getCurrentNavbarFooter && showCurrentNavbarFooter"
    class="pa-0"
    fixed
    >
    <v-bottom-navigation
      :id="`navbar-footer-${settings.id}`"
      :class="`odm-navbar odm-navbar-footer ${settings.navbarFooterClass}`"
      :trigger="`${trigger}`"
      :value="bottomNav"
      :grow="navbarFooterConfig.grow"
      :height="navbarFooterConfig.height"
      :shift="navbarFooterConfig.shift"
      color="primary"
      :triggerResetNavbarFooter="`${triggerResetNavbarFooter}`"
      >

      <!-- {{ showCurrentNavbarFooter }} -->
      <!-- {{ triggerResetNavbarFooter }} / {{ bottomNav }} -->

      <v-btn
        v-for="btn in navbarFooterConfig.buttons"
        :key="btn.value"
        :value="btn.value"
        @click.stop="goToRef(btn)"
        >
        <span>
          {{ btn.title[locale] }}
        </span>

        <v-icon>
          {{ btn.icon }}
        </v-icon>

      </v-btn>
    </v-bottom-navigation>
  </v-footer>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'NavbarFooter',

  // components: {},

  props: ['settings'],

  data() {
    return {
      dataViewType: 'navbarFooters',
      navbarFooterConfig: undefined,
      bottomNav: undefined,

      duration: 300,
      offset: 0,
      easing: 'easeInOutCubic',

    }
  },

  watch: {
    navbarFooterConfig(next, prev) {
      this.$store.commit('setCurrentNavbarFooter', next)
    },
    getActivatedCurrentNavbarFooter(next, prev) {
      let btnFallback
      if (next) {
        // show navbarFooter => mobile
        btnFallback = this.getCurrentNavbarFooter.redirectAtBreakShow.btnNav
          ? this.getCurrentNavbarFooter.redirectAtBreakShow.btnNav
          : 1
      } else {
        // don't show navbarFooter => desktop
        btnFallback = this.getCurrentNavbarFooter.redirectAtBreakNoShow.btnNav
          ? this.getCurrentNavbarFooter.redirectAtBreakNoShow.btnNav
          : 1
      }
      this.changeBottomNav(btnFallback)
    },
    triggerResetNavbarFooter(next, prev) {
      this.resetBottomNav()
    }
  },

  beforeMount() {
    // set up view config
    this.navbarFooterConfig = this.getLocalConfig
  },

  mounted() {
    // this.log && console.log("C-NavbarFooter / mounted ...")
    // this.bottomNav = this.navbarFooterConfig.defaultBtnNav
    this.resetBottomNav()
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      triggerResetNavbarFooter: (state) => state.triggerResetNavbarFooter,
      trigger: (state) => state.data.triggerChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
    }),

    ...mapGetters({
      // getCurrentLocale: "getCurrentLocale",
      getDataViewConfig: 'getDataViewConfig',
      selectFromDisplayedData: 'data/selectFromDisplayedData',
      // getSpecialStore: "data/getSpecialStore",
      // windowSize: "getWindowsSize",
      // getCurrentBreakpoint: "getCurrentBreakpoint",
      getCurrentNavbarFooter: 'getCurrentNavbarFooter',
      getActivatedCurrentNavbarFooter: 'getActivatedCurrentNavbarFooter',
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

    options() {
      return {
        duration: this.duration,
        offset: this.offset,
        easing: this.easing,
      }
    },
    showCurrentNavbarFooter() {
      // let currentNavbarFooterOnSizes = this.getCurrentNavbarFooter.showOnSizes
      let currentNavbarFooterOnSizes = this.mobileBreakpoints
      // this.log && console.log('C-NavbarFooter / showCurrentNavbarFooter / currentNavbarFooterOnSizes : ', currentNavbarFooterOnSizes)
      //   let currentBreakpoint = this.getCurrentBreakpoint(this.windowSize.width)
      let currentBreakpoint = this.$vuetify.breakpoint.name
      // this.log && console.log('C-NavbarFooter / showCurrentNavbarFooter / currentBreakpoint : ', currentBreakpoint)
      let bool = currentNavbarFooterOnSizes.includes(currentBreakpoint)
      // this.log && console.log('C-NavbarFooter / showCurrentNavbarFooter / bool : ', bool)
      return bool
    },
  },

  methods: {
    getDisplayedData(paramsArray) {
      // this.log && console.log("C-NavbarFooter / getDisplayedData ...")
      let dataFromDisplayedData = this.selectFromDisplayedData(paramsArray)
      return dataFromDisplayedData
    },

    toggleNavbarFooter(btn) {
      // this.log &&
      //   console.log("C-NavbarFooter / toggleNavbarFooter / btn : ", btn)
      this.$store.commit('toggleNavbarFooterVisibility')
    },

    goToRef(btn) {
      // this.log && console.log("\nC-NavbarFooter / goToRef / btn : ", btn)

      this.bottomNav = btn.value

      // this.log && console.log('C-NavbarFooter / goToRef / btn : ', btn)
      if (btn.action == 'scrollTo') {
        // scroll action
        this.$vuetify.goTo(btn.to, this.options)
      }
      if (btn.action == 'goToUrl') {
        // router action
        this.$router.push(btn.toUrl)
      }
      if (btn.action == 'toggleDivs') {
        // router action
        this.$store.dispatch('toggleDivsVisibility', btn)
        this.$store.commit('toggleVisTrigger')
      }
    },

    changeBottomNav(val) {
      this.bottomNav = val
    },

    resetBottomNav() {
      // this.log && console.log("C-NavbarFooter / resetBottomNav ...")
      // this.log && console.log("C-NavbarFooter / this.navbarFooterConfig :", this.navbarFooterConfig)
      this.bottomNav = this.navbarFooterConfig.defaultBtnNav
    }
  },
}
</script>
