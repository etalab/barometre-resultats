<template>
  <div 
    v-if="showValue(itemLocal, header)"
    >
    <!-- :trigger="`${trigger}`" -->

    <!-- NUMBER VALUE -->
    <span v-if="valueType === 'number'">

      <span v-if="header && header.addArrow"
        class="mr-3"
        >
        <v-icon
          v-if="formatValue(itemLocal, header) > 0"
          small
          class="pl-0 pb-1"
          color="black"
          >
          icon-arrow-up-right
        </v-icon>
        <v-icon
          v-else-if="formatValue(itemLocal, header) < 0"
          small
          class="pl-0 pb-1"
          color="black"
          >
          icon-arrow-down-right
        </v-icon>
        <v-icon
          v-else-if="formatValue(itemLocal, header) === 0"
          small
          class="pl-0 pb-1"
          color="black"
          >
          icon-arrow-right1
        </v-icon>
        <v-icon
          v-else
          small
          class="pl-0 pb-1"
          color="grey"
          >
          icon-warning
        </v-icon>
      </span>

      <span v-if="header && header.addSign && formatValue(itemLocal, header) < 0">
        - 
      </span>
      <span v-if="header && header.addSign && formatValue(itemLocal, header) > 0">
        + 
      </span>
      <!-- {{ stringNumber(formatValue(itemLocal, header), header && header.format) }} -->
      <!-- {{ stringNumber(counter, header && header.format) }} -->

      <!-- <span class="main-number"> -->
        {{ stringNumber(counter, itemLocal && itemLocal.odmFormat) }}
      <!-- </span> -->

      <slot name="unit"></slot>
      <span v-if="header && header.unit && formatValue(itemLocal, header) !== noDataText[locale]"
        v-html="header.unit">
      </span>
    </span>

    <!-- SIMPLE VALUE -->
    <span
      v-if="valueType === 'simple'"
      class=""
      >
      {{ formatValue(itemLocal, header, true) }}
    </span>

    <!-- VALUE DATE -->
    <span v-if="itemLocal && header && header.valueDate" class="caption">
      <!-- PREFIX -->
      {{ header.textPrefix[locale]}} 
      <!-- DATE -->
      <span v-if="header.textPrefix[locale]!='depuis la première publication de l\'indicateur'">
        {{ formatDate(itemLocal[header.valueDate]) }}
      </span>
      <span v-if="header.textPrefix[locale]=='depuis la première publication de l\'indicateur'">
        (données de {{ formatDate(itemLocal[header.valueDate]) }})
      </span>
    </span>

    <v-tooltip v-if="header" bottom>
      <template v-slot:activator="{ on, attrs }">
        <div
          v-bind="header.tooltip && attrs"
          v-on="header.tooltip && on"
          >
          <!-- LINEAR PROGRESS BAR -->
          <span v-if="header && valueType === 'progress-bar'">
            <KpiProgressBar
              :color="getColor(formatValue(itemLocal, header), header)"
              :addSign="header.addSign"
              :unit="header.unit"
              :val="formatValue(itemLocal, header)"
              :format="header.format"
              :noDataText="noDataText"
              :animate="header.animate"
              :striped="header.striped"
              :dark="header.dark"
              :textPosition="header.textPosition"
              :tooltip="header.tooltip"
              :trigger="trigger"
            />
          </span>
          <!-- PROGRESS PIE -->
          <span v-if="header && valueType === 'progress-pie'">
            <KpiProgressPie
              :color="getColor(formatValue(itemLocal, header), header)"
              :addSign="header.addSign"
              :unit="header.unit"
              :val="formatValue(itemLocal, header)"
              :animate="header.animate"
              :tooltip="header.tooltip"
              :trigger="trigger"
            />
          </span>
        </div>
      </template>

      <!-- TOOLTIP TTEXT -->
      <span v-if="header.tooltip">
        {{ header.tooltipText[locale] }}
      </span>
    </v-tooltip>

    <!-- <div class="text-body-1"> -->
      <!-- <hr>DEBUGGING<hr> -->
      <!-- itemLocal : <code>{{ itemLocal }}</code><hr> -->
      <!-- header : <code>{{ header }}</code><hr> -->
      <!-- valueType : <code>{{ valueType }}</code><hr> -->
      <!-- animate : <code>{{ animate }}</code><hr> -->
    <!-- </div> -->

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { numberToStringBasic } from "~/utils/utils.js"

