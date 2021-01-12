// console.log('=== utils/utils... ')

// PURE UTILS

// - - - - - - - - - - - - - - - - - - - //
// CLEAN VALUES
// - - - - - - - - - - - - - - - - - - - //

export function capitalizeString (string) {
  return string[0].toUpperCase() + string.substring(1)
}
export function splitMulti (str, tokens, glue = ' ', capitalize = false) {
  var tempChar = tokens[0] // We can use the first token as a temporary join character
  // console.log("\n=== splitMulti / str : ", str)
  for (const token of tokens) {
    const strArray = str.split(token)
    // console.log("=== splitMulti / strArray : ", strArray)
    const strArrayNew = []
    for (let [i, s] of strArray.entries()) {
      if (capitalize) { s = capitalizeString(s.trim()) }
      if (glue && i > 0) { s = glue + s }
      strArrayNew.push(s)
    }
    // console.log("=== splitMulti / strArrayNew : ", strArrayNew)
    str = strArrayNew.join(tempChar)
  }
  const finalStrArray = str.split(tempChar)
  return finalStrArray
}

// - - - - - - - - - - - - - - - - - - - //
// SORT VALUES & ARRAY ORDER
// - - - - - - - - - - - - - - - - - - - //

export function moveArrayElement (arr, oldIndex, newIndex) {
  while (oldIndex < 0) {
    oldIndex += arr.length
  }
  while (newIndex < 0) {
    newIndex += arr.length
  }
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length
    while (k-- + 1) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}
export function sortByFieldName (arrayOfStuff, fieldName, toUpper = false) {
  const sortedArray = arrayOfStuff.sort((a, b) => {
    var nameA = toUpper ? a[fieldName].toUpperCase() : a[fieldName].toLowerCase()
    var nameB = toUpper ? b[fieldName].toUpperCase() : b[fieldName].toLowerCase()
    // sort string ascending
    if (nameA < nameB) { return -1 }
    if (nameA > nameB) return 1
    return 0 // default return value (no sorting)
  })
  return sortedArray
}
export function sortByFieldValue (arrayOfStuff, fieldName, toNumber = true) {
  const sortedArray = arrayOfStuff.sort((a, b) => {
    const numbA = toNumber ? new Number(a[fieldName]) : a[fieldName]
    const numbB = toNumber ? new Number(b[fieldName]) : b[fieldName]
    return numbA - numbB
  })
  return sortedArray
}
export function sortByValue (arrayOfStuff) {
  const sortedArray = arrayOfStuff.sort((a, b) => {
    return a - b
  })
  return sortedArray
}
export function sortByFieldDate (arrayOfStuff, fieldName) {
  const sortedArray = arrayOfStuff.sort((a, b) => {
    var dateA = new Date(a[fieldName])
    var dateB = new Date(b[fieldName])
    return dateA - dateB // sort by date ascending
  })
  return sortedArray
}
export function sortArrayBy (arrayOfStuff, params) {
  let sortedArray = arrayOfStuff
  const sortBy = params.sortByType
  switch (sortBy) {
    case 'sortByFieldName':
      sortedArray = sortByFieldName(arrayOfStuff, params.fieldName)
      break
    case 'sortByFieldValue':
      sortedArray = sortByFieldValue(arrayOfStuff, params.fieldName)
      break
    case 'sortByValue':
      sortedArray = sortByValue(arrayOfStuff)
      break
    case 'sortByFieldDate':
      sortedArray = sortByFieldDate(arrayOfStuff, params.fieldName)
      break
  }
  return sortedArray
}

// - - - - - - - - - - - - - - - - - - - //
// SELECTOR FUNCTIONS FROM ENV VAR
// - - - - - - - - - - - - - - - - - - - //

const trueStrings = [
  'y',
  'yes',
  'Yes',
  'YES',
  'Y',
  'o',
  'oui',
  'Oui',
  'OUI',
  'O',
  't',
  'true',
  'True',
  'TRUE',
  'T'
]
// const falseStrings = [
//   'no',
//   'No',
//   'NO',
//   'NON',
//   'Non',
//   'non',
//   'n',
//   'N',
//   'false',
//   'False',
//   'FALSE',
//   'f',
//   'F'
// ]
export const chooseBooleanMode = (ARG) => {
  if (trueStrings.includes(ARG)) {
    return true
  } else {
    return false
  }
}

