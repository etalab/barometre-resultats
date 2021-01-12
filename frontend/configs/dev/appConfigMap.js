// const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,
  keyKpiGroupId,
  keyKpiGroupName,
  keyKpiGroupKpis,
  keyKpiId,
  // keyKpiName,
  keyKpiMapIsDefault,
  keyKpiMapFillColor,
  // keyKpiMapHighlightColor,
  keyKpiMapOnlyNational,
  keyKpiMapHasRegion,
  keyKpiMapHasDepartement,
  keyKpiMapRegionMax,
  keyKpiMapDepartementMax,
  keyKpiMapLabel,
  keyKpiMapLegend,
  keyKpiMapLegendSubtitle
  // keyKpiMapDefaultLayer
} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigMaps.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON CONSTANTS

// switch between dataset batches
// const OVQ_PROD_FOLDER_NAME = 'prod' ==> isCumulated = true
// const OVQ_PROD_FOLDER_NAME = 'prod-raw' ==> isCumulated = false
// const isCumulated = true
// const isCumulated = false

// - - - - - - - - - - - - - - - - - - - - - //
// COMMON PAINT SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

// CONSTANTS

// switch between facts on region / departement level
const ZOOM_THRESHOLD = 5.3
const ZOOM_THRESHOLD_BIS = ZOOM_THRESHOLD - 0.1
const ZOOM_THRESHOLD_MAX = 9.5

// colors
// const FR_GOUV_BLUE = '#000091'
// const PRIMARYFILLCOLOR = '#7373FF'

// const SECONDARYFILLCOLOR = '#526781'
// const HIGHLIGHTCOLOR = '#572a99'
const SECONDARYFILLCOLOR = '#526781'
const HIGHLIGHTCOLOR = '#96ded1'

// const OPACITY_SELECTED_NATIONAL = 0.2
const OPACITY_SELECTED_REGIONS = 0.2
const OPACITY_SELECTED_DEPARTEMENTS = 0.4

// const FILLCOLOR_MAP = '#00AC8C'
const OUTLINECOLOR = '#627BC1'
const OUTLINECOLOR2 = '#6c87ab'

// const FILLCOLOR_COHESION = '#00BCD4'
// const FILLCOLOR_LOGEMENT = '#D66200'
// const FILLCOLOR_TRANSITION_ECOLOGIQUE = '#50B250'
// const FILLCOLOR_EMPLOI = '#7373FF'
// const FILLCOLOR_HANDICAP = '#C95DC9'
// const FILLCOLOR_EDUCATION = '#1E88E5'

// const FILLCOLOR_COHESION = FILLCOLOR_MAP
// const FILLCOLOR_LOGEMENT = FILLCOLOR_MAP
// const FILLCOLOR_TRANSITION_ECOLOGIQUE = FILLCOLOR_MAP
// const FILLCOLOR_EMPLOI = FILLCOLOR_MAP
// const FILLCOLOR_HANDICAP = FILLCOLOR_MAP
// const FILLCOLOR_EDUCATION = FILLCOLOR_MAP

// const FILLCOLOR_ = '#7373FF'

// layer fonts : ["Open Sans Regular","Arial Unicode MS Regular"]
// const fillPaintNational = {
//   'fill-color': [
//     'case',
//     ['boolean', ['feature-state', 'selected'], false],
//     HIGHLIGHTCOLOR,
//     SECONDARYFILLCOLOR
//   ],
//   'fill-outline-color': OUTLINECOLOR,
//   'fill-opacity': [
//     'case',
//     [
//       'boolean',
//       ['feature-state', 'selected'],
//       ['feature-state', 'hover'],
//       false
//     ],
//     OPACITY_SELECTED_NATIONAL,
//     0
//   ]
// }
const fillPaintRegions = {
  'fill-color': [
    'case',
    [
      'boolean', 
      ['feature-state', 'selected'], 
      false
    ],
    HIGHLIGHTCOLOR,
    SECONDARYFILLCOLOR
  ],
  'fill-outline-color': OUTLINECOLOR,
  'fill-opacity': [
    'case',
    [
      'any',
      [
        'boolean',
        ['feature-state', 'selected'],
        // ['feature-state', 'hover'],
        false
      ],
      [
        'boolean',
        // ['feature-state', 'selected'],
        ['feature-state', 'hover'],
        false
      ],
      false
    ],
    OPACITY_SELECTED_REGIONS,
    0
  ]
}
const fillPaintDepartements = {
  'fill-color': [
    'case',
    [
      'boolean',
      ['feature-state', 'selected'],
      false
    ],
    HIGHLIGHTCOLOR,
    SECONDARYFILLCOLOR
  ],
  'fill-outline-color': OUTLINECOLOR,
  'fill-opacity': [
    'case',
    [
      'any',
      [
        'boolean',
        ['feature-state', 'selected'],
        // ['feature-state', 'hover'],
        false
      ],
      [
        'boolean',
        // ['feature-state', 'selected'],
        ['feature-state', 'hover'],
        false
      ],
      false
    ],
    OPACITY_SELECTED_DEPARTEMENTS,
    0
  ]
}

const zoomRectifier = -0.29999999999999935051953056
const maxCircleRadius = 45
const minCircleRadius = 5

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON FUNCTIONS

function getRadius (val, maxVal) {
  const deltaRad = maxCircleRadius - minCircleRadius
  return (val * deltaRad / maxVal)
}

function getRadiusFull (val, maxVal) {
  return minCircleRadius + getRadius(val, maxVal)
}

function getRadiusFullSqrt (val, valMax) {
  return Math.sqrt(getRadiusFull(val, valMax))
}

