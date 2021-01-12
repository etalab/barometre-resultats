<style scoped>
.has-scrollbar {
  overflow-y: scroll !important;
}
.kpi-group{
  border-bottom: 1px solid;
  border-color: #BDBDBD;
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
.rotate-div-180 {
  transform: rotate(180deg);
}
.flip {
  transform: scaleX(-1) rotate(180deg);
}
</style>

<template>

    <!-- KPI DATA -->
    <div
      class="pt-0"
      >

      <!-- KPI FAMILIES -->
      <v-row
        align-center
        :class="`custom-min-height mt-3`"
        >
        <v-col
          cols="12"
          class=""
          >

          <!-- KPI FAMILY -->
          <v-row
            v-for="kpi_family in viewConfig.kpi_families"
            :key="kpi_family.id"
            :id="kpi_family.id"
            class="mb-5 pb-5"
            >
            <v-col
              cols="12"
              class="pt-0 text-left"
              >
              <h2
                :class="`ml-${kpi_family.tableType === 'table-per-group' ? '1' : '0'}`"
                >

                <template
                  v-if="kpi_family.link"
                  >
                  <v-btn
                    :to="kpi_family.link"
                    :color="kpi_family.titleColor.color"
                    class="ml-1 px-5"
                    x-large
                    text
                    >
                    <v-icon
                      v-if="kpi_family.icon"
                      medium
                      class="pb-1 mr-2"
                      :color="kpi_family.titleColor.color"
                      >
                      {{ kpi_family.icon }}
                    </v-icon>
                    <span
                      class="black--text"
                      >
                      {{ kpi_family.kpiTitle[locale] }}
                    </span>
                  </v-btn>
                </template>

                <template v-else>
                  <div>
                    <v-icon
                      v-if="kpi_family.icon"
                      medium
                      class="pb-1 ml-1"
                      :color="kpi_family.titleColor.color"
                      >
                      {{ kpi_family.icon }}
                    </v-icon>
                    <span>
                      {{ kpi_family.kpiTitle[locale] }}
                    </span>
                  </div>
                </template>

              </h2>

              <template
                v-if="kpi_family.kpi_groups"
                >
                <!-- KPI / OVQ + def -->
                <v-row
                  v-for="(kpi_group, kpi_group_index) in kpi_family.kpi_groups"
                  :key="kpi_group.id"
                  v-if="!kpi_group.hide"
                  :id="`${kpi_family.id}-${kpi_group.id}`"
                  class="mt-0 justify-center"
                  >

                  <!-- TITLE + EXPANSION PANEL -->
                  <v-col
                    v-if="kpi_family.tableType === 'table-per-group'"
                    cols="12"
                    class="mt-2 pb-0 px-4"
                    >
                    <v-expansion-panels
                      focusable
                      :class="`elevation-0 mb-0 pb-0`"
                      >
                      <v-expansion-panel>

                        <v-expansion-panel-header
                          :disable-icon-rotate="!!kpi_group.link"
                          >
                          <!-- PANEL HEADER / TITLE -->
                          <h3>
                            <v-icon
                              v-if="kpi_family.icon"
                              medium
                              class="pb-1 mr-1"
                              :color="kpi_family.titleColor.color"
                              >
                              {{ kpi_family.icon }}
                            </v-icon>
                            {{ kpi_family.kpiTitle[locale] }} / 
                            {{ kpi_group.kpiTitle[locale] }}
                            <v-icon
                              small
                              class="pl-3"
                              color="black"
                              >
                              icon-info
                            </v-icon>
                          </h3>

                          <!-- ICON RIGHT -->
                          <template v-slot:actions>
                            <v-btn
                              v-if="kpi_group.link"
                              class="mr-1 elevation-0"
                              fab
                              outlined
                              x-small
                              :to="kpi_group.link"
                              :color="kpi_family.titleColor.color"
                              >
                              <v-icon
                                small
                                :color="kpi_family.titleColor.color"
                                >
                                icon-link
                              </v-icon>
                            </v-btn>
                            <v-icon v-else>
                              icon-chevron-down
                            </v-icon>
                          </template>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <div
                            v-if="getKpiSettingsTexts(kpi_group)"
                            v-for="kpi_comp in getKpiSettingsTexts(kpi_group)"
                            :key="kpi_comp.settings.id"
                            >
                            <TextFrame
                              v-if="kpi_comp.activated && kpi_comp.component == 'text'"
                              :settings="kpi_comp.settings"
                              :route-id="kpi_comp.id"
                            />
                          </div>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>

                  <!-- KPI / OVQ / INDICATORS -->
                  <v-col
                    v-if="localRawData && !isLoadingNewData"
                    cols="12"
                    class="pt-0"
                    >

                    <v-data-iterator
                      :items="formatKpiData(kpi_family, kpi_group)"
                      :items-per-page.sync="itemsPerPage"
                      hide-default-footer
                      >
                      <!-- KPI / OVQ / INDICATORS / HEADERS -->
                      <template
                        v-if="kpi_family.tableType === 'table-per-group' || kpi_group_index === 0"
                        v-slot:header
                        >
                        <v-row
                          :class="`align-center justify-center caption kpi-headers mx-1 white--text ${kpi_group.headersBackgroundColor ? kpi_group.headersBackgroundColor : 'blue-grey'}`"
                          >
                          <v-col
                            v-for="(header, index) in kpi_group.headers"
                            v-if="!header.hide"
                            :key="`${index}-${header.value}`"
                            class="text-center font-weight-bold px-1"
                            :cols="header.cols"
                            >
                            <span v-html="header.text[locale]">
                            </span>
                          </v-col>
                        </v-row>
                      </template>

                      <!-- KPI / OVQ / INDICATORS / NO DATA -->
                      <template v-slot:no-data>
                        <v-row
                          class="align-center mx-1 kpi-group"
                          >
                          <v-col
                            class="text-center blue-grey lighten-5"
                            cols="12"
                            >
                            {{ kpi_group.kpiTitle[locale] }} 
                            <v-icon
                              small
                              color="warning"
                              class="mx-4 pb-1"
                              >
                              icon-warning
                            </v-icon>
                            {{ noLocalDataText[locale] }}
                          </v-col>
                        </v-row>
                      </template>

                      <!-- KPI / OVQ / INDICATORS / VALUES -->
                      <template v-slot:default="props">
                        <v-row
                          class="align-center mx-1 kpi-group"
                          >
                          <v-col
                            v-for="(item, index) in props.items"
                            :key="item.name"
                            cols="12"
                            :class="`ml-0 mr-5 py-2 px-0 kpi-indicator ${index & 1 ? 'blue-grey lighten-5' : 'grey lighten-5'}`"
                            >
                            <v-list
                              dense 
                              :class="`py-0 transparent`"
                              >
                              <v-list-item>
                                <v-row
                                  class="align-center"
                                  >
                                  <v-col
                                    v-for="(header, index) in kpi_group.headers"
                                    v-if="!header.hide"
                                    :key="`${index}-${header.value}`"
                                    :class="`align-center text-${header.formatIcon ? (header.formatIcon === 'pie' ? 'left pl-5 pr-1' : 'center px-5' ) : 'center px-1'} py-0 body-2`"
                                    :cols="header.cols"
                                    >

                                    <!-- PROGRESS PIE -->
                                    <!-- <KpiProgressPie
                                      v-if="header.formatIcon && header.formatIcon === 'progress-pie'"
                                      :color="getColor(formatValue(item, header), header)"
                                      :addSign="header.addSign"
                                      :unit="header.unit"
                                      :value="formatValue(item, header)"
                                      :animate="header.animate"
                                    /> -->

                                    <!-- LINEAR PROGRESS BAR -->
                                    <!-- <KpiProgressBar
                                      v-if="header.formatIcon && header.formatIcon === 'progress-bar'"
                                      :color="getColor(formatValue(item, header), header)"
                                      :addSign="header.addSign"
                                      :unit="header.unit"
                                      :value="formatValue(item, header)"
                                      :format="header.format"
                                      :noDataText="noDataText"
                                      :animate="header.animate"
                                    /> -->

                                    <kpiValue
                                      :item="item"
                                      :header="header"
                                      />
                                    </v-chip>

                                    <!-- VALUE IN CHIP -->
                                    <v-chip
                                      v-if="header.asChip && header.formatIcon !== 'progress-bar'"
                                      small
                                      label
                                      :class="`px-2 ${getColor(formatValue(item, header), header)}${header.formatIcon ? '--text' : ''} font-weight-bold ${header.formatIcon ? '' : 'white--text'}`"
                                      >
                                      <!-- <span v-if="header.addSign && formatValue(item, header) > 0">
                                        + 
                                      </span>
                                      {{ numberToString(formatValue(item, header), header.format) }}
                                      <span v-if="header.unit && formatValue(item, header) !== noDataText[locale]"
                                        v-html="header.unit">
                                      </span> -->
                                      <kpiValue
                                        :item="item"
                                        :header="header"
                                        />
                                    </v-chip>

                                    <!-- VALUE -->
                                    <div v-if="!header.asChip && header.formatIcon !== 'bar'"
                                      :class="header.class"
                                      >
                                      <!-- VALUE DIALOG / MODAL -->
                                      <v-dialog
                                        v-if="getKpisFromKpiGroup (kpi_group, item, header.value)"
                                        class="light-shadow"
                                        v-model="dialogs[item.odmDialogKey]"
                                        max-width="700"
                                        scrollable
                                        >
                                        <template v-slot:activator="{ on, attrs }">
                                          <span
                                            text
                                            class="text-none"
                                            v-bind="attrs"
                                            v-on="on"
                                            >

                                            <!-- addKpiGroupLink -->
                                            <template
                                              v-if="header.addKpiGroupLink"
                                              >
                                              <v-btn
                                                v-if="kpi_group.link"
                                                class="ml-2 mr-5 elevation-0"
                                                icon
                                                x-small
                                                :to="kpi_group.link"
                                                :color="kpi_family.titleColor.color"
                                                >
                                                <v-icon
                                                  small
                                                  :color="kpi_family.titleColor.color"
                                                  >
                                                  icon-link
                                                </v-icon>
                                              </v-btn>
                                            </template>

                                            <!-- VALUE -->
                                            <span>
                                              <!-- {{formatValue(item, header)}} -->
                                              <kpiValue
                                                :item="item"
                                                :header="header"
                                              />
                                            </span>

                                            <!-- DIALOG ICON -->
                                            <v-icon
                                              x-small
                                              class="pl-1"
                                              color="black"
                                              >
                                              icon-info
                                            </v-icon>
                                          </span>
                                        </template>

                                        <!-- DIALOG / MODAL TEXT -->
                                        <v-card>
                                          <v-card-title>
                                            <v-icon class="pr-2">
                                              icon-info
                                            </v-icon>
                                            <span class="text-center">
                                              {{infosText[locale]}}
                                            </span>
                                          </v-card-title>
                                          <v-card-text>
                                            <TextFrame
                                              v-if="getKpisFromKpiGroup (kpi_group, item, header.value).activated && getKpisFromKpiGroup (kpi_group, item, header.value).component == 'text'"
                                              :settings="getKpisFromKpiGroup (kpi_group, item, header.value).settings"
                                              :route-id="getKpisFromKpiGroup (kpi_group, item, header.value).id"
                                              :isModal="true"
                                            />
                                          </v-card-text>
                                        </v-card>
                                      </v-dialog> 
                                      
                                      <span v-else>
                                        <!-- {{ formatValue(item, header) }} -->
                                        <kpiValue
                                          :item="item"
                                          :header="header"
                                        />
                                      </span>

                                    </div>

                                    <!-- {{ formatValue(item, header) }} -->
                                    <!-- {{ getColor(formatValue(item, header), header) }} -->

                                  </v-col>
                                </v-row>
                              </v-list-item>
                            </v-list>

                          </v-col>
                        </v-row>
                      </template>

                    </v-data-iterator>

                  </v-col>

                  <!-- LOADER -->
                  <v-col
                    v-show="isLoadingNewData"
                    cols="3"
                    class="flex-grow text-center mt-3 mx-5 mb-3 py-3 px-5"
                    >
                    <LoaderLinear
                      :size="50"
                      :width="5"
                      >
                    </LoaderLinear>
                  </v-col>

                </v-row>
              </template>
            </v-col>
          </v-row>

        </v-col>

      </v-row>

    </div>

</template>

<script>
import { switchFormatFunctions, objectFromPath, findElementFromArrayAndId, objectToUrlParams } from '~/utils/utils'
import { mapState } from 'vuex'

// import TextFrame from '~/components/DataViews/TextFrame.vue'
// import KpiProgressBar from '~/components/DataViews/KpiProgressBar.vue'
// import KpiProgressPie from '~/components/DataViews/KpiProgressPie.vue'

// import LoaderLinear from '~/components/UX/LoaderLinear.vue'

export default {
  name: 'KpiTableSimple',

  components: {
    // TextFrame: () => import(/* webpackChunkName: "TextFrame" */ '@/components/DataViews/TextFrame.vue'),

    // KpiProgressBar: () => import(/* webpackChunkName: "KpiProgressBar" */ '@/components/DataViews/KpiProgressBar.vue'),
    // KpiProgressPie: () => import(/* webpackChunkName: "KpiProgressPie" */ '@/components/DataViews/KpiProgressPie.vue'),
    // KpiValue: () => import(/* webpackChunkName: "KpiValue" */ '@/components/DataViews/KpiValue.vue'),

    // LoaderLinear: () => import(/* webpackChunkName: "LoaderLinear" */ '@/components/UX/LoaderLinear.vue'),
  },

  props: [
    'viewConfig',
    'datasetMappers',
    'isLoading',
    'isLoadingNewData',
    'localRawData',
  ],

  data() {
    return {

      dialog: false,
      dialogs: {},

      infosText: {
        fr: 'infos'
      },
      noDataText: {
        fr: '-'
      },
      noLocalDataText: {
        fr: 'pas de données'
      },
  
      itemsPerPage: 100,

    }
  },



  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
    }),

  },

  methods: {

    getKpiSettingsTexts(kpi, componentType = 'text') {
      let textSettingsArray = kpi.afterTitleComponents && kpi.afterTitleComponents.filter(comp => comp.component === componentType)
      return textSettingsArray
    },

    getKpisFromKpiGroup (kpiGroup, item, field) {
      // this.log && console.log("\nC-KpiTableSimple / getKpisFromKpiGroup / kpiGroup : ", kpiGroup)
      // this.log && console.log("C-KpiTableSimple / getKpisFromKpiGroup / item : ", item)
      // this.log && console.log("C-KpiTableSimple / getKpisFromKpiGroup / field : ", field)
      // this.log && console.log("C-KpiTableSimple / getKpisFromKpiGroup / item.odmKeyfield : ", item.odmKeyfield)
      let kpis = kpiGroup.kpis
      // this.log && console.log("C-KpiTableSimple / getKpisFromKpiGroup / kpis : ", kpis)
      let kpi = kpis && kpis.find((kpi) => kpi.fromDatasetKeyValue === item['odmKeyfield'])
      // this.log && console.log("C-KpiTableSimple / getKpisFromKpiGroup / kpi : ", kpi)

      // let kpiModalsParams = kpis.find((kpi) => kpi.dialogComponent && kpi.fromDatasetKeyValue === item['odmKeyfield'] && kpi.dialogComponent.onHeader === field)
      let kpiModalsParams = kpi && kpi.dialogComponents && kpi.dialogComponents.find((dialogComp) => dialogComp.onHeader === field)
      // this.log && console.log("C-KpiTableSimple / getKpisFromKpiGroup / kpiModalsParams : ", kpiModalsParams)
      return kpiModalsParams
    },

    formatKpiData(kpiFamily, kpiGroupSettings) {
      // this.log && console.log("\nC-KpiTableSimple / formatKpiData / kpiFamily : ", kpiFamily)
      // this.log && console.log("C-KpiTableSimple / formatKpiData / kpiGroupSettings : ", kpiGroupSettings)
      // get kpi serie data
      const data = this.localRawData && this.localRawData[0].data
      // this.log && console.log("C-KpiTableSimple / formatKpiData / data : ", data)

      let serie = []

      // reformat data
      if (data) {
        const kpiDataKey = kpiGroupSettings.kpiDataFromDatasetKey
        const kpiDatasetKey = kpiGroupSettings.fromDatasetKey
        const kpiDatasetKeyValue = kpiGroupSettings.fromDatasetKeyValue
        const headers = kpiGroupSettings.headers
        const kpiDataFormat = kpiGroupSettings.formatKpis
        // this.log && console.log("C-KpiTableSimple / formatKpiData / kpiDataKey : ", kpiDataKey)
        // this.log && console.log("C-KpiTableSimple / formatKpiData / kpiDatasetKey : ", kpiDatasetKey)
        // this.log && console.log("C-KpiTableSimple / formatKpiData / kpiDatasetKeyValue : ", kpiDatasetKeyValue)
        // this.log && console.log("C-KpiTableSimple / formatKpiData / headers : ", headers)

        let series = data && data.find(item => item[kpiDatasetKey] === kpiDatasetKeyValue)
        // // this.log && console.log("C-KpiTableSimple / formatKpiData / series : ", series)

        let kpiGroupSerie = series && series[kpiDataKey]

        if (kpiGroupSerie) {
          kpiGroupSettings.kpis.forEach(kpi => {
            // this.log && console.log("C-KpiTableSimple / formatKpiData / kpi : ", kpi)
            const kpiKey = kpi.fromDatasetKeyValue
            // this.log && console.log("C-KpiTableSimple / formatKpiData / kpiKey : ", kpiKey)
            const rawValues = kpiGroupSerie.find(item => Object.keys(item).includes(kpiKey) )
            let values = rawValues[kpiKey][0]
            if (kpiGroupSettings.appendKeyToValues) {
              values[kpiDataKey] = kpi.kpiTitle[this.locale]
            }
            const formattedVals = {}
            for(let [k, v] of Object.entries(values)) {
              const formatSettings = kpiDataFormat.find(format => format.key === k)
              if ( !v ) {
                formattedVals[k] = this.noDataText[this.locale]
              } 
              else if (formatSettings) {
                formattedVals[k] = switchFormatFunctions(v, formatSettings.format)
              } else {
                formattedVals[k] = v
              }
  
              // append odm keyfield
              formattedVals['odmKeyfield'] = kpiKey
              formattedVals['odmDialogKey'] = `${kpiKey}-${kpi.id}`

              // append family and group values if necessary
              let headerKpiFamily = headers.find((header) => header.from === 'kpi-family')
              if (headerKpiFamily) {
                formattedVals[headerKpiFamily.value] = kpiFamily.kpiTitle[this.locale]
              }

              let headerKpiGroup = headers.find((header) => header.from === 'kpi-group')
              if (headerKpiGroup) {
                formattedVals[headerKpiGroup.value] = kpiGroupSettings.kpiTitle[this.locale]
              }
  
              // append dialog option
              const kpiId = `${kpiKey}-${kpi.id}`
              this.dialogs[kpiId] = false
            }
            // this.log && console.log("C-KpiTableSimple / formatKpiData / formattedVals : ", formattedVals)
            serie.push(formattedVals)
          })
        }
      }

      // this.log && console.log("C-KpiTableSimple / formatKpiData / serie : ", serie)
      return serie
    },

    formatValue (item, header) {
      // this.log && console.log("\nC-KpiTableSimple / formatValue / header.value : ", header.value)
      let value = item[header.value]
      // this.log && console.log("C-KpiTableSimple / formatValue / value : ", value)
      const format = header.format
      // this.log && console.log("\nC-KpiTableSimple / formatValue / format : ", format)
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
        // this.log && console.log("\nC-KpiTableSimple / getColor / value : ", value)
        const switchParams = header.switchParams
        const condition = switchParams.limit
        const conditionMedium = switchParams.limitMedium
        // this.log && console.log("C-KpiTableSimple / getColor / condition : ", condition)
        // this.log && console.log("C-KpiTableSimple / getColor / conditionMedium : ", conditionMedium)
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
        // this.log && console.log("C-KpiTableSimple / getColor / color : ", color)
        return color
      } else {
        return header.class
      }
    },

  },
}
</script>
