// const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,
  keyKpiGroupIdDataset,
  keyKpiGroupId,
  keyKpiGroupName,
  keyKpiGroupKpis,
  keyKpiId,
  keyKpiName,
  // keyKpiChartType,
  keyKpiChartTemplate,
  keyKpiChartColors,
  // keyKpiChartXaxisType,
  keyKpiChartMarkerSize,
  // keyKpiChartSerieName,
  keyKpiChartTitle,
  keyKpiChartFormat,
  keyKpiChartUnit,
  keyKpiChartAnnotationActivate,
  keyKpiChartAnnotationKey,
  keyKpiChartYannotation,
  keyKpiChartYannotationText,
  keyKpiChartAnimate
} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigCharts.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
// console.log( '...' )

const apexLocales = require('../../locales/apexLocales.js')
// console.log('>>> appConfigCharts.js (start) / apexLocales : ', apexLocales)

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON CONSTANTS

const KEY_NOMBRE = 'value'
const KEY_DATE = 'date'

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
    },
    buildAxisCategsX: true,
    buildAxisCategsXsettings: {
      fromKey: KEY_DATE,
      capitalize: false
    }
  },
  basicNumber: {
    dataFromKey: KEY_NOMBRE,
    serieName: 'valeur',
    format: COMMON_FORMATTERS.toMillionsWithComma,
    buildAxisCategsX: true,
    buildAxisCategsOnlyYearAndMonth: true,
    buildAxisCategsXsettings: {
      fromKey: KEY_DATE,
      capitalize: false
    },
    buildLabels: true,
    buildLabelsSettings: {
      fromKey: KEY_DATE
    }
  }
}

