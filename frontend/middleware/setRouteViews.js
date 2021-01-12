import { objectToUrlParams } from '~/utils/utils.js'
import { updateDataStore, resetDataStore, setMapView, setSelectedPolygons } from '~/utils/utilsStore.js'

export default function ({ store, route }) {
  const log = store.state.log
  // log && console.log('\n', '+ '.repeat(20))
  // log && console.log('-MW- setRouteViews / ... ')

  const currentRouteConfig = store.getters.getLocalRouteConfig
  // log && console.log('-MW- setRouteViews / currentRouteConfig.id :', currentRouteConfig.id)

  // GET ROUTE PARAMS IF ANY IN ROUTE && ROUTE_CONNFIG
  const setUpRouteViews = currentRouteConfig.setUpRouteViews
  if (setUpRouteViews) {
    // log && console.log('-MW- setRouteViews / setUpRouteViews :', setUpRouteViews)
    // log && console.log('-MW- setRouteViews / route :', route)

    // BUILD URL PARAMS
    var urlParams = {}
    for (const p of setUpRouteViews.urlArgs) {
      urlParams[p] = route.query[p]
    }
    // log && console.log('-MW- setRouteViews / urlParams :', urlParams)
    const paramsString = objectToUrlParams(urlParams)
    store.commit('setRouteParams', paramsString)

    // LOOP FUNCTIONS TO RUN FOR THIS ROUTE
    for (const fn of setUpRouteViews.functions) {
      // log && console.log('-MW- setRouteViews / fn.funcName :', fn.funcName)
      // log && console.log('-MW- setRouteViews / fn :', fn)

      switch (fn.funcName) {
        case 'resetStore':
          // log && console.log('-MW- setRouteViews / resetStore ...')
          resetDataStore(fn.funcParams, store, log)
          break

        case 'updateDataStore':
          updateDataStore(urlParams, fn.funcParams, store, log)
          break

        case 'updateUrlPath':
          // setMapView(urlParams, fn.funcParams, store, log)
          break

        case 'goToPolygon':
          setMapView(urlParams, fn.funcParams, store, log)
          break

        case 'toggleSelected':
          setSelectedPolygons(urlParams, fn.funcParams, store, log)
          break
      }
    }
  }

  // hide layout loader
  store.commit('setRouteLoading', false)

  // trigger ComponentLoaded for iframe resizing
  store.commit('toggleTriggerComponentLoaded')

  // log && console.log('\n')
}
