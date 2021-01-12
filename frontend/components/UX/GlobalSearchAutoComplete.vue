<style scoped>
.menu-height {
  height: 30px;
}
</style>

<template>

  <v-row
    :class="`align-center ${btn.btnClass}`"
    >

    <v-col
      v-if="btn.title"
      class="text-left pb-0 mb-0"
      cols="12"
     >
      <h5 v-if="btn.title"
        :class="`mb-1 font-weight-regular`"
        >
        {{btn.title[locale]}}
      </h5>
      <!-- <h5 v-if="btn.title && isMobileWidth"
        :class="`mb-1 font-weight-regular`"
        >
        {{btn.title[locale]}}
      </h5> -->

      <p
        v-if="btn.subtitle && !isMobileWidth"
        class="mb-2 h3 grey--text"
        >
        {{btn.subtitle[locale]}}

        <!-- <br><br> -->
        <!-- model : <code>{{model}}</code><br> -->
        <!-- itemSelected : <code>{{itemSelected}}</code> -->
        <!-- triggerBtnChange : <code>{{triggerBtnChange}}</code> -->
        <!-- trigger : <code>{{ trigger }}</code> -->

        <!-- <v-icon>
          icon-th-large
        </v-icon> -->
        <!-- <v-icon>
          icon-map
        </v-icon> -->
        <!-- <v-icon>
          icon-stats-bars
        </v-icon> -->

      </p>
    </v-col>

    <v-col
      v-if="btn.inputHelp"
      class="text-right align-center"
      cols="5"
      >
      <p class="mb-2 subtitle grey--text">
        {{ btn.inputHelp[locale] }}
      </p>
    </v-col>

    <v-col
      class="mt-0 pt-0"
      :cols="btn.inputHelp ? 7 : 12"
      >

      <!-- <code>model : {{ model }}</code><br> -->
      <!-- <code>itemSelected : {{ itemSelected }}</code><br> -->

      <v-autocomplete
        v-show="canShow"
        v-model="model"
        :items="autocompleteItems"
        :label="btn.inputLabel[locale]"
        :disabled="btn.disabled"
        :dense="btn.dense"
        :filled="btn.filled"
        :outlined="btn.outlined"
        :clearable="btn.clearable"
        :hide-details="btn.hideDetails"
        clear-icon="icon-clear"
        append-icon="icon-keyboard_arrow_down"
        item-text="label"
        item-value="value"
        solo
        eager
        background-color="grey lighten-4"
        class="elevation-0"
        :filter="filterObject"
        @click:clear="runClear(btn)"
        @change="runChange(btn)"
        >
        <!-- @keydown.enter="runBtnFunctions(btn, itemSelected)" -->
        <!-- @input="runBtnFunctions(btn, itemSelected)" -->

        <!-- NO DATA -->
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              {{ btn.inputNoData[locale] }}
            </v-list-item-title>
          </v-list-item>
        </template>

        <!-- SELECTED ITEM -->
        <template
          v-slot:selection="data"
          >
          <div
            v-bind="data.attrs"
            :input-value="data.item.value"
            >
            <span 
              v-text="data.item.label"
              >
            </span>
          </div>
        </template>

        <!-- AUTOCOMPLETE ITEMS LIST -->
        <template v-slot:item="{ item }">
          <v-list-item-content
            @click="runBtnFunctions(btn, item)"
            >
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </template>

      </v-autocomplete>

      <!-- <v-text-field
        v-show="canShow"
        :label="btn.inputLabel[locale]"
        :outlined="btn.outlined"
        :color="btn.color"
        :large="isMobileWidth ? false : btn.large"
        :small="isMobileWidth ? true : btn.small"
        :disabled="btn.disabled"
        :dense="btn.dense"
        :clearable="btn.clearable"
        :hide-details="btn.hideDetaiils"
        >
      </v-text-field> -->
  
    </v-col>

    <!-- DEBUGGING -->
    <!-- <v-col cols="6" class="px-1">
      autocompleteItems : <br>
      <code>
        <pre>
          {{ [autocompleteItems] }}...
        </pre>
      </code>
    </v-col> -->

  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { objectToUrlParams, sortByFieldName, objectFromQueriesString, stringFromQueriesObject, slugify } from '~/utils/utils.js'

