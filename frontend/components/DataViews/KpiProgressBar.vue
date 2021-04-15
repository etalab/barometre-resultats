<style scoped>
.rotate-div-180 {
  transform: rotate(180deg);
}
.flip {
  transform: scaleX(-1) rotate(180deg);
}
.light-bottom-padding {
  padding-left: .2em;
  padding-bottom: .15em;
}
</style>

<template>
  <v-progress-linear
    :class="`${Math.sign(val) === -1 ? 'rotate-div-180' : ''}`"
    :value="counter"
    :height="heightBar"
    :color="color"
    :striped="stripedBar"
    >

    <template v-slot="{ value }">
      <div
        :class="`flex caption font-weight-bold ${darkBar ? 'white--text mx-2' : ''} text-${textPositionBar} ${ Math.sign(val) === -1 ? 'rotate-div-180 text-right' : ''}`"
        >
        <span v-if="addSign && val > 0">
          + 
        </span>
        <span v-if="val < 0">
          
        </span>
        {{ stringValue }}
        <span
          v-if="unit && val !== noDataText[locale]"
          v-html="unit"
          >
        </span>
        <span v-if="tooltip">
          <v-icon
            dark
            size="11"
            class="light-bottom-padding"
            >
            icon-info-circle
          </v-icon>
        </span>
      </div>
    </template>
  </v-progress-linear>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { numberToStringBasic } from "~/utils/utils.js"

export default {
  name: 'KpiProgressBar',
  props: [
    'color',
    'addSign',
    'unit',
    'val',
    'format',
    'noDataText',
    'height',
    'animate',
    'dark',
    'striped',
    'textPosition',
    'tooltip',
    'trigger'
  ],
  data () {
    return {
      counter: 0,
      valIsNan: false,
      heightBar: 20,
      stripedBar: undefined,
      stringValue: '',
      darkBar: undefined,
      textPositionBar : undefined,
      timeDelay: 10
    }
  },
  mounted() {
    // this.log && console.log("\nC-KpiProgressBar / mounted / this.val : ", this.val)
    this.setValues(this.val)
    this.heightBar = this.height ? this.height : this.heightBar
    this.stripedBar = this.striped ? this.striped : false
    this.darkBar = this.dark ? this.dark : false
    this.textPositionBar = !this.valIsNan && this.textPosition ? this.textPosition : 'center'
    this.$store.commit('toggleTriggerComponentLoaded')
  },
  watch: {
    val(next, prev) {
      this.setValues(next)
    },
    trigger(next, prev) {
      if (this.animate) {
        this.counter = 0
        const maxValue = Math.abs(this.val)
        if (maxValue && !Number.isNaN(maxValue)) {
          this.animateValue(maxValue)
        }
      }
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
    }),
  },
  methods: {
    setValues(val) {
      const maxValue = Math.abs(val)
      // this.log && console.log("C-KpiProgressBar / setValues / maxValue : ", maxValue)
      if (maxValue && !Number.isNaN(maxValue)) {
        if (this.animate) {
          this.animateValue(maxValue)
        } else {
          this.counter = maxValue
          this.stringValue = numberToStringBasic(val)
        }
      } else {
        this.counter = 0
        this.valIsNan = true
        this.stringValue = this.val
      }
    },
    animateValue(maxValue) {
      var self = this
      if (this.counter < maxValue && this.counter < 100) {
        setTimeout(() => {
          this.counter =  this.counter + 1
          this.stringValue = this.numberToStringBasic(this.counter)
          self.animateValue(maxValue)
        }, this.timeDelay)
      } else {
        this.counter = maxValue
        this.stringValue = this.numberToStringBasic(maxValue)
      }
    }
  },
}
</script>
