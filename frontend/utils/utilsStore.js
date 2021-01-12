import { switchFormatFunctions, objectsFromString } from '~/utils/utils.js'

// console.log('+ + + utils/utilsStore... ')

// UTILS USING STORE AS PARAM

// - - - - - - - - - - - - - - - - - - - //
// COPY DATA
// - - - - - - - - - - - - - - - - - - - //

export function copyData (respData, store, dataRef, log) {
  // COPY A SLICE TO ...

  for (const dataCopy of dataRef.copyTo) {
    // log && console.log('\n... + + + copyData / dataCopy.help :', dataCopy.help)
    // log  && console.log('... + + + copyData / respData :' , respData )

    // get source data
    let value = respData[dataCopy.from.objectRef]
    // log  && console.log('... + + + copyData / value :' , value )
    if (dataCopy.fieldToCopy) {
      value = value && value[dataCopy.fieldToCopy]
    }
    if (dataCopy.format) {
      value = switchFormatFunctions(value, dataCopy.format)
    }

    const targetData = {
      value: value,
      specialStoreId: dataCopy.toSpecialStore
    }
    store.dispatch('data/setNestedData', targetData)
  }
}
export function storeData (dataset, dataRef, resp, store, log) {
  // log && console.log('+ + + storeData / dataset.id', dataset.id,' / res :' , resp )
  dataset.data = resp.data
  store.commit('data/pushToInitData', dataset)

  // COPY IT TO data/displayedData
  if (dataRef.displayed) {
    store.commit('data/pushToDisplayedData', dataset)
  }

  // COPY A SLICE TO ...
  if (dataRef.copyTo && dataRef.copyTo.length > 0) {
    for (const dataCopy of dataRef.copyTo) {
      // log &&
      //   console.log(
      //     '\n... + + + storeData / dataset.id : ',
      //     dataset.id,
      //     ' / dataCopy.fieldToCopy :',
      //     dataCopy.fieldToCopy
      //   )

      // get source data
      const sourceObject = resp.data[dataCopy.from.objectRef]
      let value = sourceObject
      if (dataCopy.fieldToCopy) {
        value = sourceObject && sourceObject[dataCopy.fieldToCopy]
      }
      if (dataCopy.format) {
        value = switchFormatFunctions(value, dataCopy.format)
      }
      // log  && console.log('... + + + storeData / dataset.id : ', dataset.id,' / value :' , value )

      const targetData = {
        value: value,
        specialStoreId: dataCopy.toSpecialStore
      }

      store.dispatch('data/setNestedData', targetData)
    }
  }
}

// - - - - - - - - - - - - - - - - - - - //
// UPDATE DATASET IN STORES
// - - - - - - - - - - - - - - - - - - - //

export function canRunIf (ifQuery, ifQueryNot, urlParams, log) {
  const canRunBoolArray = [true]
  const canRunBoolArrayNot = [false]
  // log && console.log('\n+ + + canRunIf / urlParams : ', urlParams)

  if (ifQuery) {
    // log && console.log('+ + + canRunIf / ifQuery : ', ifQuery)
    for (const condition of ifQuery) {
      let urlArgBool
      if (condition.onlyCheckField) {
        // log && console.log('+ + + canRunIf / condition.field : ', condition.field)
        urlArgBool = !!urlParams[condition.field]
      } else {
        urlArgBool = urlParams[condition.field] === condition.val
      }
      canRunBoolArray.push(urlArgBool)
    }
  }
  if (ifQueryNot) {
    // log && console.log('+ + + canRunIf / ifQueryNot : ', ifQueryNot)
    for (const conditionNot of ifQueryNot) {
      let urlArgBoolNot
      if (conditionNot.onlyCheckField) {
        // log && console.log('+ + + canRunIf / conditionNot.field : ', conditionNot.field)
        urlArgBoolNot = !!urlParams[conditionNot.field]
      } else {
        urlArgBoolNot = urlParams[conditionNot.field] === conditionNot.val
      }
      canRunBoolArrayNot.push(urlArgBoolNot)
    }
  }

  const areAllConditionsFilled = canRunBoolArray.every(v => v === true) && canRunBoolArrayNot.every(v => v === false)

  return areAllConditionsFilled
}

export function resetDataStore (params, store, log) {
  // log && console.log('+ + + updateDataStore / store.state.data : ', store.state.data)
  store.dispatch('data/resetStore', params)
}

export function updateDataStoreDataset (targetData, store, log) {
  // log && console.log('+ + + updateDataStore / targetData : ', targetData)
  // log && console.log('+ + + updateDataStore / store.state.data : ', store.state.data)
  store.dispatch('data/setNestedData', targetData)
}

