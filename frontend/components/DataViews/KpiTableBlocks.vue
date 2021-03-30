<style scoped>
.has-scrollbar {
  overflow-y: scroll !important;
}
.kpi-group{
  border-bottom: 1px solid;
  border-color: #BDBDBD;
}

.kpi-dialog-title {
  hyphens: manual;
  hyphens: manual;
}
.kpi-headers{
  border-bottom: 1px solid;
}
.kpi-indicator{
  border-bottom: 1px dashed;
}
.transparent {
  color: rgba(0, 0, 0, 0)
}
.light-shadow {
  box-shadow: none !important;
}
.simple-link {
  text-decoration: none;
}

.margin-added {
  margin-top: 50px;
}

.kpi-family-title-padding {
  padding-left: 130px;
}
.kpi-family-title-padding-mobile {
  padding-left: 18px;
}
.kpi-family-margins  {
  margin-top: 25px;
  /* margin-left: 25px;
  margin-right: 0px; */
  margin-bottom: 25px;
}
.kpi-family-margins-x  {
  margin-left: 25px;
  margin-right: 0px;
}
.kpi-family-margins-x-mobile  {
  margin-left: 0px;
  margin-right: 0px;
}

.kpi-group-margins  {
  margin-top: 0px;
  background-color: #f9f8f6;
}
.kpi-group-margins-x  {
  margin-left: 80px;
  margin-right: 150px;
  margin-bottom: 60px;
  padding-top: 20px;
  padding-bottom: 40px;
}
.kpi-group-margins-x-mobile  {
  margin-left: 18px;
  margin-right: 18px;
  margin-bottom: 30px;
  padding-top: 0px;
  padding-bottom: 20px;
}
.kpi-group-block {
  background-color: #f9f8f6;
  margin-bottom: 0px !important;
}
.kpi-group-block-padding {
  padding-left: 40px;
  padding-right: 40px;
}
.kpi-group-block-padding-mobile {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px;
}

.kpi-margins {
  margin-right: 40px;
  margin-left: 40px;
}
.kpi-margins-mobile {
  padding-top: 0px;
  margin-right: 10px;
  margin-left: 10px;
}
.kpi-borders {
  border-width: 1px;
  border-style: solid;
  border-color: #e7e7e7;
  background-color: white;
}
.kpi-link-btn {
  background-color: #e5e5f4;
}

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
  color:#000091;
  transform: translate(-6px,1px); */
  display: none;
}
/* .rotate-div-180 {
  transform: rotate(180deg);
}
.flip {
  transform: scaleX(-1) rotate(180deg);
} */

.fade-in {
animation: fadeIn ease 1s;
-webkit-animation: fadeIn ease 1s;
-moz-animation: fadeIn ease 1s;
-o-animation: fadeIn ease 1s;
-ms-animation: fadeIn ease 1s;
}
@keyframes fadeIn {
0% {opacity:0;}
100% {opacity:1;}
}

@-moz-keyframes fadeIn {
0% {opacity:0;}
100% {opacity:1;}
}

@-webkit-keyframes fadeIn {
0% {opacity:0;}
100% {opacity:1;}
}

@-o-keyframes fadeIn {
0% {opacity:0;}
100% {opacity:1;}
}

@-ms-keyframes fadeIn {
0% {opacity:0;}
100% {opacity:1;}
}

</style>

