// const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,
  keyKpiGroupId,
  keyKpiGroupKpis,
  keyKpiId
} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigNavFooters.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON CONSTANTS

const COMMON_DIVS_TEMPLATES = {
  home: (dataStructureOptions) => {
    const divsToToggle = []
    for (const kpiFamilyOptions of dataStructureOptions) {
      for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
        const divsOn = {
          routeId: `${kpiGroupOptions[keyKpiGroupId]}`,
          toggle: 'on',
          toggleVisibility: ['isVisibleMobile'],
          divIds: [
            `returnBtn-${kpiGroupOptions[keyKpiGroupId]}`,
            `text-${kpiGroupOptions[keyKpiGroupId]}-title`,
            `text-${kpiGroupOptions[keyKpiGroupId]}-resume`,
            // `discover-button-${kpiGroupOptions[keyKpiGroupId]}`,
            `infoBox-${kpiGroupOptions[keyKpiGroupId]}`,
            'global-to-territoires',
            'text-bottom-empty-block'
          ]
        }
        const divsOff = {
          routeId: `${kpiGroupOptions[keyKpiGroupId]}`,
          toggle: 'off',
          toggleVisibility: ['isVisibleMobile'],
          divIds: [
            `map-france-${kpiGroupOptions[keyKpiGroupId]}-metro`
          ]
        }
        for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
          const componentIdsOff = [
            `text-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-resume`,
            `apexchart-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`
          ]
          divsOff.divIds.push(...componentIdsOff)
        }
        const kpiGroupDivs = [
          divsOn,
          divsOff
        ]
        divsToToggle.push(...kpiGroupDivs)
      }
    }
    return divsToToggle
  },
  map: (dataStructureOptions) => {
    const divsToToggle = []
    for (const kpiFamilyOptions of dataStructureOptions) {
      for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
        const divsOn = {
          routeId: `${kpiGroupOptions[keyKpiGroupId]}`,
          toggle: 'on',
          toggleVisibility: ['isVisibleMobile'],
          divIds: [
            `returnBtn-${kpiGroupOptions[keyKpiGroupId]}`,
            `text-${kpiGroupOptions[keyKpiGroupId]}-title`,
            `text-${kpiGroupOptions[keyKpiGroupId]}-resume`,
            `map-france-${kpiGroupOptions[keyKpiGroupId]}-metro`,
            'global-to-territoires',
            `infoBox-${kpiGroupOptions[keyKpiGroupId]}`
          ]
        }
        const divsOff = {
          routeId: `${kpiGroupOptions[keyKpiGroupId]}`,
          toggle: 'off',
          toggleVisibility: ['isVisibleMobile'],
          divIds: [
            // `text-${kpiGroupOptions[keyKpiGroupId]}-resume`,
            // `discover-button-${kpiGroupOptions[keyKpiGroupId]}`,
            // `global-to-territoires`,
            // `infoBox-${kpiGroupOptions[keyKpiGroupId]}`,
          ]
        }
        for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
          const componentIdsOff = [
            // `text-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-resume`,
            // `apexchart-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,
            // `text-bottom-empty-block`
          ]
          divsOff.divIds.push(...componentIdsOff)
          const componentIdsOn = [
            `text-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-resume`,
            `apexchart-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,
            'text-bottom-empty-block'
          ]
          divsOn.divIds.push(...componentIdsOn)
        }
        const kpiGroupDivs = [
          divsOn,
          divsOff
        ]
        divsToToggle.push(...kpiGroupDivs)
      }
    }
    return divsToToggle
  },
  charts: (dataStructureOptions) => {
    const divsToToggle = []
    for (const kpiFamilyOptions of dataStructureOptions) {
      for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
        const divsOn = {
          routeId: `${kpiGroupOptions[keyKpiGroupId]}`,
          toggle: 'on',
          toggleVisibility: ['isVisibleMobile'],
          divIds: [
            `returnBtn-${kpiGroupOptions[keyKpiGroupId]}`,
            `text-${kpiGroupOptions[keyKpiGroupId]}-title`,
            'global-to-territoires',
            'text-bottom-empty-block'
          ]
        }
        const divsOff = {
          routeId: `${kpiGroupOptions[keyKpiGroupId]}`,
          toggle: 'off',
          toggleVisibility: ['isVisibleMobile'],
          divIds: [
            `text-${kpiGroupOptions[keyKpiGroupId]}-resume`,
            // `discover-button-${kpiGroupOptions[keyKpiGroupId]}`,
            `infoBox-${kpiGroupOptions[keyKpiGroupId]}`,
            `map-france-${kpiGroupOptions[keyKpiGroupId]}-metro`
          ]
        }
        for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
          const componentIdsOn = [
            `text-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-resume`,
            `apexchart-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`
          ]
          divsOn.divIds.push(...componentIdsOn)
        }
        const kpiGroupDivs = [
          divsOn,
          divsOff
        ]
        divsToToggle.push(...kpiGroupDivs)
      }
    }
    return divsToToggle
  }
}
const COMMON_BTNS_TEMPLATES = {
  home: (dataStructureOptions) => {
    const buttons = {
      title: { fr: 'accueil' },
      value: 'home',
      showTitle: true,
      icon: 'icon-info',
      action: 'toggleDivs', // goToUrl | scrollTo | toggleDivs
      divsToToggle: [
        ...COMMON_DIVS_TEMPLATES.home(dataStructureOptions)
      ],
      offset: 10
    }
    return buttons
  },
  map: (dataStructureOptions) => {
    const buttons = {
      title: { fr: 'carte' },
      value: 'map',
      showTitle: true,
      icon: 'icon-map',
      action: 'toggleDivs', // goToUrl | scrollTo | toggleDivs
      divsToToggle: [
        ...COMMON_DIVS_TEMPLATES.map(dataStructureOptions)
      ],
      offset: 10
    }
    return buttons
  },
  charts: (dataStructureOptions) => {
    const buttons = {
      title: { fr: 'graphiques' },
      value: 'charts',
      showTitle: true,
      icon: 'icon-bar-chart',
      action: 'toggleDivs', // goToUrl | scrollTo | toggleDivs
      divsToToggle: [
        ...COMMON_DIVS_TEMPLATES.charts(dataStructureOptions)
      ],
      offset: 10
    }
    return buttons
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON FUNCTIONS

const buildNavbarFooter = (kpiGroupOptions, template) => {
  const navbarFooter = COMMON_BTNS_TEMPLATES[template](kpiGroupOptions)
  return navbarFooter
}

const builtFooterButtons = []
const navbarFootersHome = buildNavbarFooter(dataStructure, 'home')
const navbarFootersMap = buildNavbarFooter(dataStructure, 'map')
const navbarFootersCharts = buildNavbarFooter(dataStructure, 'charts')
const navbarFooters = [
  navbarFootersHome,
  navbarFootersMap,
  navbarFootersCharts
]
builtFooterButtons.push(...navbarFooters)

// console.log( '>>> appConfigNavFooters.js (start) / builtFooterButtons : ', builtFooterButtons )
// console.log( '...' )
// console.log( '>>> appConfigNavFooters.js (start) / builtFooterButtons : ', builtFooterButtons.slice(0, 1) )
// console.log( '>>> appConfigNavFooters.js (start) / builtFooterButtons[0] : ', builtFooterButtons[0] )
// console.log( '...' )
// console.log( '>>> appConfigNavFooters.js (start) / builtFooterButtons[1].divsToToggle : ', builtFooterButtons[1].divsToToggle )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN NAVBAR FOOTER COMPONENTS SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppNavbarFooters = {
  help: 'this file contains the setup for the numbers components',

  // NAVBAR FOOTERS

  settingsIds: [
    {
      id: 'navbar-footer-01',
      help: '',

      activated: true,

      title: { fr: '' },
      titleI18n: 'navbars.footer.title',
      navbarFooterClass: '',

      height: 70,
      grow: true,
      shift: true,
      // showOnSizes: ['xs', 'sm'],

      defaultBtnNav: 'map',
      redirectAtBreakShow: { path: '/map', btnNav: 'map' },
      redirectAtBreakNoShow: { path: '/', btnNav: 'home' },

      buttons: [

        // ////////////////////////////////////////////////////////////////
        // >>> ALL KPI NAVBAR COMPONENTS SETTINGS
        // ////////////////////////////////////////////////////////////////

        ...builtFooterButtons

      ]
    }
  ]
}
