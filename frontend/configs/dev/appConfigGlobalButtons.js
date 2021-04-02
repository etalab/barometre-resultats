// const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,
  keyKpiGroupId,
  keyKpiGroupName,
  keyKpiGroupExtLink
} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigGlobalButtons.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON CONSTANTS

const ZOOM_THRESHOLD = 5.3
const ZOOM_THRESHOLD_BIS = ZOOM_THRESHOLD - 0.1
// const ZOOM_THRESHOLD_MAX = 9.5

const COMMONN_URL_ARGS = {
  objectArgs: [
    'kpifamilies',
    'datasetid',
    'field',
    'value'
  ]
}
const COMMON_FUNCTIONS = {
  resetUrlPath: (ignoreArgs = ['kpifamilies']) => {
    const resetUrl = {
      funcName: 'cleanUrlPath',
      funcParams: {
        ignoreQueryArgs: []
      }
    }
    if (ignoreArgs.length) {
      resetUrl.funcParams.ignoreQueryArgs = ignoreArgs
    }
    return resetUrl
  },
  resetFitToPolygon: {
    funcName: 'resetFitToPolygon',
    funcParams: {}
  },
  resetSelectedPolygons: {
    funcName: 'resetSelectedPolygons',
    funcParams: {}
  },
  updateUrlPathRegions: {
    funcName: 'updateUrlPath',
    help: 'update url path without reloading page for constant focus object form dataset to dataset',
    funcParams: {
      zoomRange: {
        minZoom: undefined,
        maxZoom: ZOOM_THRESHOLD_BIS
      },
      propName: 'code',
      targets: [
        {
          from: 'props',
          fromPropsKey: 'value',
          urlArgs: {
            datasetid: 'regions',
            field: 'code',
            value: 'prop',
            highlight: undefined
          }
        },
        {
          from: 'store',
          fromStoreData: 'specialStore',
          fromDatasetId: 'kpifamilies',
          arrayToString: true,
          flatValue: true,
          urlArg: 'kpifamilies',
          urlArgs: {}
        }
      ]
    }
  },
  updateUrlPathDepartements: {
    funcName: 'updateUrlPath',
    help: 'update url path without reloading page for constant focus object form dataset to dataset',
    funcParams: {
      zoomRange: {
        minZoom: ZOOM_THRESHOLD_BIS,
        maxZoom: undefined
      },
      propName: 'code',
      targets: [
        {
          from: 'props',
          fromPropsKey: 'value',
          urlArgs: {
            datasetid: 'departements',
            field: 'code',
            value: 'prop',
            highlight: undefined
          }
        },
        {
          from: 'store',
          fromStoreData: 'specialStore',
          fromDatasetId: 'kpifamilies',
          arrayToString: true,
          flatValue: true,
          urlArg: 'kpifamilies',
          urlArgs: {}
        }
      ]
    }
  },
  // updateLevel: (level = 'nat') => {
  //   return {
  //     funcName: 'updateData',
  //     funcParams: {
  //       targets: [
  //         { from: 'raw',
  //           targetSpecialStoreId: 'level',
  //           rawValue: level
  //         },
  //       ]
  //     }
  //   }
  // },
  updateLevelName: (levelname = 'France Entière') => {
    return {
      funcName: 'updateData',
      funcParams: {
        targets: [
          {
            from: 'raw',
            targetSpecialStoreId: 'levelname',
            rawValue: levelname
          }
        ]
      }
    }
  },
  updateLevelCode: (levelcode = 'national') => {
    return {
      funcName: 'updateData',
      funcParams: {
        targets: [
          {
            from: 'raw',
            targetSpecialStoreId: 'levelcode',
            rawValue: levelcode
          }
        ]
      }
    }
  }
}
const COMMON_RULES = {
  fr_prepositions: {
    position: 'after_prefix',
    rules: [
      {
        add: 'la',
        class: 'mx-0',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'national'
          }
        ]
      },
      {
        add: 'la région',
        class: 'mx-0',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'regional'
          }
        ]
      },
      {
        add: "le département de l'",
        // class: 'ml-1',
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
        class: 'mx-0',
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
        class: 'mx-0',
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
        class: 'mx-0',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'departemental'
          },
          {
            specialStoreId: 'gender',
            specialStoreValue: 'plur'
          }
        ],
      },
      {
        add: 'le département',
        class: 'ml-0',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'departemental'
          },
          {
            specialStoreId: 'gender',
            specialStoreValue: 'solo'
          }
        ],
      }
    ]
  }
}