export function updateDataStore (urlParams, params, store, log) {
  for (const targetParams of params.targets) {
    // console.log('\n', '+++ '.repeat(10))
    // console.log('+ + + updateDataStore / targetParams : ', targetParams)

    // 1 - get if targetParams must run given urlParams
    const canRun = canRunIf(targetParams.ifQuery, targetParams.ifQueryNot, urlParams)
    // console.log('+ + + updateDataStore / 1 / canRun : ', canRun)

    if (canRun) {
      // 2 - prepare targetParams
      // console.log('+ + + updateDataStore / 2 / urlParams : ', urlParams)

      targetParams.fromPropValue = (targetParams.rawValue) ? undefined : urlParams.value
      // console.log('+ + + updateDataStore / 2 / targetParams : ', targetParams)

      // 3 - get data value given the urlArgs
      // console.log('+ + + updateDataStore / 3 / store.state.data[targetParams.fromStoreData] : ', store.state.data[targetParams.fromStoreData])
      let data
      if (targetParams.rawValue) {
        data = targetParams.rawValue
      } else if (targetParams.fromQueryValue) {
        data = urlParams[targetParams.fromQueryKey]
        data = targetParams.splitQueryValue ? data.split(',') : data
      } else {
        data = store.getters['data/getStoreSourceData'](targetParams)
      }
      if (targetParams.format) {
        data = switchFormatFunctions(data, targetParams.format)
      }
      // console.log('+ + + updateDataStore / 3 / data : ', data)

      // 4 - check if has fallback conditions
      if (targetParams.fallback) {
        // console.log('+ + + updateDataStore / 4 / fallbackSwitch ... TRUE ')
        const fallbackSwitch = targetParams.fallbackSwitch
        // console.log('+ + + updateDataStore / 4 / fallbackSwitch : ', fallbackSwitch)
        let newData
        if (targetParams.fallbackFromStoreData !== 'raw') {
          fallbackSwitch.props = data
          fallbackSwitch.fromPropValue = targetParams.fromPropValue
          const switchData = (fallbackSwitch.rawValue) ? fallbackSwitch.rawValue : store.getters['data/getStoreSourceData'](fallbackSwitch)
          // console.log('+ + + updateDataStore / 4 / switchData : ', switchData)
          const switchDataValue = switchData[fallbackSwitch.targetPropKey]
          // console.log('+ + + updateDataStore / 4 / switchDataValue : ', switchDataValue)

          const newParams = {
            fromPropValue: switchDataValue,
            fromStoreData: targetParams.fallbackFromStoreData,
            fromDatasetId: targetParams.fallbackFromDatasetId,
            fromDatasetKey: targetParams.fallbackFromDatasetKey,
            fromDatasetField: targetParams.fallbackFromDatasetField,
            targetSpecialStoreId: targetParams.targetSpecialStoreId,
            rawValue: targetParams.rawValue
          }
          // console.log('+ + + updateDataStore / 4 / newParams : ', newParams)

          newData = (newParams.rawValue) ? newParams.rawValue : store.getters['data/getStoreSourceData'](newParams)
          // console.log('+ + + updateDataStore / 4 / newData : ', newData)
          data = newData
        }
      }

      // 5 - commit value to datastore
      const targetData = {
        value: data,
        specialStoreId: targetParams.targetSpecialStoreId
      }
      // log && console.log('+ + + updateDataStore / 5 / targetData : ', targetData)
      updateDataStoreDataset(targetData, store, log)
    }
  }
}
export function setMapView (urlParams, params, store, log) {
  // log && console.log('\n+ + + setMapZoom / urlParams : ', urlParams)
  for (const targetParams of params.targets) {
    // log && console.log('\n+ + + setMapZoom / targetParams : ', targetParams)
    const canRun = canRunIf(targetParams.ifQuery, targetParams.ifQueryNot, urlParams, log)
    // log && console.log('+ + + setMapZoom / canRun : ', canRun)

    if (canRun) {
      // log && console.log('+ + + setMapZoom /  targetParams.zoomBy : ', targetParams.zoomBy)

      let viewParams = {
        zoomBy: targetParams.zoomBy
      }
      if (targetParams.zoomBy === 'polygon') {
        viewParams = {
          ...viewParams,
          source: urlParams[targetParams.sourceField],
          prop: urlParams[targetParams.propField],
          propName: urlParams[targetParams.propNameField]
        }
      } else if (targetParams.zoomBy === 'centerAndZoom') {
        viewParams = {
          ...viewParams,
          center: {
            lng: parseFloat(urlParams[targetParams.centerLngField]),
            lat: parseFloat(urlParams[targetParams.centerLatField])
          },
          zoom: parseFloat(urlParams[targetParams.zoomField])
        }
      }
      // log && console.log('+ + + setMapZoom / viewParams : ', viewParams)
      store.commit('maps/setFitToPolygon', viewParams)
    }
  }
}
export function setSelectedPolygons (urlParams, params, store, log) {
  // log && console.log('\n+ + + setSelectedPolygons / urlParams : ', urlParams)
  for (const targetParams of params.targets) {
    // log && console.log('\n+ + + setSelectedPolygons / targetParams : ', targetParams)
    const canRun = canRunIf(targetParams.ifQuery, targetParams.ifQueryNot, urlParams)
    if (canRun) {
      // log && console.log('+ + + setSelectedPolygons /  targetParams : ', targetParams)
      const selectedParams = {
        selected: objectsFromString(urlParams[targetParams.selectedField])
      }
      // log && console.log('+ + + setSelectedPolygons /  selectedParams : ', selectedParams)
      store.commit('maps/seSelectedStateId', selectedParams.selected)
    }
  }
}
