<style scoped>
</style>

<template>
  <div
    v-show="canShow"
    :class="`pa-0 ${btn.btnInnerClass.includes('btn-gouv') ? 'btn-borders mb-0 mt-1' :''}`"
    :trigger="`${trigger}`"
    :trigger-vis="`${triggerVis}`"
    >
    <v-btn
      :class="`ma-0 ${btn.btnInnerClass} ${btn.btnInnerClass.includes('btn-gouv') ? 'btn-gouv-translate' : ''}`"
      :block="btn.block"
      :icon="btn.icon"
      :outlined="btn.outlined"
      :fab="btn.fab"
      :color="btn.color"
      :large="isMobileWidth ? false : btn.large"
      :small="isMobileWidth ? true : btn.small"
      :text="btn.text"
      :dark="btn.dark"
      :tile="btn.tile"
      :rounded="btn.rounded"
      :disabled="btn.disabled"
      :height="btn.height ? btn.height : '36px'"
      @click="runBtnFunctions(btn)"
      >
      <v-icon
        v-if="btn.iconLink"
        :small="!isMobileWidth"
        :x-small="isMobileWidth"
        class="mr-2"
        >
        {{ btn.iconLink }}
      </v-icon>
      <v-icon
        v-if="btn.btnInnerIcon"
        :small="!isMobileWidth"
        :x-small="isMobileWidth"
        class="mr-2"
        >
        {{ btn.btnInnerIcon }}
      </v-icon>

        <!-- {{ btn.title[locale] }} -->
      <span
        v-if="!btn.textPrefixRules"
        v-html="btn.title[locale]">
      </span>

      <span
        v-if="btn.textPrefixRules"
        >
        <span
          :class="`${btn.textPrefixClass}`"
          >
          {{ btn.textPrefix[locale] }}
        </span>
        <br>
        <span
          :class="`${btn.textPrefixClass} ${getSuffixRuleValue(getSpecialStore[btn.specialStoreId], btn.textPrefixRules, true)}`"
          v-html="getSuffixRuleValue(getSpecialStore[btn.specialStoreId], btn.textPrefixRules)"
        />
        <span
          v-if="btn.specialStoreId"
          :class="`${btn.specialStoreIdClass}`"
          >
          {{ getSpecialStore[btn.specialStoreId] }}
        </span>
      </span>

      <v-icon
        v-if="btn.iconAfterTitle"
        :small="!isMobileWidth"
        :x-small="isMobileWidth"
        class="pl-2 pb-0"
        color="primary"
        >
        {{ btn.iconAfterTitle }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { objectToUrlParams, objectFromQueriesString, stringFromQueriesObject } from '~/utils/utils.js'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'GlobalBtn',

  // components: {},

  props: [
    'btn',
    'settings'
  ],

  data() {
    return {
      canShow: undefined,
    };
  },

  watch: {
    trigger(next, prev) {
      this.getCanShow()
    },
    canShow(next, prev) {
      this.$store.commit('buttons/toggleBtnTrigger')
    },
  },

  beforeMount() {
    // set up view config
    this.viewConfig = this.getLocalConfig
  },

  mounted() {
    // this.log && console.log("C-GlobalButton / mounted ...")
    this.getCanShow()
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      triggerVis: (state) => state.triggerVisChange,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      routeParams: (state) => state.routeParams,
      queryRouteId: (state) => state.queryRouteId,
    }),

    ...mapGetters({
      getSpecialStore:'data/getSpecialStore',
      // getDivCurrentVisibility: "getDivCurrentVisibility",
    }),

    isMobileWidth() {
      let breakpoints = this.mobileBreakpoints
      let currentBreakpoint = this.$vuetify.breakpoint.name
      return breakpoints.includes(currentBreakpoint)
    },
  },

  methods: {
    getCanShow() {
      let hideIfs = this.btn.hideIfs
      // this.log && console.log("C-GlobalBtn / getCanShow / this.getSpecialStore : ", this.getSpecialStore)
      let boolsArray = [true]
      if (hideIfs) {
        for (let hideIf of hideIfs) {
          let valueFromSpecialStore = this.getSpecialStore[
            hideIf.specialStoreId
          ]
          // this.log && console.log("C-GlobalBtn / getCanShow / valueFromSpecialStore : ", valueFromSpecialStore)
          let tempBool = hideIf.value == valueFromSpecialStore
          boolsArray.push(!tempBool)
        }
      }

      let checker = boolsArray.every(Boolean)
      this.canShow = checker

    },

    runBtnFunctions(btn) {
      // this.log && console.log('C-GlobalButton / runBtnFunctions / btn : ', btn)

      if (btn.functions) {
        for (let fn of btn.functions) {
          // this.log && console.log('C-GlobalButton / runBtnFunctions / fn.funcName : ', fn.funcName )
          // this.log && console.log('C-GlobalButton / runBtnFunctions / fn.funcParams : ', fn.funcParams )
          let funcParams = fn.funcParams
          switch (fn.funcName) {
            case 'resetStore':
              this.$store.dispatch("data/resetStore", funcParams)
              break
  
            case 'resetMapZoom':
              this.$store.dispatch("maps/triggerResetZoom", funcParams)
              break
  
            case 'updateData':
              this.updateData(funcParams)
              break
  
            case 'updateUrlPath':
              this.updateUrlPath(funcParams)
              break
  
            case 'cleanUrlPath':
              this.cleanUrlPath(funcParams)
              break
  
            case 'resetFitToPolygon':
              this.resetFitToPolygon()
              break
  
            case 'resetSelectedPolygons':
              this.resetSelectedPolygons()
              break
  
            case 'goTo':
              // this.log && console.log('C-GlobalButton / runBtnFunctions / goTo / funcParams : ', funcParams )
              this.$router.push(funcParams.to)
              break

            case 'goToExt':
              let win = window.open(funcParams.url, '_blank')
              win.focus()
              break
          }
        }
      }
      this.$store.commit('buttons/updateResetBtnsExceptions', btn.id)
      this.$store.commit('buttons/toggleBtnTrigger')
      this.$store.commit('buttons/toggleBtnReset')
      this.$store.commit('toggleTriggerComponentLoaded')
    },

    getSourceData(params, from) {
      let data
      if (from === 'raw') {
        data = params.rawValue
      }
      return data
    },

    updateData(params) {
      // this.log && console.log("\nC-GlobalButton / updateData  : ", "+ ".repeat(10) )
      // this.log && console.log("C-GlobalButton / updateData ... params : ", params )

      for (let targetParams of params.targets) {
          // 1 - get data for the update
          targetParams.prop = params.prop
          targetParams.propName = params.propName
          targetParams.props = params.props
          let value = this.getSourceData(targetParams, targetParams.from)
          // this.log && console.log("C-GlobalButton / updateData ... value : ", value )

          // 2 - then update displayed data
          let targetData = {
            value: value,
            specialStoreId: targetParams.targetSpecialStoreId,
          }
          this.$store.dispatch('data/setNestedData', targetData) // set element in : store.data.sepcialStore
      }
    },

    updateUrlPath(params) {
      // this.log && console.log("\nC-GlobalButton / updateUrlPath  : ", "+ ".repeat(10) )
      // this.log && console.log("\nC-GlobalButton / updateUrlPath ... params : ", params )

      for (let targetParams of params.targets) {
        let targetArgs = { ...targetParams.urlArgs }
        // this.log && console.log("C-GlobalButton / updateUrlPath ... this.$store.state.data[ targetArgs.datastore ] : ", this.$store.state.data[ targetArgs.datastore ] )

        const routePath = this.$route.path
        let paramsString = objectToUrlParams(targetArgs)
        const routeIdString = this.queryRouteId ? `routeId=${this.queryRouteId}` : undefined
        if (routeIdString) {
          paramsString = `${routeIdString}&${paramsString}`
        }
        // this.log && console.log("C-GlobalButton / updateUrlPath ... paramsString : ", paramsString )

        this.$store.commit('setRouteParams', paramsString)
        history.pushState({}, null, `${routePath}?${paramsString}`)
      }
    },

    cleanUrlPath(funcParams) {
      // this.log && console.log("C-GlobalButton / cleanUrlPath ... funcParams : ", funcParams )
      let routePath = this.$route.path
      // this.log && console.log("C-GlobalButton / cleanUrlPath ... this.$route : ", this.$route )
      // this.log && console.log("C-GlobalButton / cleanUrlPath ... this.routeParams : ", this.routeParams )
      
      let routeQuery = objectFromQueriesString(this.routeParams)
      // this.log && console.log("C-GlobalButton / cleanUrlPath ... routeQuery : ", routeQuery )
      
      let otherQueries = stringFromQueriesObject(routeQuery, [], funcParams.ignoreQueryArgs )
      // this.log && console.log("C-GlobalButton / cleanUrlPath ... otherQueries : ", otherQueries )

      this.$store.commit('setRouteParams', otherQueries)
      routePath = otherQueries !== '' ? `${routePath}?${otherQueries}` : routePath
      history.pushState({}, null, routePath)
    },

    resetFitToPolygon() {
      this.$store.commit('maps/setFitToPolygon', undefined);
    },

    resetSelectedPolygons() {
      this.$store.commit('maps/seSelectedStateId', undefined);
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
};
</script>
