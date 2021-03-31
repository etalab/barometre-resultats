<style scoped>
  .adapt-flex {
    flex: 1; 
    display: flex;
    justify-content: center; 
    flex-direction: column;
  }
</style>

<template>

  <div class="adapt-flex">

    <!-- KPI / INDICATOR CARD TITLE -->
    <v-card
      class="elevation-0"
      :color="blockHeaderDataMainValue.blockTitleColor"
      tile
      >
      <v-card-title
        :class="`d-flex ${blockHeaderDataMainValue.blockTitleClass} word-break`"
        >
        <span
          v-html="blockHeaderDynamicData"
          >
        </span>
      </v-card-title>
    </v-card>

    <!-- KPI / INDICATOR CARD VALUE(S) -->
    <v-card
      class="elevation-0 d-flex align-self-stretch flex-grow-1"
      :color="blockHeaderDataMainValue.blockColor"
      tile
      >
      <v-card-text 
        :class="`py-${isMobileWidth ? 1 : 3}`"
        >

          <!-- <br> - kpi : <code>{{ kpi }}</code> -->
        <!-- <div> -->
          <!-- DEBUGGING -->
          <!-- <hr> -->
          <!-- <br> - blockHeaderDataMainValue : <code>{{ blockHeaderDataMainValue }}</code> -->
          <!-- <br> - blockHeaderDynamicData : <code>{{ blockHeaderDynamicData }}</code> -->
          <!-- <br> - propsItemValue : <code>{{ propsItemValue }}</code> -->
          <!-- <br> - ruleValue : <code>{{ ruleValue }}</code> -->
          <!-- <br> - blockHeaderDataSecondValue : <code>{{ blockHeaderDataSecondValue }}</code> -->
        <!-- </div> -->


        <!-- KPI MAIN VALUE -->
        <div class="mt-1">
          <p
            :class="`text-left ${kpi.kpiClasses.mainValue} ${ kpi.kpiUnit ? 'mb-0' : '' } font-weight-bold black--text`">
            <kpiValue
              :item="propsItemValue"
              :header="blockHeaderDataMainValue"
              :trigger="triggerTabBtn"
              >

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
                      v-html="ruleValue"
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
              v-html="ruleValue"
            />
          </p>
        </div>

        <!-- KPI SECOND VALUE -->
        <div 
          :class="`mt-${isMobileWidth ? 1 : 4}`">
          <p 
            :class="`text-left mb-1`">
            <kpiValue
              :item="propsItemValue"
              :header="blockHeaderDataSecondValue"
              :trigger="triggerTabBtn"
            />
          </p>
        </div>

      </v-card-text> 
    </v-card>    

  </div>

</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {

  name: 'KpiCard',

  props: [
    'kpi',
    'blockHeaderDataMainValue', // getBlockHeaderData(blockHeaders, 'data-main-value')
    'blockHeaderDynamicData', // getBlockHeaderDynamicData(blockHeaders, 'data-main-value', kpi.fromDatasetKeyValue, props.items)
    'propsItemValue', // getPropsItemValue(props.items, kpi.fromDatasetKeyValue) 
    'ruleValue', // getRuleValue(getPropsItemValue(props.items, kpi.fromDatasetKeyValue), kpi.textSuffixRules)
    'blockHeaderDataSecondValue', // getBlockHeaderData(blockHeaders, 'data-second-value')
    'triggerTabBtn',
    'isMobileWidth',
  ],

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
    }),


  },

}

</script>
