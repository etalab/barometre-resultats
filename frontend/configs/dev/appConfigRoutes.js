// const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,

  // keyKpiFamilyImage,

  keyKpiGroupId,
  keyKpiGroupTextBrief,
  keyKpiGroupUrls,
  keyKpiGroupName,
  // keyKpiGroupNameBis,
  keyKpiGroupExtLink,
  keyKpiGroupExtLinkTxt,
  keyKpiGroupImageActivate,
  keyKpiGroupKpis,
  keyKpiId,
  keyKpiName,
  keyKpiMapHasDepartement
} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigRoutes.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
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
  ],
  mapArgs: [
    'zoom',
    'centerlat',
    'centerlng',
    'selected'
  ]
}
const COMMON_FUNCTIONS = {
  updateUrlPathRegions: {
    funcName: 'updateUrlPath',
    help: 'update url path without reloading page for constant focus object from dataset to dataset',
    funcParams: {
      zoomRange: {
        minZoom: undefined,
        maxZoom: ZOOM_THRESHOLD_BIS
      },
      propName: 'code',
      targets: [
        {
          from: 'prop',
          urlArgs: {
            datasetid: 'regions',
            field: 'code',
            value: 'prop',
            highlight: undefined
          }
        }
      ]
    }
  }
}
const COMMON_TARGETS = {
  // TAXOS
  setLevelCode: (levelcode) => {
    const level = (levelcode === 'regional') ? 'regions' : 'departements'
    const setCode = {
      ifQuery: [{ field: 'datasetid', val: level }],
      fromQueryKey: undefined,
      fromStoreData: 'raw',
      targetSpecialStoreId: 'levelcode',
      rawValue: levelcode
    }
    return setCode
  },
  setRegionsGender: {
    ifQuery: [{ field: 'datasetid', val: 'regions' }],
    fromQueryKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-regions',
    fromDatasetKey: 'reg',
    fromDatasetField: 'pre',
    targetSpecialStoreId: 'gender'
  },
  setDepartementsGender: {
    ifQuery: [{ field: 'datasetid', val: 'departements' }],
    fromQueryKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-departements',
    fromDatasetKey: 'dep',
    fromDatasetField: 'pre',
    targetSpecialStoreId: 'gender'
  },
  setRegionsLevel: {
    ifQuery: [{ field: 'datasetid', val: 'regions' }],
    fromQueryKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-regions',
    fromDatasetKey: 'reg',
    fromDatasetField: 'reg',
    targetSpecialStoreId: 'level'
  },
  setDepartementsLevel: {
    ifQuery: [{ field: 'datasetid', val: 'departements' }],
    fromQueryKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-departements',
    fromDatasetKey: 'dep',
    fromDatasetField: 'dep',
    targetSpecialStoreId: 'level'
  },

  // LIBELLES
  setLibelleRegion: {
    ifQuery: [{ field: 'datasetid', val: 'regions' }],
    fromQueryKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-regions',
    fromDatasetKey: 'reg',
    fromDatasetField: 'libelle',
    targetSpecialStoreId: 'levelname'
  },
  setLibelleDepartement: {
    ifQuery: [{ field: 'datasetid', val: 'departements' }],
    fromQueryKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-departements',
    fromDatasetKey: 'dep',
    fromDatasetField: 'libelle',
    targetSpecialStoreId: 'levelname'
  },

  // OBJECTS - REGIONS
  setObjectsRegionsParTerritoire: [
    {
      ifQuery: [{ field: 'datasetid', val: 'regions' }],
      fromQueryKey: 'code',
      fromStoreData: 'initData',
      fromDatasetId: 'regions-territoires-raw',
      fromDatasetKey: 'reg',
      fromDatasetField: 'value',
      targetSpecialStoreId: 'value'
    },
    {
      ifQuery: [{ field: 'datasetid', val: 'regions' }],
      fromQueryKey: 'code',
      fromStoreData: 'initData',
      fromDatasetId: 'regions-territoires-raw',
      fromDatasetKey: 'reg',
      fromDatasetField: undefined,
      targetSpecialStoreId: 'focusObject'
    }
  ],

  // OBJECTS - DEPARTEMENTS
  setObjectsDepartementsParTerritoire: [
    {
      ifQuery: [{ field: 'datasetid', val: 'departements' }],
      fromQueryKey: 'code',
      fromStoreData: 'initData',
      fromDatasetId: 'departements-territoires-raw',
      fromDatasetKey: 'reg',
      fromDatasetField: 'value',
      targetSpecialStoreId: 'value'
    },
    {
      ifQuery: [{ field: 'datasetid', val: 'departements' }],
      fromQueryKey: 'code',
      fromStoreData: 'initData',
      fromDatasetId: 'departements-territoires-raw',
      fromDatasetKey: 'reg',
      fromDatasetField: undefined,
      targetSpecialStoreId: 'focusObject'
    }
  ],

  // OBJECTS - KPI FAMILIES
  setObjectsKpiFamilies: [
    {
      ifQuery: [{ field: 'kpifamilies', val: undefined, onlyCheckField: true }],
      fromQueryValue: true,
      splitQueryValue: true,
      fromQueryKey: 'kpifamilies',
      targetSpecialStoreId: 'kpifamilies'
    }
  ],

  // SET MAP ZOOM
  setMapZoomByCenter: {
    ifQuery: [
      { field: 'datasetid', val: 'departements' },
      { field: 'zoom', val: undefined, onlyCheckField: true }
    ],
    ifQueryNot: undefined,
    zoomBy: 'centerAndZoom',
    zoomField: 'zoom',
    centerLngField: 'centerlng',
    centerLatField: 'centerlat'
  },
  setMapZoomRegions: {
    ifQuery: [
      { field: 'datasetid', val: 'regions' }
    ],
    ifQueryNot: undefined,
    zoomBy: 'polygon',
    sourceField: 'datasetid',
    propField: 'value',
    propNameField: 'field'
  },
  setMapZoomDepartements: {
    ifQuery: [
      { field: 'datasetid', val: 'departements' }
    ],
    ifQueryNot: [
      { field: 'zoom', val: undefined, onlyCheckField: true }
    ],
    zoomBy: 'polygon',
    sourceField: 'datasetid',
    propField: 'value',
    propNameField: 'field'
  },

  // SET SELECTED POLYGONS
  setSelectedPolygons: {
    ifQuery: undefined,
    selectedField: 'selected',
    selectedSeparator: ',',
    selectedObjectSeparator: ':'
  },

  // RESET
  resetLevel: {
    from: 'store',
    fromPropKey: undefined,
    fromPropValue: undefined,
    fromStoreData: 'initData',
    fromDatasetId: 'infos',
    fromDatasetKey: 'texts',
    fromDatasetField: 'level',
    targetSpecialStoreId: 'level',
    updatePath: false
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
    updatePath: false
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
    updatePath: false
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
    updatePath: false
  }

}
const COMMON_URL_FOCUS = {
  // PAR OVQ

  // PAR TERRTOIRE
  setFocusObjectsParTerritoire: (kpiGroupOptions) => {
    const setFocusTerritories = {
      urlArgs: [
        ...COMMONN_URL_ARGS.objectArgs
      ],
      functions: [
        {
          funcName: 'resetStore',
          funcParams: {
            targets: [
              COMMON_TARGETS.resetLevel,
              COMMON_TARGETS.resetLevelName,
              COMMON_TARGETS.resetLevelCode,
              COMMON_TARGETS.resetLevelGender
            ]
          }
        },
        {
          funcName: 'updateDataStore',
          help: 'set store/data/specialStore',
          funcParams: {
            targets: [
              COMMON_TARGETS.setLevelCode('regional'),
              COMMON_TARGETS.setLevelCode('departemental'),
              COMMON_TARGETS.setRegionsLevel,
              COMMON_TARGETS.setDepartementsLevel,
              COMMON_TARGETS.setRegionsGender,
              COMMON_TARGETS.setDepartementsGender,
              COMMON_TARGETS.setLibelleRegion,
              COMMON_TARGETS.setLibelleDepartement,
              ...COMMON_TARGETS.setObjectsRegionsParTerritoire,
              ...COMMON_TARGETS.setObjectsDepartementsParTerritoire,
              ...COMMON_TARGETS.setObjectsKpiFamilies,
              ...COMMON_TARGETS_TEMPLATES.setLabelRegion('territoires', true),
              ...COMMON_TARGETS_TEMPLATES.setLabelDepartement('territoires', true)
            ]
          }
        }
      ]
    }
    return setFocusTerritories
  }
}
const COMMON_TEXTS = {
  bottomEmptyBlock: {
    component: 'text',
    activated: true,
    smallScreenVerticalOrder: 1,
    justify: 'center',
    align: 'center',
    settings: {
      id: 'text-bottom-empty-block',
      containerClass: 'py-0',
      containerClassMobile: 'my-5',
      mobileIsVisibleDefault: false,
      desktopIsVisibleDefault: true
    }
  }
}
// const COMMON_BUTTONS = {
//   toTerritoires: {
//     component: 'globalButtons',
//     activated: true,
//     smallScreenVerticalOrder: 1,
//     justify: 'center',
//     align: 'center',
//     settings: {
//       id: 'global-to-territoires',
//       containerClass: 'py-0 my-0',
//       mobileIsVisibleDefault: false,
//       desktopIsVisibleDefault: true
//     }
//   }
// }

