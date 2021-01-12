<style scoped>
.mobile-title {
  font-size: 1.5rem;
  line-height: 1.1;
}
.border-1 {
  border-style: solid;
  border-width: 1px;
  border-color: #EEEEEE;
}
.full-width {
  width: 100%;
}

</style>

<template>

  <v-container
    v-show="canShow"
    :id="`${settings.id}`"
    :class="`${ isBrief && fromKpiTable ? 'mb-0' : '' } ${isMobileWidth ? settings.containerClassMobile : settings.containerClass }`"
    :trigger="`${trigger}`"
    :trigger-vis="`${triggerVis}`"
    >

    <div
      v-show="!isLoading || settings.forceShow"
      class="full-width"
      >

      <div v-if="!fromKpiTable">
        <v-divider v-if="viewConfig.dividers.before" />
      </div>

      <v-row
        v-for="(row, index) in viewConfig.componentRows"
        :id="`R${index}`"
        :key="`'R${index}`"
        >
        <v-col
          v-for="(col, i) in row.columns"
          :id="`R${index}-C${i}`"
          :key="`R${index}-C${i}`"
          :class="`${ col.colClass && !isBrief && !fromKpiTable ? col.colClass : '' } ${isMobileWidth || isBrief ? 'py-0' : ''} ${isBrief && fromKpiTable ? 'px-0' : ''} ${classOverride ? classOverride : ''}`"
          :cols="col.cols"
          >

          <!-- TITLE -->
          <v-col
            v-if="(col.colTitle && col.colTitle[locale]) || (col.textPrefix && col.textPrefix[locale])"
            :id="`R${index}-C${i}-col`"
            :class="`px-0 justify-center ${isMobileWidth ? 'pt-1' : ''}`"
            >

            <!-- KPI FAMILY -->
            <p v-if="col.addKpiFamilyTag && !isMobileWidth"
              :class="`grey--text ${isMobileWidth ? 'mb-2' : 'mb-5'}`"
              >
              {{ col.kpiFamilyName[locale] }}
            </p>

            <!-- TEXT TITLE -->
            <p v-if="col.colTitle"
              :class="`${col.colTitleClass} ${isMobileWidth ? 'text-body-1 mb-0 mobile-title' : ''} font-weight-bold`"
              v-html="col.colTitle[locale]"
              >
            </p>

            <!-- TEXT FROM DISPLAYED DATA -->
            <div v-if="!col.asChip">
            <h4
              v-if="col.textPrefix || col.specialStoreId || col.textSuffix"
              :class="`${col.textClass} ${isMobileWidth ? 'mb-0 ml-0 ' + col.sizeMobile : col.sizeDesktop}`"
              >

              <span
                :class="`${col.textPrefixClass}`"
                >
                {{ col.textPrefix[locale] }}
                <br v-if="!isMobileWidth && !noBreakLine.includes($vuetify.breakpoint.name)">
              </span>

              <span
                v-if="col.textPrefixRules"
                :class="`${col.textPrefixClass} ${getSuffixRuleValue(getSpecialStore[col.specialStoreId], col.textPrefixRules, true)}`"
                v-html="getSuffixRuleValue(getSpecialStore[col.specialStoreId], col.textPrefixRules)"
              />

              <span
                v-if="col.specialStoreId"
                :class="`${col.specialStoreIdClass}`"
                >
                {{ getSpecialStore[col.specialStoreId] }}
              </span>

              <span
                v-if="col.textSuffixRules"
                :class="`${col.textSuffixClass} ${getSuffixRuleValue(getSpecialStore[col.specialStoreId], col.textSuffixRules, true)}`"
                v-html="getSuffixRuleValue(getSpecialStore[col.specialStoreId], col.textSuffixRules)"
              />

              <span
                :class="`${col.textSuffixClass}`"
                v-html="col.textSuffix[locale]"
              />

            </h4>
            </div>

            <v-chip
              v-if="col.asChip"
              disabled
              color="grey lighten-4"
              :class="`full-opacity mt-4 d-flex flex-grow-1 ${isMobileWidth ? 'caption' : ''}`"
              >

              <!-- ICON -->
              <v-icon
                x-small
                class="pr-2"
                :color="drawerTitleIconColor"
                >
                icon-map-pin
              </v-icon>
              <v-divider vertical light inset class="mr-2" ></v-divider>

              <!-- TEXTS -->
              <span
                :class="`${col.textPrefixClass}`"
                >
                {{ col.textPrefix[locale] }}
              </span>
              <span
                v-if="col.textPrefixRules"
                :class="`${col.textPrefixClass} ${getSuffixRuleValue(getSpecialStore[col.specialStoreId], col.textPrefixRules, true)}`"
                v-html="getSuffixRuleValue(getSpecialStore[col.specialStoreId], col.textPrefixRules)"
              />
              <span
                v-if="col.specialStoreId"
                :class="`${col.specialStoreIdClass}`"
                >
                {{ getSpecialStore[col.specialStoreId] }}
              </span>
              <span
                v-if="col.textSuffixRules"
                :class="`${col.textSuffixClass} ${getSuffixRuleValue(getSpecialStore[col.specialStoreId], col.textSuffixRules, true)}`"
                v-html="getSuffixRuleValue(getSpecialStore[col.specialStoreId], col.textSuffixRules)"
              />
              <span
                :class="`${col.textSuffixClass}`"
                v-html="col.textSuffix[locale]"
              />
            </v-chip>

          </v-col>

          <!-- IMAGE -->
          <template v-if="col.textImage">
            <v-img
              :lazy-src="col.textImage"
              :src="col.textImage"
            ></v-img>
          </template>

          <!-- CONTENTS -->
          <template v-if="col.textsHtml">
            <v-layout
              v-for="(txt, idx) in col.textsHtml"
              :key="idx"
              :id="`${txt.id}-layout`"
              :class="`${isBrief && fromKpiTable ? '' : ( classOverride ? '' : txt.textClass)} ${settings.asDrawer ? 'mt-0 pt-0' : 'pt-2'} ${classOverride ? classOverride : ''} px-0 ${isMobileWidth ? 'text-caption' : 'text-body-2'}`"
              >

              <!-- TEXT FROM DISPLAYED DATA / IN DRAWER -->
              <div v-if="settings.asDrawer"
                :id="`${txt.id}-drawer-block`"
                :class="`flex-grow-1 ${fromKpiTable ? 'mb-4' : ''}`"
                >

                <!-- TEXT TITLE -->
                <p v-if="settings.componentTitle"
                  :class="`${col.colTitleClass} ${isMobileWidth ? 'text-body-2 mt-0 mb-3' : 'mt-0 mb-4'} font-weight-bold small-spacing`"
                  v-html="settings.componentTitle[locale]"
                  >
                </p>

                <!-- txt.textClass : <code><pre>{{ txt.textClass }}</pre></code><br> -->
                <v-expansion-panels
                  focusable
                  flat
                  tile
                  multiple
                  v-model="panel"
                  :active-class="'py-3'"
                  :class="`${ drawerClassOverride ? drawerClassOverride : 'border-1'}`"
                  >
                  <v-expansion-panel
                    color="white"
                    >
                    <v-expansion-panel-header
                      :disable-icon-rotate="drawerIcon ? true : false"
                      :id="`${txt.id}-drawer-expansion-panel-header`"
                      :class="`${drawerClassOverride ? 'no-background-color' : ''} py-0 ${isMobileWidth && fromKpiTable ? 'px-1' : ''} ${isMobileWidth && !fromKpiTable ? 'px-4' : ''}`"
                      style="min-height: 33px;"
                      :color="`${drawerClassOverride ? 'white' : ''}`"
                      >
                      <template v-slot:actions>
                        <v-icon color="grey" small>
                          {{ currentDrawerIcon }}
                        </v-icon>
                      </template>
                      <div>
                        <!-- <v-icon
                          v-show="!isMobileWidth"
                          x-small
                          class="pr-2"
                          :color="`${drawerTextClassOverride ? 'grey darken-3' : drawerTitleIconColor}`"
                          >
                          icon-info
                        </v-icon> -->
                        <span
                          :class="`${panel[0] == 0 ? 'font-weight-bold' : ''} ${drawerTextClassOverride ? 'grey--darken-3--text small-spacing' : drawerTitleTextColor} ${isMobileWidth ? 'text-caption' : ''}`"
                          >
                          {{ settings.drawerTitle[locale] }}
                        </span>
                        <span>
                          &nbsp;
                        </span>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content
                      class="mt-4"
                      :id="`${txt.id}-drawer-expansion-panel-content`"
                      eager
                      >
                      <p
                        v-if="!txt.fromUrl || !txt.fromUrl[locale]"
                        :id="`${txt.id}-drawer`"
                        :class="`${isBrief && fromKpiTable ? '' : col.textClass} ${
                          isMobileWidth ? 'mb-0 ' + col.sizeMobile : col.sizeDesktop
                        }`"
                        >
                        <span v-if="txt.textContent" v-html="txt.textContent[locale]" />
                      </p>

                      <!-- TEXT FROM DISTANT HTML FILE -->
                      <RawHtml
                        v-show="txt.fromUrl[locale]"
                        :class="`${isBrief && fromKpiTable ? '' : col.textClass} ${
                          isMobileWidth ? 'mb-0 ' + col.sizeMobile : col.sizeDesktop
                        }`"
                        :templateURL="txt.fromUrl[locale]" 
                        :isBrief="isBrief"
                        :isModal="isModal"
                        :fromKpiTable="fromKpiTable"
                        :mobileShowMore="settings.mobileShowMore"
                        @toggleModal="toggleModal"
                      />
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>

              <div v-else>
                <p
                  v-if="!txt.fromUrl || !txt.fromUrl[locale]"
                  :id="txt.id"
                  :class="`${isBrief && fromKpiTable ? '' : col.textClass} ${
                    isMobileWidth ? 'mb-0 ' + col.sizeMobile : col.sizeDesktop
                  }`"
                  >
                  <span v-if="txt.textContent" v-html="txt.textContent[locale]" />
                </p>

                <!-- TEXT FROM DISTANT HTML FILE -->
                <RawHtml
                  v-show="txt.fromUrl[locale]"
                  :class="`${isBrief && fromKpiTable ? '' : col.textClass} ${
                    isMobileWidth ? 'mb-0 ' + col.sizeMobile : col.sizeDesktop
                  }`"
                  :templateURL="txt.fromUrl[locale]" 
                  :isBrief="isBrief"
                  :isModal="isModal"
                  :fromKpiTable="fromKpiTable"
                  :mobileShowMore="settings.mobileShowMore"
                  @toggleModal="toggleModal"
                />
              </div>

            </v-layout>
          </template>
        </v-col>
      </v-row>

      <div v-if="!fromKpiTable">
        <v-divider v-if="getLocalConfig.dividers.after" />
      </div>

    </div>

    <div
      v-show="isLoading && settings.showLoader && !settings.forceShow"
      class="flex-grow text-center my-4 py-2 px-5"
      >
      <LoaderCircular
        :size="70"
        :width="7"
      ></LoaderCircular>
    </div>

  </v-container>
</template>

<script>
import axios from 'axios'

import { mapState, mapGetters } from 'vuex'

// import RawHtml from '~/components/DataViews/RawHtml.vue'
// import LoaderCircular from '~/components/UX/LoaderCircular.vue'

export default {
  name: 'TextFrame',

  components: {
    // RawHtml,
    RawHtml: () => import(/* webpackChunkName: "RawHtml" */ '@/components/DataViews/RawHtml.vue'),
    // LoaderCircular,
    // LoaderCircular: () => import(/* webpackChunkName: "LoaderCircular" */ '@/components/UX/LoaderCircular.vue'),

  },

  props: [
    'settings',
    'routeId',
    'isModal',
    'isBrief',
    'fromKpiTable',
    'classOverride',
    'drawerIcon',
    'drawerIconOff',
    'drawerClassOverride',
    'drawerTextClassOverride'
  ],

  data() {
    return {
      dataViewType: 'texts',
      viewConfig: undefined,
      canShow: undefined,
      isLoading: false,
      rawHtmls: {},
      errorHtml: "<br><br>there is an <strong> Error </strong><br><br>",
      noBreakLine: ['lg', 'xl'],
      panel: [],
      drawerTitleIconColor: 'grey darken-1',
      drawerTitleTextColor: 'grey--darken-1--text',
    }
  },

  watch: {
    isRouteLoading(next, prev) {
      this.isLoading = true
    },

    triggerVis(next, prev) {
      this.getCanShow()
    },

    panel(next, prev) {
      this.$store.commit('toggleTriggerResizeNoScroll')
    }
  },

  beforeMount() {
    // set up view config
    this.viewConfig = this.getLocalConfig
    // if (this.settings.drawerOpen) { this.panel = this.settings.drawerOpen }
    if (this.settings.drawerOpen) {
      if (this.isMobileWidth && this.settings.mobileShowMore) {
        this.panel.push(0)
      } else if (this.isMobileWidth && !this.settings.mobileShowMore) {
        this.panel = this.panel
      } 
      else {
        this.panel.push(0)
      }
    }
  },

  mounted() {
    // this.log && console.log("C-TextFrame / mounted ...")
    // this.log && console.log("C-TextFrame / mounted / this.isBrief : ", this.isBrief)
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
      getDataViewConfig: 'getDataViewConfig',
      getSpecialStore: 'data/getSpecialStore',
      getDivCurrentVisibility: 'getDivCurrentVisibility',
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

    currentDrawerIcon() {
      let icon = 'icon-keyboard_arrow_down'
      if (this.drawerIcon) {
        icon = this.panel[0] == 0 ? this.drawerIconOff : this.drawerIcon
      }
      return icon
    }
  },

  methods: {
    getCanShow() {
      if (this.isModal || this.fromKpiTable) {
        this.canShow = true
      } else {
        let breakpoint = this.$vuetify.breakpoint.name
        let isVisible = this.getDivCurrentVisibility({
          div: { id: this.settings.id, routeId: this.routeId },
          breakpoint: breakpoint,
        })
        // this.log && console.log("C-TextFrame / getCanShow / isVisible :", isVisible )
        this.canShow = isVisible
      }
    },
    toggleModal(evt) {
      this.log && console.log("C-TextFrame / toggleModal / evt :", evt)
      this.$emit('toggleModal', evt)
    },
    getSuffixRuleValue(value, rules, returnClass = false) {
      let fix = ''

      // this.log && console.log("\nC-TextFrame / getSuffixRuleValue / value : ", value)
      const specialStore = this.getSpecialStore
      // this.log && console.log("C-TextFrame / getSuffixRuleValue / specialStore : ", specialStore)

      // this.log && console.log("C-TextFrame / getSuffixRuleValue / rules : ", rules)
      let localeRules = rules && rules[this.locale]
      // this.log && console.log("C-TextFrame / getSuffixRuleValue / localeRules : ", localeRules)

      const localeRulesPosition = localeRules.position
      const localeRulesList = localeRules.rules

      // filter out applying rules' conditions 
      let rulesToApply = localeRulesList.filter(rule => {
        const conditions = rule.conditions
        let boolArray = []
        for (const cond of conditions) {
          // this.log && console.log("C-TextFrame / getSuffixRuleValue / cond : ", cond)
          let boolVal = specialStore[cond.specialStoreId] === cond.specialStoreValue
          // this.log && console.log("C-TextFrame / getSuffixRuleValue / boolVal : ", boolVal)
          boolArray.push(boolVal)
        }
        // this.log && console.log("C-TextFrame / getSuffixRuleValue / boolArray : ", boolArray)
        return boolArray.every(v => v === true)
      })

      // this.log && console.log("C-TextFrame / getSuffixRuleValue / rulesToApply : ", rulesToApply)
      // apply rules to value
      for (const rule of rulesToApply) {
        fix = rule.add
        if (returnClass) {
          fix = rule.class
        }
      }

      return fix
    }
  },
}
</script>
