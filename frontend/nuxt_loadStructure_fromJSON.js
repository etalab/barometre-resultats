// - - - - - - - - - - - - - - - - - - - - - - - -
// BUILD STRUCTURE FROM STRUCTURE JSON FILE...
// console.log( '>>> nuxt_loadStructure_fromJSON.js (start) / process.env : ', process.env )
const locale = process.env.NUXT_ENV_LANG_DEFAULT_LOCALE

const structureKpiFamiliesPath = `./static${process.env.NUXT_ENV_CONFIG_STATIC_STRUCTURE_KPIFAMS_FILEPATH}`
const structureKpiFamilies = require(structureKpiFamiliesPath)
// console.log( '>>> nuxt.config.js (start) / structureKpiFamilies : ', structureKpiFamilies )

const structurePath = `./static${process.env.NUXT_ENV_CONFIG_STATIC_STRUCTURE_KPIS_FILEPATH}`
const structureKpis = require(structurePath)
// console.log( '>>> nuxt.config.js (start) / structureKpis : ', structureKpis )

// declare key constants to parse structureKpiFamilies && structureKpis objects

// KPI FAMIILIES === THEMAS
export const keyKpiFamilyId = 'odm_id'
export const keyKpiFamilyOvqIds = 'id_ovq'
export const keyKpiFamilies = 'odm_kpi_families'
export const keyKpiFamilyName = 'nom_ovq'
export const keyKpiFamilyActivate = 'odm_kpi_family_activate'
export const keyKpiFamilyAliases = 'odm_url_aliases'
export const keyKpiFamilyIcon = 'odm_tab_icon'
export const keyKpiFamilyText = 'odm_text'
export const keyKpiFamilyUrl = 'odm_url'
export const keyKpiFamilyExtUrl = 'odm_ext_link'
export const keyKpiFamilyImageActivate = 'odm_image_activate'
export const keyKpiFamilyImage = 'odm_image'

// KPI GROUPS === OVQ
export const keyKpiGroupIdDataset = 'id_ovq'
export const keyKpiGroupId = 'odm_id'
export const keyKpiGroupUrl = 'odm_url'
export const keyKpiGroupUrls = 'odm_urls'
export const keyKpiGroupExtLink = 'odm_ext_link'
export const keyKpiGroupExtLinkTxt = 'odm_ext_link_text'
export const keyKpiGroupExtLink2 = 'odm_ext_link_2'
export const keyKpiGroupExtLinkTxt2 = 'odm_ext_link_text_2'
export const keyKpiGroupImageActivate = 'odm_image_activate'
export const keyKpiGroupImage = 'odm_image'
export const keyKpiGroupText = 'odm_text'
export const keyKpiGroupTextOpen = 'odm_text_open'
export const keyKpiGroupTextBrief = 'odm_text_brief'
export const keyKpiGroupName = 'nom_ovq'
export const keyKpiGroupNameBis = 'nom_ovq_bis'
export const keyKpiGroupSourcesId = 'odm_sources_ids'
export const keyKpiGroupKpis = 'indicateurs'

// KPIS === INDICATORS
export const keyKpiId = 'odm_id'
export const keyKpiActivate = 'odm_activate'
export const keyKpiText = 'odm_text'
export const keyKpiTextOpen = 'odm_text_open'
export const keyKpiTextBrief = 'odm_text_brief'
export const keyKpiName = 'nom_indicateur'

export const keyKpiChartType = 'odm_chart_type'
export const keyKpiChartTemplate = 'odm_chart_template'
export const keyKpiChartColors = 'odm_chart_colors'
export const keyKpiChartXaxisType = 'odm_chart_xaxis_type'
export const keyKpiChartMarkerSize = 'odm_chart_marker_size'
export const keyKpiChartSerieName = 'odm_chart_serie_name'
export const keyKpiChartTitle = 'odm_chart_title'
export const keyKpiChartFormat = 'odm_chart_format'
export const keyKpiChartUnit = 'odm_chart_unit'
// export const keyKpiChartTitleRaw = 'nom_indicateur_ditp'
export const keyKpiChartTitleRaw = 'odm_map_label'
export const keyKpiChartAnnotationActivate = 'odm_chart_annotation'
export const keyKpiChartAnnotationKey = 'odm_chart_annotation_key'
export const keyKpiChartYannotation = 'odm_chart_y_annotation_key'
export const keyKpiChartYannotationText = 'odm_chart_y_annotation_text'
export const keyKpiChartAnimate = 'odm_chart_animate'

export const keyKpiMapIsDefault = 'odm_map_is_default'
export const keyKpiMapFillColor = 'odm_map_fill_color'
export const keyKpiMapHighlightColor = 'odm_map_highlight_color'
export const keyKpiMapOnlyNational = 'odm_map_only_national'
export const keyKpiMapHasRegion = 'odm_map_has_regional_level'
export const keyKpiMapHasDepartement = 'odm_map_has_departement_level'
export const keyKpiMapRegionMax = 'odm_map_region_max'
export const keyKpiMapDepartementMax = 'odm_map_departement_max'
export const keyKpiMapLabel = 'odm_map_label'
// export const keyKpiMapLegend = 'nom_indicateur'
export const keyKpiMapLegend = 'odm_map_label'
export const keyKpiMapLegendSubtitle = 'odm_map_legend_subtitle'
export const keyKpiMapDefaultLayer = 'odm_map_default_layer'

export const keyKpiTableFormat = 'odm_kpi_format'
export const keyKpiTableUnit = 'odm_kpi_unit'

const mapOrder = (array, order, key) => {
  array.sort((a, b) => {
    const A = a[key]
    const B = b[key]
    return order.indexOf(A) > order.indexOf(B) ? 1 : -1
  })
  return array
}

// group by kpi family
// console.log( '>>> nuxt_loadStructure_fromJSON.js (start) / structureKpiFamilies : ', structureKpiFamilies )
const structureData = []
if (structureKpiFamilies && structureKpis) {
  for (const kpiFamId of structureKpiFamilies) {
    if (kpiFamId[keyKpiFamilyActivate]) {
      const kpiIds = kpiFamId[keyKpiFamilyOvqIds]
      const kpiGroups = structureKpis.filter(kpi => kpi[keyKpiActivate] && kpi[keyKpiFamilies].includes(kpiFamId[keyKpiFamilyId]))
      kpiGroups = mapOrder(kpiGroups, kpiIds, keyKpiGroupIdDataset)
      const kpiFamilyData = {
        kpiFamilyId: kpiFamId[keyKpiFamilyId],
        kpiFamilyName: {},
        kpiFamilyImageActivate: kpiFamId[keyKpiFamilyImageActivate],
        kpiFamilyImage: kpiFamId[keyKpiFamilyImage],
        kpiFamilyIcon: kpiFamId[keyKpiFamilyIcon],
        kpiFamilyUrl: kpiFamId[keyKpiFamilyUrl],
        kpiFamilyExtLink: kpiFamId[keyKpiFamilyExtUrl],
        kpiFamilyUrlAliases: kpiFamId[keyKpiFamilyAliases],
        kpiFamilyText: kpiFamId[keyKpiFamilyText],
        kpiGroups: kpiGroups
      }
      kpiFamilyData.kpiFamilyName[locale] = kpiFamId[keyKpiFamilyName]
      structureData.push(kpiFamilyData)
    }
  }
}

// console.log( '>>> nuxt_loadStructure_fromJSON.js (start) / structureData : ', structureData )
export const dataStructure = structureData
