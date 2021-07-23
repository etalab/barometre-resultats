// const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,

  // keyKpiFamilyId,
  // keyKpiFamilies,
  // keyKpiFamilyName,
  // keyKpiFamilyAliases,
  // keyKpiFamilyIcon,
  // keyKpiFamilyText,
  // keyKpiFamilyUrl,
  // keyKpiFamilyExtUrl,
  // keyKpiFamilyImageActivate,
  // keyKpiFamilyImage,

  keyKpiGroupIdDataset,
  keyKpiGroupId,
  keyKpiGroupImageActivate,
  keyKpiGroupImage,
  keyKpiGroupUrl,
  // keyKpiGroupUrls,
  keyKpiGroupExtLink,
  keyKpiGroupExtLink2,
  keyKpiGroupExtLinkTxt2,
  // keyKpiGroupText,
  keyKpiGroupName,
  // keyKpiGroupSourcesId,
  keyKpiGroupKpis,

  keyKpiId,
  // keyKpiText,
  keyKpiGroupTextOpen,
  keyKpiTextBrief,
  keyKpiTextOpen,
  // keyKpiName,

  keyKpiChartTitleRaw,

  keyKpiTableFormat,
  keyKpiTableUnit,

  keyKpiMapDefaultLayer,
  keyKpiMapOnlyNational,
  keyKpiMapHasRegion,
  keyKpiMapHasDepartement

} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigKpiTables.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON CONSTANTS

const KEY_NOMBRE = 'value'
// const KEY_DATE = 'date'

// - - - - - - - - - - - - - - - - - - - - - - //
// COLORS
// - - - - - - - - - - - - - - - - - - - - - - //
// const FILLCOLOR_COHESION = '#00BCD4'
// const FILLCOLOR_LOGEMENT = '#D66200'
// const FILLCOLOR_TRANSITION_ECOLOGIQUE = '#50B250'
// const FILLCOLOR_EMPLOI = '#7373FF'
// const FILLCOLOR_HANDICAP = '#C95DC9'
// const FILLCOLOR_EDUCATION = '#1E88E5'

const FILLCOLOR_DEFAULT = {
  color: 'black',
  // color: 'orange darken-3',
  textColor: 'orange--text text--darken-3'
}

// const FILLCOLOR_COHESION = {
//   color: 'black',
//   // color: 'light-cyan darken-1',
//   textColor: 'light-cyan--text text--darken-1'
// }
// const FILLCOLOR_LOGEMENT = {
//   color: 'black',
//   // color: 'orange darken-3',
//   textColor: 'orange--text text--darken-3'
// }
// const FILLCOLOR_TRANSITION_ECOLOGIQUE = {
//   color: 'black',
//   // color: 'green',
//   textColor: 'green--text'
// }
// const FILLCOLOR_EMPLOI = {
//   color: 'black',
//   // color: 'deep-purple lighten-2',
//   textColor: 'deep-purple--text text--lighten-2'
// }
// const FILLCOLOR_HANDICAP = {
//   color: 'black',
//   // color: 'pink darken-1',
//   textColor: 'pink--text text--darken-1'
// }
// const FILLCOLOR_EDUCATION = {
//   color: 'black',
//   // color: 'light-blue',
//   textColor: 'light-blue--text'
// }