const COMMON_KPI_COMPONENTS = {
  components: (kpiFamilyOptions, kpiGroupOptions, addCharts = false, addKpiCard = true) => {
    const components = []
    for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
      const kpiComponents = [
        {
          component: 'text',
          activated: true,
          smallScreenVerticalOrder: 1,
          justify: 'left',
          align: 'center',
          settings: {
            id: `text-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-resume`,
            componentTitle: { fr: kpi[keyKpiName] },
            containerClass: `mt-0 mb-${addCharts || addKpiCard ? 0 : 2 } mx-5 kpi-block-carto-${addCharts || addKpiCard ? 'top' : 'alone' }`,
            containerClassMobile: `mt-0 mb-${addCharts || addKpiCard ? 0 : 2 } mx-4 kpi-block-carto-${addCharts || addKpiCard ? 'top' : 'alone' }-mobile`,
            asDrawer: true,
            drawerOpen: true,
            drawerTitle: { fr: 'Que mesure cet indicateur ?' },
            drawerIcon: 'icon-plus',
            drawerIconOff: 'icon-minus1',
            drawerClassOverride: 'borders-y-only',
            drawerTextClassOverride: false,
            mobileIsVisibleDefault: true,
            mobileShowMore: false,
            desktopIsVisibleDefault: true
          }
        },
        {
          component: 'kpicard',
          activated: addKpiCard,
          smallScreenVerticalOrder: 1,
          justify: 'center',
          align: 'center',
          settings: {
            id: `kpicard-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,
            componentTitle: { fr: kpi[keyKpiName] },
            containerClass: `mt-0 mb-2 mx-5 kpi-block-carto-${addCharts? 'center' : 'bottom' }`,
            containerClassMobile: `mt-0 mb-2 mx-4 kpi-block-carto-${addCharts? 'center' : 'bottom' }-mobile`,
            mobileIsVisibleDefault: true,
            desktopIsVisibleDefault: true,
            
            kpiConfigFrom: {
              kpiFamilyId: kpiFamilyOptions.kpiFamilyId,
              kpiGroupId: kpiGroupOptions[keyKpiGroupId],
              kpiIdFull: `${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,
              kpiId: `${kpi[keyKpiId]}`,
              dataViewType: 'kpitables',
              kpiTableId: 'kpi-territoires',
              kpiFamiliesField: 'kpi_families',
              kpiGroupsField: 'kpi_groups',
              kpisField: 'kpis',
            },
          }
        },
        {
          component: 'apexchart',
          activated: addCharts,
          smallScreenVerticalOrder: 4,
          justify: 'left',
          align: 'center',
          settings: {
            id: `apexchart-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,
            containerClass: 'mx-5 mb-5 kpi-block-carto-bottom',
            containerClassMobile: 'mx-4 mb-3 kpi-block-carto-bottom-mobile',
            asDrawer: true,
            drawerOpen: false,
            hideTitle: true,
            drawerIcon: 'icon-plus',
            drawerIconOff: 'icon-minus1',
            drawerTitle: { fr: 'Voir le graphique' },
            mobileIsVisibleDefault: false,
            desktopIsVisibleDefault: true,
            sizeRefClass: 'kpi-block-carto-top',
            chartPadding: 70
          }
        }
      ]
      components.push(...kpiComponents)
    }
    return components
  }
}
const COMMON_TARGETS_TEMPLATES = {
  setLabelRegion: (kpiGroupOptions, raw = false) => {
    const groupId = raw ? kpiGroupOptions : kpiGroupOptions[keyKpiGroupId]
    const regionsLabels = [
      {
        ifQuery: [{ field: 'datasetid', val: 'regions' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: `regions-${groupId}-raw`,
        fromDatasetKey: 'reg',
        fromDatasetField: 'value',
        targetSpecialStoreId: 'value'
      },
      {
        ifQuery: [{ field: 'datasetid', val: 'regions' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: `regions-${groupId}-raw`,
        fromDatasetKey: 'reg',
        fromDatasetField: undefined,
        targetSpecialStoreId: 'focusObject'
      }
    ]
    return regionsLabels
  },
  setLabelDepartement: (kpiGroupOptions, raw = false) => {
    const groupId = raw ? kpiGroupOptions : kpiGroupOptions[keyKpiGroupId]
    const departementsLabels = [
      {
        ifQuery: [{ field: 'datasetid', val: 'departements' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: `departements-${groupId}-raw`,
        fromDatasetKey: 'dep',
        fromDatasetField: 'value',
        targetSpecialStoreId: 'value'
      },
      {
        ifQuery: [{ field: 'datasetid', val: 'departements' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: `departements-${groupId}-raw`,
        fromDatasetKey: 'dep',
        fromDatasetField: undefined,
        targetSpecialStoreId: 'focusObject'
      }
    ]
    return departementsLabels
  },
  setFallbackDepartement: (kpiGroupOptions, raw = false) => {
    const groupId = raw ? kpiGroupOptions : kpiGroupOptions[keyKpiGroupId] // FALLBACK IF DEPARTEMENT IN URL AND NO DEPARTEMENT DATA
    const depToRegionSwitch = {
      fromQueryKey: 'dep',
      fromStoreData: 'initData',
      fromDatasetId: 'taxo-departements',
      fromDatasetKey: 'dep',
      targetPropKey: 'reg'
    }
    const fallbackConditions = [
      // target : focusObject
      {
        ifQuery: [{ field: 'datasetid', val: 'departements' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: `departements-${groupId}-raw`,
        fromDatasetKey: 'dep',
        fromDatasetField: undefined,

        fallback: true,
        fallbackSwitch: depToRegionSwitch,
        fallbackFromStoreData: 'initData',
        fallbackFromDatasetId: `regions-${groupId}-raw`,
        fallbackFromDatasetKey: 'reg',
        fallbackFromDatasetField: undefined,

        targetSpecialStoreId: 'focusObject'
      },
      // target : value
      {
        ifQuery: [{ field: 'datasetid', val: 'departements' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: `departements-${groupId}-raw`,
        fromDatasetKey: 'dep',
        fromDatasetField: 'value',

        fallback: true,
        fallbackSwitch: depToRegionSwitch,
        fallbackFromStoreData: 'initData',
        fallbackFromDatasetId: `regions-${groupId}-raw`,
        fallbackFromDatasetKey: 'reg',
        fallbackFromDatasetField: 'value',

        targetSpecialStoreId: 'value'
      },
      // target : libelle
      {
        ifQuery: [{ field: 'datasetid', val: 'departements' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: 'taxo-departements',
        fromDatasetKey: 'dep',
        fromDatasetField: 'libelle',

        fallback: true,
        fallbackSwitch: depToRegionSwitch,
        fallbackFromStoreData: 'initData',
        fallbackFromDatasetId: 'taxo-regions',
        fallbackFromDatasetKey: 'reg',
        fallbackFromDatasetField: 'libelle',

        targetSpecialStoreId: 'levelname',
        fallbackAddOn: COMMON_FUNCTIONS.updateUrlPathRegions
      },
      // target : level
      {
        ifQuery: [{ field: 'datasetid', val: 'departements' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: 'taxo-departements',
        fromDatasetKey: 'dep',
        fromDatasetField: 'dep',

        fallback: true,
        fallbackSwitch: depToRegionSwitch,
        fallbackFromStoreData: 'initData',
        fallbackFromDatasetId: 'taxo-regions',
        fallbackFromDatasetKey: 'reg',
        fallbackFromDatasetField: 'reg',

        targetSpecialStoreId: 'level'
      },
      // target : gender
      {
        ifQuery: [{ field: 'datasetid', val: 'departements' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: 'taxo-departements',
        fromDatasetKey: 'dep',
        fromDatasetField: 'pre',

        fallback: true,
        fallbackSwitch: depToRegionSwitch,
        fallbackFromStoreData: 'initData',
        fallbackFromDatasetId: 'taxo-regions',
        fallbackFromDatasetKey: 'reg',
        fallbackFromDatasetField: 'pre',

        targetSpecialStoreId: 'gender'
      },
      // target : levelcode
      {
        ifQuery: [{ field: 'datasetid', val: 'departements' }],
        fromQueryKey: 'code',
        fromStoreData: 'initData',
        fromDatasetId: `departements-${groupId}-raw`,
        fromDatasetKey: 'dep',
        fromDatasetField: undefined,

        fallback: true,
        fallbackSwitch: depToRegionSwitch,
        fallbackFromQueryKey: undefined,
        fallbackFromStoreData: 'raw',
        targetSpecialStoreId: 'levelcode',

        rawValue: 'regional'
      }
    ]
    return fallbackConditions
  }
}
const COMMON_URL_FOCUS_TEMPLATES = {
  mapFocus: (kpiGroupOptions) => {
    // console.log( '\n>>> appConfigRoutes.js (start) / mapFocus / kpiGroupOptions[keyKpiGroupName] : ', kpiGroupOptions[keyKpiGroupName] )
    const needFallbackArray = kpiGroupOptions[keyKpiGroupKpis].map(kpi => kpi[keyKpiMapHasDepartement])
    // console.log( '>>> appConfigRoutes.js (start) / mapFocus / needFallbackArray : ', needFallbackArray )
    const needFallBack = needFallbackArray.some(v => v === false)
    // console.log( '>>> appConfigRoutes.js (start) / mapFocus / needFallBack : ', needFallBack )
    const urlFocus = {
      urlArgs: [
        ...COMMONN_URL_ARGS.objectArgs,
        ...COMMONN_URL_ARGS.mapArgs
      ],
      functions: [
        {
          funcName: 'updateDataStore',
          help: 'set store/data/specialStore',
          funcParams: {
            targets: [
              COMMON_TARGETS.setLibelleRegion,
              COMMON_TARGETS.setRegionsGender,
              COMMON_TARGETS.setLevelCode('regional'),
              ...COMMON_TARGETS_TEMPLATES.setLabelRegion(kpiGroupOptions)
              // COMMON_TARGETS.setDepartementsGender, //
              // COMMON_TARGETS.setLevelCode('departemental'), //
              // COMMON_TARGETS.setLibelleDepartement, //
              // ...COMMON_TARGETS_TEMPLATES.setLabelDepartement(kpiGroupOptions), //
            ]
          }
        },
        {
          funcName: 'goToPolygon',
          help: 'set map zoom',
          funcParams: {
            targets: [
              COMMON_TARGETS.setMapZoomRegions,
              COMMON_TARGETS.setMapZoomByCenter,
              COMMON_TARGETS.setMapZoomDepartements
            ]
          }
        },
        {
          funcName: 'toggleSelected',
          help: 'set selected polygon on map',
          funcParams: {
            targets: [
              COMMON_TARGETS.setSelectedPolygons
            ]
          }
        }
      ]
    }
    const targetsDepartements = [
      COMMON_TARGETS.setLibelleDepartement,
      COMMON_TARGETS.setDepartementsLevel,
      COMMON_TARGETS.setDepartementsGender,
      COMMON_TARGETS.setLevelCode('departemental'),
      ...COMMON_TARGETS_TEMPLATES.setLabelDepartement(kpiGroupOptions)
    ]
    const targetsRegionsFallback = [
      ...COMMON_TARGETS_TEMPLATES.setFallbackDepartement(kpiGroupOptions)
    ]
    if (!needFallBack) {
      // update targets if dataset contains departements level
      urlFocus.functions[0].funcParams.targets.push(...targetsDepartements)
    } else {
      // update targets if dataset DOES NOT contain departements level => need fallback
      urlFocus.functions[0].funcParams.targets.push(...targetsRegionsFallback)
    }
    return urlFocus
  }
}
const COMMON_TEMPLATES = {
  mapRoute: (kpiFamilyOptions, kpiGroupOptions) => {
    const route = {
      id: `${kpiGroupOptions[keyKpiGroupId]}`,
      kpiFamilyId: `${kpiFamilyOptions.kpiFamilyId}`,
      kpiGroupId: `${kpiGroupOptions[keyKpiGroupId]}`,
      name: `${kpiGroupOptions[keyKpiGroupName]} page`,
      help: `route view for ${kpiGroupOptions[keyKpiGroupName]} dataset`,
      title: { fr: '' },
      titleI18n: `routes.${kpiGroupOptions[keyKpiGroupId]}.title`,
      urls: kpiGroupOptions[keyKpiGroupUrls],
      sourcesIds: [
        `national-${kpiGroupOptions[keyKpiGroupId]}-raw`,
        `regions-${kpiGroupOptions[keyKpiGroupId]}-raw`,
        `departements-${kpiGroupOptions[keyKpiGroupId]}-raw`
      ],
      rawHtml: undefined,
      navbarFooter: {
        activated: false,
        settings: {
          id: 'navbar-footer-01'
        }
      },
      forceHeightIfIframe: false,
      forceFullHeightMobile: true,
      pageRows: [
        {
          id: `row1-${kpiGroupOptions[keyKpiGroupId]}`,
          rowNumber: 1,
          activated: true,
          help: '',
          columns: [

            // KPI GROUP COLUMN INFOS + CHARTS
            {
              id: 'col1',
              colName: 'Numbers and tables',
              activated: true,
              // colClass: 'col-12 col-sm-12 col-md-6 col-lg-5 col-xl-4',
              colClass: '',
              colSizes: { xs: 12, sm: 12, md: 6, lg: 5, xl: 4 },
              colAddPadding: true,
              hasScrollbar: true,
              smallScreenVerticalOrder: undefined,
              colRows: [

                // KPI GROUP COMMON COMPONENTS
                {
                  component: 'returnBtn',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'left',
                  align: 'center',
                  settings: {
                    id: `returnBtn-${kpiGroupOptions[keyKpiGroupId]}`,
                    forceShow: true,
                    defaultUrl: '/par-territoire/',
                    returnBtnTxt: {
                      fr: "Voir l'ensemble des politiques prioritaires"
                    },
                    containerClass: 'mt-5 mx-0 pb-0 px-0',
                    containerClassMobile: 'mt-0 mx-0 pb-0 px-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'text',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'left',
                  align: 'center',
                  settings: {
                    id: `text-${kpiGroupOptions[keyKpiGroupId]}-title`,
                    forceShow: true,
                    containerClass: 'mx-5 pt-2 pb-0 px-0',
                    containerClassMobile: 'mx-1 mt-0 pt-0 pb-0 px-0',
                    mobileIsVisibleDefault: true,
                    mobileShowMore: false,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'globalButtons',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'center',
                  align: 'center',
                  settings: {
                    id: 'back-detail-button-simple-territoires',
                    containerClass: 'ml-0 pl-3 py-0 mb-5',
                    containerClassMobile: 'py-0 my-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'globalButtons',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'left',
                  align: 'center',
                  settings: {
                    id: `global-button-${kpiGroupOptions[keyKpiGroupId]}`,
                    containerClass: 'mx-5 pa-0',
                    containerClassMobile: 'mx-1 pa-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'text',
                  activated: true,
                  textBrief: kpiGroupOptions[keyKpiGroupTextBrief],
                  smallScreenVerticalOrder: 1,
                  justify: 'left',
                  align: 'center',
                  settings: {
                    id: `text-${kpiGroupOptions[keyKpiGroupId]}-resume`,
                    containerClass: 'mx-5 px-0',
                    containerClassMobile: 'mx-4 px-0 pb-0',
                    // asDrawer: true,
                    // drawerTitle: { fr: "En savoir plus sur l'indicateur" },
                    mobileIsVisibleDefault: true,
                    mobileShowMore: false,
                    desktopIsVisibleDefault: true
                  }
                },
                // {
                //   component: 'globalButtons',
                //   activated: true,
                //   smallScreenVerticalOrder: 1,
                //   justify: 'center',
                //   align: 'center',
                //   settings: {
                //     id: `discover-button-${kpiGroupOptions[keyKpiGroupId]}`,
                //     containerClass: 'py-0 my-0',
                //     containerClassMobile: 'pl-1 my-0',
                //     mobileIsVisibleDefault: false,
                //     desktopIsVisibleDefault: true
                //   }
                // },

                // KPI GROUP'S KPI COMPONENTS
                ...COMMON_KPI_COMPONENTS.components(kpiFamilyOptions, kpiGroupOptions, false), // true => addCharts to map routes
                // ...COMMON_KPI_COMPONENTS.components(kpiFamilyOptions, kpiGroupOptions, true),

                {
                  component: 'infoBox',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'left',
                  align: 'center',
                  settings: {
                    id: `infoBox-${kpiGroupOptions[keyKpiGroupId]}`,
                    title: { fr: 'Bénéficier de cette mesure' },
                    text: { fr: kpiGroupOptions[keyKpiGroupExtLinkTxt] },
                    // link: `/par-territoire/?kpifamilies=${kpiFamilyOptions.kpiFamilyId}`,
                    link: kpiGroupOptions[keyKpiGroupExtLink],
                    linkExt: true,
                    image: kpiFamilyOptions.kpiFamilyImage,
                    containerClass: 'mx-5 pa-0',
                    containerClassMobile: 'mx-1 px-0 pt-0',
                    mobileIsVisibleDefault: false,
                    desktopIsVisibleDefault: true
                  }
                },

                // KPI GROUP'S KPI LAST COMPONENTS
                // COMMON_BUTTONS.toTerritoires,
                COMMON_TEXTS.bottomEmptyBlock,
                COMMON_TEXTS.bottomEmptyBlock
              ]
            },

            // KPI GROUP COLUMN MAP
            {
              id: 'col2',
              colName: `main map for ${kpiGroupOptions[keyKpiGroupId]}`,
              activated: true,
              // colClass: 'col-12 col-sm-12 col-md-6 col-lg-7 col-xl-8 pa-0 no-max-width',
              colClass: 'pa-0 no-max-width',
              colSizes: { xs: 12, sm: 12, md: 6, lg: 7, xl: 8 },
              colAddPadding: false,
              hasScrollbar: false,
              forceFullHeigth: true,
              smallScreenVerticalOrder: undefined,
              colRows: [
                {
                  component: 'map',
                  activated: true,
                  smallScreenVerticalOrder: 2,
                  justify: 'center',
                  align: 'center',
                  settings: {
                    id: `map-france-${kpiGroupOptions[keyKpiGroupId]}-metro`,
                    forceMobileSettings: true,
                    mobileHeight: 400,
                    mobileOrder: 3,
                    containerClass: 'pb-0',
                    containerClassMobile: 'pb-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                }
              ]
            }
          ]
        },

        {
          id: `row2-${kpiGroupOptions[keyKpiGroupId]}`,
          rowNumber: 2,
          activated: false,
          help: '',
          columns: [
            {
              id: 'col1',
              colName: 'text',
              activated: true,
              colClass: '',
              colSizes: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
              hasScrollbar: false,
              smallScreenVerticalOrder: undefined,
              colRows: [
                {
                  component: 'text',
                  activated: true,
                  smallScreenVerticalOrder: undefined,
                  justify: 'center',
                  align: 'center',
                  settings: {
                    id: 'text-03',
                    containerClass: 'mb-4',
                    containerClassMobile: 'mb-4',
                    mobileIsVisibleDefault: false,
                    desktopIsVisibleDefault: false
                  }
                }
              ]
            }
          ]
        }
      ],

      setUpRouteViews: COMMON_URL_FOCUS_TEMPLATES.mapFocus(kpiGroupOptions)
    }

    if (kpiGroupOptions[keyKpiGroupImageActivate]) {
      const imageText = {
        component: 'text',
        activated: true,
        smallScreenVerticalOrder: 1,
        justify: 'center',
        align: 'center',
        settings: {
          id: `text-${kpiGroupOptions[keyKpiGroupId]}-image`,
          containerClass: 'py-2',
          containerClassMobile: 'py-2',
          mobileIsVisibleDefault: false,
          desktopIsVisibleDefault: true
        }
      }
      route.pageRows[0].columns[0].colRows.splice(3, 0, imageText)
    }
    return route
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON FUNCTIONS

const buildRoute = (kpiFamilyOptions, kpiGroupOptions, template) => {
  const route = COMMON_TEMPLATES[template](kpiFamilyOptions, kpiGroupOptions)
  return route
}

const builtRoutes = []
for (const kpiFamilyOptions of dataStructure) {
  for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
    const route = buildRoute(kpiFamilyOptions, kpiGroupOptions, 'mapRoute')
    builtRoutes.push(route)
  }
}
// console.log( '>>> appConfigRoutes.js (start) / builtRoutes : ', builtRoutes )
// console.log( '>>> appConfigRoutes.js (start) / builtRoutes : ', builtRoutes.slice(0, 2) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN ROUTE COMPONENT SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppRoutes = {
  help: 'this file contains the setup for the routes',

  // ROUTES / PAGES

  routes: [

    // ////////////////////////////////////////////////////////////////
    // >>> ALL ROUTES
    // ////////////////////////////////////////////////////////////////

    ...builtRoutes,

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // >>> AXIS : PAR TERRITOIRE
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    {
      id: 'kpi-territoires-national',
      name: 'kpi-territoires-national',
      help: 'route for rawData view',
      title: { fr: '' },
      titleI18n: 'routes.rawData.title',
      urls: ['/', '/par-territoire', '/par-territoire/'],
      sourcesIds: [
        'national-territoires-raw',
        'regions-territoires-raw',
        'departements-territoires-raw'
      ],
      // noRouteTabs: true,
      rawHtml: undefined,
      navbarFooter: {
        activated: false,
        settings: {
          id: 'navbar-footer-01',
          containerClass: '',
          containerClassMobile: '',
          mobileIsVisibleDefault: true,
          desktopIsVisibleDefault: true
        }
      },
      forceHeightIfIframe: true,
      pageRows: [
        {
          id: 'row1',
          rowNumber: 1,
          activated: true,
          help: '',
          columns: [
            {
              id: 'col1',
              colName: 'kpi data territoires - selectors',
              activated: true,
              // colClass: 'col-sm-10 col-md-4 col-lg-3 col-xl-3 mt-3 pt-0 px-3',
              colClass: 'mt-3 pt-0 px-3',
              colSizes: { xs: 12, sm: 10, md: 4, lg: 3, xl: 3 },
              colAddPadding: false,
              hasScrollbar: false,
              smallScreenVerticalOrder: undefined,
              colRows: [
                // COMMON_TEXTS.bottomEmptyBlock,
                // {
                //   component: 'text',
                //   activated: true,
                //   smallScreenVerticalOrder: 1,
                //   justify: 'left',
                //   align: 'center',
                //   settings: {
                //     id: 'text-territoires-title',
                //     forceShow: true,
                //     containerClass: 'mt-0 mb-0 pt-4 pb-4 pb-0',
                //     containerClassMobile: 'mt-0 mb-0 py-0 pb-0',
                //     mobileIsVisibleDefault: true,
                //     desktopIsVisibleDefault: true
                //   }
                // },
                {
                  component: 'text',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  textBrief: true,
                  justify: 'left',
                  align: 'center',
                  settings: {
                    id: 'text-territoires-header-localization',
                    forceShow: true,
                    containerClass: 'ml-5 mt-0 mb-0 pt-0 pb-0',
                    containerClassMobile: 'mt-0 mb-0 py-0 pb-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'globalButtons',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'left',
                  align: 'center',
                  settings: {
                    id: 'global-button-search-territoires',
                    containerClass: 'py-0 my-0',
                    containerClassMobile: 'py-0 my-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'globalButtons',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'center',
                  align: 'center',
                  settings: {
                    id: 'global-button-simple-territoires',
                    containerClass: 'py-0 mt-0 mb-5',
                    containerClassMobile: 'py-0 mt-0 mb-3',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'globalButtons',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'center',
                  align: 'center',
                  settings: {
                    id: 'actu-button-simple-territoires',
                    containerClass: 'ml-5 pl-3 py-0 mb-5',
                    containerClassMobile: 'py-0 my-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'text',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  textBrief: true,
                  justify: 'left',
                  align: 'center',
                  settings: {
                    id: 'text-territoires-header-thema',
                    forceShow: true,
                    containerClass: 'ml-5 mt-0 mb-0 pt-0 pb-0 pb-0',
                    containerClassMobile: 'mt-0 mb-0 py-0 pb-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                {
                  component: 'globalButtons',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'center',
                  align: 'center',
                  settings: {
                    id: 'global-button-tabs-territoires',
                    containerClass: 'py-0 my-0',
                    containerClassMobile: 'py-0 my-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                }
              ]
            },
            {
              id: 'col2',
              colName: 'kpi data territoires - data',
              activated: true,
              // colClass: 'col-sm-10 col-md-8 col-lg-9 col-xl-9 mt-0 pt-0',
              colClass: 'mt-0 pt-0',
              colSizes: { xs: 12, sm: 10, md: 8, lg: 9, xl: 9 },
              colAddPadding: false,
              hasScrollbar: false,
              smallScreenVerticalOrder: undefined,
              colRows: [
                // COMMON_TEXTS.bottomEmptyBlock,
                {
                  component: 'kpiTable',
                  activated: true,
                  smallScreenVerticalOrder: 1,
                  justify: 'center',
                  align: 'center',
                  settings: {
                    id: 'kpi-territoires',
                    containerClass: 'py-0',
                    containerClassMobile: 'py-0',
                    mobileIsVisibleDefault: true,
                    desktopIsVisibleDefault: true
                  }
                },
                COMMON_TEXTS.bottomEmptyBlock
              ]
            }
          ]
        }
      ],
      setUpRouteViews: COMMON_URL_FOCUS.setFocusObjectsParTerritoire({})
    }

    // ============================================================= //
    // ============================================================= //
    // ============================================================= //

    // // ONLY RAW DATA
    // { id: 'raw-territoires-national',
    //   name: 'raw-territoires-national',
    //   help: 'route for rawData view',
    //   title: { fr: '' },
    //   titleI18n: 'routes.rawData.title',
    //   urls: ['/raw-territoires-national'],
    //   sourcesIds: [
    //     'national-territoires-raw',
    //     'regions-territoires-raw',
    //     'departements-territoires-raw',
    //   ],
    //   rawHtml: undefined,
    //   navbarFooter: {
    //     activated: true,
    //     settings: {
    //       id: 'navbar-footer-01',
    //       containerClass: '',
    //       containerClassMobile: '',
    //       mobileIsVisibleDefault: true,
    //       desktopIsVisibleDefault: true
    //     }
    //   },
    //   pageRows: [
    //     {
    //       id: 'row1',
    //       rowNumber: 1,
    //       activated: true,
    //       help: '',
    //       columns: [
    //         {
    //           id: 'col1',
    //           colName: 'Raw data territoires',
    //           activated: true,
    //           colClass: 'col-12',
    //           hasScrollbar: true,
    //           smallScreenVerticalOrder: undefined,
    //           colRows: [
    //             {
    //               component: 'rawData',
    //               activated: true,
    //               smallScreenVerticalOrder: 1,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'raw-data-territoires-national',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },

    // // ONLY MAP
    // { id: 'map',
    //   name: 'map',
    //   help: 'route map viewfor ',
    //   title: { fr: '' },
    //   titleI18n: 'routes.map.title',
    //   urls: ['/map'],
    //   rawHtml: undefined,
    //   navbarFooter: {
    //     activated: true,
    //     settings: {
    //       id: 'navbar-footer-01'
    //     }
    //   },
    //   pageRows: [
    //     {
    //       id: 'row1',
    //       rowNumber: 1,
    //       activated: true,
    //       help: '',
    //       columns: [
    //         {
    //           id: 'col1',
    //           colName: 'map',
    //           activated: true,
    //           colClass: '',
    //           hasScrollbar: true,
    //           smallScreenVerticalOrder: undefined,
    //           colRows: [
    //             {
    //               component: 'text',
    //               activated: true,
    //               smallScreenVerticalOrder: undefined,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'text-01',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             },
    //             {
    //               component: 'globalButtons',
    //               activated: true,
    //               smallScreenVerticalOrder: 1,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'global-button-01',
    //                 containerClass: 'pt-0 mt-0',
    //                 containerClassMobile: 'pt-0 mt-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             },
    //             {
    //               component: 'numbers',
    //               activated: true,
    //               smallScreenVerticalOrder: undefined,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'numbers-01',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             },
    //             {
    //               component: 'map',
    //               activated: true,
    //               smallScreenVerticalOrder: undefined,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'map-france-metro',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },

    // // ONLY CHARTS
    // { id: 'charts',
    //   name: 'charts',
    //   help: 'route for charts view',
    //   title: { fr: '' },
    //   titleI18n: 'routes.charts.title',
    //   urls: ['/charts'],
    //   rawHtml: undefined,
    //   navbarFooter: {
    //     activated: true,
    //     settings: {
    //       id: 'navbar-footer-01'
    //     }
    //   },
    //   pageRows: [
    //     {
    //       id: 'row1',
    //       rowNumber: 1,
    //       activated: true,
    //       help: '',
    //       columns: [
    //         {
    //           id: 'col1',
    //           colName: 'chart',
    //           activated: true,
    //           colClass: '',
    //           hasScrollbar: true,
    //           smallScreenVerticalOrder: undefined,
    //           colRows: [
    //             {
    //               component: 'text',
    //               activated: true,
    //               smallScreenVerticalOrder: undefined,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'text-01',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             },
    //             {
    //               component: 'globalButtons',
    //               activated: true,
    //               smallScreenVerticalOrder: 1,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'global-button-01',
    //                 containerClass: 'pt-0 mt-0',
    //                 containerClassMobile: 'pt-0 mt-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             },
    //             {
    //               component: 'numbers',
    //               activated: true,
    //               smallScreenVerticalOrder: undefined,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'numbers-01',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             },
    //             {
    //               component: 'apexchart',
    //               activated: true,
    //               smallScreenVerticalOrder: undefined,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'apexchart-01',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             },
    //             {
    //               component: 'apexchart',
    //               activated: true,
    //               smallScreenVerticalOrder: 5,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'apexchart-01bis',
    //                 containerClass: 'mt-0 pt-3 pb-0',
    //                 containerClassMobile: 'mt-0 pt-3 pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             },
    //             {
    //               component: 'text',
    //               activated: true,
    //               smallScreenVerticalOrder: 1,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'text-02',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },

    // // ONLY TABLE
    // { id: 'table',
    //   name: 'table',
    //   help: 'route for table view',
    //   title: { fr: '' },
    //   titleI18n: 'routes.table.title',
    //   urls: ['/table'],
    //   rawHtml: undefined,
    //   navbarFooter: {
    //     activated: true,
    //     settings: {
    //       id: 'navbar-footer-01'
    //     }
    //   },
    //   pageRows: [
    //     {
    //       id: 'row1',
    //       rowNumber: 1,
    //       activated: true,
    //       help: '',
    //       columns: [
    //         {
    //           id: 'col1',
    //           colName: 'table',
    //           activated: true,
    //           colClass: '',
    //           hasScrollbar: false,
    //           smallScreenVerticalOrder: undefined,
    //           colRows: [
    //             {
    //               component: 'table',
    //               activated: true,
    //               smallScreenVerticalOrder: undefined,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'table-01',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },

    // // ONLY RAW DATA
    // { id: 'rawData',
    //   name: 'rawData',
    //   help: 'route for rawData view',
    //   title: { fr: '' },
    //   titleI18n: 'routes.rawData.title',
    //   urls: ['/rawData'],
    //   rawHtml: undefined,
    //   navbarFooter: {
    //     activated: true,
    //     settings: {
    //       id: 'navbar-footer-01',
    //       containerClass: '',
    //       containerClassMobile: '',
    //       mobileIsVisibleDefault: true,
    //       desktopIsVisibleDefault: true
    //     }
    //   },
    //   pageRows: [
    //     {
    //       id: 'row1',
    //       rowNumber: 1,
    //       activated: true,
    //       help: '',
    //       columns: [
    //         {
    //           id: 'col1',
    //           colName: 'rawData',
    //           activated: true,
    //           colClass: '',
    //           hasScrollbar: false,
    //           smallScreenVerticalOrder: undefined,
    //           colRows: [
    //             {
    //               component: 'rawData',
    //               activated: true,
    //               smallScreenVerticalOrder: undefined,
    //               justify: 'center',
    //               align: 'center',
    //               settings: {
    //                 id: 'raw-data-01',
    //                 containerClass: 'pb-0',
    //                 containerClassMobile: 'pb-0',
    //                 mobileIsVisibleDefault: true,
    //                 desktopIsVisibleDefault: true
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // }

  ]
}