function donutRadiusFormula (maxVal, valName = ['get', 'montantMillions']) {
  const fullRadius = [
    'sqrt',
    ['+',
      ['*',
        ['/',
          // ['number', ['get', valName]],
          ['number', valName],
          maxVal
        ],
        ['-',
          maxCircleRadius,
          minCircleRadius
        ]
      ],
      minCircleRadius
    ]
  ]
  return fullRadius
}

// main function to build circle properties for mapbox GL
function buildCirclePaint (maxReg, maxDep, fillColor, withReg = true, withDep = true, field = ['get', 'montantMillions'], opacity = 0.5) {
  let circlePaint
  const maxRadReg = getRadiusFullSqrt(maxReg, maxReg)
  const maxRadDep = getRadiusFullSqrt(maxDep, maxDep)

  if (withDep) {
    if (withReg) {
      // regional level and department level
      circlePaint = {
        'circle-opacity': opacity,
        'circle-color': fillColor,
        'circle-radius': [
          'step',
          ['zoom'],
          [
            'interpolate',
            ['linear'],
            donutRadiusFormula(maxReg, field),
            getRadiusFullSqrt(0, maxReg), minCircleRadius,
            maxRadReg,
            maxCircleRadius
          ],
          ZOOM_THRESHOLD + zoomRectifier, [
            'interpolate',
            ['linear'],
            donutRadiusFormula(maxDep, field),
            getRadiusFullSqrt(0, maxDep), minCircleRadius,
            maxRadDep,
            maxCircleRadius
          ]
        ]
      }
    } else {
      // department level only
      circlePaint = {
        'circle-opacity': opacity,
        'circle-color': fillColor,
        'circle-radius': [
          'interpolate',
          ['linear'],
          donutRadiusFormula(maxDep, field),
          getRadiusFullSqrt(0, maxDep), minCircleRadius,
          maxRadDep,
          maxCircleRadius
        ]
      }
    }
    // regional level and department level
    // circlePaint = {
    //   'circle-opacity': opacity,
    //   'circle-color': fillColor,
    //   'circle-radius': [
    //     'step',
    //     ['zoom'],
    //     [
    //       'interpolate',
    //       ['linear'],
    //       donutRadiusFormula(withReg ? maxReg : maxDep, field),
    //       getRadiusFullSqrt(0, withReg ? maxReg : maxDep), minCircleRadius,
    //       withReg ? maxRadReg : maxRadDep,
    //       maxCircleRadius
    //     ],
    //     ZOOM_THRESHOLD + zoomRectifier, [
    //       'interpolate',
    //       ['linear'],
    //       donutRadiusFormula(maxDep, field),
    //       getRadiusFullSqrt(0, maxDep), minCircleRadius,
    //       maxRadDep,
    //       maxCircleRadius
    //     ]
    //   ]
    // }
  } else {
    // regional level only
    circlePaint = {
      'circle-opacity': opacity,
      'circle-color': fillColor,
      'circle-radius': [
        'interpolate',
        ['linear'],
        donutRadiusFormula(maxReg, field),
        getRadiusFullSqrt(0, maxReg), minCircleRadius,
        maxRadReg,
        maxCircleRadius
      ]
    }
  }

  return circlePaint
}

// - - - - - - - - - - - - - - - - - - - - - //
// COMMON PROPERTIES SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

const commonProperties = [
  // {
  //   propName: 'montantMillions',
  //   itemField: 'value',
  //   needFormatting: true,
  //   format: [
  //     {
  //       utilsFnName: 'toMillionsOrElse',
  //       params: { divider: 1, fixed: 0 }
  //     }
  //   ]
  // },
  // {
  //   propName: 'value',
  //   itemField: 'value',
  //   needFormatting: true,
  //   format: [
  //     {
  //       utilsFnName: 'toFloat',
  //       params: undefined
  //     }
  //   ]
  // },
  {
    propName: 'values',
    itemField: 'values',
    needFormatting: false
  }
]

// - - - - - - - - - - - - - - - - - - - - - //
// COMMON FORMATTED TEXTS
// - - - - - - - - - - - - - - - - - - - - - //

const buildCommonLayout = (getField) => {
  const layoutCanvas = {
    'text-field':
    ['format',
      ['number-format',
        ['number', getField],
        {
          locale: 'fr-CA',
          'min-fraction-digits': 0,
          'max-fraction-digits': 0
        }
      ], {},
      '', { 'font-scale': 0.8 }
    ],
    'text-font': ['Open Sans Regular'],
    'text-size': 14
  }
  return layoutCanvas
}
// const COMMON_TEXTS = {
//   millions: {
//     'text-field':
//     // '{montantMillions} M€',
//     ['format',
//       ['number-format',
//         ['number', ['get', 'montantMillions']],
//         {
//           locale: 'fr-CA',
//           'min-fraction-digits': 0,
//           'max-fraction-digits': 0
//         }
//       ], {},
//       '', { 'font-scale': 0.8 }
//     ],
//     'text-font': ['Open Sans Regular'],
//     'text-size': 14
//   },
//   value: {
//     'text-field':
//     ['format',
//       ['number-format',
//         ['number', ['get', 'value']],
//         {
//           locale: 'fr-CA',
//           'min-fraction-digits': 0,
//           'max-fraction-digits': 0
//         }
//       ], {},
//       '', { 'font-scale': 0.8 }
//     ],
//     'text-font': ['Open Sans Regular'],
//     'text-size': 14
//   },
//   salaries: {
//     'text-field':
//     [
//       'format',
//       ['number-format',
//         ['number', ['get', 'nombreSalaries']],
//         {
//           locale: 'fr-CA'
//         }
//       ], {},
//       '\nsalariés', { 'font-scale': 0.8 }
//     ],
//     'text-font': ['Open Sans Regular'],
//     'text-size': 14
//   }
// }