// - - - - - - - - - - - - - - - - - - - //
// FIND FROM ARRAY
// - - - - - - - - - - - - - - - - - - - //

export function findElementFromArrayAndId (id, targetArray, idField = 'id') {
  // console.log("=== findElementFromArrayAndId / id : ", id)
  const filteredOut = targetArray.find((item) => item[idField] === id)
  return filteredOut
}

// - - - - - - - - - - - - - - - - - - - //
// RETRIEVE OBJECT FROM PATH
// - - - - - - - - - - - - - - - - - - - //

export function objectFromPath (obj, path, separator = '.') {
  // console.log("\n=== objectFromPath / obj : ", obj)
  // console.log("=== objectFromPath / path : ", path)
  let object
  if (path) {
    var properties = Array.isArray(path) ? path : path.split(separator)
    // console.log("=== objectFromPath / properties : ", properties)
    object = properties.reduce((prev, curr) => prev && prev[curr], obj)
    // console.log("=== objectFromPath / object : ", object)
  } else {
    object = obj
  }
  return object
}

// - - - - - - - - - - - - - - - - - - - //
// SET NESTED OBJECT FROM PATH
// - - - - - - - - - - - - - - - - - - - //

export function cloneObject (obj) {
  return JSON.parse(JSON.stringify(obj))
}
export function setNestedObjectFromPath (path, value, obj, separator = '.') {
  // console.log("=== setNestedObjectFromPath / obj : ", obj)
  // console.log("=== setNestedObjectFromPath / path : ", path)
  // console.log("=== setNestedObjectFromPath / value : ", value)

  // from : https://medium.com/data-scraper-tips-tricks/safely-read-write-in-deeply-nested-objects-js-a1d9ddd168c6
  // this is a super simple parsing, you will want to make this more complex to handle correctly any path
  // it will split by the dots at first and then simply pass along the array (on next iterations)
  const properties = Array.isArray(path) ? path : path.split(separator)

  // Not yet at the last property so keep digging
  if (properties.length > 1) {
    // The property doesn't exists OR is not an object (and so we overwritte it) so we create it
    if (
      !obj.hasOwnProperty(properties[0]) ||
      typeof obj[properties[0]] !== 'object'
    ) { obj[properties[0]] = {} }
    // We iterate.
    return setNestedObjectFromPath(
      properties.slice(1),
      value,
      obj[properties[0]]
    )
    // This is the last property - the one where to set the value
  } else {
    // We set the value to the last property
    obj[properties[0]] = value
    return true // this is the end
  }
}
export function setDeep (
  path,
  value,
  obj,
  setrecursively = false,
  separator = '.'
) {
  const pathWay = Array.isArray(path) ? path : path.split(separator)

  console.log('=== setDeep / pathWay : ', pathWay)
  console.log('=== setDeep / value : ', value)
  console.log('=== setDeep / obj : ', obj)

  pathWay.reduce((a, b, level) => {
    if (
      setrecursively &&
      typeof a[b] === 'undefined' &&
      level !== pathWay.length
    ) {
      a[b] = {}
      return a[b]
    }
    if (level === pathWay.length) {
      a[b] = value
      return value
    }
    return a[b]
  }, obj)
}