export default {
  name: 'GlobalSearchAutoCompleteAutoComplete',
  // components: {},

  props: [
    'btn',
    'settings'
  ],

  data() {
    return {
      canShow: true,

      model: null,
      itemSelected: null,
      autocompleteItems: [],

    }
  },

  watch: {
    trigger(next, prev) {
      // this.log && console.log("C-GlobalSearchAutoComplete / watch / trigger ...")
      this.getCanShow()
    },
    // triggerBtnChange(next, prev) {
    //   this.log && console.log("C-GlobalSearchAutoComplete / watch / triggerBtnChange ...")
    //   // this.itemSelected = undefined
    // },
    triggerBtnReset(next, prev) {
      // this.log && console.log("\nC-GlobalSearchAutoComplete / watch / triggerBtnReset ...")
      // this.log && console.log("C-GlobalSearchAutoComplete / watch / this.resetBtnsExceptions : ", this.resetBtnsExceptions)
      // this.log && console.log("C-GlobalSearchAutoComplete / watch / this.btn.id : ", this.btn.id)
      if (!this.resetBtnsExceptions.includes(this.btn.id)){
        this.itemSelected = undefined
        this.model = null
      }
    },
    resetBtnsExceptions(next, prev) {
      // this.log && console.log("\nC-GlobalSearchAutoComplete / watch / triggerBtnResetautocomplete / this.btn.id :", this.btn.id)
      if (!this.resetBtnsExceptions.includes(this.btn.id)){
        this.itemSelected = undefined
        this.model = null
      }
    },
    canShow(next, prev) {
      // this.log && console.log("C-GlobalSearchAutoComplete / watch / canShow ...")
      this.$store.commit('buttons/toggleBtnTrigger')
    },

  },

  beforeMount() {
    // set up view config
    this.viewConfig = this.getLocalConfig
  },

  mounted() {
    // this.log && console.log("C-GlobalSearchAutoComplete / mounted ...")
    // this.log && console.log("C-GlobalSearchAutoComplete / this.btn :", this.btn)
    this.getCanShow()
    this.populateAutocomplete(this.btn.populateAutocompleteParams)
    this.populateModel(this.btn.populateModelParams)
  },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
      // triggerBtnChange: (state) => state.buttons.triggerBtnChange,
      triggerBtnReset: (state) => state.buttons.triggerBtnReset,
      resetBtnsExceptions: (state) => state.buttons.resetBtnsExceptions,
      mobileBreakpoints: (state) => state.configUX.mobileBreakpoints,
      routeParams: (state) => state.routeParams,
      queryRouteId: (state) => state.queryRouteId
    }),

    ...mapGetters({
      getSpecialStore: 'data/getSpecialStore',
      getStoreSourceData: 'data/getStoreSourceData',
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
      // this.log && console.log("C-GlobalBtn / canShow / this.getSpecialStore : ", this.getSpecialStore)
      let boolsArray = [true]
      if (hideIfs) {
        for (let hideIf of hideIfs) {
          let valueFromSpecialStore = this.getSpecialStore[
            hideIf.specialStoreId
          ]
          let tempBool = hideIf.value == valueFromSpecialStore
          boolsArray.push(!tempBool)
        }
      }
      let checker = boolsArray.every(Boolean)
      this.canShow = checker
    },

    filterObject(item, queryText, itemText) {
      const inputNormalized = slugify(queryText).toLocaleLowerCase()
      const againstNormalizedTitle = slugify(item.title).toLocaleLowerCase()
      const againstNormalizedValue = slugify(item.value).toLocaleLowerCase()
      const filteredText = againstNormalizedTitle.indexOf(inputNormalized) > -1
      const filteredValue = againstNormalizedValue.indexOf(inputNormalized) > -1
      return filteredText || filteredValue
    },

    populateAutocomplete( populateAutocompleteParams ) {
      // this.log && console.log("C-GlobalSearchAutoComplete / populateAutocomplete   ...")

      let data = this.getSourceData(populateAutocompleteParams)
      let autocompleteItems = data.map(item => ({
        title: item[populateAutocompleteParams.setTitleFromKey],
        // titleNorm: item[populateAutocompleteParams.setTitleFromKey].normalize('NFC'),
        value: item[populateAutocompleteParams.setValueFromKey],
        // label: `${item[populateAutocompleteParams.setValueFromKey]} - ${item[populateAutocompleteParams.setTitleFromKey]}`
        label: `${item[populateAutocompleteParams.setTitleFromKey]}${populateAutocompleteParams.addValueToLabel ? ', ' + item[populateAutocompleteParams.setValueFromKey] : '' }`
      }))
      autocompleteItems = sortByFieldName(autocompleteItems, 'title', true)
      // this.log && console.log("C-GlobalSearchAutoComplete / getSourceData / data :", data)
      this.autocompleteItems = autocompleteItems
    },

    populateModel(populateModelParams) {
      // this.log && console.log("C-GlobalSearchAutoComplete / populateModel   ...")
      let modelData = this.getSpecialStore[populateModelParams.specialStoreId][populateModelParams.setValueFromKey]
      // this.log && console.log("C-GlobalSearchAutoComplete / modelData :", modelData)
      if (modelData) {
        this.model = modelData
      }
    },

    getSourceData(params, from = 'store') {
      // this.log && console.log("C-GlobalSearchAutoComplete / getSourceData   ...")
      // this.log && console.log("C-GlobalSearchAutoComplete / getSourceData / params :", params)
      let data
      if (from === "store") {
        data = this.getStoreSourceData(params)
      }
      if (from === "prop") {
        data = params.prop
      }
      if (from === "props") {
        data = params.props && params.props[params.fromPropsKey]
      }
      if (from === 'raw') {
        data = params.rawValue
      }
      // this.log && console.log("C-GlobalSearchAutoComplete / getSourceData / data :", data)
      return data
    },

    runClear(btn) {
      // this.log && console.log('\nC-GlobalSearchAutoComplete / runClear / btn :', btn)
      if (btn.clearFunctions) {
        for (let fn of btn.clearFunctions) {
          // this.log && console.log('C-GlobalSearchAutoComplete / runClear / fn.funcName : ', fn.funcName )
          let funcParams = fn.funcParams
          // let params = funcParams && {
          //   propName: funcParams.propName,
          //   prop: btnItem[funcParams.propName],
          //   props: btnItem,
          // }
          switch (fn.funcName) {
            case 'resetStore':
              this.$store.dispatch('data/resetStore', funcParams)
              break
            case 'updateData':
              this.updateData(funcParams)
              break
            case 'cleanUrlPath':
              this.cleanUrlPath(funcParams)
              break
          }
        }
      }
      // this.$store.commit("buttons/toggleBtnTrigger")
      this.$store.commit('buttons/toggleBtnReset')
      this.$store.commit('toggleTriggerComponentLoaded')
    },

    runChange(btn) {
      // this.log && console.log('\nC-GlobalSearchAutoComplete / runChange / btn : ', btn)
      // this.log && console.log('C-GlobalSearchAutoComplete / runChange / this.model : ', this.model)
      // this.log && console.log('C-GlobalSearchAutoComplete / runChange / this.autocompleteItems : ', this.autocompleteItems)
      // get btnItem from model
      let btnItem = this.autocompleteItems.find((btn) => btn.value === this.model)
      // this.log && console.log('C-GlobalSearchAutoComplete / runChange / btnItem : ', btnItem)
      if (btnItem) {
        this.runBtnFunctions(btn, btnItem)
      }
    },

    runBtnFunctions(btn, btnItem) {
      // this.log && console.log('\nC-GlobalSearchAutoComplete / runBtnFunctions / btn : ', btn)
      // this.log && console.log('C-GlobalSearchAutoComplete / runBtnFunctions / btnItem : ', btnItem)

      for (let fn of btn.functions) {
        // this.log && console.log('C-GlobalSearchAutoComplete / runBtnFunctions / fn.funcName : ', fn.funcName )
        let funcParams = fn.funcParams
        let params = funcParams && {
          propName: funcParams.propName,
          prop: btnItem[funcParams.propName],
          props: btnItem,
          // source: itemSource,
        }

        switch (fn.funcName) {
          
          case 'resetStore':
            this.$store.commit('buttons/toggleBtnReset')
            this.$store.dispatch('data/resetStore', funcParams)
            break

          case 'updateData':
            params.targets = funcParams.targets
            this.updateData(params)
            break

          case 'updateDisplayedData':
            params.targets = funcParams.targets
            this.updateDisplayedData(params)
            break

          case 'updateUrlPath' :
            params.targets = funcParams.targets
            // this.log && console.log( "... GlobalSearchAutoComplete / updateUrlPath / params : ", params )
            this.updateUrlPath(params)
            break

          case 'cleanUrlPath' :
            this.cleanUrlPath(funcParams)
            break
        }
      }
      // this.$store.commit('buttons/toggleBtnReset')
      // this.log && console.log('C-GlobalSearchAutoComplete / runBtnFunctions / btnItem.value : ', btnItem.value)
      
      // this.$store.commit('buttons/updateResetBtnsExceptions', btn.id)
      this.$store.dispatch('buttons/changeAutocomplete', btn.id)

      this.$store.commit('buttons/toggleBtnTrigger')
      this.itemSelected = btnItem
      // this.$store.commit('buttons/toggleBtnResetAutocomplete')
      this.$store.commit('toggleTriggerComponentLoaded')
    },

    updateUrlPath(params) {
      // this.log && console.log("\nC-GlobalSearchAutoComplete / updateUrlPath  : ", "+ ".repeat(10) )
      // this.log && console.log("\nC-GlobalSearchAutoComplete / updateUrlPath ... params : ", params )

      const routePath = this.$route.path
      const routeIdString = this.queryRouteId ? `routeId=${this.queryRouteId}` : undefined
      let paramsString = routeIdString ? routeIdString : ''

      for (let targetParams of params.targets) {
        // this.log && console.log("\nC-GlobalSearchAutoComplete / updateUrlPath ... targetParams : ", targetParams )

        // 1 - get data for the update
        targetParams.prop = params.prop
        targetParams.propName = params.propName
        targetParams.props = params.props
        
        const arrayToString = targetParams.arrayToString
        const flatValue = targetParams.flatValue

        let value = this.getSourceData(targetParams, targetParams.from)
        // this.log && console.log('C-GlobalSearchAutoComplete / updateUrlPath ... value : ', value )

        let targetArgs = { ...targetParams.urlArgs }
        targetArgs.value = arrayToString ? value.join(',') : value
        // this.log && console.log('C-GlobalSearchAutoComplete / updateUrlPath ... targetArgs : ', targetArgs )

        let paramsStringTemp = flatValue ? `${targetParams.urlArg}=${targetArgs.value}` : objectToUrlParams(targetArgs)

        paramsString = `${paramsString}&${paramsStringTemp}`
        // this.log && console.log("C-GlobalSearchAutoComplete / updateUrlPath ... paramsStringTemp : ", paramsStringTemp )
        
      }
      // this.log && console.log("C-GlobalSearchAutoComplete / updateUrlPath ... paramsString : ", paramsString )
      this.$store.dispatch('updateUserRouteParams',`${routePath}?${paramsString}`)
      // console.log(`${routePath}?${paramsString}`)
      this.$store.commit('setRouteParams', paramsString)
      history.pushState(
        {},
        null,
        `${routePath}?${paramsString}`
      )
    },

    cleanUrlPath(funcParams) {
      let routePath = this.$route.path
      let routeQuery = objectFromQueriesString(this.routeParams)      
      let otherQueries = stringFromQueriesObject(routeQuery, [], funcParams.ignoreQueryArgs )
      this.$store.commit('setRouteParams', otherQueries)
      routePath = otherQueries !== '' ? `${routePath}?${otherQueries}` : routePath
      history.pushState({}, null, routePath)
    },

    updateData(params , toggleTrigger = false) {
      // this.log && console.log("\nC-GlobalSearchAutoComplete / updateData  : ", "+ ".repeat(10) )
      // this.log && console.log("C-GlobalSearchAutoComplete / updateData ... params : ", params )
      for (let targetParams of params.targets) {

        // this.log && console.log("\nC-GlobalSearchAutoComplete / updateData ... targetParams : ", targetParams )
        // 1 - get data for the update
        targetParams.prop = params.prop
        targetParams.propName = params.propName
        targetParams.props = params.props

        let value = this.getSourceData(targetParams, targetParams.from)
        // this.log && console.log("\nC-GlobalSearchAutoComplete / updateData ... value : ", value )

        // 2 - then update displayed data
        let targetData = {
          value: value,
          specialStoreId: targetParams.targetSpecialStoreId,
        }
        this.$store.dispatch('data/setNestedData', targetData) // set element in : store.data.sepcialStore
      }
      if (toggleTrigger) {
        this.$store.commit('data/toggleTrigger')
      }
    },

    updateDisplayedData(params) {
      this.updateData(params, true)
    },

  },
}
</script>
