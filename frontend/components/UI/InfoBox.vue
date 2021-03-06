<style scoped>
  .infobox-text-block {
    background-color: #f9f8f6;
  }
  .infobox-link {
    text-decoration: none;
  }
  .infobox-image {
    max-width: 175px;
    height: 175px;
  }
  .infobox-image-mobile {
    max-width: 100px;
    height: 100px;
  }
</style>

<template>

  <v-container
    v-show="canShow"
    :id="`infoBox-${routeId}`"
    :class="`${isMobileWidth ? settings.containerClassMobile : settings.containerClass}`"
    :trigger="`${trigger}`"
    :trigger-vis="`${triggerVis}`"
    >
    
    <v-divider v-if="settings.dividers && settings.dividers.before" class="mb-3"></v-divider>

    <!-- TITLE -->
    <v-row>
      <v-col class="mb-0">
        <p 
          :class="`text-left font-weight-bold ${isMobileWidth ? 'text-body-2' : 'text-body-1'} mb-0`">
          {{ settings.title[locale] }}
        </p>
      </v-col>
    </v-row>

    <a
      class="row no-gutters d-flex text-none infobox-link"
      justify-left
      :href="settings.link"
      :target="`${ isIframe ? '_parent' : '_blank' }`"
      >

      <!-- IMAGE -->
      <v-col
        :class="`infobox-image${isMobileWidth ? '-mobile' : ''}`"
        >
        <v-img
          class=""
          :lazy-src="settings.image"
          :src="settings.image"
          :height="`${isMobileWidth ? 100 : 175 }`"
        ></v-img>
      </v-col>

      <!-- TEXT -->
      <v-col
        align-center 
        :class="`infobox-text-block ${isMobileWidth ? 'pa-2' : 'pa-5'} flex-grow-1`"
        >
        <nuxt-link
          v-if="!settings.linkExt"
          :class="`text-none infobox-link black--text font-weight-bold ${isMobileWidth ? 'text-body-2' : 'text-body-1'}`"
          :to="settings.link"
          >
          <div 
            :class="`${isMobileWidth ? 'ma-0 px-1' : 'px-2'}`">
            <span class="">
              {{ settings.text[locale] }}
            </span>
            <!-- <br> -->
            <v-icon
              small
              class="pl-2 pb-0 black--text"
              color="primary"
              >
              icon-arrow-right1
            </v-icon>
          </div>
        </nuxt-link>
        <span
          :class="`text-none black--text font-weight-bold ${isMobileWidth ? 'text-body-2' : 'text-body-1'}`"
          >
          <!-- v-if="settings.linkExt" -->
          <!-- :href="settings.link" -->
          <!-- :target="`${ isIframe ? '_parent' : '_blank' }`" -->
          <div 
            :class="`${isMobileWidth ? 'ma-0 px-1' : 'px-2'}`">
            <span class="">
              {{ settings.text[locale] }}
            </span>
            <!-- <br> -->
            <v-icon
              small
              class="pl-2 pb-0 black--text"
              color="primary"
              >
              icon-arrow-right1
            </v-icon>
          </div>
        </span>
      </v-col>

    </a>

    <!-- DEBUGGING -->
    <!-- settings : <code><pre>{{ settings }}</pre></code> -->
  
  </v-container>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'InfoBox',
  props: ['settings', 'routeId'],
  data() {
    return {
      canShow: undefined,
    }
  },
  watch: {
    triggerVis(next, prev) {
      this.getCanShow()
    },
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
      isIframe: (state) => state.isIframe,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
    }),
    ...mapGetters({
      getDivCurrentVisibility: 'getDivCurrentVisibility',
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
    },
  }
}

</script>
