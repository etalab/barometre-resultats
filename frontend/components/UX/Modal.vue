<template>

  <div>

    <v-dialog
      class="light-shadow"
      v-model="dialog"
      :max-width="dialogMaxWidth"
      @click.outside="dialog = false"
      scrollable
      >

      <!-- DIALOG / ACTIVATOR -->
      <template 
        v-slot:activator="{ on }"
        >
        <div
          v-on="on"
          >
          <p 
            v-if="!kpiData.textBrief"
            class="mb-3">
            <a
              class="caption text-none grey--text text--darken-1"
              >
              <span class="no-pointer">
                {{ forceTrim(kpiData.kpiTitle[locale]) }}
              </span>
              <v-icon
                x-small
                class="ml-1"
                color="grey darken-1"
                >
                icon-info
              </v-icon>
            </a>
          </p>
          <p 
            class="mb-0 body-1"
            v-if="kpiData.textBrief"
            >
            <a
              v-for="(textComp, index) in getKpiSettingsTexts(kpiData)"
              :key="`textBriefComp-${index}`"
              class="text-none black--text"
              v-on="on"
              >
              <span>
                <TextFrame
                  :settings="textComp.settings"
                  :route-id="textComp.settings.id"
                  :isBrief="true"
                  :isModal="true"
                  :fromKpiTable="true"
                />
              </span>
            </a>
          </p>
        </div>
      </template>

      <!-- DIALOG / MODAL TEXT -->
      <v-card>
        <v-card-title
          class="pb-0"
          >
          <v-row
            class="ml-5"
            justify="space-between"
            align="start"
            >
            <v-col
              :class="`mr-0 pb-0 ${isMain ? 'ml-5 text-h6' : 'pl-2 text-subtitle-1 text-weight-bold'} kpi-dialog-title`"
              cols="10"
              >
              {{ kpiData.kpiTitle[locale] }}
            </v-col>
            <v-col class="ml-auto pa-0 text-right">
              <v-btn
                color="grey"
                icon
                @click="dialog = false"
                >
                <v-icon>
                  icon-clear
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text
          v-for="(textComp, index) in getKpiSettingsTexts(kpiData)"
          :key="`textComp${isMain ? '' : 'Kpi'}-${index}`"
          >
          <TextFrame
            :settings="textComp.settings"
            :route-id="textComp.settings.id"
            :isModal="true"
            :fromKpiTable="true"
          />
            <!-- @toggleModal="dialog = s" -->
        </v-card-text>
      </v-card>

    </v-dialog>

  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  name: 'Modal',
  props: [
    'isMain',
    'kpiData',
  ],
  data() {
    return {
      dialog: false,
      dialogMaxWidth: 625,
    }
  },
  computed: {
    ...mapState({
      log: (state) => state.log,
      locale: (state) => state.locale,
    }),

  },
  methods: {
    forceTrim(string) {
      let newString = string.trim()
      return newString
    },
    getKpiSettingsTexts(kpi, componentType = 'text') {
      let textSettingsArray = kpi.afterTitleComponents && kpi.afterTitleComponents.filter(comp => comp.component === componentType)
      return textSettingsArray
    },
  }

}

</script>
