<style scoped></style>

<template>
  <v-container
    v-show="canShow"
    :id="`table-${settings.id}`"
    :class="``"
    :trigger="`${trigger}`"
  >
    <v-layout>
      <v-card>
        <v-card-title>
          table
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="icon-search"
            label="Search"
            single-line
            hide-details
          />
          <!-- append-icon="mdi-magnify" -->
        </v-card-title>
        <v-data-table :headers="headers" :items="desserts" :search="search" />
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex"

export default {
  name: 'Table',

  // components: {},

  props: ["settings", "routeId"],

  data() {
    return {
      dataViewType: "tables",
      viewConfig: undefined,

      search: "",
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: "1%",
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: "1%",
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: "7%",
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: "8%",
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: "16%",
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: "0%",
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: "2%",
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: "45%",
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: "22%",
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: "6%",
        },
      ],
    }
  },

  watch: {},

  beforeMount() {
    // set up view config
    this.viewConfig = this.getLocalConfig
  },

  // mounted() {
  //   this.log && console.log("C-Table / mounted ...")
  // },

  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
      trigger: (state) => state.data.triggerChange,
    }),

    ...mapGetters({
      getCurrentLocale: "getCurrentLocale",
      getDataViewConfig: "getDataViewConfig",
      getSpecialStore: "data/getSpecialStore",
      windowSize: "getWindowsSize",
      // getCurrentBreakpoint: "getCurrentBreakpoint",
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

    canShow() {
      let bool = true
      let noShowArray = this.viewConfig && this.viewConfig.notShowFor
      if (noShowArray) {
        // bool = noShowArray.includes(this.getCurrentBreakpoint)
        bool = noShowArray.includes(this.$vuetify.breakpoint.name)
      }
      return bool
    },
  },

  methods: {},
}
</script>