const COMMONS_TARGETS = {
  resetLevel: {
    from: 'store',
    fromPropKey: undefined,
    fromPropValue: undefined,
    fromStoreData: 'initData',
    fromDatasetId: 'infos',
    fromDatasetKey: 'texts',
    fromDatasetField: 'level',
    targetSpecialStoreId: 'level',
    updatePath: true
  },
  resetLevelName: {
    from: 'store',
    fromPropKey: undefined,
    fromPropValue: undefined,
    fromStoreData: 'initData',
    fromDatasetId: 'infos',
    fromDatasetKey: 'texts',
    fromDatasetField: 'levelname',
    targetSpecialStoreId: 'levelname',
    updatePath: true
  },
  resetLevelCode: {
    from: 'store',
    fromPropKey: undefined,
    fromPropValue: undefined,
    fromStoreData: 'initData',
    fromDatasetId: 'infos',
    fromDatasetKey: 'texts',
    fromDatasetField: 'levelcode',
    targetSpecialStoreId: 'levelcode',
    updatePath: true
  },
  resetLevelGender: {
    from: 'store',
    fromPropKey: undefined,
    fromPropValue: undefined,
    fromStoreData: 'initData',
    fromDatasetId: 'infos',
    fromDatasetKey: 'texts',
    fromDatasetField: 'gender',
    targetSpecialStoreId: 'gender',
    updatePath: true
  },
  resetMapZoom: {
    from: 'store',
    fromPropKey: undefined,
    fromPropValue: 8,
    fromStoreData: undefined,
    fromDatasetId: undefined,
    fromDatasetKey: undefined,
    fromDatasetField: undefined,
    targetSpecialStoreId: undefined
  },
  resetTerritoires: [
    {
      from: 'store',
      fromPropKey: undefined,
      fromPropValue: undefined,
      fromStoreData: 'initData',
      fromDatasetId: 'national-territoires-raw',
      fromDatasetKey: undefined,
      fromDatasetIndex: 0,
      fromDatasetField: 'value',
      targetSpecialStoreId: 'value'
    },
    {
      from: 'store',
      fromPropKey: undefined,
      fromPropValue: undefined,
      fromStoreData: 'initData',
      fromDatasetId: 'national-territoires-raw',
      fromDatasetKey: undefined,
      fromDatasetIndex: 0,
      fromDatasetField: undefined,
      targetSpecialStoreId: 'focusObject'
    }
  ]
}

