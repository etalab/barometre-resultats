<style scoped></style>

<template>
  <v-main
    id="routes-tabs"
    v-if="!noRoutesTabs"
    :class="routesTabs.backgroundColor"
    >
    <v-container
      fluid
      fixed
      class="odm-navbar ma-0 pa-0"
      >
      <v-tabs
        show-arrows
        centered
        class="px-3"
        :background-color="routesTabs.backgroundColor"
        :height="routesTabs.height"
        :dark="routesTabs.dark"
        :grow="routesTabs.grow"
        prev-icon="icon-navigate_before"
        next-icon="icon-navigate_next"
        :icons-and-text="routesTabs.hasIcons"
        >

        <v-tabs-slider 
          v-if="routesTabs.hasSlider"
          :class="routesTabs.sliderClass"
          >
        </v-tabs-slider>

        <!-- TABS WITH/WITHOUT DROPDOWN -->
        <v-menu
          v-for="(rt, idx) in routesTabs.tabs"
          :key="idx"
          :open-on-hover="rt.dropdown"
          offset-y
          transition="slide-y-transition"
          bottom
          tile
          >

          <template v-slot:activator="{ on, attrs }">
              <!-- :disabled="rt.isDisabled" -->
              <!-- :to="buildUrlPath(rt)" -->
            <v-tab
              :class="`${routesTabs.tabsClass} ${rt.hrefAliases.includes(currentUrlPath) ? 'v-tab--active' : ''} ${ rt.isDisabled ? 'disabled-link' : '' }`"
              @click="runBtnFunctions(rt)"
              :aria-label="rt.tooltip[locale]"
              nuxt
              v-bind="attrs"
              v-on="on"
              >
              <v-icon
                v-if="rt.hasIcons"
                small
                class="mr-2"
                >
                {{rt.icon}}
              </v-icon>
              <span v-if="rt.isCompact">
                <v-icon
                  dark
                  >
                  icon-menu
                </v-icon>
              </span>
              <span v-else-if="!isMobile" class="tab-button">
                {{ rt.title[ locale ] }}
              </span>
              <span v-else class="tab-button">
                {{ rt.titleMobile[ locale ] }}
              </span>
            </v-tab>
          </template>

          <v-list
            dense
            tile
            :class="`over-all no-border py-0 ${routesTabs.backgroundColor}`"
            :dark="routesTabs.dark"
            >
              <!-- :to="buildUrlPath(subRt)" -->
            <v-list-item
              v-for="(subRt, index) in rt.dropdownLinks"
              class="text-center"
              :key="`${subRt}-${index}`"
              :disabled="subRt.isDisabled"
              @click="runBtnFunctions(subRt)"
              link
              exact
              nuxt
              >
              <v-list-item-content
                :class="`py-0 ${ subRt.isDisabled ? 'disabled-link' : '' }`"
                >
                <v-icon v-if="subRt.hasIcons">
                  {{subRt.icon}}
                </v-icon>
                <span v-if="!isMobile" class="tab-button">
                  {{ subRt.title[ locale ] }}
                </span>
                <span v-else class="tab-button">
                  {{ subRt.titleMobile[ locale ] }}
                </span>
              </v-list-item-content>
            </v-list-item>
          </v-list>

        </v-menu>

      </v-tabs>
    </v-container>
  </v-main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'TabsRoutes',

  // components: {},

  // props: [],

  // data() {
  //   return {
  //     prevIcon: false,
  //     nextIcon: false,
  //   }
  // },

  // watch: {},

  // mounted() {
  //   this.log && console.log("C-TabsRoutes / mounted ...")
  // },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      noRoutesTabs: (state) => state.noRoutesTabs,
      routeParams: (state) => state.routeParams,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
    }),

    ...mapGetters({
      // getCurrentLocale: "getCurrentLocale",
      // getLocalRouteConfig: "getLocalRouteConfig",
      routesTabs: 'getRoutesTabs',
    }),

    isMobile() {
      let mobileBreakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      let bool = mobileBreakpoints.includes(currentBreakpoint)
      return bool
    },

    currentUrlPath() {
      return this.$nuxt.$route.path
    }

  },

  methods: {
    buildUrlPath(rt) {
      let url = rt.isNuxtLink ? rt.to : rt.href
      if (rt.addUrlParams && this.routeParams) {
        let hasParamStart = url.includes('?')
        let separator = hasParamStart ? '&' : '?'
        url = `${url}${separator}${this.routeParams}`
      }
      return url
    },
    // updateData(params , toggleTrigger = false) {
    //   // this.log && console.log("\nC-TabsRoutes / updateData  : ", "+ ".repeat(10) )
    //   // this.log && console.log("C-TabsRoutes / updateData ... params : ", params )
    //   for (let targetParams of params.targets) {

    //     // this.log && console.log("\nC-TabsRoutes / updateData ... targetParams : ", targetParams )
    //     // 1 - get data for the update
    //     targetParams.prop = params.prop
    //     targetParams.propName = params.propName
    //     targetParams.props = params.props

    //     let value = this.getSourceData(targetParams, targetParams.from)
    //     // this.log && console.log("\nC-TabsRoutes / updateData ... value : ", value )

    //     // 2 - then update displayed data
    //     let targetData = {
    //       value: value,
    //       specialStoreId: targetParams.targetSpecialStoreId,
    //     }
    //     this.$store.dispatch('data/setNestedData', targetData) // set element in : store.data.sepcialStore
    //   }
    //   if (toggleTrigger) {
    //     this.$store.commit('data/toggleTrigger')
    //   }
    // },
    runBtnFunctions(btn) {
      // this.log && console.log("C-TabsRoutes / btn : ", btn)
      let url = this.buildUrlPath(btn)
      if (btn.functions) {
        for (let fn of btn.functions) {
          let funcParams = fn.funcParams
          switch (fn.funcName) {
            case 'resetStore':
              this.$store.dispatch('data/resetStore', funcParams)
              break
            // case 'updateData':
            //   this.updateData(funcParams)
            //   break
            case 'goTo':
              this.$router.push(funcParams.to)
              break
          }
        }
        this.$store.commit('buttons/toggleBtnTrigger')
      } else {
        this.$router.push(url)
      }
    },

  },
}
</script>

<style scoped>

.v-menu__content {
  border-radius: 0px !important;
  margin-top: 3px;
}
.over-all {
  z-index: 10;
}
.no-border {
  border-radius: 0;
}
.disabled-link {
  text-decoration: line-through;
}

</style>