// - - - - - - - - - - - - - - - - - - - - - - //
// FORMATTERS / MAPPERS
// - - - - - - - - - - - - - - - - - - - - - - //
const COMMON_FORMATTERS = {
  toFloat: [
    {
      utilsFnName: 'toFloat'
    }
  ],
  millionsEuros: {
    type: 'float',
    sepThousands: ' ',
    sepComma: ',',
    unit: 'M€'
  },
  toMillionsWithComma: [
    {
      utilsFnName: 'toMillionsOrElse',
      params: { divider: 1, fixed: 1 }
    }
  ],
  toMillionsWithoutComma: [
    {
      utilsFnName: 'toMillionsOrElse',
      params: { divider: 1000000, fixed: 0 }
    }
  ],
  integerEuropeanFormat: {
    type: 'integer',
    sepThousands: ' '
  },
  floatEuropeanFormat: {
    type: 'float',
    sepThousands: ' ',
    sepComma: ','
  }
}
const COMMON_SERIES_MAPPERS = {
  DateByNumber: {
    dataFromKey: KEY_NOMBRE,
    serieName: 'nombre',
    format: COMMON_FORMATTERS.toMillionsWithComma,
    sortDataSerieBy: {
      sortByType: 'sortByFieldValue',
      fieldName: KEY_NOMBRE,
      toNumber: true
    }
  },
  basicNumber: {
    dataFromKey: KEY_NOMBRE,
    serieName: 'nombre',
    format: COMMON_FORMATTERS.toMillionsWithComma
  },
  basicSerie: {
    dataFromKey: KEY_NOMBRE,
    serieName: 'serie',
    format: COMMON_FORMATTERS.toMillionsWithComma
  }
}

const COMMON_RULES = {
  fr_levelname_prepositions: {
    position: 'after_prefix',
    rules: [
      {
        add: 'la',
        class: '',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'national'
          }
        ]
      },
      {
        add: 'la région',
        class: '',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'regional'
          }
        ]
      },
      {
        add: "le département de l'",
        class: 'no-space-after',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'departemental'
          },
          {
            specialStoreId: 'gender',
            specialStoreValue: 'app'
          }
        ]
      },
      {
        add: 'le département du',
        class: '',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'departemental'
          },
          {
            specialStoreId: 'gender',
            specialStoreValue: 'masc'
          }
        ]
      },
      {
        add: 'le département de la',
        class: '',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'departemental'
          },
          {
            specialStoreId: 'gender',
            specialStoreValue: 'fem'
          }
        ]
      },
      {
        add: 'le département des',
        class: '',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'departemental'
          },
          {
            specialStoreId: 'gender',
            specialStoreValue: 'plur'
          }
        ]
      },
      {
        add: 'le département de',
        class: '',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'departemental'
          },
          {
            specialStoreId: 'gender',
            specialStoreValue: 'solo'
          }
        ]
      }
    ]
  },

  fr_prepositions: {
    position: 'after_prefix',
    rules: [
      {
        add: 'dans la région',
        targetInitDataKeyReload: 'reg',
        value: [
          { fromSpecialStoreFocusObjectId: 'dep' },

          { fromInitDataId: 'taxo-departements' },
          { fromInitDataKey: 'dep' },
          { targetKey: 'reg' },

          { fromInitDataId: 'taxo-regions' },
          { fromInitDataKey: 'reg' },
          { targetInitDataKey: 'libelle' }
        ],
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'departemental'
          },
          {
            itemId: 'from_level',
            itemValue: 'reg'
          }
        ]
      },

      {
        add: 'pour la France entière',
        conditions: [
          { checkBreakpoint: true, breakpoints: ['xs', 'sm', 'xl']},
          {
            itemId: 'from_level',
            itemValue: 'nat'
          }
        ]
      },
      {
        add: '<br>pour la France entière',
        conditions: [
          { checkBreakpoint: true, breakpoints: ['md', 'lg'] },
          {
            itemId: 'from_level',
            itemValue: 'nat'
          }
        ]
      },
      // {
      //   add: 'à la maille nationale',
      //   conditions: [
      //     // { specialStoreId: 'levelcode',
      //     //   specialStoreValue: 'departemental',
      //     // },
      //     // { noDepKpi: true },
      //     // { noRegKpi: true },
      //     {
      //       itemId: 'from_level',
      //       itemValue: 'nat'
      //     }
      //   ]
      // },

      {
        add: ' et à la maille départementale',
        conditions: [
          { hasDepKpi: true },
          // { checkMobile: true, isMobile: false, treshold: 1400 },
          { checkBreakpoint: true, breakpoints: ['lg', 'xl']},
          {
            itemId: 'from_level',
            itemValue: 'nat'
          }
        ]
      },
      {
        add: '<br> et à la maille départementale',
        conditions: [
          { hasDepKpi: true },
          // { checkMobile: true, isMobile: true, breakpoint: 1400 },
          { checkBreakpoint: true, breakpoints: ['xs', 'sm', 'md'] },
          {
            itemId: 'from_level',
            itemValue: 'nat'
          }
        ]
      },

    ]
  }
}