const COMMON_TEMPLATES = {
  reset: (kpiGroupOptions) => {
    return {
      id: `global-button-${kpiGroupOptions[keyKpiGroupId]}`,
      help: `global reset buttton for ${kpiGroupOptions[keyKpiGroupName]}`,
      title: { fr: '' },
      titleI18n: 'buttons.button01.title',
      dividers: {
        before: false,
        after: false
      },
      btnsRowClass: `align-center justify-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'center'}`,
      btnsRowClassMobile: 'mt-0 pt-0',
      componentButtons: [
        {
          id: `reset-button-${kpiGroupOptions[keyKpiGroupId]}`,
          btnType: 'simpleBtn',
          title: { fr: 'retour au niveau national' },
          titleI18n: 'buttons.button01.title',
          btnClass: 'text-center pa-0 mb-3',
          btnClassMobile: 'text-center pa-0 mb-2',
          btnInnerClass: 'text-none',
          btnInnerIcon: 'icon-times-circle-o',
          block: false,
          icon: undefined,
          outlined: false,
          fab: false,
          color: 'primary',
          large: false,
          small: false,
          text: true,
          dark: false,
          tile: false,
          rounded: true,
          disabled: false,
          activatedIf: undefined,
          functions: [
            {
              funcName: 'resetStore',
              funcParams: {
                targets: [
                  COMMONS_TARGETS.resetLevel,
                  COMMONS_TARGETS.resetLevelName,
                  COMMONS_TARGETS.resetLevelCode,
                  COMMONS_TARGETS.resetLevelGender,
                  {
                    from: 'store',
                    fromPropKey: undefined,
                    fromPropValue: undefined,
                    fromStoreData: 'initData',
                    fromDatasetId: `national-${kpiGroupOptions[keyKpiGroupId]}-raw`,
                    fromDatasetKey: undefined,
                    fromDatasetIndex: 0,
                    fromDatasetField: 'value',
                    targetSpecialStoreId: 'value'
                  },
                  {
                    from: 'store',
                    fromPropKey: undefined,
                    fromPropValue: undefined,
                    fromStoreData: 'initData',
                    fromDatasetId: `national-${kpiGroupOptions[keyKpiGroupId]}-raw`,
                    fromDatasetKey: undefined,
                    fromDatasetIndex: 0,
                    fromDatasetField: undefined,
                    targetSpecialStoreId: 'focusObject'
                  }
                ]
              }
            },
            {
              funcName: 'resetMapZoom',
              funcParams: {
                targets: [
                  COMMONS_TARGETS.resetMapZoom
                ]
              }
            },
            COMMON_FUNCTIONS.resetUrlPath(),
            COMMON_FUNCTIONS.resetFitToPolygon,
            COMMON_FUNCTIONS.resetSelectedPolygons
            // COMMON_FUNCTIONS.updateLevelName(),
            // COMMON_FUNCTIONS.updateLevelCode(),
          ]
        }
      ],
      hideIfs: [
        { specialStoreId: 'levelcode', value: 'national' },
      ]
    }
  },
  discover: (kpiGroupOptions) => {
    return {
      id: `discover-button-${kpiGroupOptions[keyKpiGroupId]}`,
      help: `global discover buttton for ${kpiGroupOptions[keyKpiGroupName]}`,
      title: { fr: '' },
      titleI18n: 'buttons.button01.title',
      dividers: {
        before: false,
        after: false
      },
      btnsRowClass: `align-center justify-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'left'}`,
      btnsRowClassMobile: 'mt-0 pt-0 mb-2',
      componentButtons: [
        {
          id: `discover-button-${kpiGroupOptions[keyKpiGroupId]}`,
          btnType: 'simpleBtn',
          title: { fr: 'En savoir plus' },
          titleI18n: 'buttons.button01.title',
          btnClass: `justify-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'left'} py-0 my-0`,
          btnInnerClass: 'text-none',
          // btnInnerClass: 'text-none btn-gouv',
          block: false,
          icon: undefined,
          iconAfterTitle: 'icon-arrow-right',
          outlined: false,
          fab: false,
          color: 'primary',
          large: false,
          small: false,
          dark: false,
          text: true,
          tile: true,
          rounded: false,
          disabled: false,
          activatedIf: undefined,
          functions: [
            {
              funcName: 'goToExt',
              funcParams: {
                url: kpiGroupOptions[keyKpiGroupExtLink]
              }
            }
          ]
        }
      ]
    }
  },
  resetSimple: (kpiGroupOptions) => {
    return {
      id: `global-button-simple-${kpiGroupOptions[keyKpiGroupId]}`,
      help: `global reset buttton for ${kpiGroupOptions[keyKpiGroupName]}`,
      title: { fr: '' },
      titleI18n: 'buttons.button01.title',
      dividers: {
        before: false,
        after: false
      },
      btnsRowClass: `align-center justify-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'center'}`,
      btnsRowClassMobile: 'my-0 py-0',
      componentButtons: [
        {
          id: `reset-button-${kpiGroupOptions[keyKpiGroupId]}`,
          btnType: 'simpleBtn',
          title: { fr: 'Réinitialiser la recherche' },
          titleI18n: 'buttons.button01.title',
          btnClass: `text-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'center'} pa-0 mt-2 mb-2`,
          btnClassMobile: `text-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'left'} pa-0 mt-2 mb-0`,
          btnInnerClass: 'text-none',
          btnInnerIcon: 'icon-times-circle-o',
          block: false,
          icon: undefined,
          outlined: false,
          fab: false,
          color: 'primary',
          large: true,
          small: false,
          text: true,
          dark: false,
          tile: false,
          rounded: true,
          disabled: false,
          activatedIf: undefined,
          functions: [
            {
              funcName: 'resetStore',
              funcParams: {
                targets: [
                  COMMONS_TARGETS.resetLevel,
                  COMMONS_TARGETS.resetLevelName,
                  COMMONS_TARGETS.resetLevelCode,
                  COMMONS_TARGETS.resetLevelGender,
                  {
                    from: 'store',
                    fromPropKey: undefined,
                    fromPropValue: undefined,
                    fromStoreData: 'initData',
                    fromDatasetId: `national-${kpiGroupOptions[keyKpiGroupId]}-raw`,
                    fromDatasetKey: undefined,
                    fromDatasetIndex: 0,
                    fromDatasetField: 'value',
                    targetSpecialStoreId: 'value'
                  },
                  {
                    from: 'store',
                    fromPropKey: undefined,
                    fromPropValue: undefined,
                    fromStoreData: 'initData',
                    fromDatasetId: `national-${kpiGroupOptions[keyKpiGroupId]}-raw`,
                    fromDatasetKey: undefined,
                    fromDatasetIndex: 0,
                    fromDatasetField: undefined,
                    targetSpecialStoreId: 'focusObject'
                  }
                ]
              }
            },
            {
              funcName: 'resetMapZoom',
              funcParams: {
                targets: [
                  COMMONS_TARGETS.resetMapZoom
                ]
              }
            },
            COMMON_FUNCTIONS.resetUrlPath(),
            COMMON_FUNCTIONS.resetFitToPolygon,
            COMMON_FUNCTIONS.resetSelectedPolygons
            // COMMON_FUNCTIONS.updateLevelName(),
            // COMMON_FUNCTIONS.updateLevelCode(),
          ]
        }
      ],
      hideIfs: [
        { specialStoreId: 'levelcode', value: 'national' }
      ]
    }
  },
  actus: (kpiGroupOptions) => {
    return {
      id: `actu-button-simple-${kpiGroupOptions[keyKpiGroupId]}`,
      help: `global actu buttton for ${kpiGroupOptions[keyKpiGroupName]}`,
      title: { fr: '' },
      titleI18n: 'buttons.button01.title',
      dividers: {
        before: true,
        beforeOnMobile: true,
        after: false
      },
      btnsRowClass: `align-center mx-3 my-2 justify-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'left'}`,
      btnsRowClassMobile: 'my-2 py-0',
      componentButtons: [
        {
          id: `actu-button-${kpiGroupOptions[keyKpiGroupId]}`,
          btnType: 'simpleBtn',
          title: { fr: "Voir l'actualité du <br/>département" },
          titleI18n: 'buttons.button01.title',
          btnClass: `justify-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'center'} pt-5 pb-0 py-0`,
          btnInnerClass: 'text-none btn-no-radius py-2 font-weight-bold',
          block: true,
          icon: undefined,
          iconAfterTitle: null,
          outlined: true,
          fab: false,
          color: 'primary',
          large: false,
          small: false,
          dark: false,
          text: false,
          tile: false,
          rounded: false,
          disabled: false,
          activatedIf: undefined,
          height: '60px',
          functions: [
            {
              // funcName: 'goToExt',
              funcName: 'goToExtFromData',
              funcParams: {
                defaultUrl: 'https://gouvernement.fr',
                // url: kpiGroupOptions[keyKpiGroupExtLink]
                dataFromInitData: 'taxo-prefectures-urls',
                matchFromSpecialStoreField: 'levelname',
                matchToDataField: 'Département',
                returnField: 'url'
              }
            }
          ]
        }
      ],
      hideIfs: [
        // OR operator
        { specialStoreId: 'levelcode', value: 'national' },
        { specialStoreId: 'levelcode', value: 'regional' }
      ]
    }
  },
  backToDetailedResults: (kpiGroupOptions) => {
    return {
      id: `back-detail-button-simple-${kpiGroupOptions[keyKpiGroupId]}`,
      help: `global back-detail buttton for ${kpiGroupOptions[keyKpiGroupName]}`,
      title: { fr: '' },
      titleI18n: 'buttons.button01.title',
      dividers: {
        before: false,
        after: false
      },
      btnsRowClass: `align-center mx-0 my-0 justify-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'left'}`,
      btnsRowClassMobile: 'my-2 py-0',
      componentButtons: [
        {
          id: `back-detail-button-${kpiGroupOptions[keyKpiGroupId]}`,
          btnType: 'simpleBtn',
          title: { fr: "Consulter les résultats détaillés pour XXX" },
          titleI18n: 'buttons.button01.title',
          btnClass: `justify-${kpiGroupOptions.justify ? kpiGroupOptions.justify : 'center'} py-0`,
          btnInnerClass: 'text-none btn-no-radius py-2 font-weight-bold',
          block: true,
          icon: undefined,
          iconAfterTitle: null,
          outlined: true,
          fab: false,
          color: 'primary',
          large: false,
          small: false,
          dark: false,
          text: false,
          tile: false,
          rounded: false,
          disabled: false,
          activatedIf: undefined,
          height: '60px',

          textPrefix: { fr: 'Consulter les résultats détaillés pour ' },
          textPrefixClass: 'font-weight-regular',
          textPrefixRules: {
            fr: COMMON_RULES.fr_prepositions
          },
          textSuffix: { fr: '' },
          textSuffixClass: '',
          specialStoreId: 'levelname',
          // specialStoreIdClass: 'font-weight-bold',

          functions: [
            {
              funcName: 'goToDynamic',
              funcParams: {
                // url: kpiGroupOptions[keyKpiGroupExtLink]
                to: '/par-territoire/',
                args: [
                  { arg: 'datasetid',
                    from: 'mapFromSpecialStore',
                    field: 'levelcode', // departements
                    mapper: {
                      departemental: 'departements',
                      regional: 'regions'
                    }
                  },
                  { arg: 'field',
                    from: 'raw',
                    value: 'code' // code
                  },
                  // { arg: 'value',
                  //   from: 'specialStore',
                  //   field: 'level' // 02 - level code
                  // },
                  { arg: 'value',
                    from: 'mapFromSpecialStoreAndInit',
                    mapperInitDataId: {
                      specialStoreField: 'levelcode',
                      mapperInitDataField: {
                        departemental: 'taxo-departements',
                        regional: 'taxo-regions'
                      }
                    },
                    mapperFind: {
                      specialStoreField: 'levelname',
                      initDataFieldFind: 'libelle',
                      initDataValueFieldMapper: {
                        departemental: 'dep',
                        regional: 'reg'
                      }
                    }
                  },
                  { arg: 'kpifamilies',
                    from: 'routeConfig',
                    field: 'kpiFamilyId' // relance-emploi-economie
                  },
                ]
              }
            }
          ]
        }
      ],
      hideIfs: [
        // OR operator
        { specialStoreId: 'levelcode', value: 'national' },
      ]
    }
  },
}