// - - - - - - - - - - - - - - - - - - - - - //
// COMMON GEOJSON SOUURCES
// - - - - - - - - - - - - - - - - - - - - - //

const COMMON_SOURCES = {
  FranceRegions: {
    id: 'regions',
    help: 'geojson des contours des régions',
    from: 'url',
    url: '/datasets/geodata/regions-1000m.geojson', // local file in `/static` folder
    // url  : 'https://raw.githubusercontent.com/etalab/dashboard-aides-entreprises/master/static-data/geodata/regions-1000m.geojson',
    // url  : 'https://raw.githubusercontent.com/etalab/dashboard-aides-entreprises/master/frontend/datasets/geodata/regions-1000m.geojson',
    // url  : 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson',
    type: 'geojson',
    generateId: true,
    licence: 'open licence',
    loadInStore: true,
    popupSettings: true
  },
  FranceDepartements: {
    id: 'departements',
    help: 'geojson des contours des départements',
    from: 'url',
    url: '/datasets/geodata/departements-1000m.geojson',
    // url  : 'https://raw.githubusercontent.com/etalab/dashboard-aides-entreprises/master/static-data/geodata/departements-1000m.geojson',
    // url  : 'https://raw.githubusercontent.com/etalab/dashboard-aides-entreprises/j_front/frontend/datasets/geodata/departements-1000m.geojson',
    // url  : 'https://raw.githubusercontent.com/etalab/DVF-app/master/static/donneesgeo/departements-100m.geojson',
    // url  : 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson',
    type: 'geojson',
    generateId: true,
    licence: '',
    loadInStore: true,
    popupSettings: undefined
  }
}

// - - - - - - - - - - - - - - - - - - - - - //
// COMMON MAP CONFIGURATIONS ELEMENTS
// - - - - - - - - - - - - - - - - - - - - - //
// ADAPT TO MAPBOX-GL-JS OPTIONS

