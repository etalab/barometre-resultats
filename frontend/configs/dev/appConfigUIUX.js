const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,
  keyKpiGroupId,
  keyKpiGroupUrl,
  keyKpiGroupName
} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigUIUX.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON CONSTANTS

const COMMON_FUNCTIONS = {
  resetUrlPath: (ignoreArgs = []) => {
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
const COMMONS_TARGETS = {
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

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON FUNCTIONS

const buildTab = (kpiFamilyOptions) => {
  const tab = {
    title: kpiFamilyOptions.kpiFamilyName,
    titleMobile: { fr: undefined },
    tooltip: kpiFamilyOptions.kpiFamilyName,
    to: `/?routeId=${kpiFamilyOptions.kpiFamilyId}`,
    href: kpiFamilyOptions.kpiFamilyUrl,
    hrefAliases: kpiFamilyOptions.kpiFamilyUrlAliases,
    isVisible: true,
    hasIcons: true,
    icon: kpiFamilyOptions.kpiFamilyIcon,
    isNuxtLink: false,
    addUrlParams: true,
    dropdown: true,
    isDisabled: false,
    dropdownLinks: []
  }

  for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
    const routeLink = {
      to: `/?routeId=${kpiGroupOptions[keyKpiGroupId]}`,
      href: kpiGroupOptions[keyKpiGroupUrl],
      isVisible: true,
      hasIcons: false,
      icon: undefined,
      title: {},
      titleMobile: {},
      tooltip: {},
      isNuxtLink: false,
      addUrlParams: true,
      isDisabled: false
    }
    routeLink.title[locale] = kpiGroupOptions[keyKpiGroupName]
    routeLink.titleMobile[locale] = kpiGroupOptions[keyKpiGroupName]
    routeLink.tooltip[locale] = kpiGroupOptions[keyKpiGroupName]
    tab.dropdownLinks.push(routeLink)
  }

  return tab
}

const builtTabs = []
for (const kpiFamilyOptions of dataStructure) {
  const kpiFamilyTab = buildTab(kpiFamilyOptions)
  builtTabs.push(kpiFamilyTab)
}
// console.log( '>>> appConfigUIUX.js (start) / builtTabs : ', builtTabs.slice(0, 3) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN UI UX COMPONENT SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppUIUX = {
  help: 'this file contains the setup for the UI-UX',

  // GLOBAL
  appTitle: {
    // fr: 'Actions prioritaires du gouvernement',
    // fr: 'Bbaromètre des résultats',
    fr: process.env.NUXT_ENV_APP_TITLE
  },
  appMetas: [],
  appVersion: 'v.2.3.0',
  appLogo: 'https://',

  // INTERATIONALIZATION
  lang: {
    defaultLocale: process.env.NUXT_ENV_LANG_DEFAULT_LOCALE,
    locales: [
      {
        code: 'fr',
        name: 'Français',
        file: 'fr-FR.js'
      }
    ]
  },

  // UX
  UX_config: {
    hasDrawer: false,

    mobileBreakpoints: ['xs', 'sm'],

    // max height for iframe
    overrideIframeMaxHeight: undefined,
    // overrideIframeMaxHeight: 800,

    navbar: {
      height: 64, // in pixels
      mobileHeight: 45,

      fixed: true,
      fixedBtn: false,

      clipped: true,
      clippedBtn: false,

      drawer: false,
      drawerBtn: false,

      miniVariant: true,
      miniVariantBtn: false,

      right: false,
      rightBtn: false,

      rightDrawer: false,
      rightDrawerBtn: false,

      // HORIZ BUTTONS
      buttons: [
        {
          to: '/about',
          // icon: 'mdi-apps',
          icon: 'icon-apps',
          i18nTitle: 'menu.about',
          switch: false
        }
      ],

      // ITEMS IN RIGHT DRAWER
      items: [
        {
          to: '/',
          // icon: "mdi-apps",
          // icon: 'fas fa-th',
          icon: 'icon-th-large',
          i18nTitle: 'menu.welcome',
          isVisible: true
        },
        {
          to: '/map',
          // icon: 'fas fa-map',
          icon: 'icon-map',
          i18nTitle: 'menu.map',
          isVisible: true
        },
        {
          to: '/charts',
          // icon: 'fas fa-chart-bar',
          icon: 'icon-stats-bars',
          i18nTitle: 'menu.charts',
          isVisible: true
        },
        // { to: "/table",
        //   icon: "fas fa-table",
        //   i18nTitle: "menu.table",
        //   isVisible : false,
        // },
        {
          to: '/rawData',
          icon: 'fas fa-database',
          i18nTitle: 'menu.data',
          isVisible: false
        }
      ]
    },

    tabsRoutes: {

      isActivated: true,
      grow: true,
      dark: true,
      backgroundColor: 'info',
      hasIcons: false,
      hasSlider: true,
      height: 35,
      slidersClass: 'primary',
      format: 'tabs', // todo : as buttons too
      tabsClass: 'text-none',

      // ITEMS ROUTES TABS
      tabs: [
        {
          title: { fr: 'Choix visualisation' },
          titleMobile: { fr: 'Choix visualisation' },
          tooltip: { fr: 'Choix visualisation' },
          to: '/par-territoire',
          href: '/par-territoire',
          hrefAliases: ['/par-territoire'],
          isVisible: true,
          icon: undefined,
          isNuxtLink: false,
          addUrlParams: true,
          dropdown: true,
          isDisabled: false,
          isCompact: true,
          functions: [
            COMMON_FUNCTIONS.resetUrlPath(),
            {
              funcName: 'goTo',
              funcParams: {
                to: '/par-territoire'
              }
            },
            {
              funcName: 'resetStore',
              funcParams: {
                targets: [
                  // ...COMMONS_TARGETS.resetTerritoires,
                  COMMONS_TARGETS.resetLevelName,
                  COMMONS_TARGETS.resetLevelCode,
                  COMMONS_TARGETS.resetLevelGender
                ]
              }
            }
          ],
          dropdownLinks: [
            {
              to: '/par-territoire',
              href: '/par-territoire',
              isVisible: true,
              hasIcons: false,
              icon: undefined,
              title: { fr: 'Par territoire' },
              titleMobile: { fr: 'Par territoire' },
              tooltip: { fr: 'Par territoire' },
              isNuxtLink: false,
              addUrlParams: true,
              isDisabled: false,
              functions: [
                COMMON_FUNCTIONS.resetUrlPath(),
                {
                  funcName: 'goTo',
                  funcParams: {
                    to: '/par-territoire'
                  }
                },
                {
                  funcName: 'resetStore',
                  funcParams: {
                    targets: [
                      // ...COMMONS_TARGETS.resetTerritoires,
                      COMMONS_TARGETS.resetLevelName,
                      COMMONS_TARGETS.resetLevelCode,
                      COMMONS_TARGETS.resetLevelGender
                    ]
                  }
                }
              ]
            },
            {
              to: '/par-ovq',
              href: '/par-ovq',
              isVisible: true,
              hasIcons: false,
              icon: undefined,
              // title: { fr: "par OVQ" },
              // titleMobile: { fr: "par OVQ" },
              // tooltip: { fr: "par OVQ" },
              title: { fr: 'Par action prioritaire' },
              titleMobile: { fr: 'Par action prioritaire' },
              tooltip: { fr: 'Par action prioritaire' },
              isNuxtLink: false,
              addUrlParams: true,
              isDisabled: false
            }
          ]
        },

        ...builtTabs

      ]
    },

    filters: {
      isVisible: false
    }
  },

  // UI
  UI_config: {
    isDarkTheme: false,

    navbar: {
      elevation: 0,
      navbarClass: '',
      color: 'primary',
      dark: true,
      titleClass: 'white--text font-weight-black',
      sizeDesktop: 'headline',
      sizeMobile: 'subtitle-1'
    },

    filters: {
      elevation: 0
    },

    themes: {
      light: {
        primary: '#000091',
        accent: '#572a99',
        secondary: '#b1133b',
        info: '#53657D',
        warning: '#ff9947',
        error: '#D1335B;',
        success: '#03BD5B'
      },

      dark: {
        primary: '#000091',
        accent: '#572a99',
        secondary: '#b1133b',
        info: '#53657D',
        warning: '#ff9947',
        error: '#D1335B;',
        success: '#03BD5B'
      }
    },

    map: {
      loader: {
        color: '#000091',
        width: '6px',
        height: '6px'
      }
    },

    typos: {},

    customCSS: [
      {
        class: '.btn-gouv',
        config: `
          background-color: #fff !important;
          border-bottom: 1px solid #000091 !important;
          border-right: 1px solid #000091 !important;
          margin: .3em !important;
        `
      },
      {
        class: '.btn-no-radius',
        config: `
          border-bottom: 1px solid #000091 !important;
          border-right: 1px solid #000091 !important;
          margin: .3em !important;
          border-radius: 0 !important;
        `
          // background-color: #fff !important;
      },
      {
        class: '.btn-gouv-min',
        config: `
          background-color: #fff !important;
          border-bottom: 1px solid #000091 !important;
          border-right: 1px solid #000091 !important;
        `
      },
      {
        class: '.btn-borders',
        config: `
          display:inline-block;
          border-bottom: 1px solid #000091 !important;
          border-right: 1px solid #000091 !important;
          margin: 0.5em 1em;
        `
      },
      {
        class: '.btn-borders-min',
        config: `
          display:block;
          border-bottom: 1px solid #000091 !important;
          border-right: 1px solid #000091 !important;
        `
      },
      {
        class: '.btn-gouv-translate',
        config: `
        transform: translate(-0.1em, -0.1em);
        transition: transform 0.1s ease-out 0s;
        `
      },
      {
        class: '.btn-gouv.selected',
        config: `
          color: #FFF;
          background-color: #000091;
        `
      }
    ]
  }
}
