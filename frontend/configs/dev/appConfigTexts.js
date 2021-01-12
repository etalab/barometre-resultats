// const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE
const {
  dataStructure,
  // keyKpiFamilyName,
  keyKpiGroupId,
  keyKpiGroupImageActivate,
  keyKpiGroupImage,
  keyKpiGroupText,
  keyKpiGroupName,
  keyKpiGroupNameBis,
  keyKpiGroupKpis,
  keyKpiId,
  keyKpiText,
  keyKpiName
  // keyKpiChartColors
} = require('../../nuxt_loadStructure_fromJSON.js')
// console.log( '>>> appConfigTexts.js (start) / dataStructure : ', dataStructure.slice(0, 1) )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON CONSTANTS

// const COMMON_TEXTS_HTML = {
//   dashboardIntro: {
//     id: 'dashboard-intro',
//     textClass: 'text-left mx-4 pt-4 pb-5 mb-5',
//     textContent: {
//       fr: `
//         Ce tableau de bord a été créé par le département Etalab de la
//         <a target="_blank" href="https://www.numerique.gouv.fr">
//           Direction Interministérielle du Numérique (DINUM)</a>
//         et son
//         <a target="_blank" href="https://github.com/etalab/ovq-dashboard">
//           code source est libre</a>.
//       `
//     },
//     fromUrl: {
//       fr: undefined
//     }
//   },
//   moreInfosAsile: {
//     id: 'more-infos-asile',
//     textClass: 'text-left mx-4 pt-4',
//     textContent: {
//       fr: `
//         Les données utilisées sur ce tableau de bord
//         <a target="_blank" href="https://www.data.gouv.fr/fr/datasets/donnees-relatives-aux-prets-garantis-par-letat-dans-le-cadre-de-lepidemie-de-covid-19/">
//           sont disponibles en open data sur data.gouv.fr</a>.
//       `
//     },
//     fromUrl: {
//       fr: undefined
//     }
//   },
//   moreInfosPlanVelo: {
//     id: 'more-infos-plan-velo',
//     textClass: 'text-left mx-4 pt-4',
//     textContent: {
//       fr: `
//         Les données utilisées sur ce tableau de bord
//         <a target="_blank" href="https://www.data.gouv.fr/fr/datasets/aides-aux-entreprises-dans-le-cadre-de-lepidemie-de-covid-19-en-france/">
//           sont disponibles en open data sur data.gouv.fr</a>.
//       `
//     },
//     fromUrl: {
//       fr: undefined
//     }
//   }
// }
const COMMON_RULES = {
  fr_prepositions: {
    position: 'after_prefix',
    rules: [
      {
        add: 'la',
        class: 'mx-1',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'national'
          }
        ]
      },
      {
        add: 'la région',
        class: 'mx-1',
        conditions: [
          {
            specialStoreId: 'levelcode',
            specialStoreValue: 'regional'
          }
        ]
      },
      {
        add: "l'",
        class: 'ml-1',
        // class: 'no-space-after',
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
        add: 'le',
        class: 'mx-1',
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
        add: 'la',
        class: 'mx-1',
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
        add: 'les',
        class: 'mx-1',
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
        add: '',
        class: 'ml-1',
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

const COMMON_TEMPLATES = {

  kpiGroupTitle: (kpiGroupOptions, kpiFamilyOptions) => {
    return {
      id: `text-${kpiGroupOptions[keyKpiGroupId]}-title`,
      help: `text title for ${kpiGroupOptions[keyKpiGroupName]}`,
      title: { fr: '' },
      titleI18n: 'texts.text01.title',
      dividers: {
        before: false,
        after: false
      },
      componentRows: [
        {
          rowNumber: 1,
          help: '',
          columns: [
            {
              colName: '',
              colTitle: { fr: `${kpiGroupOptions[keyKpiGroupNameBis]}` },
              colTitleClass: 'text-left mb-1 mx-0 ovq-h4',
              addKpiFamilyTag: true,
              kpiFamilyName: { fr: kpiFamilyOptions.kpiFamilyName.fr },
              cols: 12,
              textClass: 'text-left',
              subTextClass: '',
              sizeDesktop: 'mb-0',
              sizeMobile: 'subtitle-1',
              asChip: true,
              textPrefix: { fr: 'Les résultats pour ' },
              textPrefixClass: 'font-weight-regular',
              textPrefixRules: {
                fr: COMMON_RULES.fr_prepositions
              },
              textSuffix: { fr: '' },
              textSuffixClass: '',
              specialStoreId: 'levelname',
              specialStoreIdClass: 'font-weight-bold'
            }
          ]
        }
      ]
    }
  },
  kpiGroupImage: (kpiGroupOptions, kpiFamilyOptions) => {
    return {
      id: `text-${kpiGroupOptions[keyKpiGroupId]}-image`,
      help: `image for ${kpiGroupOptions[keyKpiGroupName]}`,
      title: { fr: '' },
      titleI18n: 'texts.text01.title',
      dividers: {
        before: false,
        after: false
      },
      showLoader: false,
      componentRows: [
        {
          rowNumber: 1,
          help: '',
          columns: [
            {
              colName: '',
              colTitle: { fr: undefined },
              colTitleClass: 'my-5',
              cols: 12,
              textClass: '',
              subTextClass: '',
              sizeDesktop: '',
              sizeMobile: 'body-2',
              textPrefix: { fr: undefined },
              textPrefixClass: undefined,
              textSuffix: { fr: undefined },
              textSuffixClass: undefined,
              specialStoreId: undefined,
              specialStoreIdClass: undefined,
              textImage: kpiGroupOptions[keyKpiGroupImage]
            }
          ]
        }
      ]
    }
  },
  kpiGroupResume: (kpiGroupOptions, kpiFamilyOptions) => {
    return {
      id: `text-${kpiGroupOptions[keyKpiGroupId]}-resume`,
      help: `text for ${kpiGroupOptions[keyKpiGroupName]}`,
      title: { fr: '' },
      titleI18n: 'texts.text01.title',
      dividers: {
        before: false,
        after: false
      },
      showLoader: true,
      componentRows: [
        {
          rowNumber: 1,
          help: '',
          columns: [
            {
              colName: '',
              colClass: 'pt-0 mb-4 mx-0',
              colTitle: { fr: undefined },
              colTitleClass: 'ovq-h5',
              cols: 12,
              textClass: '',
              subTextClass: '',
              sizeDesktop: '',
              sizeMobile: 'body-2',
              textPrefix: { fr: undefined },
              textPrefixClass: undefined,
              textSuffix: { fr: undefined },
              textSuffixClass: undefined,
              specialStoreId: undefined,
              specialStoreIdClass: undefined,
              textsHtml: [
                {
                  id: `${kpiGroupOptions[keyKpiGroupId]}-resume`,
                  textClass: 'text-reduce-1 text-left ma-0 pt-0 pb-4',
                  textContent: {
                    fr: undefined
                  },
                  fromUrl: {
                    fr: `${kpiGroupOptions[keyKpiGroupText]}`
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  },
  kpiResumes: (kpiGroupOptions, kpiFamilyOptions) => {
    const resumes = []
    for (const kpi of kpiGroupOptions[keyKpiGroupKpis]) {
      const text = {
        id: `text-${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}-resume`,
        help: `text resume for ${kpiGroupOptions[keyKpiGroupName]} / ${kpi[keyKpiName]}`,
        title: { fr: '' },
        titleI18n: 'texts.text01.title',
        dividers: {
          before: false,
          after: false
        },
        componentRows: [
          {
            rowNumber: 1,
            help: '',
            columns: [
              {
                colName: '',
                colClass: 'py-0',
                colTitle: { fr: undefined },
                colTitleClass: 'mb-5',
                cols: 12,
                textClass: '',
                subTextClass: '',
                sizeDesktop: '',
                sizeMobile: 'body-2',
                textPrefix: { fr: undefined },
                textPrefixClass: undefined,
                textSuffix: { fr: undefined },
                textSuffixClass: undefined,
                specialStoreId: undefined,
                specialStoreIdClass: undefined,
                textsHtml: [
                  {
                    id: `${kpiGroupOptions[keyKpiGroupId]}-${kpi[keyKpiId]}`,
                    textClass: 'text-reduce-1 py-0',
                    textContent: { fr: undefined },
                    fromUrl: {
                      fr: `${kpi[keyKpiText]}`
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
      resumes.push(text)
    }
    return resumes
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - -
// COMMON FUNCTIONS

const buildText = (kpiGroupOptions, template, kpiFamilyOptions = undefined) => {
  const text = COMMON_TEMPLATES[template](kpiGroupOptions, kpiFamilyOptions)
  return text
}

const builtTexts = []
for (const kpiFamilyOptions of dataStructure) {
  for (const kpiGroupOptions of kpiFamilyOptions.kpiGroups) {
    const textKpiGroupTitle = buildText(kpiGroupOptions, 'kpiGroupTitle', kpiFamilyOptions)
    builtTexts.push(textKpiGroupTitle)

    if (kpiGroupOptions[keyKpiGroupImageActivate]) {
      const textKpiGroupImage = buildText(kpiGroupOptions, 'kpiGroupImage')
      builtTexts.push(textKpiGroupImage)
    }

    const textKpiGroupResume = buildText(kpiGroupOptions, 'kpiGroupResume')
    builtTexts.push(textKpiGroupResume)

    const textKpiResumes = buildText(kpiGroupOptions, 'kpiResumes')
    builtTexts.push(...textKpiResumes)
  }
}
// console.log( '>>> appConfigUIUX.js (start) / builtTexts : ', builtTexts )
// console.log( '...' )

// - - - - - - - - - - - - - - - - - - - - - //
// MAIN TEXT COMPONENT SETTINGS
// - - - - - - - - - - - - - - - - - - - - - //

export const configAppTexts = {
  help: 'this file contains the setup for the texts components',

  settingsIds: [

    // ////////////////////////////////////////////////////////////////
    // >>> COMMON TEXTS
    // ////////////////////////////////////////////////////////////////
    {
      id: 'text-bottom-empty-block',
      help: 'extra empty text block to add at the end of route settings to make some space',
      title: { fr: '' },
      titleI18n: 'texts.text01.title',
      dividers: {
        before: false,
        after: false
      },
      componentRows: [
        {
          rowNumber: 1,
          help: 'bottom text block',
          columns: [
            {
              colName: '',
              colTitle: { fr: '' },
              colTitleClass: 'my-5',
              cols: 12,
              textClass: '',
              subTextClass: '',
              sizeDesktop: '',
              sizeMobile: 'body-2',
              textPrefix: { fr: undefined },
              textPrefixClass: undefined,
              textSuffix: { fr: undefined },
              textSuffixClass: undefined,
              specialStoreId: undefined,
              specialStoreIdClass: undefined,
              textsHtml: [
                {
                  id: 'col-outro',
                  textClass: 'text-left mx-3 pt-3',
                  textContent: {
                    fr: `
                      <br>
                    `
                  },
                  fromUrl: {
                    fr: undefined
                  }
                }
              ]
            }
          ]
        }
      ]
    },

    // ////////////////////////////////////////////////////////////////
    // >>> PAR TERRITOIRE
    // ////////////////////////////////////////////////////////////////
    {
      id: 'text-territoires-title',
      help: '',
      title: { fr: '' },
      titleI18n: 'texts.text01.title',
      dividers: {
        before: false,
        after: true
      },
      componentRows: [
        {
          rowNumber: 1,
          help: '',
          columns: [
            {
              colName: '',
              colTitle: { fr: '' },
              colTitleClass: 'text-left',
              cols: 12,
              textClass: 'text-left',
              subTextClass: '',
              sizeDesktop: 'mb-0 ml-5 pl-3',
              sizeMobile: 'body-1 mb-0 ml-0 pl-0',
              textPrefix: { fr: 'Les résultats pour ' },
              textPrefixClass: 'font-weight-regular',
              textPrefixRules: {
                fr: COMMON_RULES.fr_prepositions
              },
              textSuffix: { fr: '' },
              textSuffixClass: undefined,
              specialStoreId: 'levelname',
              specialStoreIdClass: 'font-weight-bold'
            }
          ]
        }
      ]
    },

    // ////////////////////////////////////////////////////////////////
    // >>> ALL THEMA / KPI GROUPS
    // ////////////////////////////////////////////////////////////////

    ...builtTexts

  ]
}