const COMMON_CHART_SETTINGS = {
  xaxis_default: {
    tickAmount: 6,
    tickPlacement: 'on',
    labels: {
      show: true,
      rotate: -45,
      rotateAlways: true,
      hideOverlappingLabels: false,
      minHeight: 45,
      maxHeight: 60,
      style: {
        fontSize: '9px'
      }
    },
    crosshairs: {
      show: true,
      width: 1,
      position: 'front',
      opacity: 0.9,
      stroke: {
        color: '#b6b6b6',
        width: 1,
        dashArray: 1
      },
      fill: {
        type: 'solid',
        color: '#B1B9C4',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5
        }
      },
      dropShadow: {
        enabled: false,
        top: 0,
        left: 0,
        blur: 1,
        opacity: 0.4
      }
    },
    tooltip: {
      enabled: false
    }
  },
  xaxis_datetime: {
    type: 'datetime',
    // type: 'category',
    tickAmount: 6,
    tickPlacement: 'between',
    labels: {
      show: true,
      rotate: -25,
      rotateAlways: true,
      hideOverlappingLabels: true,
      minHeight: 45,
      maxHeight: 55,
      format: 'MMMM yyyy',
      style: {
        fontSize: '9px'
      }
    },
    // crosshairs: {
    //   show: true,
    //   width: 1,
    //   position: 'front',
    //   opacity: 0.9,
    //   stroke: {
    //     color: '#b6b6b6',
    //     width: 1,
    //     dashArray: 1,
    //   },
    //   fill: {
    //     type: 'solid',
    //     color: '#B1B9C4',
    //     gradient: {
    //         colorFrom: '#D8E3F0',
    //         colorTo: '#BED1E6',
    //         stops: [0, 100],
    //         opacityFrom: 0.4,
    //         opacityTo: 0.5,
    //     },
    //   },
    //   dropShadow: {
    //     enabled: false,
    //     top: 0,
    //     left: 0,
    //     blur: 1,
    //     opacity: 0.4,
    //   },
    // },
    tooltip: {
      enabled: false
    }
  }
}
const COMMON_CHART_OPTIONS = {
  categHorizH300: {
    chart: {
      type: 'line',
      height: '300px',
      width: '390px',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true // nerd-pride....
      }
    },
    theme: {
      mode: 'light'
    },

    dataLabels: {
      enabled: true
    },

    xaxis: {
      type: 'category',
      labels: {
        show: false,
        style: {
          fontSize: '9px'
        }
      }
    },

    responsive: [
      {
        breakpoint: 960,
        options: {
          chart: {
            // height: "370px",
            width: '350px'
          },
          xaxis: {
            type: 'numeric',
            labels: {
              show: false,
              style: {
                fontSize: '9px'
              }
            }
          }
        }
      }
    ]
  },
  categHorizH390: {
    chart: {
      type: 'line',
      height: '250px',
      width: '390px',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true // nerd-pride....
      }
    },
    theme: {
      mode: 'light'
    },

    dataLabels: {
      enabled: true
    },

    xaxis: {
      type: 'category',
      labels: {
        show: false,
        style: {
          fontSize: '9px'
        }
      }
    },

    responsive: [
      {
        breakpoint: 960,
        options: {
          chart: {
            // height: "370px",
            width: '350px'
          },
          xaxis: {
            type: 'numeric',
            labels: {
              show: false,
              style: {
                fontSize: '9px'
              }
            }
          }
        }
      }
    ]
  },

  categVertH390: {
    chart: {
      type: 'line',
      height: '250px',
      // width: '520px',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    legend: {
      show: false
    },
    theme: {
      mode: 'light'
    },
    // markers: {
    //   size: 4
    // },
    dataLabels: {
      enabled: false
    },

    // xaxis: { ...COMMON_CHART_SETTINGS.xaxis_datetime },
    xaxis: { ...COMMON_CHART_SETTINGS.xaxis_default },

    xyxis: {
      // type: 'category',
      labels: {
        show: false,
        style: {
          fontSize: '9px'
        }
      }
    },
    grid: {
      row: {
        colors: ['#f3f4f5', '#fff'],
        opacity: 1
      }
    },
    responsive: [
      {
        breakpoint: 960,
        options: {
          // chart: {
          //   // height: "370px",
          //   width: '350px'
          // },
          markers: { size: 4 },
          xaxis: {
            // type: 'datetime',
            labels: {
              show: true,
              // format: 'MMMM yyyy',
              style: {
                fontSize: '9px'
              }
            }
          }
        }
      }
    ]
  },
  categVertH390_histo: {
    chart: {
      type: 'bar',
      height: '250px',
      // width: '520px',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    legend: {
      show: false
    },
    theme: {
      mode: 'light'
    },

    dataLabels: {
      enabled: false
    },

    // xaxis: { ...COMMON_CHART_SETTINGS.xaxis_datetime },
    xaxis: { ...COMMON_CHART_SETTINGS.xaxis_default },

    xyxis: {
      type: 'category',
      labels: {
        show: false,
        style: {
          fontSize: '9px'
        }
      }
    },
    grid: {
      row: {
        colors: ['#f3f4f5', '#fff'],
        opacity: 1
      }
    },
    responsive: [
      {
        breakpoint: 960,
        options: {
          // chart: {
          //   // height: "370px",
          //   width: '350px'
          // },
          markers: { size: 4 },
          xaxis: {
            // type: 'datetime',
            labels: {
              show: true,
              // format: 'MMMM yyyy',
              style: {
                fontSize: '9px'
              }
            }
          }
        }
      }
    ]
  },

  categHorizH170: {
    chart: {
      type: 'line',
      height: '170px',
      width: '390px',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    legend: {
      show: false
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true // nerd-pride....
      }
    },
    theme: {
      mode: 'light'
    },

    dataLabels: {
      enabled: true
    },

    xaxis: {
      type: 'category',
      labels: {
        show: false,
        style: {
          fontSize: '9px'
        }
      }
    },

    responsive: [
      {
        breakpoint: 960,
        options: {
          chart: {
            // height: "370px",
            width: '350px'
          },
          xaxis: {
            type: 'numeric',
            labels: {
              show: false,
              style: {
                fontSize: '9px'
              }
            }
          },
          markers: { size: 4 }
        }
      }
    ]
  },
  categPieH250: {
    chart: {
      type: 'donut',
      height: '250px',
      width: '390px',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    legend: {
      position: 'bottom'
    },
    theme: {
      palette: 'palette7',
      mode: 'light'
    },

    dataLabels: {
      enabled: true
    },
    plotOptions: {
      pie: {
        donut: {
          size: '45%'
        }
      }
    },
    responsive: [
      {
        breakpoint: 960,
        options: {
          chart: {
            // height: "370px",
            width: '350px'
          },
          markers: { size: 4 }
        }
      }
    ]
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON FUNCTIONS

function buildChartOptions (
  template,
  colorsArray,
  unit = '',
  markerSize = undefined,
  xaxisType = undefined,
  annotations = undefined,
  formatter = undefined,
  animate = false
) {
  // use template options
  const options = {
    ...COMMON_CHART_OPTIONS[template]
  }

  // add locales and default locale
  options.chart.locales = apexLocales.locales
  options.chart.defaultLocale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE

  // customize options
  // colors
  if (colorsArray) {
    options.colors = colorsArray
  }
  // markers
  if (markerSize) {
    options.markers = {
      size: markerSize
    }
  }
  // xaxis type
  if (xaxisType) {
    options.xaxis.type = xaxisType
  }
  // annotations
  if (annotations) {
    options.annotationsOptions = {
      settings: {
        specialStoreId: 'focusObject',
        fromDatasetKey: annotations.fromDatasetKey,
        fromDatasetInnerKey: annotations.fromDatasetInnerKey,
        yValue: annotations.yValueKey,
        yTextDefault: annotations.yText,
        yUnit: annotations.yUnit
      },
      annotations: {
        yaxis: [
          {
            y: annotations.yValue ? annotations.yValue : undefined,
            borderColor: '#000091',
            label: {
              borderColor: '#000091',
              style: {
                color: '#fff',
                fontWeight: 'bold',
                background: '#000091'
              },
              text: annotations.yText
            }
          }
        ]
      }
    }
  }
  // tooltip
  options.tooltip = {
    enabled: true,
    // x: {
    // show: true,
    // format: 'MMMM yyyy',
    // },
    y: {
      unit: unit,
      format: formatter
    }
  }
  // animations
  if (!animate) {
    options.chart.animations = { enabled: false }
  }

  return options
}

const COMMON_TEMPLATES = {
  chart: (kpiFamilyOptions, kpiGroupOptions) => {
    const kpiGroupCharts = []
    for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
      const templateOptions = kpi[keyKpiChartTemplate]
      const colorsOptions = kpi[keyKpiChartColors]
      const formatOptions = kpi[keyKpiChartFormat]
      const unitOptions = kpi[keyKpiChartUnit]
      const markerOptions = kpi[keyKpiChartMarkerSize]
      const annotationsOptions = kpi[keyKpiChartAnnotationActivate] && {
        fromDatasetKey: kpi[keyKpiChartAnnotationKey],
        fromDatasetInnerKey: kpi[keyKpiId],
        yValueKey: kpi[keyKpiChartYannotation],
        yText: kpi[keyKpiChartYannotationText],
        yUnit: kpi[keyKpiChartUnit]
      }
      const animateOptions = kpi[keyKpiChartAnimate]

      let formatter = COMMON_FORMATTERS.integerEuropeanFormat
      if (formatOptions === 'float') {
        formatter = COMMON_FORMATTERS.floatEuropeanFormat
      }
      // console.log( '>>> appConfigGlobalButtons.js (start) / COMMON_TEMPLATES.chart / annotationsOptions : ', annotationsOptions )
      const chart = {
        id: `apexchart-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,
        serie_id: `chart--${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-${kpi[keyKpiChartTemplate]}`,
        help: `Apex chart for ${kpiGroupOptions[keyKpiGroupName]} / ${kpi[keyKpiName]}`,
        titleI18n: 'charts.chart01.title',
        chartTitle: {
          fr: `
            ${kpi[keyKpiChartTitle]}
            <br>
          `
        },
        chartSubtitleUnit: { fr: `${unitOptions}` },
        chartTitleClass: 'subtitle-1 font-weight-bold text-left ma-0',
        titlePreffixSpecialStoreId: undefined,
        titleSuffixSpecialStoreId: 'levelname',
        titleSuffixClass: 'grey--text',
        dividers: {
          before: false,
          after: false,
          afterHideOnMobile: true
        },

        kpiFamilyId: kpiFamilyOptions.kpiFamilyId,
        keyKpiGroupIdDataset: kpiGroupOptions[keyKpiGroupIdDataset],
        keyKpiGroupId: kpiGroupOptions[keyKpiGroupId],
        sourcesIds: [
          { levelcode: 'national', sourceId: `national-${kpiGroupOptions[keyKpiGroupId]}-raw` },
          { levelcode: 'regional', sourceId: `regions-${kpiGroupOptions[keyKpiGroupId]}-raw` },
          { levelcode: 'departemental', sourceId: `departements-${kpiGroupOptions[keyKpiGroupId]}-raw` }
        ],
        datasetMappers: {
          specialStoreId: 'focusObject',
          fromSpecialStoreKey: 'value',
          fromDatasetKey: kpi[keyKpiId],
          reloadRules: {
            national: { key: 'nat', findBy: 0, findByIndex: true },
            regional: { key: 'reg', findBy: 'level' },
            departemental: { key: 'dep', findBy: 'level' }
          },
          seriesMappers: [
            {
              ...COMMON_SERIES_MAPPERS.basicNumber,
              // serieName: kpi[keyKpiChartSerieName],
              serieName: ''
            }
          ],
          chartOptions: buildChartOptions(
            templateOptions,
            colorsOptions,
            unitOptions,
            markerOptions,
            undefined,
            annotationsOptions,
            formatter,
            animateOptions
          ),
          format: formatter,
          valType: formatOptions,
          unit: unitOptions
        }
      }
      kpiGroupCharts.push(chart)
    }
    return kpiGroupCharts
  }
}

const buildCharts = (kpiFamilyOptions, kpiGroupOptions, template) => {
  const charts = COMMON_TEMPLATES[template](kpiFamilyOptions, kpiGroupOptions)
  return charts
}

const builtCharts = []
for (const kpiFamilyOptions of dataStructure) {
  for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
    const charts = buildCharts(kpiFamilyOptions, kpiGroupOptions, 'chart')
    builtCharts.push(...charts)
  }
}
// console.log( '>>> appConfigGlobalButtons.js (start) / builtCharts : ', builtCharts )
// console.log( '>>> appConfigGlobalButtons.js (start) / builtCharts : ', builtCharts.slice(0, 2) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN CHART COMPONENT SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppCharts = {
  help: 'this file contains the setup for the apex charts',

  // APEX CHARTS

  settingsIds: [

    // ////////////////////////////////////////////////////////////////
    // >>> ALL KPI GLOBAL BUTTONS
    // ////////////////////////////////////////////////////////////////

    ...builtCharts

  ]
}
