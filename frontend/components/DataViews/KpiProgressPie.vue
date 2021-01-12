<style scoped>
.rotate-div-180 {
  transform: rotate(180deg);
}
.flip {
  transform: scaleX(-1) rotate(180deg);
}
</style>

<template>
  <v-progress-circular
    :class="`ml-5 mr-3 ${Math.sign(value) === -1 ? 'flip' : ''}`"
    :rotate="-90 * Math.sign(value)"
    :value="counter"
    :color="color"
    :size="28"
    :width="14"
    >
  </v-progress-circular>
</template>

<script>
import { mapState, mapGetters } from "vuex"

export default {
  name: 'KpiProgressPie',
  props: [
    'color',
    'addSign',
    'unit',
    'val',
    'animate',
    'trigger'
  ],
  data () {
    return {
      counter: 0,
      timeDelay: 10
    }
  },
  mounted() {
    const maxValue = Math.abs(this.val)
    if (this.animate) {
      this.animateValue(maxValue)
    } else {
      this.counter = maxValue
    }
  },
  watch: {
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
    animateValue(maxValue) {
      var self = this
      if (this.counter < maxValue && this.counter < 100) {
        setTimeout(() => {
          this.counter =  this.counter + 1
          self.animateValue(maxValue)
        }, this.timeDelay)
      } else {
        this.counter = maxValue
      }
    },
  },
}
</script>