export default {
  name: 'KpiValue',
  // components: {},
  props: [
    'item',
    'header',
    'trigger',
  ],
  data() {
    return {
      itemLocal: undefined,
      animate: true,
      valueType: undefined,
      counter: 0,
      noDataText: {
        fr: '-'
      },
      timeDelay: 10,
      timeDivision: 50,
    }
  },
  beforeMount() {
    // this.log && console.log("\nC-KpiValue / beforeMount / this.item : ", this.item)
    // this.log && console.log("C-KpiValue / beforeMount / this.header : ", this.header)
    this.valueType = this.header && this.header.kpiValueComponent ? this.header.kpiValueComponent : 'simple'
  },
  mounted() {
    this.itemLocal = this.item
    let val = this.formatValue(this.itemLocal, this.header)
    const maxValue = Math.abs(val)
    // this.log && console.log("C-KpiValue / mounted / maxValue : ", maxValue)
    if (maxValue && !Number.isNaN(maxValue)) {
      if (this.valueType === 'number' && this.header.animate) {
        this.animateValue(maxValue)
      } else {
        this.counter = maxValue
      }
    } else {
      this.counter = 0
    }
    this.$store.commit('toggleTriggerComponentLoaded')
  },
  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
    }),
    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },
  },
  watch: {

    item(next, prev) {
      this.itemLocal = next
      let val = this.formatValue(this.itemLocal, this.header)
      const maxValue = Math.abs(val)
      this.counter = maxValue
    },

    trigger(next, prev) {
      let val = this.formatValue(this.itemLocal, this.header)
      if (this.valueType === 'number' && this.header.animate) {
        this.counter = 0
        const maxValue = Math.abs(val)
        if (maxValue && !Number.isNaN(maxValue)) {
          this.animateValue(maxValue)
        }
      }
    },
  },
  methods: {

    formatValue (item, header, asString = false) {
      // this.log && console.log("\nC-KpiValue / formatValue / item : ", item)
      // this.log && console.log("C-KpiValue / formatValue / header : ", header)
      let value = undefined
      if (item && header) {
        value = item[header.value]
        // const format = header.format
        const format = item.odmFormat
        if (typeof format !== 'undefined' && value && !isNaN(value)) {
          value = value.toString() === 'NaN' ? 0 : value
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
          value = isNaN(value) || value.toString() === 'NaN' ? 0 : value
          // value = value
        } else {
          value = this.noDataText[this.locale]
        }
        if (asString) {
          value = numberToStringBasic(value, format)
        }
      }
      // this.log && console.log("\nC-KpiValue / formatValue / value : ", value)
      return value
    },

    formatDate (dateString) {
      let date = new Date(dateString)
      let dateOptions = {  year: 'numeric', month: 'long' }
      return date.toLocaleDateString('fr-FR',dateOptions)
    },

    showValue(item, header) {
      let showVal = true
      let hideIfNull = header && header.hideIfNull
      if (hideIfNull) {
        let value = this.formatValue(item, header)
        showVal = value === this.noDataText[this.locale] ? false : true
      }
      return showVal
    },

    stringNumber (number, format) {
      // this.log && console.log("C-KpiValue / formatValue / number : ", number)
      // this.log && console.log("C-KpiValue / formatValue / format : ", format)
      return numberToStringBasic(number, format, true)
    },

    animateValue(maxValue) {
      let interval = Math.round(maxValue/this.timeDivision)
      if( interval === 0 && maxValue > 0 ) {
        interval = 1
      }
      var self = this
      if (this.counter < maxValue) {
        setTimeout(() => {
          this.counter =  this.counter + interval
          self.animateValue(maxValue)
        }, this.timeDelay)
      } else {
        this.counter = maxValue
      }
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
  }

}

</script>
