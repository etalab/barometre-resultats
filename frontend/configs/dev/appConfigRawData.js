const KEY_NOMBRE = 'value'
// const KEY_DATE = 'date'

const COMMON_FORMATTERS = {

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

export const configAppRawData = {
  help: 'this file contains the setup for the rawdata components',

  // RAW DATA

  settingsIds: [
    {
      id: 'raw-data-01',
      titleI18n: 'rawdatas.text01.title',
      help: 'Raw data - territoires niveau national'
    },

    {
      id: 'raw-data-territoires-national',
      titleI18n: 'rawdatas.text01.title',
      help: 'Raw data - territoires niveau national',

      chartTitleClass: 'subtitle-2 text-center',
      titlePreffixSpecialStoreId: undefined,
      titleSuffixSpecialStoreId: 'levelname',
      titleSuffixClass: 'accent--text',
      dividers: {
        before: false,
        after: false,
        afterHideOnMobile: true
      },
      datasetMappers: {
        specialStoreId: 'focusObject',
        fromDatasetKey: 'ovq',
        seriesMappers: [
          COMMON_SERIES_MAPPERS.basicSerie
        ],
        format: COMMON_FORMATTERS.integerEuropeanFormat
      }
    }

  ]
}