const COMMON_OPTIONS = {
  FranceMetro: {
    mapId: 'Metropole',
    mapName: 'Métropole',
    mapStyle: 'EtalabUrl',
    center: [46.2276, 2.2137],
    currentCenter: [46.2276, 2.2137],
    // bbox: [41.277, -5.317, 51.234, 9.689],
    zoom: 4.8,
    zoomMobile: 3.9,
    maxZoom: 9.5,
    minZoom: 2,
    noScroll: false
  },
  FranceGuadeloupe: {
    mapId: 'Guadeloupe',
    mapName: 'Guadeloupe',
    mapStyle: 'EtalabUrl',
    center: [16.279, -61.529],
    currentCenter: [16.279, -61.529],
    // bbox: [15.833, -61.81, 16.511, -61.003],
    zoom: 7.5,
    zoomMobile: 7.5,
    maxZoom: 8,
    minZoom: 2,
    noScroll: true
  },
  FranceGuyane: {
    mapId: 'Guyane',
    mapName: 'Guyane',
    mapStyle: 'EtalabUrl',
    center: [3.921, -53.097],
    currentCenter: [3.921, -53.097],
    // bbox: [2.111, -54.603, 5.751, -51.635],
    zoom: 4.9,
    zoomMobile: 4.9,
    maxZoom: 5.5,
    minZoom: 2,
    noScroll: true
  },
  FranceMartinique: {
    mapId: 'LaMartinique',
    mapName: 'La Martinique',
    mapStyle: 'EtalabUrl',
    center: [14.637, -61.02],
    currentCenter: [14.637, -61.02],
    // bbox: [-14.395, 61.229, 14.879, -60.811],
    zoom: 7.5,
    zoomMobile: 7.5,
    maxZoom: 8,
    minZoom: 2,
    noScroll: true
  },
  FranceMayotte: {
    mapId: 'Mayotte',
    mapName: 'Mayotte',
    mapStyle: 'EtalabUrl',
    center: [-12.821, 45.180],
    currentCenter: [-12.821, 45.180],
    // bbox: [-13, 45.018, -12.637, 45.298],
    zoom: 8.5,
    zoomMobile: 8.5,
    maxZoom: 9,
    minZoom: 2,
    noScroll: true
  },
  FranceReunion: {
    mapId: 'LaReunion',
    mapName: 'La Réunion',
    mapStyle: 'EtalabUrl',
    center: [-21.13, 55.527],
    currentCenter: [-21.13, 55.527],
    // bbox: [-21.389, 55.216, -20.872, 55.837],
    zoom: 7.3,
    zoomMobile: 7.3,
    maxZoom: 8,
    minZoom: 2,
    noScroll: true
  }
}
const COMMON_LAYERS = {

  FranceRegionsFill: {
    id: 'regions-fill',
    type: 'fill',
    source: 'regions',
    layout: {
      visibility: 'visible'
    },
    paint: fillPaintRegions
  },
  FranceRegionsLines: {
    id: 'regions-lines',
    type: 'line',
    source: 'regions',
    layout: {
      visibility: 'visible'
    },
    paint: {
      'line-color': OUTLINECOLOR,
      'line-width': 1
    }
  },

  FranceDepartementsFill: {
    id: 'departements-fill',
    type: 'fill',
    source: 'departements',
    layout: {
      // visibility: 'none' ,
    },
    paint: fillPaintDepartements,
    minzoom: ZOOM_THRESHOLD
  },
  FranceDepartementsLines: {
    id: 'departements-lines',
    type: 'line',
    source: 'departements',
    layout: {
      // visibility: 'none' ,
    },
    paint: {
      'line-color': OUTLINECOLOR2,
      'line-width': 1,
      // 'line-gap-width': 1,
      'line-dasharray': [2, 3]
    },
    minzoom: ZOOM_THRESHOLD
  },
  FranceDepartementsFillNoMinZoom: {
    id: 'departements-fill',
    type: 'fill',
    source: 'departements',
    layout: {
      // visibility: 'none' ,
    },
    paint: fillPaintDepartements
  },
  FranceDepartementsLinesNoMinZoom: {
    id: 'departements-lines',
    type: 'line',
    source: 'departements',
    layout: {
      // visibility: 'none' ,
    },
    paint: {
      'line-color': OUTLINECOLOR2,
      'line-width': 1,
      // 'line-gap-width': 1,
      'line-dasharray': [2, 3]
    }
  }
}
const COMMON_SIZES = {

  defaultSizes: {
    desktop: {
      maxHeight: undefined,
      maxHeightIframe: undefined
    },
    mobile: {
      maxHeight: undefined,
      maxHeightIframe: undefined
    }
  }

}
const COMMON_CLICK_EVENTS = {

  toggleSelectedOn: {
    funcName: 'toggleSelectedOn',
    help: 'toggle selected polygon as on',
    funcParams: {
      layersReset: ['regions-fill', 'departements-fill']
    }
  },
  goToPolygon: {
    funcName: 'goToPolygon',
    help: 'fly to polygon',
    funcParams: {
      layersReset: ['regions-fill', 'departements-fill'],
      zoomExceptions: ['Guyane', 'Martinique', 'Guadeloupe', 'La Réunion', 'Mayotte'],
      zoomExceptionsKey: 'nom',
      zoomRange: {
        minZoom: undefined,
        maxZoom: ZOOM_THRESHOLD
      },
      propName: 'code'
    }
  },
  goToPolygonPlus: {
    funcName: 'goToPolygon',
    help: 'fly to polygon with a slightly different zoom level',
    funcParams: {
      layersReset: ['regions-fill', 'departements-fill'],
      zoomExceptions: ['Guyane', 'Martinique', 'Guadeloupe', 'La Réunion', 'Mayotte'],
      zoomExceptionsKey: 'nom',
      zoomRange: {
        minZoom: undefined,
        maxZoom: ZOOM_THRESHOLD + 3
      },
      propName: 'code'
    }
  },
  toggleHighlightOn: {
    funcName: 'toggleHighlightOn',
    help: 'highlight polygon / geo element as on',
    funcParams: {
      // sourcesReset: ['regions', 'departements'],
      layersReset: ['regions-fill', 'departements-fill'],
    }
  },
  toggleHighlightOff: {
    funcName: 'toggleHighlightOff',
    help: 'highlight polygon / geo element as off',
    funcParams: {
      // sourcesReset: ['regions', 'departements'],
      layersReset: ['regions-fill', 'departements-fill']
    }
  },
  updateUrlPathRegions: (kpiGroupOptions, addDepartementMap = false) => {
    const updateUrlPath = {
      funcName: 'updateUrlPath',
      help: 'update url path without reloading page for constant focus object from dataset to dataset',
      funcParams: {
        zoomRange: {
          minZoom: undefined,
          maxZoom: addDepartementMap ? ZOOM_THRESHOLD_BIS : ZOOM_THRESHOLD_MAX
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
    return updateUrlPath
  },
  updateUrlPathDepartements: (kpiGroupOptions) => {
    const updateUrlPath = {
      funcName: 'updateUrlPath',
      help: 'update url path without reloading page for constant focus object from dataset to dataset',
      funcParams: {
        zoomRange: {
          minZoom: ZOOM_THRESHOLD_BIS,
          maxZoom: undefined
        },
        propName: 'code',
        targets: [
          {
            from: 'prop',
            urlArgs: {
              datasetid: 'departements',
              field: 'code',
              value: 'prop',
              highlight: undefined
            }
          }
        ]
      }
    }
    return updateUrlPath
  },

  updateLevelCode: (levelcode) => {
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
const COMMON_TARGETS = {
  taxoRegions: {
    from: 'store',
    fromPropKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-regions',
    fromDatasetKey: 'reg',
    fromDatasetField: 'libelle',
    targetSpecialStoreId: 'levelname'
  },
  taxoRegionsGender: {
    from: 'store',
    fromPropKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-regions',
    fromDatasetKey: 'reg',
    fromDatasetField: 'pre',
    targetSpecialStoreId: 'gender'
  },
  taxoDepartements: {
    from: 'store',
    fromPropKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-departements',
    fromDatasetKey: 'dep',
    fromDatasetField: 'libelle',
    targetSpecialStoreId: 'levelname'
  },
  taxoDepartementsGender: {
    from: 'store',
    fromPropKey: 'code',
    fromStoreData: 'initData',
    fromDatasetId: 'taxo-departements',
    fromDatasetKey: 'dep',
    fromDatasetField: 'pre',
    targetSpecialStoreId: 'gender'
  }
}
const COMMON_MAP_BLOCKS = {
  DOM_TOM: [
    COMMON_OPTIONS.FranceGuadeloupe,
    COMMON_OPTIONS.FranceGuyane,
    COMMON_OPTIONS.FranceMartinique,
    COMMON_OPTIONS.FranceMayotte,
    COMMON_OPTIONS.FranceReunion
  ]
}

const buildSources = (kpiGroupOptions) => {
  const sources = []
  const kpiGroupId = kpiGroupOptions[keyKpiGroupId]

  for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
    const onlyNational = kpi[keyKpiMapOnlyNational]
    const hasRegion = kpi[keyKpiMapHasRegion]
    const hasDepartement = kpi[keyKpiMapHasDepartement]
    const kpiId = kpi[keyKpiId]

    // NATIONAL
    if (onlyNational) {
      // console.log('\nbuildSources / kpiGroupId : ', kpiGroupId)
      // console.log('buildSources / kpiId : ', kpiId)
      const nationalSource = {
        id: `national-${kpiGroupId}-${kpiId}`,
        help: `${kpiGroupId} au niveau national - as geojson from raw`,
        from: 'store',
        fromId: `national-${kpiGroupId}-raw`,
        type: 'geojson',
        debug: false,
        generateId: true,
        needTransform: true,
        transformTo: {
          srcKey: 'values', // look for => values.nb-dossiers-maprimerenov-valides.value
          geoCanvasId: 'centers',
          canvasKey: {
            keyIsFieldName: true,
            field: undefined,
            ignoreItem: true,
            canvasKeyPrefix: 'NAT',
            canvasKeySuffix: ''
          },
          properties: commonProperties,
          geometry: {
            type: 'Point'
          }
        },
        licence: ''
      }
      sources.push(nationalSource)
    }

    // REGIONAL
    if (hasRegion) {
      const regionsSource = {
        id: `regions-${kpiGroupId}-${kpiId}`,
        help: `${kpiGroupId} au niveau regional - as geojson from raw`,
        from: 'store',
        fromId: `regions-${kpiGroupId}-raw`,
        type: 'geojson',
        debug: false,
        generateId: true,
        needTransform: true,
        transformTo: {
          srcKey: 'reg',
          geoCanvasId: 'centers',
          canvasKey: {
            keyIsFieldName: true,
            field: undefined,
            canvasKeyPrefix: 'REG-',
            canvasKeySuffix: ''
          },
          properties: commonProperties,
          geometry: {
            type: 'Point'
          }
        },
        licence: ''
      }
      sources.push(regionsSource)
    }

    // DEPARTEMENTAL
    if (hasDepartement) {
      const departementSource = {
        id: `departements-${kpiGroupId}-${kpiId}`,
        help: `${kpiGroupId} au niveau départemental - as geojson from raw`,
        from: 'store',
        fromId: `departements-${kpiGroupId}-raw`,
        type: 'geojson',
        debug: false,
        generateId: false,
        needTransform: true,
        transformTo: {
          srcKey: 'dep',
          geoCanvasId: 'centers',
          canvasKey: {
            keyIsFieldName: true,
            field: undefined,
            canvasKeyPrefix: 'DEP-',
            canvasKeySuffix: ''
          },
          properties: commonProperties,
          geometry: {
            type: 'Point'
          }
        },
        licence: ''
      }
      sources.push(departementSource)
    }
  }
  return sources
}
const buildLegend = (kpiGroupOptions) => {
  const kpis = kpiGroupOptions[keyKpiGroupKpis]
  const defaultKpi = kpis.find(kpi => kpi[keyKpiMapIsDefault] === true)
  const legend = {
    activated: true,
    legend_title: {
      fr: defaultKpi[keyKpiMapLegend]
    },
    legend_subtitle: {
      fr: defaultKpi[keyKpiMapLegendSubtitle]
    }
  }
  return legend
}
const buildLayers = (kpiGroupOptions) => {
  const layers = []
  const kpiGroupId = kpiGroupOptions[keyKpiGroupId]

  // REGIONS
  const layersRegions = [
    COMMON_LAYERS.FranceRegionsFill,
    COMMON_LAYERS.FranceRegionsLines
  ]
  let hasRegionsFill = false

  // DEPARTEMENTS
  const layersDepartements = [
    COMMON_LAYERS.FranceDepartementsFill,
    COMMON_LAYERS.FranceDepartementsLines
  ]
  const layersDepartementsNoMinZoom = [
    COMMON_LAYERS.FranceDepartementsFillNoMinZoom,
    COMMON_LAYERS.FranceDepartementsLinesNoMinZoom
  ]
  let hasDepartementsFill = false

  for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
    const kpiId = kpi[keyKpiId]
    const isDefaultLayer = kpi[keyKpiMapIsDefault]
    const onlyNational = kpi[keyKpiMapOnlyNational]
    const hasRegion = kpi[keyKpiMapHasRegion]
    const hasDepartement = kpi[keyKpiMapHasDepartement]
    const maxRegion = kpi[keyKpiMapRegionMax]
    const maxDepartement = kpi[keyKpiMapDepartementMax]
    const fillColor = kpi[keyKpiMapFillColor]
    const getValFromProperties = ['get', 'value', ['get', kpiId, ['get', 'values']]]
    const circlePaint = buildCirclePaint(maxRegion, maxDepartement, fillColor, hasRegion, hasDepartement, getValFromProperties)

    // DEBUG
    // let debug = kpiGroups / hasDepartement : ', hasDepartement)

    // LAYERS NATIONAL
    if (onlyNational) {
      // debug && console.log('buildLayers => add layer => national ...')
      const nationalCircles = {
        id: `national-${kpiGroupId}-${kpiId}-circles`,
        type: 'circle',
        source: `national-${kpiGroupId}-${kpiId}`,
        layout: {
          visibility: isDefaultLayer ? 'visible' : 'none'
        },
        maxzoom: hasDepartement ? ZOOM_THRESHOLD : ZOOM_THRESHOLD_MAX,
        paint: circlePaint
      }
      const nationalTexts = {
        id: `national-${kpiGroupId}-${kpiId}-texts`,
        type: 'symbol',
        source: `national-${kpiGroupId}-${kpiId}`,
        layout: isDefaultLayer
          ? buildCommonLayout(getValFromProperties)
          : {
            visibility: 'none',
            ...buildCommonLayout(getValFromProperties)
          },
        maxzoom: hasDepartement ? ZOOM_THRESHOLD : ZOOM_THRESHOLD_MAX
      }
      layers.push(nationalCircles, nationalTexts)
    }

    // LAYERS REGIONS
    if (hasRegion) {
      // debug && console.log('buildLayers => add layer => regional ...')
      if (!hasRegionsFill) {
        layers.push(...layersRegions)
        hasRegionsFill = true
      }
      const regionCircles = {
        id: `regions-${kpiGroupId}-${kpiId}-circles`,
        type: 'circle',
        source: `regions-${kpiGroupId}-${kpiId}`,
        layout: {
          visibility: isDefaultLayer ? 'visible' : 'none'
        },
        maxzoom: hasDepartement ? ZOOM_THRESHOLD : ZOOM_THRESHOLD_MAX,
        paint: circlePaint
      }
      const regionTexts = {
        id: `regions-${kpiGroupId}-${kpiId}-texts`,
        type: 'symbol',
        source: `regions-${kpiGroupId}-${kpiId}`,
        layout: isDefaultLayer
          ? buildCommonLayout(getValFromProperties)
          : {
            visibility: 'none',
            ...buildCommonLayout(getValFromProperties)
          },
        maxzoom: hasDepartement ? ZOOM_THRESHOLD : ZOOM_THRESHOLD_MAX
      }
      layers.push(regionCircles, regionTexts)
    }

    // LAYERS DEPARTEMENTS
    if (hasDepartement) {
      // debug && console.log('buildLayers => add layer => departemental ...')
      if (!hasDepartementsFill) {
        if (!hasRegion && !onlyNational) {
          layers.push(...layersDepartementsNoMinZoom)
        } else {
          layers.push(...layersDepartements)
        }
        hasDepartementsFill = true
      }
      const departementCircles = {
        id: `departements-${kpiGroupId}-${kpiId}-circles`,
        type: 'circle',
        source: `departements-${kpiGroupId}-${kpiId}`,
        layout: {
          visibility: isDefaultLayer ? 'visible' : 'none'
        },
        paint: circlePaint,
        minzoom: onlyNational || hasRegion ? ZOOM_THRESHOLD : 0
      }
      const departementTexts = {
        id: `departements-${kpiGroupId}-${kpiId}-texts`,
        type: 'symbol',
        source: `departements-${kpiGroupId}-${kpiId}`,
        layout: isDefaultLayer
          ? buildCommonLayout(getValFromProperties)
          : {
            visibility: 'none',
            ...buildCommonLayout(getValFromProperties)
          },
        minzoom: onlyNational || hasRegion ? ZOOM_THRESHOLD : 0
      }
      layers.push(departementCircles, departementTexts)
    }
  }
  // console.log( '>>> appConfigMaps.js (start) / buildLayers / layers : ', layers )
  return layers
}
const buildMaps = (kpiGroupOptions) => {
  const maps = []
  const kpiGroupId = kpiGroupOptions[keyKpiGroupId]

  // debug
  // let debug = kpiGroupId === 'lunettes-auditifs-dentaires'

  const hasOnlyNational = []
  // const clickerOnlyNational = true

  // const hasRegionsFill = false
  // const hasDepartementsFill = false

  const hasRegion = []
  const hasDepartement = []
  for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
    hasOnlyNational.push(kpi[keyKpiMapOnlyNational])
    hasRegion.push(kpi[keyKpiMapHasRegion])
    hasDepartement.push(kpi[keyKpiMapHasDepartement])
  }
  // const addOnlyNationalMap = hasOnlyNational.every(b => b === true)
  const addRegionalMap = hasRegion.some(b => b === true)
  const addDepartementMap = hasDepartement.some(b => b === true)

  const regionMap = {
    id: `map-${kpiGroupId}-reg`,
    name: `Carte ${kpiGroupId} x région`,
    category: 'regional',
    properties: `${kpiGroupId}`,
    data: `${kpiGroupId}`,
    layers: [],
    clicEvents: []
  }

  // debug && console.log('buildMaps => addOnlyNationalMap : ', addOnlyNationalMap)
  // debug && console.log('buildMaps => addRegionalMap : ', addRegionalMap)
  // debug && console.log('buildMaps => addDepartementMap : ', addDepartementMap)
  // debug && console.log('buildMaps ...')

  // NATIONAL
  // debug && console.log('buildMaps => add maps => national ...')
  for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
    const kpiId = kpi[keyKpiId]
    const onlyNational = kpi[keyKpiMapOnlyNational]
    if (onlyNational) {
      regionMap.layers.push(`national-${kpiGroupId}-${kpiId}-circles`)
      regionMap.layers.push(`national-${kpiGroupId}-${kpiId}-texts`)
    }
  }

  // REGIONAL
  if (addRegionalMap) {
    // debug && console.log('buildMaps => add map => regional ...')
    const regionsClickEvents = [
      {
        event: 'click',
        layer: 'regions-fill',
        functions: [
          COMMON_CLICK_EVENTS.toggleSelectedOn,
          COMMON_CLICK_EVENTS.goToPolygonPlus,
          COMMON_CLICK_EVENTS.updateLevelCode('regional'),
          {
            funcName: 'updateDisplayedData',
            help: 'update several data (targets) from store',
            funcParams: {
              zoomRange: {
                minZoom: undefined,
                maxZoom: addDepartementMap ? ZOOM_THRESHOLD_BIS : ZOOM_THRESHOLD_MAX
              },
              propName: 'code',
              targets: [
                COMMON_TARGETS.taxoRegions,
                COMMON_TARGETS.taxoRegionsGender,
                {
                  from: 'store',
                  fromPropKey: 'code', // use props region code
                  fromStoreData: 'initData',
                  fromDatasetId: `regions-${kpiGroupId}-raw`,
                  fromDatasetKey: 'reg',
                  fromDatasetField: 'value',
                  targetSpecialStoreId: 'value'
                },
                {
                  from: 'store',
                  fromPropKey: 'code', // use props region code
                  fromStoreData: 'initData',
                  fromDatasetId: `regions-${kpiGroupId}-raw`,
                  fromDatasetKey: 'reg',
                  fromDatasetField: undefined,
                  targetSpecialStoreId: 'focusObject'
                }
              ]
            }
          },
          COMMON_CLICK_EVENTS.updateUrlPathRegions(kpiGroupOptions, addDepartementMap)
        ]
      },
      {
        event: 'mousemove',
        layer: 'regions-fill',
        functions: [
          COMMON_CLICK_EVENTS.toggleHighlightOn
        ]
      },
      {
        event: 'mouseleave',
        layer: 'regions-fill',
        functions: [
          COMMON_CLICK_EVENTS.toggleHighlightOff
        ]
      }
    ]
    regionMap.layers = [
      'regions-fill',
      'regions-lines'
    ]
    for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
      const hasRegion = kpi[keyKpiMapHasDepartement]
      if (hasRegion) {
        const kpiId = kpi[keyKpiId]
        regionMap.layers.push(`regions-${kpiGroupId}-${kpiId}-circles`)
        regionMap.layers.push(`regions-${kpiGroupId}-${kpiId}-texts`)
      }
    }
    maps.push(regionMap)
    regionMap.clicEvents = regionsClickEvents
  }

  // DEPARTEMENTAL
  if (addDepartementMap) {
    // debug && console.log('buildMaps => add maps => departemental ...')
    const departementMap = {
      id: `map-${kpiGroupId}-dep`,
      name: `Carte ${kpiGroupId} x departement`,
      category: 'departemental',
      properties: `${kpiGroupId}`,
      data: `${kpiGroupId}`,
      layers: [
        'departements-fill',
        'departements-lines'
      ],
      clicEvents: [
        {
          event: 'click',
          layer: 'departements-fill',
          functions: [
            COMMON_CLICK_EVENTS.toggleSelectedOn,
            COMMON_CLICK_EVENTS.updateLevelCode('departemental'),
            {
              funcName: 'updateDisplayedData',
              help: 'update several data (targets) from store',
              funcParams: {
                zoomRange: {
                  minZoom: ZOOM_THRESHOLD,
                  maxZoom: undefined
                },
                propName: 'code',
                targets: [
                  COMMON_TARGETS.taxoDepartements,
                  COMMON_TARGETS.taxoDepartementsGender,
                  {
                    from: 'store',
                    fromPropKey: 'code', // use props region code
                    fromStoreData: 'initData',
                    fromDatasetId: `departements-${kpiGroupId}-raw`,
                    fromDatasetKey: 'dep',
                    fromDatasetField: 'value',
                    targetSpecialStoreId: 'value'
                  },
                  {
                    from: 'store',
                    fromPropKey: 'code', // use props region code
                    fromStoreData: 'initData',
                    fromDatasetId: `departements-${kpiGroupId}-raw`,
                    fromDatasetKey: 'dep',
                    fromDatasetField: undefined,
                    targetSpecialStoreId: 'focusObject'
                  }
                ]
              }
            },
            COMMON_CLICK_EVENTS.updateUrlPathDepartements(kpiGroupOptions)
          ]
        },
        {
          event: 'mousemove',
          layer: 'departements-fill',
          functions: [
            COMMON_CLICK_EVENTS.toggleHighlightOn
          ]
        },
        {
          event: 'mouseleave',
          layer: 'departements-fill',
          functions: [
            COMMON_CLICK_EVENTS.toggleHighlightOff
          ]
        }
      ]
    }
    for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
      const hasDepartement = kpi[keyKpiMapHasDepartement]
      if (hasDepartement) {
        const kpiId = kpi[keyKpiId]
        departementMap.layers.push(`departements-${kpiGroupId}-${kpiId}-circles`)
        departementMap.layers.push(`departements-${kpiGroupId}-${kpiId}-texts`)
      }
    }
    maps.push(departementMap)
  }

  return maps
}
const buildLayersVisibility = (kpiGroupOptions) => {
  const kpiGroupId = kpiGroupOptions[keyKpiGroupId]
  const hasSeveralKpis = kpiGroupOptions[keyKpiGroupKpis].length > 1

  const layersVisibility = {
    title: { fr: 'Indicateurs' },
    btnClass: '',
    positionClass: 'legend-top-right',
    is_activated: hasSeveralKpis,
    is_drawer_open: false,
    layersIds_full_set: [],
    layers_switches: []
  }
  for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
    const kpiId = kpi[keyKpiId]
    const isDefaultLayer = kpi[keyKpiMapIsDefault]
    const onlyNational = kpi[keyKpiMapOnlyNational]
    const hasRegion = kpi[keyKpiMapHasRegion]
    const hasDepartement = kpi[keyKpiMapHasDepartement]
    const legend = kpi[keyKpiMapLegend]
    const legendSubtitle = kpi[keyKpiMapLegendSubtitle]
    const label = kpi[keyKpiMapLabel]

    // add to layersIds_full_set
    if (onlyNational) {
      layersVisibility.layersIds_full_set.push(`national-${kpiGroupId}-${kpiId}-circles`)
      layersVisibility.layersIds_full_set.push(`national-${kpiGroupId}-${kpiId}-texts`)
    }
    if (hasRegion) {
      layersVisibility.layersIds_full_set.push('regions-fill')
      layersVisibility.layersIds_full_set.push('regions-lines')
      layersVisibility.layersIds_full_set.push(`regions-${kpiGroupId}-${kpiId}-circles`)
      layersVisibility.layersIds_full_set.push(`regions-${kpiGroupId}-${kpiId}-texts`)
    }
    if (hasDepartement) {
      if (onlyNational && !hasRegion) {
        layersVisibility.layersIds_full_set.push('departements-lines')
        layersVisibility.layersIds_full_set.push('departements-fill')
      }
      layersVisibility.layersIds_full_set.push(`departements-${kpiGroupId}-${kpiId}-circles`)
      layersVisibility.layersIds_full_set.push(`departements-${kpiGroupId}-${kpiId}-texts`)
    }

    // add to layers_switches
    if (hasSeveralKpis) {
      const layerSwitch = {
        id: kpiId,
        layersIds: [],
        label: { fr: label },
        legend: {
          legend_subtitle: {
            fr: legendSubtitle
          },
          legend_title: {
            fr: legend
          }
        },
        default_visible: isDefaultLayer
      }
      // NATIONAL
      if (onlyNational) {
        layerSwitch.layersIds = [
          `national-${kpiGroupId}-${kpiId}-circles`,
          `national-${kpiGroupId}-${kpiId}-texts`
        ]
      }
      // REGIONAL
      if (hasRegion) {
        layerSwitch.layersIds = [
          'regions-fill',
          'regions-lines',
          `regions-${kpiGroupId}-${kpiId}-circles`,
          `regions-${kpiGroupId}-${kpiId}-texts`
        ]
      }
      // DEPARTEMENTTAL
      if (hasDepartement) {
        layerSwitch.layersIds.push(
          'departements-fill',
          'departements-lines',
          `departements-${kpiGroupId}-${kpiId}-circles`,
          `departements-${kpiGroupId}-${kpiId}-texts`
        )
      }
      layersVisibility.layers_switches.push(layerSwitch)
    }
  }
  return layersVisibility
}