<template>

  <!-- KPI DATA -->
  <div
    class="pt-0"
    >

    <!-- KPI FAMILIES BUTTONS -->
    <v-row
      align-center
      :class="`custom-min-height`"
      >

      <v-col
        v-if="openTabs()"
        cols="12"
        :class="`ma-0 pa-0`"
        v-for="kpiFamily in kpiFamilies"
        :key="kpiFamily.id"
        :id="kpiFamily.id"
        :order="`${kpiFamilyOrder(kpiFamily.id)}`"
        >

        <div
          v-show="openTabs().includes(kpiFamily.id)"
          :class="`kpi-family-margins kpi-family-margins-x${isMobileWidth ? '-mobile' : ''}`"
          >
          
          <!-- KPI FAMILY TITLE -->
          <p
            :class="`mt-4 kpi-family-title kpi-family-title-padding${isMobileWidth ? '-mobile mb-0 kpi-family-title-mobile' : 'mb-5'}`"
            >
            <template>
              <div>
                <span>
                  {{ kpiFamily.kpiTitle[locale] }}
                </span>
              </div>
            </template>
          </p>
          
          <br>

          <!-- DEBUGGING -->
          <!-- $vuetify.breakpoint.name : {{ $vuetify.breakpoint.name }}<br> -->

          <!-- KPI FAMILY IMAGE -->
          <template v-if="kpiFamily.image">
            <v-row class="d-flex justify-center mt-1 mb-5 mx-0">
              <v-img
                max-height="300"
                max-width="100%"
                :lazy-src="kpiFamily.image"
                :src="kpiFamily.image"
                v-on:load="onLoadImg"
              ></v-img>
            </v-row>
            <br>
          </template>

          <!-- KPI FAMILY GROUPS -->
          <template
            v-show="kpiFamily.kpi_groups"
            >

            <!-- KPI / OVQ + def -->
            <v-row
              v-for="(kpi_group, kpi_group_index) in kpiFamily.kpi_groups"
              :key="kpi_group.id"
              v-if="!kpi_group.hide"
              :id="`${kpiFamily.id}-${kpi_group.id}`"
              :class="`fade-in kpi-group-margins kpi-group-margins-x${isMobileWidth ? '-mobile' : ''} justify-${isMobileWidth ? 'center' : 'space-between'}`"
              >
              <!-- mb-${isMobileWidth ? '5' : '0'} -->

              <!-- TITLE OVQ -->
              <v-col
                :class="`mt-0 kpi-group-block kpi-group-block-padding${isMobileWidth ? '-mobile' : ' mb-3'}`"
                cols="12"
                >
                <!-- :cols="`${isMobileWidth ? '12' : '8'}`" -->

                <!-- IMAGE -->
                <!-- <template v-if="kpi_group.image">
                  <div class="d-flex align-center">
                    <v-img
                      :lazy-src="kpi_group.image"
                      :src="kpi_group.image"
                    ></v-img>
                  </div>
                </template> -->

                <!-- PANEL HEADER / KPI GROUP TITLE -->
                <div class="d-flex align-center">
                  <p 
                    :class="`mt-3 kpi-group-title ${isMobileWidth ? 'ml-2 mb-0 kpi-group-title-mobile' : 'ml-4'}`">
                    {{ kpi_group.kpiTitle[locale] }}
                  </p>
                </div>

                <!-- KPI GROUP TEXT + AND MODAL -->
                <div
                  v-if="getKpiSettingsTexts(kpi_group)"
                  :class="`${isMobileWidth ? 'pr-0 pl-5' : 'pr-2'}`"
                  >
                  <div
                    v-for="(textCompKpiGroup, index) in kpi_group.afterTitleComponents.filter(comp => comp.component === 'text')"
                    :key="`textBriefComp-${textCompKpiGroup.settings.id}-${index}`"
                    class="text-none black--text"
                    >

                    <TextFrame
                      :settings="textCompKpiGroup.settings"
                      :route-id="textCompKpiGroup.settings.id"
                      :isBrief="textCompKpiGroup.textBrief"
                      :classOverride="'mx-0 pl-0 pr-3'"
                      :drawerIcon="textCompKpiGroup.settings.drawerIcon"
                      :drawerIconOff="textCompKpiGroup.settings.drawerIconOff"
                      :fromKpiTable="true"
                    />
                  </div>
                  <!-- <Modal
                    :isMain="true"
                    :kpiData="kpi_group"
                  /> -->
                </div>

                <!-- LINK TO EXTERIOR -->
                <div
                  v-show="!isLoadingNewData"
                  :class="`ml-2 ${isMobileWidth ? 'mt-1 text-center' : ''} mb-0`"
                  >
                  <v-btn
                    :class="`text-none btn-no-radius ${isMobileWidth ? 'no-text-transform word-break' : ''}`"
                    outlined
                    color="primary"
                    :href="kpi_group.linkExt"
                    :target="`${ isIframe ? '_parent' : '_blank' }`"
                    >
                    <span 
                      :style="`${isMobileWidth ? 'white-space: normal;' : ''}`"
                      v-if="kpi_group.kpiLinkText"
                      >
                      {{ kpi_group.kpiLinkText[locale] }}
                    </span>
                    <!-- <v-icon
                      small
                      class="pl-2 pb-0"
                      color="primary"
                      >
                      icon-arrow-right
                    </v-icon> -->
                  </v-btn>
                </div>

              </v-col>

              <!-- LOADER -->
              <v-col
                v-show="isLoadingNewData"
                cols="12"
                class="px-5"
                >
                <div class="mx-5 px-5">
                  <LoaderLinear
                    :size="50"
                    :width="5"
                    >
                  </LoaderLinear>
                </div>
              </v-col>

              <!-- KPI / OVQ / CARD INDICATORS -->
              <v-col
                v-if="localRawData && !isLoadingNewData"
                cols="12"
                :class="`py-0 mt-${isMobileWidth ? '0' : '3'} mb-1`"
                >

                <div :class="`kpi-margins${isMobileWidth ? '-mobile' : ''} pb-0`">
                  <!-- px-${isMobileWidth ? '2' : '5'} -->

                  <v-data-iterator
                    :items="formatKpiData(kpiFamily, kpi_group)"
                    :items-per-page.sync="itemsPerPage"
                    hide-default-footer
                    >

                    <!-- KPI / OVQ / INDICATORS / NO DATA -->
                    <template v-slot:no-data>
                      <v-row
                        class="align-center mx-1 kpi-group"
                        >
                        <v-col
                          class="text-center blue-grey lighten-5"
                          cols="12"
                          >
                          <!-- {{ kpi_group.kpiTitle[locale] }} 
                          <v-icon
                            small
                            color="warning"
                            class="mx-4 pb-1"
                            >
                            icon-warning
                          </v-icon>
                          {{ noLocalDataText[locale] }} -->
                        </v-col>
                      </v-row>
                    </template>

                    <!-- KPI / OVQ / INDICATORS / VALUES -->
                    <template v-slot:default="props">
                      <v-row
                        class="align-stretch mx-0"
                        >

                        <!-- KPI / INDICATORS -->
                        <v-col
                          v-for="(kpi, index) in kpi_group.kpis"
                          :key="kpi.id"
                          cols="12"
                          :class="`kpi-borders mt-0 ${isMobileWidth ? 'mb-2 px-4 pt-0 py-2' : 'mb-3 px-5 pt-3 pb-2'}`"
                          >

                          <!-- KPI TITLE -->
                          <div class="d-flex align-center">
                            <p 
                              :class="`${isMobileWidth ? 'ml-1 mt-4 text-body-2' : 'ml-1 mt-2 text-body-1'} font-weight-bold`"
                              >
                              {{ kpi.kpiTitle[locale] }}
                            </p>
                          </div>

                          <!-- KPI TEXT -->
                          <div
                            v-for="(textCompKpi, index) in kpi.afterTitleComponents.filter(comp => comp.component === 'text')"
                            :key="`textBriefComp-${textCompKpi.settings.id}-${index}`"
                            class="text-none black--text"
                            >
                            <TextFrame
                              :settings="textCompKpi.settings"
                              :route-id="textCompKpi.settings.id"
                              :fromKpiTable="true"
                              :classOverride="'mx-0 pt-0 pb-1'"
                              :drawerClassOverride="'borders-y-only'"
                              :drawerTextClassOverride="true"
                              :drawerIcon="textCompKpi.settings.drawerIcon"
                              :drawerIconOff="textCompKpi.settings.drawerIconOff"
                            />
                          </div>

                          <!-- KPIS / INDICATORS DATA CARDS & CHART-->
                          <v-row>
                            
                            <!-- KPI / LEVEL -->
                            <v-col
                              class="justify-left pt-1"
                              cols="12"
                              >
                              <v-chip
                                disabled
                                color="grey lighten-4"
                                :class="`full-opacity d-flex flex-grow-1 ${isMobileWidth ? 'caption' : ''}`"
                                >

                                <!-- ICON -->
                                <v-icon
                                  x-small
                                  :class="`pr-${isMobileWidth ? 1 : 2}`"
                                  :color="levelnameIconColor"
                                  >
                                  icon-map-pin
                                </v-icon>
                                <v-divider 
                                  vertical
                                  light
                                  inset
                                  :class="`mr-${isMobileWidth ? 1 : 2}`" 
                                ></v-divider>

                                <!-- RULE == FALSE -->
                                <div
                                  v-if="getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textSuffixRules) === ' '"
                                  class="no-warning"
                                  >
                                  <span
                                    v-show="!isMobileWidth"
                                    :class="`${levelnameTextColor}`">
                                    {{ levelNameTextPrefix[locale] }}
                                  </span>

                                  <!-- ADD PREFIX FROM SPECIAL STORE -->
                                  <span
                                    v-show="!isMobileWidth"
                                    v-if="kpi.textLevelNameRules"
                                    :class="`${levelnameTextColor} ${getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textLevelNameRules, true)}`"
                                    v-html="getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textLevelNameRules)"
                                  />

                                  <!-- LEVEL NAME -->
                                  <span :class="`${levelnameTextColor} font-weight-bold`">
                                    {{ getSpecialStore.levelname }}
                                  </span>

                                </div>

                                <!-- RULE == TRUE -->
                                <div
                                  v-if="kpi.textSuffixRules && getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textSuffixRules) !== ' '"
                                  class="has-warning mb-0"
                                  >
                                  <!-- ADD WARNING SUFFIX FROM SPECIAL STORE -->
                                  <span
                                    v-show="!isMobileWidth"
                                    >
                                    {{ kpi.suffixRulesWarningText[locale] }}
                                  </span>
                                  <!-- LEVEL NAME / WARNING -->
                                  <span
                                    class="font-weight-bold"
                                    v-html="capitalizeIfMobile(getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textSuffixRules))"
                                  />
                                </div>

                              </v-chip>

                            </v-col>

                            <!-- KPIS CARDS -->
                            <v-col
                              v-for="(blockHeaders, name) in sortHeadersByBlockIndex(kpi.headers)"
                              v-if="name !== 'undefined' && !isMainValueNull(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), getBlockHeaderData(blockHeaders, 'data-main-value'))"
                              :key="blockHeaders.value"
                              class="d-flex flex-column pt-0"
                              :cols="`${isMobileWidth ? '12' : ''}`"
                              >
                              
                              <!-- KPI / INDICATOR CARD TITLE -->
                              <v-card
                                class="elevation-0"
                                :color="getBlockHeaderData(blockHeaders, 'data-main-value').blockTitleColor"
                                tile
                                >
                                <v-card-title
                                  :class="`d-flex ${getBlockHeaderData(blockHeaders, 'data-main-value').blockTitleClass} word-break`"
                                  >
                                  <!-- {{ isMainValueNull(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), getBlockHeaderData(blockHeaders, 'data-main-value')) }} -->
                                  <span
                                    v-html="getBlockHeaderDynamicData(blockHeaders, 'data-main-value', kpi.fromDatasetKeyValue, props.items)"
                                    >
                                  </span>
                                </v-card-title>
                              </v-card>

                              <!-- KPI / INDICATOR CARD VALUE(S) -->
                              <v-card
                                class="elevation-0 d-flex align-self-stretch flex-grow-1"
                                :color="getBlockHeaderData(blockHeaders, 'data-main-value').blockColor"
                                tile
                                >
                                <v-card-text 
                                  :class="`py-${isMobileWidth ? 1 : 3}`"
                                  >

                                  <!-- KPI MAIN VALUE -->
                                  <div class="mt-1">
                                    <!-- kpi.kpiUnit[locale] : <code>{{ kpi.kpiUnit[locale] }}</code><br> -->
                                    <p
                                      :class="`text-left ${kpi.kpiClasses.mainValue} ${ kpi.kpiUnit ? 'mb-0' : '' } font-weight-bold black--text`">
                                      <kpiValue
                                        :item="getPropsItemValue(props.items, kpi.fromDatasetKeyValue) "
                                        :header="getBlockHeaderData(blockHeaders, 'data-main-value')"
                                        :trigger="triggerTabBtn"
                                        >
                                        <!-- <template 
                                          v-if="!isMobileWidth"
                                          v-slot:unit
                                          >
                                          %
                                        </template> -->

                                        <template
                                          v-slot:unit
                                          >
                                          <span>
                                            <span
                                              v-if="!isMobileWidth && kpi.kpiUnit[locale].includes('%')"
                                              >
                                              %
                                            </span>
                                            <span
                                              v-if="isMobileWidth"
                                              :class="`${isMobileWidth ? 'body-2' :'body-1'} font-weigth-bold`"
                                              >
                                              {{ kpi.kpiUnit[locale] }}
                                              <!-- ADD SUFFIX FROM SPECIAL STORE -->
                                              <span
                                                v-if="kpi.textSuffixRules"
                                                :class="`${kpi.textSuffixClass ? kpi.textSuffixClass : ''} ${isMobileWidth ? 'body-2' :'body-1'}`"
                                                v-html="getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textSuffixRules)"
                                              />
                                            </span>
                                          </span>
                                        </template>

                                      </kpiValue>
                                    </p>

                                    <p
                                      v-if="kpi.kpiUnit && !isMobileWidth"
                                      :class="`${kpi.kpiClasses.secondValue} mt-0 black--text`"
                                      >
                                      <span v-if="!kpi.kpiUnit[locale].includes('%')">
                                        {{ kpi.kpiUnit[locale] }}
                                      </span>
                                      <span v-else>
                                        {{ kpi.kpiUnit[locale].replace('%','') }}
                                      </span>
                                      <!-- ADD SUFFIX FROM SPECIAL STORE -->
                                      <span
                                        v-if="kpi.textSuffixRules"
                                        :class="`${kpi.textSuffixClass ? kpi.textSuffixClass : ''}`"
                                        v-html="getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textSuffixRules)"
                                      />
                                    </p>
                                  </div>

                                  <!-- KPI SECOND VALUE -->
                                  <div 
                                    :class="`mt-${isMobileWidth ? 1 : 4}`">
                                    <p 
                                      :class="`text-left mb-1`">
                                      <kpiValue
                                        :item="getPropsItemValue(props.items, kpi.fromDatasetKeyValue) "
                                        :header="getBlockHeaderData(blockHeaders, 'data-second-value')"
                                        :trigger="triggerTabBtn"
                                      />
                                    </p>
                                  </div>

                                </v-card-text> 
                              </v-card>

                            </v-col>

                            <!-- KPI CHART -->
                            <v-col
                              class="d-flex flex-column justify-center pa-0"
                              cols="12"
                              >
                              <!-- LOOP CHARTS SETTINGS -->
                              <div
                                v-for="(kpiChart, kpiIndex) in kpi.charts"
                                :key="`kpiChart-${kpiChart.settings.id}`"
                                >
                                <ApexChart
                                  v-if="kpiChart.activated && kpiChart.component == 'apexchart'"
                                  :settings="kpiChart.settings"
                                  :route-id="routeId"
                                  :fromKpiTable="true"
                                  :forceShow="true"
                                  :hideTitle="true"
                                  :reloadData="true"
                                  :chartHeight="190"
                                  :fallbackData="getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textSuffixRules, false, kpiChart.fallbackDataRules)"
                                  :forceDrawer="isMobileWidth ? true : kpiChart.settings.asDrawer"
                                  :drawerClassOverride="'borders-y-only'"
                                />
                              </div>
                            </v-col>

                          </v-row>

                        </v-col>

                      </v-row>
                    </template>

                  </v-data-iterator>

                </div>

                <!-- LINK TO INTERNAL PAGE -->
                <div
                  v-show="!isLoadingNewData"
                  :class="`mt-0 kpi-margins${isMobileWidth ? '-mobile' : ''}`"
                  >
                  <v-btn
                    :class="`text-none kpi-link-btn ${isMobileWidth ? 'no-text-transform word-break' : ''}`"
                    block
                    tile
                    depressed
                    color="#e5e5f4"
                    :to="updateLink(kpi_group)"
                    >
                    <span 
                      v-if="kpi_group.kpiLinkTextBis"
                      :class="`${isMobileWidth ? 'body-2' : 'body-1'} small-spacing`"
                      >
                      {{ isMobileWidth ? kpi_group.kpiLinkTextBisMobile[locale] : kpi_group.kpiLinkTextBis[locale] }}
                    </span>
                    <v-spacer></v-spacer>
                    <v-icon
                      small
                      class="pl-2 pb-0"
                      color="primary"
                      >
                      icon-arrow-right
                    </v-icon>
                  </v-btn>
                </div>

              </v-col>

            </v-row>

          </template>

          <div
            class="margin-added"
            v-show="openTabs() && openTabs().length > 1 && kpiFamilyOrder(kpiFamily.id) < openTabs().length"
            >
            <v-divider >
            </v-divider>
          </div>

        </div>

      </v-col>

    </v-row>

  </div>