// - - - - - - - - - - - - - - - - - - - //
// FORMAT VALUES
// - - - - - - - - - - - - - - - - - - - //
export function slugify(str) {
  var map = {
    '-' : ' ',
    '-' : '_',
    'a' : 'á|à|ã|â|À|Á|Ã|Â',
    'e' : 'é|è|ê|É|È|Ê',
    'i' : 'í|ì|î|Í|Ì|Î',
    'o' : 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    'c' : 'ç|Ç',
    'n' : 'ñ|Ñ'
  }
  for (var pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  }
  return str
}
export function isValFloat(value) {
  return !isNaN(value) && value.toString().indexOf('.') != -1
}
export function minMaxFloors(maxValue, minValue, from = '') {
  // console.log( "\n=== minMaxFloors / from :", from )
  // console.log( "=== minMaxFloors / maxValue :", maxValue )
  // console.log( "=== minMaxFloors / minValue :", minValue )
  const isMaxFloat = isValFloat(maxValue)
  const isMinFloat = isValFloat(minValue)
  const isFloat = isMaxFloat || isMinFloat
  // console.log( "=== minMaxFloors / isFloat, :", isFloat )
  const valueDecimals = Math.ceil(Math.log(maxValue)/Math.log(10)) - 1
  const valuePow = Math.pow(10, valueDecimals)
  let newMax = Math.ceil(maxValue / valuePow) * valuePow
  let newMin = Math.floor(minValue / valuePow) * valuePow
  if (isFloat) {
    newMax = newMax.toFixed(1)
    newMin = newMin.toFixed(1)
  }
  // console.log( "=== minMaxFloors / newMax :", newMax )
  // console.log( "=== minMaxFloors / newMin :", newMin )
  return [newMax, newMin, isFloat]
}