const COMMON_TEMPLATES = {
  france: (kpiGroupOptions) => {
    const map = {
      id: `map-france-${kpiGroupOptions[keyKpiId]}-metro`,
      help: `map for France - kpi group : ${kpiGroupOptions[keyKpiGroupName]}`,
      isActivated: true,
      titleI18n: 'maps.map01.title',
      map_options: COMMON_OPTIONS.FranceMetro,
      map_blocks: COMMON_MAP_BLOCKS.DOM_TOM,
      sizes: COMMON_SIZES.defaultSizes,

      // - - - - - - - - - - - - - - - - - - //
      // SOURCES LOADED AT MAP LOADED
      // - - - - - - - - - - - - - - - - - - //
      sources: [
        COMMON_SOURCES.FranceRegions,
        COMMON_SOURCES.FranceDepartements,
        ...buildSources(kpiGroupOptions)
      ],

      legend: buildLegend(kpiGroupOptions),

      // - - - - - - - - - - - - - - - - - - //
      // LAYERS
      // - - - - - - - - - - - - - - - - - - //
      layers: [...buildLayers(kpiGroupOptions)],

      // - - - - - - - - - - - - - - - - - - //
      // MAPS
      // - - - - - - - - - - - - - - - - - - //
      maps: [...buildMaps(kpiGroupOptions)],

      // - - - - - - - - - - - - - - - - - - //
      // LAYERS VISIBILITY DRAWER
      // - - - - - - - - - - - - - - - - - - //
      layers_visibility: buildLayersVisibility(kpiGroupOptions),

      maps_visibility: {
        title: { fr: 'calques' },
        is_activated: false,
        is_drawer_open: true,
        map_switches: [
          {
            id: 'regions',
            mapId: `map-${kpiGroupOptions[keyKpiId]}-reg`,
            label: { fr: 'régions' },
            default_visible: true
          }
        ]
      }

    }
    return map
  }
}

const buildODMmap = (kpiGroupOptions, template) => {
  const map = COMMON_TEMPLATES[template](kpiGroupOptions)
  return map
}

const builtMaps = []
for (const kpiFamilyOptions of dataStructure) {
  for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
    const map = buildODMmap(kpiGroupOptions, 'france')
    builtMaps.push(map)
  }
}
// console.log( '>>> appConfigMaps.js (start) / builtMaps : ', builtMaps )
// console.log( '>>> appConfigMaps.js (start) / builtMaps : ', builtMaps.slice(0, 1) )
// console.log( '...' )
// console.log( '>>> appConfigMaps.js (start) / builtMaps FIRST - layers : ', builtMaps[0]['layers'] )
// console.log( '...' )
// console.log( '>>> appConfigMaps.js (start) / builtMaps LAST - layers : ', builtMaps[5]['layers'] )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN MAPBOX COMPONENT SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppMap = {
  help: 'this file contains the setup for the MapboxGL layout / component',

  // MAPS

  settingsIds: [

    // ////////////////////////////////////////////////////////////////
    // >>> ALL KPI MAPS
    // ////////////////////////////////////////////////////////////////

    ...builtMaps

  ]
}