</template>

<script>
import { switchFormatFunctions, objectFromPath, findElementFromArrayAndId, objectToUrlParams, objectFromQueriesString, stringFromQueriesObject } from '~/utils/utils'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'KpiTableBlocks',

  components: {
    // Modal: () => import(/* webpackChunkName: "TextFrame" */ '@/components/UX/Modal.vue'),
  },

  props: [
    'viewConfig',
    'datasetMappers',
    'isLoading',
    'isLoadingNewData',
    'localRawData',
    'routeId'
  ],

  data() {
    return {
      
      tabsId: 'tabs-buttons-kpiFamilies',
      tabsSpecialStoreId: 'kpifamilies',
      noDepartementQueryArgs: ['datasetid', 'field', 'value'],

      kpiFamilies: [],

      openTabBtns: [],

      triggerTabBtn: true,

      infosText: {
        fr: 'infos'
      },
      levelNameTextPrefix: {
        fr: 'Les résultats pour '
      },
      noDataText: {
        fr: '-'
      },
      noLocalDataText: {
        fr: 'pas de données'
      },
    //  resetFiltersText: {
    //     fr: 'Réinitialiser tous les filtres'
    //   },
  
      itemsPerPage: 100,

      levelnameIconColor: 'grey darken-1',
      levelnameTextColor: 'grey--darken-1--text',
    }
  },

  beforeMount() {
    this.kpiFamilies = this.viewConfig.kpi_families
    // this.log && console.log("\nC-KpiTableBlocks / beforeMount / this.kpiFamilies : ", this.kpiFamilies)
  },

  mounted() {
    this.openTabBtns = this.openTabs()
    // this.log && console.log("C-KpiTableBlocks / mounted / this.openTabBtns : ", this.openTabBtns)
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      isIframe: (state) => state.isIframe,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      routeParams: (state) => state.routeParams,
      queryRouteId: (state) => state.queryRouteId,
      specialStore: (state) => state.data.specialStore,
    }),

    ...mapGetters({
      routeConfig: 'getLocalRouteConfig',
      getInitData: 'data/getInitData',
      getFromInitData: 'data/getFromInitData',
      getSpecialStore: 'data/getSpecialStore',
      getStoreSourceData: 'data/getStoreSourceData',
      getTabsFromButtonsStore: 'buttons/getTabsFromButtonsStore',
    }),

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },
  },

  methods: {
    
    tabsFromButtonsStore() {
      let tabsObject = this.getTabsFromButtonsStore(this.tabsId)
      // this.log && console.log("C-KpiTableBlocks / tabsFromButtonsStore / tabsObject : ", tabsObject)
      return tabsObject
    },
    openTabs() {
      let openTabsIds = this.tabsFromButtonsStore() && this.tabsFromButtonsStore().openTabsIds
      // this.log && console.log("C-KpiTableBlocks / openTabs / openTabsIds : ", openTabsIds)
      if (!openTabsIds) {
        openTabsIds = [ this.kpiFamilies[0].id ]
        // this.log && console.log("C-KpiTableBlocks / openTabs / !openTabsIds auto-fill: ", openTabsIds)
      }
      return openTabsIds
    },
    tabsIds() {
      let tabsIds = this.tabsFromButtonsStore() && this.tabsFromButtonsStore().tabs
      return tabsIds
    },
    kpiFamilyOrder(kpiFamilyId) {
      // this.log && console.log("\nC-KpiTableBlocks / kpiFamilyOrder / kpiFamilyId : ", kpiFamilyId)
      let index = 0
      let openTabs = this.openTabs()
      // this.log && console.log("C-KpiTableBlocks / kpiFamilyOrder / openTabs : ", openTabs)
      if (openTabs && openTabs.length ) {
        index = openTabs.indexOf(kpiFamilyId) + 1
      }
      // this.log && console.log("C-KpiTableBlocks / kpiFamilyOrder / index : ", index)
      return index
    },

    kpiFamiliesOrdered() {
      let itemsArray = this.kpiFamilies
      let sortingArr = this.openTabs()
      sortingArr && itemsArray.sort((a, b) => {  
        return sortingArr.indexOf(a.id) - sortingArr.indexOf(b.id)
      })
      return itemsArray
    },

    updateLink(kpiGroup) {
      // this.log && console.log("\nC-KpiTableBlocks / updateLink / kpiGroup : ", kpiGroup)
      
      // DEBUG
      // let debug = kpiGroup.id === 'logement-d-abord'
      // let debug = true

      const link = kpiGroup.link

      const levelCode = this.specialStore.levelcode
      const noDepartement = !kpiGroup.hasDepartement && levelCode === 'departemental'
      const onlyNational = kpiGroup.onlyNational && levelCode === 'regional'

      // debug && this.log && console.log("\nC-KpiTableBlocks / updateLink / link : ", link)
      // debug && this.log && console.log("C-KpiTableBlocks / updateLink / noDepartement : ", noDepartement)
      // debug && this.log && console.log("C-KpiTableBlocks / updateLink / onlyNational : ", onlyNational)
      // debug && this.log && console.log("C-KpiTableBlocks / updateLink / this.routeParams : ", this.routeParams)

      if (this.routeParams) {
        const routeIdString = this.queryRouteId ? `routeId=${this.queryRouteId}` : ''

        let routeQuery = objectFromQueriesString(this.routeParams)
        // debug && this.log && console.log("C-KpiTableBlocks / updateLink / this.noDepartementQueryArgs : ", this.noDepartementQueryArgs)
        if(noDepartement || onlyNational) {
          // delete regional or departemental url args if the requested map does not contain corrresponfing data 
          Object.keys(routeQuery)
            .filter(key => this.noDepartementQueryArgs.includes(key))
            .forEach(key => delete routeQuery[key])
        }
        // debug && this.log && console.log("C-KpiTableBlocks / updateLink / routeQuery : ", routeQuery)
        let otherQueriesString = stringFromQueriesObject(routeQuery, ['kpifamilies'] )
        // debug && this.log && console.log("C-KpiTableBlocks / updateLink / otherQueriesString : ", otherQueriesString)

        let paramsString = `${routeIdString}${otherQueriesString !== '' ? '&' + otherQueriesString : otherQueriesString }`
        // debug && this.log && console.log("C-KpiTableBlocks / updateLink / paramsString : ", paramsString)
        let updatedLink =  `${link}?${paramsString}`
        // debug && this.log && console.log("C-KpiTableBlocks / updateLink / updatedLink : ", updatedLink)
        return updatedLink
      } else {
        return link
      }
    },

    sortHeadersByBlockIndex (headers, key = 'blockId') {
      // this.log && console.log("\nC-KpiTableBlocks / sortHeadersByBlockIndex / headers : ", headers)
      let sortedHeaders = headers.reduce( (result, item) => (
        {
          ...result,
          [item[key]]: [
            ...(result[item[key]] || []),
            item,
          ]
        }),
        {}
      )
      return sortedHeaders
    },

    getBlockHeaderData(headerList, blockInnerTarget) {
      // this.log && console.log("\nC-KpiTableBlocks / getBlockHeaderData / headerList : ", headerList)
      // this.log && console.log("C-KpiTableBlocks / getBlockHeaderData / blockInnerTarget : ", blockInnerTarget)
      let headerData = headerList.find((header) => header.blockInnerTarget === blockInnerTarget)
      // this.log && console.log("C-KpiTableBlocks / getBlockHeaderData / headerData : ", headerData)
      return headerData
    },
    getBlockHeaderDynamicData (headerList, blockInnerTarget, fromDatasetKeyValue, items) {
      // this.log && console.log("C-KpiTableBlocks / getBlockHeaderDynamicData / fromDatasetKeyValue : ", fromDatasetKeyValue)
      const header = this.getBlockHeaderData(headerList, blockInnerTarget)
      // this.log && console.log("C-KpiTableBlocks / getBlockHeaderDynamicData / header.value : ", header.value)
      let value = header.text[this.locale]
      if (header.textValue) {
        let valueRewrite
        // this.log && console.log("C-KpiTableBlocks / getBlockHeaderDynamicData / items : ", items)
        const itemValue = items.find(item => item.odmKeyfield === fromDatasetKeyValue )
        // this.log && console.log("\nC-KpiTableBlocks / getBlockHeaderDynamicData / header.textValue : ", header.textValue)
        // this.log && console.log("C-KpiTableBlocks / getBlockHeaderDynamicData / itemValue : ", itemValue)
        if ( itemValue[header.textValue] !== this.noDataText[this.locale] ) {
          let addon = itemValue[header.textValue]
          // this.log && console.log("C-KpiTableBlocks / getBlockHeaderDynamicData / addon : ", addon)
          if( header.textFormat === 'datetime' ) {
            addon = new Date(addon)
            let dateOptions = {  year: 'numeric', month: 'long' }
            //if (!header.hideDayOnDate) { dateOptions.day = 'numeric' }
            addon = addon.toLocaleDateString('fr-FR',dateOptions)
          }
          valueRewrite = `${value} ${addon}`
        } else {
          valueRewrite = header.textDefault[this.locale]
        }
        value = valueRewrite
        // this.log && console.log("C-KpiTableBlocks / getBlockHeaderDynamicData / value : ", value)
      }
      // this.log && console.log("C-KpiTableBlocks / getBlockHeaderDynamicData / value : ", value)
      return value
    },

    getPropsItemValue(items, fromDatasetKeyValue, header, blockInnerTarget) {
      // this.log && console.log("\nC-KpiTableBlocks / getPropsItemValue / items : ", items)
      // this.log && console.log("C-KpiTableBlocks / getPropsItemValue / fromDatasetKeyValue : ", fromDatasetKeyValue)
      let itemValue = items.find(item => item.odmKeyfield === fromDatasetKeyValue )
      // this.log && console.log("C-KpiTableBlocks / getPropsItemValue / itemValue : ", itemValue)
      if ( header ) {
        // this.log && console.log("C-KpiTableBlocks / getPropsItemValue / header : ", header)
        const headerData = this.getBlockHeaderData(header, blockInnerTarget)
        // this.log && console.log("C-KpiTableBlocks / getPropsItemValue / headerData : ", headerData)
        itemValue = headerData && headerData.value ? itemValue[headerData.value] : undefined
      }
      return itemValue
    },
    isMainValueNull(item, header) {
      let hide = false
      // this.log && console.log("\nC-KpiTableBlocks / isMainValueNull / item : ", item)
      // this.log && console.log("C-KpiTableBlocks / isMainValueNull / header : ", header)
      const headerHideCondition = header.hideIfMainNull
      // this.log && console.log("C-KpiTableBlocks / isMainValueNull / headerHideCondition : ", headerHideCondition)
      if (headerHideCondition) {
        const valueKey = header.value
        const value = item[valueKey]
        hide = value === this.noDataText[this.locale]
        // if (hide) {
        //   this.log && console.log("\nC-KpiTableBlocks / isMainValueNull / item : ", item)
        //   this.log && console.log("C-KpiTableBlocks / isMainValueNull / valueKey : ", valueKey)
        //   this.log && console.log("C-KpiTableBlocks / isMainValueNull / value : ", value)
        //   this.log && console.log("C-KpiTableBlocks / isMainValueNull / hide : ", hide)
        // }
      }
      return hide
    },

    getKpiSettingsTexts(kpi, componentType = 'text') {
      let textSettingsArray = kpi.afterTitleComponents && kpi.afterTitleComponents.filter(comp => comp.component === componentType)
      return textSettingsArray
    },

    getKpisFromKpiGroup (kpiGroup, item, field) {
      // this.log && console.log("\nC-KpiTableBlocks / getKpisFromKpiGroup / kpiGroup : ", kpiGroup)
      // this.log && console.log("C-KpiTableBlocks / getKpisFromKpiGroup / item : ", item)
      // this.log && console.log("C-KpiTableBlocks / getKpisFromKpiGroup / field : ", field)
      // this.log && console.log("C-KpiTableBlocks / getKpisFromKpiGroup / item.odmKeyfield : ", item.odmKeyfield)

      let kpis = kpiGroup.kpis
      // this.log && console.log("C-KpiTableBlocks / getKpisFromKpiGroup / kpis : ", kpis)
      let kpi = kpis && kpis.find((kpi) => kpi.fromDatasetKeyValue === item['odmKeyfield'])
      // this.log && console.log("C-KpiTableBlocks / getKpisFromKpiGroup / kpi : ", kpi)

      // let kpiModalsParams = kpis.find((kpi) => kpi.dialogComponent && kpi.fromDatasetKeyValue === item['odmKeyfield'] && kpi.dialogComponent.onHeader === field)
      let kpiModalsParams = kpi && kpi.dialogComponents && kpi.dialogComponents.find((dialogComp) => dialogComp.onHeader === field)
      // this.log && console.log("C-KpiTableBlocks / getKpisFromKpiGroup / kpiModalsParams : ", kpiModalsParams)
      return kpiModalsParams
    },

    formatKpiData(kpiFamily, kpiGroupSettings) {
      // this.log && console.log("\nC-KpiTableBlocks / formatKpiData / kpiFamily : ", kpiFamily)
      // this.log && console.log("C-KpiTableBlocks / formatKpiData / kpiGroupSettings : ", kpiGroupSettings)
      // get kpi serie data
      const data = this.localRawData && this.localRawData[0].data
      // this.log && console.log("C-KpiTableBlocks / formatKpiData / data : ", data)

      const kpiGroupId = kpiGroupSettings.id

      let serie = []

      // reformat data
      if (data) {
        const kpiDataKey = kpiGroupSettings.kpiDataFromDatasetKey
        const kpiDatasetKey = kpiGroupSettings.fromDatasetKey
        const kpiDatasetKeyValue = kpiGroupSettings.fromDatasetKeyValue
        const kpiDataFormat = kpiGroupSettings.formatKpis
        // this.log && console.log("C-KpiTableBlocks / formatKpiData / kpiDataKey : ", kpiDataKey)
        // this.log && console.log("C-KpiTableBlocks / formatKpiData / kpiDatasetKey : ", kpiDatasetKey)
        // this.log && console.log("C-KpiTableBlocks / formatKpiData / kpiDatasetKeyValue : ", kpiDatasetKeyValue)
        // this.log && console.log("C-KpiTableBlocks / formatKpiData / headers : ", headers)

        let series = data && data.find(item => item[kpiDatasetKey] === kpiDatasetKeyValue)
        // // this.log && console.log("C-KpiTableBlocks / formatKpiData / series : ", series)

        let kpiGroupSerie = series && series[kpiDataKey]

        if (kpiGroupSerie) {
          kpiGroupSettings.kpis.forEach(kpi => {
            // this.log && console.log("C-KpiTableBlocks / formatKpiData / kpi : ", kpi)
            const kpiKey = kpi.fromDatasetKeyValue
            // this.log && console.log("C-KpiTableBlocks / formatKpiData / kpiKey : ", kpiKey)
            const rawValues = kpiGroupSerie.find(item => Object.keys(item).includes(kpiKey) )
            let values = rawValues[kpiKey][0]
            if (kpiGroupSettings.appendKeyToValues) {
              values[kpiDataKey] = kpi.kpiTitle[this.locale]
            }
            const formattedVals = {}
            for(let [k, v] of Object.entries(values)) {
              const formatSettings = kpiDataFormat.find(format => format.key === k)
              const formatName = kpi.kpiFormat
              formattedVals['odmFormat'] = formatName

              // no data case
              if ( !v ) {
                formattedVals[k] = this.noDataText[this.locale]
              }
              // value + format settings
              else if (!formatName && formatSettings) {
                formattedVals[k] = switchFormatFunctions(v, formatSettings.format)
              }
              // value + no format settings
              else {
                formattedVals[k] = v
              }
  
              // append odm keyfield
              formattedVals['odmKeyfield'] = kpiKey
              formattedVals['odmDialogKey'] = `${kpiKey}-${kpi.id}`
              
              let headers = kpi.headers

              // append family and group values if necessary
              let headerKpiFamily = headers.find((header) => header.from === 'kpi-family')
              if (headerKpiFamily) {
                formattedVals[headerKpiFamily.value] = kpiFamily.kpiTitle[this.locale]
              }

              let headerKpiGroup = headers.find((header) => header.from === 'kpi-group')
              if (headerKpiGroup) {
                formattedVals[headerKpiGroup.value] = kpiGroupSettings.kpiTitle[this.locale]
              }
  
            }
            // this.log && console.log("C-KpiTableBlocks / formatKpiData / formattedVals : ", formattedVals)
            serie.push(formattedVals)
          })
        }
      }

      // this.log && console.log("C-KpiTableBlocks / formatKpiData / serie : ", serie)
      return serie
    },

    formatValue (item, header) {
      // this.log && console.log("\nC-KpiTableBlocks / formatValue / header.value : ", header.value)
      let value = item[header.value]
      // this.log && console.log("C-KpiTableBlocks / formatValue / value : ", value)
      const format = header.format
      // this.log && console.log("\nC-KpiTableBlocks / formatValue / format : ", format)
      if (typeof format !== 'undefined' && value && !isNaN(value)) {
        switch (format) {
          case 'integer':
            value = parseInt(value)
            break
          case 'float':
            value = parseFloat(value)
            break
          case 'percent':
            value = parseFloat(value)
            break
        }
      } else if (!format && value) {
        value = value
      } else {
        value = this.noDataText[this.locale]
      }
      return value
    },

    getColor (value, header) {
      const switchColor = header.switchColor
      if (switchColor) {
        let color
        // this.log && console.log("\nC-KpiTableBlocks / getColor / value : ", value)
        const switchParams = header.switchParams
        const condition = switchParams.limit
        const conditionMedium = switchParams.limitMedium
        // this.log && console.log("C-KpiTableBlocks / getColor / condition : ", condition)
        // this.log && console.log("C-KpiTableBlocks / getColor / conditionMedium : ", conditionMedium)
        if (value > condition) {
          color = switchParams.positiveColor
        }
        if (value < condition) {
          color = switchParams.negativeColor
        }
        if (value === condition) {
          color = switchParams.limitColor
        }
        if (conditionMedium && value > condition && conditionMedium > value ) {
          color = switchParams.limitMediumColor
        }
        if (conditionMedium && value === conditionMedium ) {
          color = switchParams.limitMediumColor
        }
        if (value === this.noDataText[this.locale]) {
          color = 'grey'
        }
        // this.log && console.log("C-KpiTableBlocks / getColor / color : ", color)
        return color
      } else {
        return header.class
      }
    },

    getRuleValue(item, rules, returnClass = false, returnFallback = false) {
      let fix = ''
      let value = ''

      let keyReload = ''
      let valueReload = ''

      const specialStore = this.getSpecialStore
      const initData = this.getInitData
      const getFromInitData = this.getFromInitData
      // this.log && console.log("\nC-KpiTableBlocks / getRuleValue / specialStore : ", specialStore)
      // this.log && console.log("C-KpiTableBlocks / getRuleValue / item : ", item)

      let localeRules = rules && rules[this.locale]
      // const localeRulesPosition = localeRules.position
      const localeRulesList = localeRules.rules

      // filter out applying rules' conditions 
      let rulesToApply = localeRulesList.filter(rule => {
        const conditions = rule.conditions
        let boolArray = []
        for (const cond of conditions) {
          let boolVal
          if (cond.specialStoreId) {
            boolVal = specialStore[cond.specialStoreId] === cond.specialStoreValue
          }
          if (cond.itemId) {
            boolVal = item[cond.itemId] === cond.itemValue
          }
          boolArray.push(boolVal)
        }
        return boolArray.every(v => v === true)
      })
      // this.log && console.log("C-KpiTableBlocks / getRuleValue / rulesToApply : ", rulesToApply)

      // apply rules to value
      for (const rule of rulesToApply) {
        // this.log && console.log("\n.......\nC-KpiTableBlocks / getRuleValue / initData : ", initData)
        // this.log && console.log("C-KpiTableBlocks / getRuleValue / rule : ", rule)

        fix = rule.add
        if (returnClass) {
          fix = rule.class
        }

        // find value from specialStore if any
        if (!returnClass && rule.value) {

          let lastVal = ''
          let lastKeyValue = ''
          // let count = 0

          for (const step of rule.value ){

            // this.log && console.log(`...... C-KpiTableBlocks / getRuleValue / step >>>>> ${count}`)

            // this.log && console.log("C-KpiTableBlocks / lastVal (start) : ", lastVal)
            // this.log && console.log("C-KpiTableBlocks / lastKeyValue (start) : ", lastKeyValue)

            if (step.fromSpecialStoreFocusObjectId) {
              // this.log && console.log("C-KpiTableBlocks / getRuleValue / fromSpecialStoreFocusObjectId :", step.fromSpecialStoreFocusObjectId)
              lastVal = step.fromSpecialStoreFocusObjectId && specialStore.focusObject[step.fromSpecialStoreFocusObjectId]
              lastKeyValue = lastVal
            }
            
            if (step.fromInitDataId) {
              // this.log && console.log("C-KpiTableBlocks / fromInitDataId :", step.fromInitDataId)
              lastVal = step.fromInitDataId && getFromInitData(step.fromInitDataId)
            }

            if (step.fromInitDataKey) {
              // this.log && console.log("C-KpiTableBlocks / fromInitDataKey :", step.fromInitDataKey)
              // this.log && console.log("C-KpiTableBlocks / fromInitDataKey / lastVal :", lastVal)
              lastVal = lastVal && lastVal.data.find((obj) => obj[step.fromInitDataKey] === lastKeyValue )
            }

            if (step.targetKey) {
              // this.log && console.log("C-KpiTableBlocks / targetKey :", step.targetKey)
              lastKeyValue = lastVal && lastVal[step.targetKey]
            }

            if (step.targetInitDataKey) {

              // returnFallback && this.log && console.log("C-KpiTableBlocks / lastVal :", lastVal)
              
              if (returnFallback && rule.targetInitDataKeyReload) {
                // returnFallback && this.log && console.log("C-KpiTableBlocks / rule.targetInitDataKeyReload :", rule.targetInitDataKeyReload)
                keyReload = rule.targetInitDataKeyReload
                valueReload = lastVal && lastVal[keyReload]
                // returnFallback && this.log && console.log("C-KpiTableBlocks / valueReload :", valueReload)
              }

              lastVal = lastVal && lastVal[step.targetInitDataKey]
            }

            // this.log && console.log("C-KpiTableBlocks / lastVal (end) : ", lastVal)
            // this.log && console.log("C-KpiTableBlocks / lastKeyValue (end) : ", lastKeyValue)

            // count += 1

          }

          value = lastVal
          // this.log && console.log("C-KpiTableBlocks / lastValReload (end) : ", lastValReload)
          // this.log && console.log("C-KpiTableBlocks / lastVal (end) : ", lastVal)

        }

      }

      if (!returnFallback) {
        return `${fix} ${value}`
      } else {
        // this.log && console.log("C-KpiTableBlocks / rulesToApply (end) : ", rulesToApply)
        // this.log && console.log("C-KpiTableBlocks / valueReload (end) : ", valueReload)
        return {
          rules: rulesToApply[0],
          reload: {
            value: value,
            fix: fix,
            key: keyReload,
            valueReload: valueReload
          }
        }
      }
    },
    capitalizeIfMobile(string) {
      string = this.isMobileWidth ? `${string.charAt(0).toUpperCase()}${string.slice(1)}` : string
      return string
    },

    onLoadImg(){
      var self = this
      console.log("img loaded")
      setTimeout(function(){
        self.$store.commit('toggleTriggerResizeNoScroll')
      },100)
    }

  },

}
</script>
