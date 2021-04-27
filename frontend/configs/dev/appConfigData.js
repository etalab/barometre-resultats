// const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,
  keyKpiGroupIdDataset,
  keyKpiGroupId,
  keyKpiGroupName
} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigGlobalData.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON CONSTANTS

// const DATASETS_REPO_BASE = 'https://raw.githubusercontent.com/etalab/dashboard-aides-entreprises/master/frontend/static/' // in repo folder

const DATASETS_FOLDER = '/datasets' // in static folder
const OVQ_FOLDER_NAME = 'ovq-data' // in static folder
const OVQ_PROD_FOLDER_NAME = 'prod' // in static folder ... /datasets/ovq-data/prod
// const OVQ_PROD_FOLDER_NAME = 'prod-raw' // in static folder

const COMMON_TEMPLATES = {
  staticSource: (kpiFamilyOptions, kpiGroupOptions) => {
    const sources = []
    for (const sourceId of kpiGroupOptions.odm_sources_ids) {
      const source = {
        id: `${sourceId.odm_source_id}`,
        levelcode: `${sourceId.odm_source_level}`,
        kpiFamilyId: kpiFamilyOptions.kpiFamilyId,
        kpiGroupIdDataset: kpiGroupOptions[keyKpiGroupIdDataset],
        // kpiGroupId: kpiGroupOptions[keyKpiGroupId],
        dataset: `${kpiGroupOptions[keyKpiGroupId]}`,
        help: `serie for ${kpiGroupOptions[keyKpiGroupName]} - level : ${sourceId.odm_source_level}`,
        from: 'static',
        url: `${sourceId.odm_source_file}`,
        backupUrl: `${sourceId.odm_source_file}`,
        displayed: sourceId.odm_source_display
        // copyTo: []
      }
      if (sourceId.odm_source_copy) {
        source.copyTo = [
          {
            fieldToCopy: undefined,
            from: { objectRef: 0 },
            help: 'copy to another dataset (id) in displayedData | initData',
            toSpecialStore: 'focusObject',
            format: undefined
          },
          {
            fieldToCopy: 'value',
            from: { objectRef: 0 },
            help: 'copy to another dataset (id) in displayedData | initData',
            toSpecialStore: 'value',
            format: undefined
          }
        ]
      }
      sources.push(source)
    }
    return sources
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON FUNCTIONS

const buildSources = (kpiFamilyOptions, kpiGroupOptions, template = 'staticSource') => {
  const sources = COMMON_TEMPLATES[template](kpiFamilyOptions, kpiGroupOptions)
  return sources
}

const builtSources = []
for (const kpiFamilyOptions of dataStructure) {
  for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
    const kpiGroupSources = buildSources(kpiFamilyOptions, kpiGroupOptions)
    builtSources.push(...kpiGroupSources)
  }
}
// console.log( '>>> appConfigData.js (start) / builtSources : ', builtSources )
// console.log( '>>> appConfigData.js (start) / builtSources : ', builtSources.slice(0, 3) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN DATA SOURCES SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppData = {
  help: 'this file contains the data setup for the app',

  // FILTERS
  filters: [
    {
      arg: 'departement',
      filterCode: 'DEP',
      filterType: 'checkbox',
      isActivated: true,
      name: {
        fr: 'départements'
      },
      populate: 'from_options', // "from_api"
      options: [
        { value: '0', label: { fr: 'dep_1' } },
        { value: '1', label: { fr: 'dep_2' } }
      ]
    }
  ],

  // DEFAULT SETUP
  defaultDataSetup: {
    initData: {
      help:
        "populate 'store.data.state.initData' @ middleware getIniitData.js / from : url | localFile",
      store: [
        // ============================================================= //
        // INFOS
        // ============================================================= //
        {
          id: 'infos',
          help: '',
          from: 'rawObject',
          rawObject: {
            numbers: {
              montant: undefined,
              nombre: undefined,
              effectifs: undefined,
              nafs: undefined
            },
            texts: {
              level: 'nat',
              levelname: 'France entière',
              levelcode: 'national',
              gender: 'fem'
            },
            focusObject: undefined,
            switchers: {
              level: 'nat',
              levelname: 'France entière',
              regional: 'échelle régionale',
              departement: 'échelle départementale'
            }
          },
          displayed: true,
          copyTo: [
            {
              fieldToCopy: 'level',
              from: { objectRef: 'texts' },
              help: 'copy to another dataset (id) in displayedData | initData',
              toSpecialStore: 'level',
              format: undefined
            },
            {
              fieldToCopy: 'levelname',
              from: { objectRef: 'texts' },
              help: 'copy to another dataset (id) in displayedData | initData',
              toSpecialStore: 'levelname',
              format: undefined
            },
            {
              fieldToCopy: 'levelcode',
              from: { objectRef: 'texts' },
              help: 'copy to another dataset (id) in displayedData | initData',
              toSpecialStore: 'levelcode',
              format: undefined
            },
            {
              fieldToCopy: 'gender',
              from: { objectRef: 'texts' },
              help: 'copy to another dataset (id) in displayedData | initData',
              toSpecialStore: 'gender',
              format: undefined
            }
          ]
        },

        // ============================================================= //
        // TAXONOMIES
        // ============================================================= //
        {
          id: 'taxo-regions',
          help: '',
          from: 'static',
          url: `${DATASETS_FOLDER}/prod/taxonomies/regions-minify.json`,
          backupUrl: `${DATASETS_FOLDER}/prod/taxonomies/regions.json`,
          displayed: false
        },
        {
          id: 'taxo-departements',
          help: '',
          from: 'static',
          url: `${DATASETS_FOLDER}/prod/taxonomies/departements-minify.json`,
          backupUrl: `${DATASETS_FOLDER}/prod/taxonomies/departements.json`,
          displayed: false
        },

        // ============================================================= //
        // CORRRESPONDANCES
        // ============================================================= //
        {
          id: 'taxo-prefectures-urls',
          help: '',
          from: 'static',
          format: 'csv',
          url: `${DATASETS_FOLDER}/prod/correspondances/OVQ-listing-sites-pref-pas-a-jour.csv`,
          backupUrl: `${DATASETS_FOLDER}/prod/correspondances/OVQ-listing-sites-pref-pas-a-jour.csv`,
          displayed: false
        },

        // ============================================================= //
        // GEOJSON (NO NEED EXCEPT CENTERS : SOURCES LOADED IN MAPBOX COMPONENT )
        // ============================================================= //
        {
          id: 'centers',
          help: 'geo centres national, régions et départements',
          from: 'static',
          url: `${DATASETS_FOLDER}/geodata/centers_corrected-minify.json`,
          backupUrl: `${DATASETS_FOLDER}/geodata/centers_corrected.json`,
          displayed: true
        }
      ]
    }
  },

  // SOURCE DATA FOR EVERY ROUTE
  routesData: {
    help: 'data sources not loaded at init but depending on routes',
    initData: {
      help: '',
      store: [

        // ////////////////////////////////////////////////////////////////
        // >>> ALL KPI DATA SOURCES
        // ////////////////////////////////////////////////////////////////

        ...builtSources,

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // >>> AXIS : PAR TERRITOIRE
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        {
          id: 'national-territoires-raw',
          dataset: 'territoires',
          help: 'serie chiffres territoires à la maille nationale',
          from: 'static',
          url: `${DATASETS_FOLDER}/${OVQ_FOLDER_NAME}/${OVQ_PROD_FOLDER_NAME}/par_territoire/territoire-national-global-light.json`,
          backupUrl: `${DATASETS_FOLDER}/${OVQ_FOLDER_NAME}/${OVQ_PROD_FOLDER_NAME}/par_territoire/territoire-national-global-light.json`,
          displayed: true,
          copyTo: [
            {
              fieldToCopy: undefined,
              from: { objectRef: 0 },
              help: 'copy to another dataset (id) in displayedData | initData',
              toSpecialStore: 'focusObject',
              format: undefined
            }
          ]
        },
        {
          id: 'regions-territoires-raw',
          dataset: 'territoires',
          help: 'serie chiffres territoires à la maille regionale',
          from: 'static',
          url: `${DATASETS_FOLDER}/${OVQ_FOLDER_NAME}/${OVQ_PROD_FOLDER_NAME}/par_territoire/territoire-regional-global-light.json`,
          backupUrl: `${DATASETS_FOLDER}/${OVQ_FOLDER_NAME}/${OVQ_PROD_FOLDER_NAME}/par_territoire/territoire-regional-global-light.json`,
          displayed: true
        },
        {
          id: 'departements-territoires-raw',
          dataset: 'territoires',
          help: 'serie chiffres territoires à la maille departementale',
          from: 'static',
          url: `${DATASETS_FOLDER}/${OVQ_FOLDER_NAME}/${OVQ_PROD_FOLDER_NAME}/par_territoire/territoire-departemental-global-light.json`,
          backupUrl: `${DATASETS_FOLDER}/${OVQ_FOLDER_NAME}/${OVQ_PROD_FOLDER_NAME}/par_territoire/territoire-departemental-global-light.json`,
          displayed: false
        }

      ]
    }
  }
}