const COMMON_KPI_FAMILY_TEMPLATES = {
  kpiFamilyPerFamily: (kpiFamilyOptions) => {
    const kpiFamily = {
      id: kpiFamilyOptions.kpiFamilyId,
      kpiTitle: kpiFamilyOptions.kpiFamilyName,
      image: kpiFamilyOptions.kpiFamilyImageActivate ? kpiFamilyOptions.kpiFamilyImage : undefined,
      icon: kpiFamilyOptions.kpiFamilyIcon,
      link: kpiFamilyOptions.kpiFamilyUrl
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

const buildButtons = (kpiGroupOptions, template) => {
  const sources = COMMON_TEMPLATES[template](kpiGroupOptions)
  return sources
}

const builtButtons = []
for (const kpiFamilyOptions of dataStructure) {
  for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
    const resetBtn = buildButtons(kpiGroupOptions, 'reset')
    // let discoverBtn = buildButtons(kpiGroupOptions, 'discover')
    const buttons = [resetBtn]
    builtButtons.push(...buttons)
  }
}
// console.log( '>>> appConfigGlobalButtons.js (start) / builtButtons : ', builtButtons )
// console.log( '>>> appConfigGlobalButtons.js (start) / builtButtons : ', builtButtons.slice(0, 2) )
// console.log( '...' )

const kpiGroupOptionsTerritories = {}
kpiGroupOptionsTerritories[keyKpiGroupId] = 'territoires'
kpiGroupOptionsTerritories[keyKpiGroupName] = 'territoires'
kpiGroupOptionsTerritories.justify = 'center'
const resetBtnTerritories = buildButtons(kpiGroupOptionsTerritories, 'resetSimple')
const actuBtnTerritories = buildButtons(kpiGroupOptionsTerritories, 'actus')
const backDetailsBtnTerritories = buildButtons(kpiGroupOptionsTerritories, 'backToDetailedResults')

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN GLOBAL BUTTONS SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppGlobalButtons = {
  help: 'this file contains the setup for the numbers components',

  // GLOBAL BUTTONS

  settingsIds: [

    {
      id: 'global-to-territoires',
      help: '',
      title: { fr: '' },
      titleI18n: 'buttons.button01.title',
      dividers: {
        before: true,
        after: true
      },
      btnsRowClass: 'align-center justify-left',
      btnsRowClassMobile: 'mt-5 mb-0 py-5',
      componentButtons: [
        {
          id: 'goto-button',
          btnType: 'simpleBtn',
          // title: { fr: 'Tous les OVQ par territoire' },
          title: { fr: 'Toutes les actions prioritaires par territoire' },
          titleI18n: 'buttons.button01.title',
          btnClass: 'justify-left my-3',
          // btnInnerClass: 'text-none btn-gouv',
          btnInnerClass: 'text-none',
          block: false,
          icon: undefined,
          // iconLink: 'mdi-link-variant',
          iconAfterTitle: 'icon-arrow-right',
          iconLink: undefined,
          outlined: false,
          fab: false,
          color: 'primary',
          large: false,
          small: false,
          dark: false,
          text: true,
          tile: true,
          rounded: false,
          disabled: false,
          activatedIf: undefined,
          functions: [
            {
              funcName: 'resetStore',
              funcParams: {
                targets: [
                  COMMONS_TARGETS.resetLevel,
                  COMMONS_TARGETS.resetLevelName,
                  COMMONS_TARGETS.resetLevelCode,
                  COMMONS_TARGETS.resetLevelGender
                  // ...COMMONS_TARGETS.resetTerritoires,
                ]
              }
            },
            {
              funcName: 'goTo',
              funcParams: {
                to: '/par-territoire/'
              }
            },
            COMMON_FUNCTIONS.resetUrlPath()
            // COMMON_FUNCTIONS.updateLevelName(),
            // COMMON_FUNCTIONS.updateLevelCode(),
          ]
        }
      ]
    },

    // ////////////////////////////////////////////////////////////////
    // >>> ALL KPI GLOBAL BUTTONS
    // ////////////////////////////////////////////////////////////////

    ...builtButtons,

    // ////////////////////////////////////////////////////////////////
    // >>> PAR TERRITOIRE
    // ////////////////////////////////////////////////////////////////

    // ============================================================= //
    // === BTN : Territoires
    // ============================================================= //
    {
      id: 'global-button-search-territoires',
      help: '',
      title: { fr: '' },
      titleI18n: 'buttons.button01.title',
      dividers: {
        before: false,
        after: false
      },

      btnsRowClass: 'custom-min-height mt-1 mb-0 justify-center align-center',
      btnsRowClassMobile: 'mt-0 pt-0 mb-0 justify-center',

      buttonsVertical: true,
      componentButtons: [

        {
          id: 'select-regions',
          btnType: 'searchAutocompleteBtn',
          title: { fr: 'Recherche par région' },
          subtitle: { fr: 'Sélectionner dans la liste' },
          titleI18n: 'buttons.button01.title',
          cols: 10,

          inputHelp: undefined,
          // inputHelp: { fr: 'ou cherchez par département' },
          inputLabel: { fr: 'ex : Bourgogne-Franche-Comté' },
          inputNoData: { fr: 'cherchez une région' },

          btnClass: 'justify-left pt-1 px-0',
          btnClassMobile: 'justify-left pt-1 px-3 pb-0',

          block: true,
          icon: false,
          iconTitle: undefined,
          // color: 'info',
          large: false,
          small: false,
          // dark: true,
          rounded: false,
          disabled: false,
          dense: false,
          filled: true,
          outlined: false,
          clearable: true,
          hideDetails: true,
          hideSelected: true,

          populateAutocompleteParams: {
            from: 'store',
            fromPropKey: undefined,
            fromPropValue: undefined,
            fromStoreData: 'initData',
            fromDatasetId: 'taxo-regions',
            fromDatasetKey: undefined,
            fromDatasetIndex: undefined,
            fromDatasetField: undefined,
            targetSpecialStoreId: 'value',

            setTitleFromKey: 'libelle',
            setValueFromKey: 'reg',
            sortByField: 'libelle',
            addValueToLabel: false
          },
          populateModelParams: {
            specialStoreId: 'focusObject',
            setValueFromKey: 'reg'
          },

          activatedIf: undefined,

          // actions / functions
          functions: [
            {
              funcName: 'updateDisplayedData',
              help: 'update several data (targets) from store',
              funcParams: {
                propName: 'value',
                targets: [
                  {
                    from: 'store',
                    fromPropKey: 'value',
                    fromStoreData: 'initData',
                    fromDatasetId: 'taxo-regions',
                    fromDatasetKey: 'reg',
                    fromDatasetField: 'libelle',
                    targetSpecialStoreId: 'levelname'
                  },
                  {
                    from: 'store',
                    fromPropKey: 'value',
                    fromStoreData: 'initData',
                    fromDatasetId: 'taxo-regions',
                    fromDatasetKey: 'reg',
                    fromDatasetField: 'reg',
                    targetSpecialStoreId: 'level'
                  },

                  {
                    from: 'store',
                    fromPropKey: 'value', // use props region code
                    fromStoreData: 'initData',
                    fromDatasetId: 'taxo-regions',
                    fromDatasetKey: 'reg',
                    fromDatasetField: 'pre',
                    targetSpecialStoreId: 'gender'
                  },

                  {
                    from: 'store',
                    fromPropKey: 'value', // use props region code
                    fromStoreData: 'initData',
                    fromDatasetId: 'regions-territoires-raw',
                    fromDatasetKey: 'reg',
                    fromDatasetField: undefined,
                    targetSpecialStoreId: 'value'
                  },

                  {
                    from: 'store',
                    fromPropKey: 'value', // use props region code
                    fromStoreData: 'initData',
                    fromDatasetId: 'regions-territoires-raw',
                    fromDatasetKey: 'reg',
                    fromDatasetField: undefined,
                    targetSpecialStoreId: 'focusObject'
                  }
                ]
              }
            },
            COMMON_FUNCTIONS.updateLevelCode('regional'),
            COMMON_FUNCTIONS.updateUrlPathRegions
            // COMMON_FUNCTIONS.updateLevelName(),
            // COMMON_FUNCTIONS.updateLevelCode(),
          ],

          clearFunctions: [
            COMMON_FUNCTIONS.resetUrlPath(),
            {
              funcName: 'resetStore',
              funcParams: {
                targets: [
                  COMMONS_TARGETS.resetLevel,
                  COMMONS_TARGETS.resetLevelName,
                  COMMONS_TARGETS.resetLevelCode,
                  COMMONS_TARGETS.resetLevelGender,
                  ...COMMONS_TARGETS.resetTerritoires
                ]
              }
            }
          ]

        },

        {
          id: 'select-departements',
          btnType: 'searchAutocompleteBtn',
          title: { fr: 'Recherche par département' },
          subtitle: { fr: 'Saisir un département ou son code' },
          titleI18n: 'buttons.button01.title',
          cols: 10,

          inputHelp: undefined,
          // inputHelp: { fr: 'ou cherchez par département' },
          inputLabel: { fr: 'ex : 33 ou Gironde' },
          inputNoData: { fr: 'cherchez un département' },

          btnClass: 'justify-center pt-0 pb-2 px-0',
          btnClassMobile: 'justify-center py-0 px-3',

          block: true,
          icon: false,
          iconTitle: undefined,
          // color: 'info',
          large: false,
          small: false,
          // dark: true,
          rounded: false,
          disabled: false,
          dense: false,
          filled: true,
          outlined: false,
          clearable: true,
          hideDetails: true,
          hideSelected: true,

          populateAutocompleteParams: {
            from: 'store',
            fromPropKey: undefined,
            fromPropValue: undefined,
            fromStoreData: 'initData',
            fromDatasetId: 'taxo-departements',
            fromDatasetKey: undefined,
            fromDatasetIndex: undefined,
            fromDatasetField: undefined,
            targetSpecialStoreId: 'value',

            setTitleFromKey: 'libelle',
            setValueFromKey: 'dep',
            sortByField: 'libelle',
            addValueToLabel: true
          },
          populateModelParams: {
            specialStoreId: 'focusObject',
            setValueFromKey: 'dep'
          },

          activatedIf: undefined,

          // actions / functions
          functions: [
            {
              funcName: 'updateDisplayedData',
              help: 'update several data (targets) from store',
              funcParams: {
                propName: 'value',
                targets: [
                  {
                    from: 'store',
                    fromPropKey: 'value',
                    fromStoreData: 'initData',
                    fromDatasetId: 'taxo-departements',
                    fromDatasetKey: 'dep',
                    fromDatasetField: 'libelle',
                    targetSpecialStoreId: 'levelname'
                  },

                  {
                    from: 'store',
                    fromPropKey: 'value',
                    fromStoreData: 'initData',
                    fromDatasetId: 'taxo-departements',
                    fromDatasetKey: 'dep',
                    fromDatasetField: 'dep',
                    targetSpecialStoreId: 'level'
                  },

                  {
                    from: 'store',
                    fromPropKey: 'value', // use props region code
                    fromStoreData: 'initData',
                    fromDatasetId: 'taxo-departements',
                    fromDatasetKey: 'dep',
                    fromDatasetField: 'pre',
                    targetSpecialStoreId: 'gender'
                  },

                  {
                    from: 'store',
                    fromPropKey: 'value', // use props region code
                    fromStoreData: 'initData',
                    fromDatasetId: 'departements-territoires-raw',
                    fromDatasetKey: 'dep',
                    fromDatasetField: undefined,
                    targetSpecialStoreId: 'value'
                  },

                  {
                    from: 'store',
                    fromPropKey: 'value', // use props region code
                    fromStoreData: 'initData',
                    fromDatasetId: 'departements-territoires-raw',
                    fromDatasetKey: 'dep',
                    fromDatasetField: undefined,
                    targetSpecialStoreId: 'focusObject'
                  }
                ]
              }
            },
            COMMON_FUNCTIONS.updateLevelCode('departemental'),
            COMMON_FUNCTIONS.updateUrlPathDepartements
          ],

          clearFunctions: [
            COMMON_FUNCTIONS.resetUrlPath(),
            {
              funcName: 'resetStore',
              funcParams: {
                targets: [
                  COMMONS_TARGETS.resetLevel,
                  COMMONS_TARGETS.resetLevelName,
                  COMMONS_TARGETS.resetLevelCode,
                  COMMONS_TARGETS.resetLevelGender,
                  ...COMMONS_TARGETS.resetTerritoires
                ]
              }
            }
          ]

        }

      ]
    },

    // resetBtnTerritories,

    {
      id: 'global-button-tabs-territoires',
      help: '',
      title: { fr: '' },
      titleI18n: 'buttons.button01.title',
      dividers: {
        before: false,
        after: false
      },
      btnsRowClass: 'align-center justify-left',
      btnsRowClassMobile: 'my-0 py-0',
      buttonsVertical: true,
      componentButtons: [
        {
          id: 'tabs-buttons-kpiFamilies',
          btnType: 'tabsBtns',
          title: { fr: 'Filter par thématiques' },
          titleI18n: 'buttons.button01.title',
          titleReset: { fr: 'Réinitialiser tous les filtres' },
          btnClass: '',
          // btnInnerClass: 'text-none btn-gouv',
          btnInnerClass: 'mr-2 my-1 text-none elevation-0',

          block: false,
          icon: undefined,
          iconAfterTitle: false,
          iconLink: undefined,
          outlined: false,
          fab: false,
          color: 'primary',
          colorDepressed: '#e5e5f4',
          large: false,
          small: false,
          dark: false,
          text: false,
          tile: false,
          rounded: true,
          disabled: false,
          activatedIf: undefined,

          setUpRouteViews: {
            urlArgs: COMMONN_URL_ARGS.urlArgs
          },
          populateTabsParams: {
            from: 'viewConfig',
            fromPropKey: 'kpi_families',
            setTitleFromKey: 'kpiTitle',
            setValueFromKey: 'id'
          },
          populateModelParams: {
            specialStoreId: 'kpifamilies'
          },
          functions: [
            {
              funcName: 'changeOpenTabs',
              funcParams: {
                targets: [
                  // COMMONS_TARGETS.resetLevelName,
                  // COMMONS_TARGETS.resetLevelCode,
                  // COMMONS_TARGETS.resetLevelGender,
                  // ...COMMONS_TARGETS.resetTerritoires,
                ]
              }
            }
          ]
        }
      ],

      kpi_families: [
        ...builtKpiFamilies
      ]

    },

    resetBtnTerritories,
    actuBtnTerritories,
    backDetailsBtnTerritories

  ]
}