// - - - - - - - - - - - - - - - - - - - - - - //
// HEADERS
// - - - - - - - - - - - - - - - - - - - - - - //
const COMMON_HEADERS = {
  kpiOvqHeadersTable: (kpi) => {
    const headers = [
      // { text: 'odmKeyfield',
      //   value: 'odmKeyfield',
      //   align: 'start',
      //   sortable: false,
      //   hide: true,
      //   cols: 3,
      //   asChip: false,
      //   format: undefined,
      //   class: 'caption'
      // },
      // { text: { fr: 'Thématique'},
      //   value: 'ovq-thema-name',
      //   from: 'kpi-family',
      //   align: 'center',
      //   sortable: false,
      //   cols: 2,
      //   asChip: false,
      //   format: undefined,
      //   class: 'caption',
      // },
      // { text: { fr: 'OVQ'},
      {
        text: { fr: 'Actions prioritaires' },
        value: 'ovq-name',
        from: 'kpi-group',
        align: 'center',
        sortable: false,
        cols: 3,
        asChip: false,
        format: undefined,
        class: 'caption font-weight-bold text-left',
        addKpiGroupLink: true
      },
      {
        text: { fr: 'Indicateur' },
        value: 'indicateurs',
        align: 'start',
        sortable: false,
        cols: 3,
        asChip: false,
        format: undefined,
        class: 'caption'
      },
      {
        text: { fr: 'Valeur <br>initiale' },
        value: 'initial_value',
        align: 'center',
        cols: 1,
        asChip: true,
        format: 'integer',
        unit: undefined,
        class: 'light-blue lighten-2 caption font-weight-medium',
        color: 'light-blue'
      },
      {
        text: { fr: "Aujourd'hui" },
        value: 'one_quarter_before',
        align: 'center',
        cols: 1,
        asChip: true,
        animate: true,
        format: 'integer',
        unit: undefined,
        class: 'blue darken-3 white--text caption font-weight-medium',
        color: 'blue'
      },
      {
        text: { fr: 'Progression' },
        value: 'progression_percentage',
        align: 'center',
        cols: 1,
        format: 'integer',
        addSign: true,
        asChip: true,
        unit: '%',
        class: 'light-green darken-2 white--text caption font-weight-medium',
        color: 'light-green darken-2'
      },
      // {
      //   text: { fr: 'Progression depuis' },
      //   value: 'progression_last_update_percentage',
      //   align: 'center',
      //   cols: 1,
      //   format: 'integer',
      //   addSign: true,
      //   asChip: true,
      //   unit: '%',
      //   class: 'light-green darken-2 white--text caption font-weight-medium',
      //   color: 'light-green darken-2'
      // },
      {
        text: { fr: 'Cible 2022' },
        value: 'target',
        align: 'center',
        cols: 1,
        format: 'integer',
        asChip: true,
        unit: undefined,
        class: 'green darken-2 white--text caption font-weight-medium',
        color: 'green darken-2'
      },
      {
        text: { fr: 'Taux de réalisation' },
        value: 'target_percentage',
        align: 'center',
        cols: 2,
        format: 'percent',
        addSign: false,
        asChip: true,
        // formatIcon: 'progress-pie',
        formatIcon: 'progress-bar',
        animate: true,
        switchColor: true,
        switchParams: {
          limitMedium: 50,
          limit: 30,
          positiveColor: 'green white--text font-weight-bold',
          limitMediumColor: 'yellow darken-3 white--text font-weight-bold',
          limitColor: 'amber darken-4 white--text font-weight-bold',
          negativeColor: 'amber darken-4 white--text font-weight-bold'
        },
        unit: ' %',
        class: '',
        color: 'green'
      }
    ]
    // const kpisHeadersSettings = kpi.odm_kpi_headers_overwrite
    return headers
  },

  kpiOvqHeadersBlocks: (kpi) => {
    let headers = [
      // { text: 'odmKeyfield',
      //   value: 'odmKeyfield',
      //   align: 'start',
      //   sortable: false,
      //   hide: true,
      //   cols: 3,
      //   asChip: false,
      //   format: undefined,
      //   class: 'caption'
      //   blockIndex: 0,
      //   blockId: undefined,
      //   blockInnerTarget: undefined,
      // },

      {
        text: { fr: 'Actions prioritaires' },
        hide: true,
        value: 'ovq-name',
        from: 'kpi-group',
        align: 'center',
        sortable: false,
        cols: 3,
        asChip: false,
        format: undefined,
        kpiValueComponent: undefined,
        class: 'caption font-weight-bold text-left',
        addKpiGroupLink: true,
        blockId: undefined,
        blockColor: undefined,
        blockInnerTarget: undefined
      },
      {
        text: { fr: 'Indicateur' },
        value: 'indicateurs',
        align: 'start',
        sortable: false,
        cols: 3,
        asChip: false,
        format: undefined,
        kpiValueComponent: undefined,
        class: 'caption',
        blockId: undefined,
        blockColor: undefined,
        blockInnerTarget: undefined
      },
      {
        text: { fr: 'En 2017' },
        value: 'initial_value',
        align: 'center',
        cols: 1,
        asChip: true,
        format: 'integer',
        kpiValueComponent: 'number',
        unit: undefined,
        class: 'light-blue lighten-2 caption font-weight-medium',
        color: 'light-blue',
        blockId: 'block-0',
        // blockColor: 'red lighten-5',
        blockColor: '#fff9f8',
        blockTitleClass: 'caption py-1',
        blockTitleColor: '#fff4f2',
        blockInnerTarget: 'data-main-value'
      },
      {
        text: { fr: "Aujourd'hui" },
        // value: 'one_quarter_before',
        value: 'latest_value',
        align: 'center',
        cols: 1,
        asChip: true,
        animate: false,
        format: 'integer',
        kpiValueComponent: 'number',
        unit: undefined,
        class: 'blue darken-3 white--text caption font-weight-medium',
        color: 'blue',
        blockId: 'block-1',
        // blockColor: 'teal lighten-5',
        blockColor: '#f3faf7',
        blockTitleClass: 'caption py-1',
        blockTitleColor: '#e7f5ef',
        blockInnerTarget: 'data-main-value'
      },
      {
        text: { fr: 'Progression' },
        textPrefix: { fr: 'depuis' },
        value: 'progression_percentage',
        valueDate: 'initial_value_date',
        hideIfNull: true,
        align: 'center',
        cols: 1,
        addSign: true,
        addArrow: true,
        asChip: true,
        animate: false,
        format: 'integer',
        kpiValueComponent: 'number',
        unit: '%',
        class: 'light-green darken-2 white--text caption font-weight-medium',
        color: 'light-green darken-2',
        blockId: 'block-1',
        blockColor: undefined,
        blockInnerTarget: 'data-second-value'
      },
      {
        text: { fr: 'Progression depuis la dernière mise à jour' },
        textPrefix: { fr: 'depuis la première publication de l\'indicateur' },
        value: 'progression_last_update_percentage',
        valueDate: 'progression_last_update_date',
        hideIfNull: true,
        align: 'center',
        cols: 1,
        addSign: true,
        addArrow: true,
        asChip: true,
        animate: false,
        format: 'integer',
        kpiValueComponent: 'number',
        unit: '%',
        class: 'light-green darken-2 white--text caption font-weight-medium',
        color: 'light-green darken-2',
        blockId: 'block-1',
        blockColor: undefined,
        blockInnerTarget: 'data-third-value'
      },
      {
        text: { fr: 'Cible 2022' },
        value: 'target',
        align: 'center',
        cols: 1,
        asChip: true,
        unit: undefined,
        format: 'integer',
        kpiValueComponent: 'number',
        class: 'green darken-2 white--text caption font-weight-medium',
        color: 'green darken-2',
        blockId: 'block-2',
        // blockColor: 'indigo lighten-5',
        blockColor: '#f2f2f9',
        blockTitleClass: 'caption py-1',
        blockTitleColor: '#e5e5f4',
        blockInnerTarget: 'data-main-value'
      },
      {
        text: { fr: 'Taux de réalisation' },
        value: 'target_percentage',
        hideIfNull: true,
        align: 'center',
        cols: 2,
        addSign: false,
        asChip: true,
        // formatIcon: 'progress-pie',
        format: 'percent',
        kpiValueComponent: 'progress-bar',
        tooltip: true,
        tooltipText: {
          fr: "Taux de réalisation de la cible par rapport à la valeur initiale [(valeur actuelle - valeur initiale) / (valeur cible - valeur initiale) * 100)]"
        },
        animate: false,
        striped: false,
        dark: true,
        textPosition: 'left',
        switchColor: true,
        switchParams: {
          limitMedium: 50,
          limit: 0,

          // positiveColor: 'green white--text font-weight-bold',
          // limitMediumColor: 'yellow darken-3 white--text font-weight-bold',
          // limitColor: 'amber darken-4 white--text font-weight-bold',
          negativeColor: 'amber darken-4 white--text font-weight-bold',

          positiveColor: 'indigo darken-1 white--text font-weight-bold',
          limitMediumColor: 'indigo darken-1 white--text font-weight-bold',
          limitColor: 'indigo darken-1 white--text font-weight-bold'
          // negativeColor: 'indigo darken-1 white--text font-weight-bold'
        },
        unit: ' %',
        class: '',
        color: 'green',
        blockId: 'block-2',
        blockColor: undefined,
        blockInnerTarget: 'data-second-value'
      }
    ]
    const kpisHeadersSettings = kpi.odm_kpi_headers_overwrite
    // console.log( '>>> appConfigKpiTables.js (start) / kpiOvqHeadersBlocks / kpisHeadersSettings : ', kpisHeadersSettings )
    headers = headers.map(h => {
      let headerSettings = kpisHeadersSettings.find(hs => hs.value === h.value)
      if (headerSettings && h.value === headerSettings.value) {
        h.text = { fr: headerSettings.text }
        h.textDefault = { fr: headerSettings.text_default }
        h.textFormat = headerSettings.text_format
        h.textValue = headerSettings.text_value
        h.hideIfMainNull = headerSettings.hide_if_main_is_null
        h.hideDayOnDate = headerSettings.hide_day_on_date
        // console.log( '>>> appConfigKpiTables.js (start) / kpiOvqHeadersBlocks / h : ', h )
      }
      return h
    })
  
    // let header = headers.map(h => {
    //   let headerSettings = kpisHeadersSettings.find(hs => hs.value === h.value)
    //   if (headerSettings && h.value === headerSettings.value) {
    //     h.text = { fr: headerSettings.text }
    //     h.textDefault = { fr: headerSettings.text_default }
    //     h.textFormat = headerSettings.text_format
    //     h.textValue = headerSettings.text_value
    //     h.hideIfMainNull = headerSettings.hide_if_main_is_null
    //     h.hideDayOnDate = headerSettings.hide_day_on_date
    //     // console.log( '>>> appConfigKpiTables.js (start) / kpiOvqHeadersBlocks / h : ', h )
    //   }
    // })

    // console.log( '>>> appConfigKpiTables.js (end) / kpiOvqHeadersBlocks / headers : ', headers )
    return headers
  }
}

