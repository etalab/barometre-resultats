<template>

  <v-container
    v-if="canShow"
    :id="`returnBtn-${routeId}`"
    :class="`${isMobileWidth ? settings.containerClassMobile : settings.containerClass}`"
    :trigger="`${trigger}`"
    :trigger-vis="`${triggerVis}`"
    >

    <v-btn
      :class="`text-none ${isMobileWidth ? 'px-0' : ''}`"
      depressed
      rounded
      text
      color="white"
      :to="userRouteParams ? userRouteParams : settings.defaultUrl"
      >
      <v-icon
        small
        class="pr-2 pb-0"
        color="primary"
        >
        icon-arrow-left
      </v-icon>
      <span 
       :class="`primary--text ${isMobileWidth ? 'body-2' : ''}`">
        {{ settings.returnBtnTxt[locale] }}
      </span>
    </v-btn>

  </v-container>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ReturnBtn',
  props: ['settings', 'routeId'],
  data() {
    return {
      canShow: undefined,
    }
  },
  watch: {
    triggerVis(next, prev) {
      this.getCanShow()
    }
  },
  mounted() {
    this.getCanShow()
  },
  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      triggerVis: (state) => state.triggerVisChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
    }),
    ...mapGetters({
      userRouteParams: 'getUserRouteParams',
      getDivCurrentVisibility: 'getDivCurrentVisibility'
    }),
    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },
  },
  methods: {
    getCanShow() {
      let breakpoint = this.$vuetify.breakpoint.name
      let isVisible = this.getDivCurrentVisibility({
        div: { id: this.settings.id, routeId: this.routeId },
        breakpoint: breakpoint,
      })
      this.canShow = isVisible
    }
  }
}

</script>