export function numberToStringBasic (number, format, log = false, from = '') {
  // log && console.log( "=== numberToStringBasic / from :", from )
  // log && console.log( "=== numberToStringBasic / format :", format)
  // log && console.log( "=== numberToStringBasic / number (start) :", number )
  let numberAsString
  if (number < 0 ) {
    numberAsString = `- ${Math.abs(number).toString()}`
  } else {
    numberAsString = number.toString()
  }
  const withComma = ['percent', 'float']
  numberAsString = numberAsString.replace(
    /(\d)(?=(\d{3})+(?!\d))/g,
    '$1' + ' '
  )
  if (withComma.includes(format)) {
    numberAsString = numberAsString.replace('.', ',')
  }
  return numberAsString
}
export function numberToString (number, format, log = false, from = '') {
  // log && console.log( "=== numberToString / from :", from )
  // log && console.log( "=== numberToString / format :", format)
  // log && console.log( "=== numberToString / number (start) :", number )
  if (format) {
    switch (format.type) {
      case 'float':
        number = parseFloat(number).toFixed(1)
        break
      case 'integer':
        number = parseInt(number)
        break
    }
  }
  if (number < 0 ) {
    number = `- ${Math.abs(number).toString()}`
  } else {
    number = number.toString()
  }
  if (format && format.sepThousands) {
    number = number.replace(
      /(\d)(?=(\d{3})+(?!\d))/g,
      '$1' + format.sepThousands
    )
  }
  if (format && format.sepComma) {
    number = number.replace('.', format.sepComma)
  }
  if (format && format.preffix) {
    number = `${format.preffix} ${number}`
  }
  if (format && format.unit) {
    number = `${number} ${format.unit}`
  }
  // log && console.log( "=== numberToString / number (end) :", number )
  return number
}
export function toMillionsOrElse (x, params = { divider: 1000000, fixed: 2 }) {
  // console.log( "=== toMillions / x ", x )
  return parseFloat((parseFloat(x) / params.divider).toFixed(params.fixed))
}
export function toFloat (x, params = undefined) {
  // console.log( "=== toFloat / x ", x )
  return parseFloat(x)
}
export function switchFormatFunctions (value, format) {
  let val = value
  format.forEach((fn) => {
    switch (fn.utilsFnName) {
      case 'toMillionsOrElse':
        val = toMillionsOrElse(val, fn.params)
        break
      case 'toFloat':
        val = toFloat(val, fn.params)
        break
    }
  })
  return val
}
export function objectToUrlParams (obj) {
  // console.log('=== objectToUrlParams / obj :', obj)
  const paramsArray = []
  for (const key in obj) {
    let val = obj[key]
    if (val && val !== '') {
      if (Array.isArray(val)) {
        val = val.join(',')
      }
      paramsArray.push(`${key}=${val}`)
    }
  }
  // console.log('=== objectToUrlParams / paramsArray :', paramsArray)
  const paramsString = paramsArray.join('&')
  return paramsString
}
export function objectFromQueriesString (routeParams) {
  const routeQueryRaw = routeParams && routeParams.split('&')
  const routeQueryObj = {}
  if (routeQueryRaw) {
    routeQueryRaw.forEach(item => {
      const splitted = item.split('=')
      if (splitted[0] !== '') {
        routeQueryObj[splitted[0]] = splitted[1]
      }
    })
  }
  return routeQueryObj
}
export function stringFromQueriesObject (routeQuery, exceptionKeys = ['kpifamilies'], onlyKeepKeys = []) {
  let queriesString = ''
  // console.log('\n=== stringFromQueriesObject / exceptionKeys : ', exceptionKeys)
  // console.log('=== stringFromQueriesObject / onlyKeepKeys : ', onlyKeepKeys)
  const routeQueryKeys = Object.keys(routeQuery)
  if (routeQueryKeys.length) {
    for (const q of routeQueryKeys) {
      // console.log('=== stringFromQueriesObject / q : ', q)
      // console.log('=== stringFromQueriesObject / queriesString : ', queriesString)
      if (exceptionKeys.length && !exceptionKeys.includes(q) && routeQuery[q]) {
        queriesString = `${q}=${routeQuery[q]}&${queriesString}`
      }
      if (onlyKeepKeys.length && onlyKeepKeys.includes(q) && routeQuery[q]) {
        queriesString = `${q}=${routeQuery[q]}&${queriesString}`
      }
    }
    // delete last char '&'
    queriesString = queriesString !== '' ? queriesString.slice(0, -1) : queriesString
  }
  // console.log('=== stringFromQueriesObject / queriesString - END : ', queriesString)
  return queriesString
}
export function objectsFromString (str, sepArray = ',', sepObject = ':', resultAs = 'asObject') {
  if (str) {
    // console.log('=== objectsArrayFromString / str :', str)
    const resultArray = []
    const resultObject = {}
    const tempArray = str.split(sepArray)
    for (const i of tempArray) {
      // console.log('\n=== objectsArrayFromString / i :', i)
      const tempObjArray = i.split(sepObject)
      // console.log('=== objectsArrayFromString / tempObjArray :', tempObjArray)

      if (resultAs === 'asArray') {
        const tempObj = {}
        tempObj[tempObjArray[0]] = tempObjArray[1]
        resultArray.push(tempObj)
      } else if (resultAs === 'asObject') {
        resultObject[tempObjArray[0]] = tempObjArray[1]
      }
    }

    if (resultAs === 'asArray') {
      return resultArray
    } else if (resultAs === 'asObject') {
      return resultObject
    }
  } else {
    return undefined
  }
}

// - - - - - - - - - - - - - - - - - - - //
// BROWSERS
// - - - - - - - - - - - - - - - - - - - //

export function detectBrowser(win, doc, nav) {
  // Opera 8.0+
  var isOpera = (!!win.opr && !!opr.addons) || !!win.opera || nav.userAgent.indexOf(' OPR/') >= 0

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined'

  // Safari 3.0+ "[object HTMLElementConstructor]" 
  var isSafari = /constructor/i.test(win.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!win['safari'] || (typeof safari !== 'undefined' && win['safari'].pushNotification))

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/false || !!doc.documentMode

  // Edge 20+
  var isEdge = !isIE && !!win.StyleMedia

  // Chrome 1 - 79
  var isChrome = !!win.chrome && (!!win.chrome.webstore || !!win.chrome.runtime)

  // Edge (based on chromium) detection
  var isEdgeChromium = isChrome && (nav.userAgent.indexOf("Edg") != -1)

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!win.CSS

  return {
    isOpera: isOpera,
    isFirefox: isFirefox,
    isSafari: isSafari,
    isIE: isIE,
    isEdge: isEdge,
    isChrome: isChrome,
    isEdgeChromium: isEdgeChromium,
    isBlink: isBlink,
  }

}