const COMMON_KPI_TEMPLATES = {
  kpis: (kpiGroupOptions) => {
    const kpisData = []
    for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
      const kpiFormat = kpi[keyKpiTableFormat]
      const kpiUnit = kpi[keyKpiTableUnit]
      const kpiData = {
        id: `${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,

        onlyNational: kpi[keyKpiMapOnlyNational],
        hasRegion: kpi[keyKpiMapHasRegion],
        hasDepartement: kpi[keyKpiMapHasDepartement],

        afterTitleComponents: [
          {
            component: 'text',
            onHeader: 'indicateurs',
            activated: true,
            smallScreenVerticalOrder: 1,
            justify: 'center',
            align: 'center',
            settings: {
              id: `text-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-resume`,
              containerClass: 'pa-0 ma-0',
              containerClassMobile: 'pa-0 ma-0',
              asDrawer: true,
              drawerIcon: 'icon-plus',
              drawerIconOff: 'icon-minus',
              drawerTitle: { fr: 'Que mesure cet indicateur ?' },
              drawerOpen: kpi[keyKpiTextOpen],
              mobileIsVisibleDefault: true,
              desktopIsVisibleDefault: true
            }
          }
        ],
        dialogComponents: [
          {
            component: 'text',
            onHeader: 'ovq-name',
            activated: true,
            textBrief: kpi[keyKpiTextBrief],
            smallScreenVerticalOrder: 1,
            justify: 'center',
            align: 'center',
            settings: {
              id: `text-${kpiGroupOptions[keyKpiGroupId]}-resume`,
              containerClass: 'pt-1 subtitle-1',
              mobileIsVisibleDefault: true,
              desktopIsVisibleDefault: true
            }
          },
          {
            component: 'text',
            onHeader: 'indicateurs',
            activated: true,
            textBrief: kpi[keyKpiTextBrief],
            smallScreenVerticalOrder: 1,
            justify: 'center',
            align: 'center',
            settings: {
              id: `text-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-resume`,
              containerClass: 'pt-1 subtitle-1',
              mobileIsVisibleDefault: true,
              desktopIsVisibleDefault: true
            }
          }
        ],
        kpiTitle: {
          fr: `${kpi[keyKpiChartTitleRaw]}`
        },
        kpiClasses: {
          mainValue: 'ovq-h4',
          secondValue: 'ovq-h5'
        },
        fromDatasetKeyValue: `${kpi[keyKpiId]}`,
        headers: COMMON_HEADERS.kpiOvqHeadersBlocks(kpi),
        kpiUnit: {
          fr: kpiUnit
        },
        kpiFormat: kpiFormat,
        textLevelNameRules: {
          fr: COMMON_RULES.fr_levelname_prepositions
          // fr: COMMON_RULES.fr_prepositions
        },
        textSuffixRules: {
          // fr: COMMON_RULES.fr_levelname_prepositions,
          fr: COMMON_RULES.fr_prepositions
        },
        suffixRulesWarningText: { fr: 'Données uniquement disponibles ' },
        // suffixRulesWarningTextDep: { fr: 'et au niveau départemental' },
        charts: [
          {
            component: 'apexchart',
            activated: true,
            smallScreenVerticalOrder: 1,
            justify: 'center',
            align: 'center',
            fallbackDataRules: true,
            settings: {
              id: `apexchart-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,
              asDrawer: true,
              containerClass: 'ma-0 pa-0',
              drawerOpen: false,
              drawerTitle: { fr: 'Voir le graphique' },
              drawerIcon: 'icon-plus',
              drawerIconOff: 'icon-minus',
              drawerClassOverride: 'borders-y-only',
              drawerTextClassOverride: false,
              // sizeRefClass: 'kpi-block-carto-top',
              // chartPadding: 70,
              mobileIsVisibleDefault: true,
              desktopIsVisibleDefault: true
            }
          }
        ]
      }
      // console.log('kpiData : ', kpiData)
      kpisData.push(kpiData)
    }
    return kpisData
  }
}
const COMMON_KPI_GROUP_TEMPLATES = {
  kpiGroup: (kpiGroups) => {
    const kpiGroupsData = []

    for (const kpiGroupOptions of kpiGroups) {
      // let debug = kpiGroupOptions[keyKpiGroupId] === 'ameliorer-qualite-service'
      // debug && console.log('kpiGroupOptions[keyKpiGroupKpis] : ', kpiGroupOptions[keyKpiGroupKpis])
      const defaultKpiGroupLayer = kpiGroupOptions[keyKpiGroupKpis].find((kpi) => kpi[keyKpiMapDefaultLayer])
      // debug && console.log('defaultKpiGroupLayer : ', defaultKpiGroupLayer)

      const addOnlyNationalMap = defaultKpiGroupLayer && defaultKpiGroupLayer[keyKpiMapOnlyNational] && !defaultKpiGroupLayer[keyKpiMapHasDepartement]
      const addDepartementMap = defaultKpiGroupLayer && defaultKpiGroupLayer[keyKpiMapHasDepartement]

      // debug && console.log('addDepartementMap : ', addDepartementMap)

      const kpiGroup = {
        id: kpiGroupOptions[keyKpiGroupId],

        onlyNational: addOnlyNationalMap,
        hasDepartement: addDepartementMap,

        kpiTitle: {
          fr: kpiGroupOptions[keyKpiGroupName]
        },
        textBrief: kpiGroupOptions[keyKpiTextBrief],
        kpiTitlePrefix: {
          fr: "Découvrir l'action "
        },
        image: kpiGroupOptions[keyKpiGroupImageActivate] ? kpiGroupOptions[keyKpiGroupImage] : undefined,
        link: kpiGroupOptions[keyKpiGroupUrl],
        linkExt: kpiGroupOptions[keyKpiGroupExtLink],
        kpiLinkText: {
          fr: 'Bénéficier de cette mesure '
        },
        kpiLinkTextBis: {
          fr: 'Accéder à la carte des données '
        },
        kpiLinkTextBisMobile: {
          fr: 'Carte des données '
        },
        fromDatasetKey: keyKpiGroupIdDataset,
        fromDatasetKeyValue: kpiGroupOptions[keyKpiGroupIdDataset],
        afterTitleComponents: [
          {
            component: 'text',
            activated: true,
            textBrief: kpiGroupOptions[keyKpiTextBrief],
            smallScreenVerticalOrder: 1,
            justify: 'center',
            align: 'center',
            settings: {
              id: `text-${kpiGroupOptions[keyKpiGroupId]}-resume`,
              containerClass: 'pt-1 mx-5 body-1 font-weight-medium',
              mobileIsVisibleDefault: true,
              desktopIsVisibleDefault: true
            }
          }
        ],
        // headers: COMMON_HEADERS.kpiOvqHeadersBlocks(kpiGroupOptions),
        // headersBackgroundColor: FILLCOLOR_LOGEMENT,
        kpiDataFromDatasetKey: keyKpiGroupKpis,
        appendKeyToValues: true,
        kpis: [
          ...COMMON_KPI_TEMPLATES.kpis(kpiGroupOptions)
        ],

        formatKpis: [
          {
            key: 'evolution_between_quarters',
            format: COMMON_FORMATTERS.toFloat
          }
        ]
      }

      if ( kpiGroupOptions[keyKpiGroupExtLink2] ) {
        kpiGroup.linkExt2 = kpiGroupOptions[keyKpiGroupExtLink2]
        kpiGroup.kpiLinkText2 = {
          fr: kpiGroupOptions[keyKpiGroupExtLinkTxt2]
        }
      }

      // console.log('kpiGroup : ', kpiGroup)
      kpiGroupsData.push(kpiGroup)
    }
    return kpiGroupsData
  }
}
const COMMON_KPI_FAMILY_TEMPLATES = {
  kpiFamilyPerFamily: (kpiFamilyOptions) => {
    const kpiFamily = {
      id: kpiFamilyOptions.kpiFamilyId,
      kpiTitle: kpiFamilyOptions.kpiFamilyName,
      image: kpiFamilyOptions.kpiFamilyImageActivate ? kpiFamilyOptions.kpiFamilyImage : undefined,
      icon: kpiFamilyOptions.kpiFamilyIcon,
      titleColor: FILLCOLOR_DEFAULT,
      link: kpiFamilyOptions.kpiFamilyUrl,
      // tableType: 'table-per-group',
      tableType: 'table-per-family',
      kpi_groups: [
        ...COMMON_KPI_GROUP_TEMPLATES.kpiGroup(kpiFamilyOptions.kpiGroups)
      ]
    }
    // console.log('kpiFamily : ', kpiFamily)
    return kpiFamily
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON FUNCTIONS

const buildKpiFamily = (kpiFamilyOptions, template) => {
  const kpiFamily = COMMON_KPI_FAMILY_TEMPLATES[template](kpiFamilyOptions)
  return kpiFamily
}

const builtKpiFamilies = []
for (const kpiFamilyOptions of dataStructure) {
  const kpiFamily = buildKpiFamily(kpiFamilyOptions, 'kpiFamilyPerFamily')
  builtKpiFamilies.push(kpiFamily)
}
// console.log( '>>> appConfigKpiTables.js (start) / builtKpiFamilies : ', builtKpiFamilies )
// console.log( '>>> appConfigKpiTables.js (start) / builtKpiFamilies : ', builtKpiFamilies.slice(0, 1) )
// for (const kpiFamily of builtKpiFamilies) {
//   console.log( '\n>>> kpiFamily.id : ', kpiFamily.id )
//   for (const kpiGroup of kpiFamily.kpi_groups) {
//     console.log( '   ... kpiGroup.id : ', kpiGroup.id )
//   }
// }
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN KPI COMPONENT SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppKpiTables = {
  help: 'this file contains the setup for the kpi tables components',

  // KPI TABLES

  settingsIds: [

    {
      id: 'kpi-territoires',

      // kpiComponentType: 'KpiTableSimple',
      kpiComponentType: 'KpiTableBlocks',

      help: 'KPI - territoires',
      titleI18n: 'kpi.text01.title',
      // kpiTitle: {
      //   fr: '<h1>OVQ par territoire</h1><br><p>vision nationale</p>'
      // },
      kpiTitle: {},
      kpiTitleClass: 'pt-5 subtitle-2 text-center',
      titlePreffixSpecialStoreId: undefined,
      titleSuffixSpecialStoreId: 'levelname',
      titleSuffixClass: 'accent--text',
      afterTitleComponents: [],
      dividers: {
        before: false,
        after: false,
        afterHideOnMobile: true
      },
      hasScrollbar: true,
      datasetMappers: {
        specialStoreId: 'focusObject',
        fromDatasetKey: 'ovq',
        seriesMappers: [
          COMMON_SERIES_MAPPERS.basicSerie
        ],
        format: COMMON_FORMATTERS.integerEuropeanFormat
      },
      addTabs: true,
      kpi_families: [

        // ////////////////////////////////////////////////////////////////
        // >>> ALL KPI TABLES
        // ////////////////////////////////////////////////////////////////

        ...builtKpiFamilies

      ]
    }

  ]
}
