import { uuid } from '@/tools/uuid.js'
export function meiZone2annotorious (mei, zoneInput, pageUri) {
  const zone = (typeof zoneInput === 'string') ? mei.querySelector('[*|id=' + zoneInput + ']') : zoneInput
  const zoneId = zone.getAttribute('xml:id')
  const measures = []
  mei.querySelectorAll('measure[facs~="#' + zoneId + '"]').forEach(measure => {
    measures.push(measure)
  })
  const hasDataLink = zone.hasAttribute('data') && zone.getAttribute('data').length > 0

  if (hasDataLink) {
    const links = zone.getAttribute('data').replace(/\s+/g, ' ').trim().split(' ')
    links.forEach(dataId => {
      if (dataId.startsWith('#')) {
        const elem = mei.querySelector(dataId)
        if (elem !== null) {
          measures.push(elem)
        }
      }
    })
  }

  const measureNums = []
  const measureLinks = []
  const mdivLinks = []

  measures.forEach(measure => {
    measureNums.push(parseInt(measure.getAttribute('n'), 10))
    measureLinks.push('measure#' + measure.getAttribute('xml:id'))
    const mdivId = 'mdiv#' + measure.closest('mdiv').getAttribute('xml:id')
    if (mdivLinks.indexOf(mdivId) === -1) {
      mdivLinks.push(mdivId)
    }
  })

  const additionalBodies = []
  const measureCssLink = measureLinks.join(', ')
  const mdivCssLink = mdivLinks.join(', ')
  additionalBodies.push({
    type: 'Dataset',
    selector: {
      type: 'CssSelector',
      value: measureCssLink
    }
  })
  additionalBodies.push({
    type: 'Dataset',
    selector: {
      type: 'CssSelector',
      value: mdivCssLink
    }
  })

  let label
  if (measureNums.length === 1) {
    label = measures[0].getAttribute('label')
  } else if (measureNums.length === 0) {
    label = '–'
  } else {
    const minIndex = Math.min(...measureNums)
    const maxIndex = Math.max(...measureNums)
    const minLabel = measures.find(measure => parseInt(measure.getAttribute('n'), 10) === minIndex).getAttribute('label')
    const maxLabel = measures.find(measure => parseInt(measure.getAttribute('n'), 10) === maxIndex).getAttribute('label')
    label = minLabel + '–' + maxLabel
  }

  const ulx = parseInt(zone.getAttribute('ulx'))
  const uly = parseInt(zone.getAttribute('uly'))
  const lrx = parseInt(zone.getAttribute('lrx'))
  const lry = parseInt(zone.getAttribute('lry'))
  const xywh = ulx + ',' + uly + ',' + (lrx - ulx) + ',' + (lry - uly)

  const annot = {
    type: 'Annotation',
    body: [{
      type: 'TextualBody',
      purpose: 'tagging',
      value: label
    }, ...additionalBodies],
    target: {
      source: pageUri,
      selector: {
        type: 'FragmentSelector',
        conformsTo: 'http://www.w3.org/TR/media-frags/',
        value: 'xywh=pixel:' + xywh
      }
    },
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id: zoneId
  }

  return annot
}

export function annotorious2meiZone (annot) {
  const rawDimensions = annot.target.selector.value.substr(11).split(',')
  const xywh = {
    x: Math.round(rawDimensions[0]),
    y: Math.round(rawDimensions[1]),
    w: Math.round(rawDimensions[2]),
    h: Math.round(rawDimensions[3])
  }
  const id = annot.id

  const zone = document.createElementNS('http://www.music-encoding.org/ns/mei', 'zone')
  zone.setAttribute('xml:id', id)
  zone.setAttribute('type', 'measure')
  zone.setAttribute('ulx', xywh.x)
  zone.setAttribute('uly', xywh.y)
  zone.setAttribute('lrx', xywh.x + xywh.w)
  zone.setAttribute('lry', xywh.y + xywh.h)

  return zone
}

export function measureDetector2meiZone (rect) {
  const id = 'd' + uuid()
  const zone = document.createElementNS('http://www.music-encoding.org/ns/mei', 'zone')
  zone.setAttribute('xml:id', id)
  zone.setAttribute('type', 'measure')
  zone.setAttribute('ulx', Math.round(rect.ulx))
  zone.setAttribute('uly', Math.round(rect.uly))
  zone.setAttribute('lrx', Math.round(rect.lrx))
  zone.setAttribute('lry', Math.round(rect.lry))

  return zone
}

export function generateMeasure () {
  const measure = document.createElementNS('http://www.music-encoding.org/ns/mei', 'measure')
  measure.setAttribute('xml:id', 'b' + uuid())

  return measure
}
function getZoneOnTheTop (allZones) {
  console.log('all zones ' + allZones.length)
  let topZone = 10000000
  allZones.forEach(zone => {
    topZone = Math.min(topZone, parseInt(zone.uly))
  })
  return topZone
}
function calculateFactor (topZone) {
  return topZone * 2
}
function getSystems (allZones, factor, currentSystem, top, allSystem) {
  console.log('factor is ' + factor)
  if (allZones.length > 0) {
    if (allZones[0].uly < factor) {
      console.log(currentSystem.length + ' before adding')
      if (!currentSystem.includes(allZones[0])) {
        currentSystem.push(allZones[0])
      }
      console.log(currentSystem.length + ' after adding')
      console.log('elements in the same system ' + allZones[0].uly + ' factor ' + factor)
      allZones.splice(0, 1)
      getSystems(allZones, factor, currentSystem, top, allSystem)
    } else {
      console.log(currentSystem.length + ' this always has to be 0')

      if (!currentSystem.includes(allZones[0])) {
        currentSystem.push(allZones[0])
      }

      allSystem.push(currentSystem)
      allZones.splice(0, 1)
      top = getZoneOnTheTop(allZones)
      factor = calculateFactor(top)
      currentSystem.length = 0
      getSystems(allZones, factor, currentSystem, top, allSystem)
    }
  }

  return currentSystem
}
export function insertMeasure (xmlDoc, measure, state, currentZone) {
  const currentSystem = []
  const allSystem = []

  // 1. lets have current page refernce
  // 2. Retrieve all the existing zones from that pages
  // 3. Compare the comparision based on the zonesOnCurrentPage
  // 4. Get the position to insert the current zone
  // const currentPage = parseInt(state.currentPage) + 1
  // console.log(currentPage + ' is the current page')

  const currentPage = state.currentPage
  console.log('current zone is ' + currentZone)
  // const label = []
  // const surfaces = xmlDoc.querySelectorAll('surface')
  // const surface = [...xmlDoc.querySelectorAll('surface')].find(surface => surface.getAttribute('n') === curres
  const surface = xmlDoc.querySelectorAll('surface')[currentPage]
  const zones = [...surface.querySelectorAll('zone')]

  // surfaces.forEach(surface => {
  //   console.log(surface.getAttribute('n') + ' is the name of the attribute')
  // })
  // console.log('currentZone is the x value ' + Math.round(rect.ulx) + ' ' + Math.round(rect.uly))
  // const xDistance = Math.round(rects[0].ulx) - Math.round(rects[10].ulx)
  // const yDistance = Math.round(rects[0].uly) - Math.round(rects[10].uly)
  // console.log('distance between the first measure and the second measure is ' + Math.sqrt(xDistance * xDistance + yDistance * yDistance))
  // if(Math.round(rects[0].uly) > Math.round())
  const mdivArray = [...xmlDoc.querySelectorAll('mdiv')]

  if (mdivArray.length === 0) {
    const mdivId = createNewMdiv(xmlDoc)
    state.currentMdivId = mdivId
  }
  const mdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)

  // TODO: what if mdivId does not match the ID of an mdiv?
  const section = [...mdiv.querySelectorAll('section')].slice(-1)[0]

  //
  // const surfaces = xmlDoc.querySelectorAll('surface')
  // console.log(xmlDoc)

  // surfaces.forEach(surface => {
  //   if (surface.children.length > 1 && !listSurface.includes(surface.getAttribute("n")) ) {
  //     console.log('currentZone is surface')
  //     listSurface.append(surfa)
  //   }
  // })

  // TODO: prepare for parts, right now it supports score only
  const measures = [...mdiv.querySelectorAll('measure')]
  // compareTo(measures, measure)

  const num = measures.length === 0 ? 1 : (parseInt(measures.slice(-1)[0].getAttribute('label'), 10) + 1)
  measure.setAttribute('label', num)
  measure.setAttribute('n', measures.length + 1)
  // const arr = []
  // let yheight = {}
  // const maxh = 0
  const allZones = []
  zones.forEach(zone => {
    allZones.push({
      uly: parseInt(zone.getAttribute('uly')),
      lry: parseInt(zone.getAttribute('lry')),
      id: zone.getAttribute('xml:id')
    })
    // const mid = parseInt(zone.getAttribute('lry')) - parseInt(zone.getAttribute('uly'))
    // const midy = mid / 2
    // console.log('this are systems ' + check(midy, zones).length)

    // const height = parseInt(zone.getAttribute('lry')) - parseInt(zone.getAttribute('uly'))
    // const y = parseInt(zone.getAttribute('uly'))
    // yheight = {
    //   y: y,
    //   height: height,
    //   id: zone.getAttribute('xml:id')
    // }
    // arr.push(yheight)
    // getPosition(zone, currentZone, state.sys, label)
  })

  //  console.log(sys.length)
  // console.log(' this is system ' + getPosition(arr, surface, xmlDoc, state).length)

  while (allZones.length > 0) {
    const top = getZoneOnTheTop(allZones)
    const factor = calculateFactor(top)
    console.log('this is new top ' + top + ' this is new factor' + factor)
    const currentSystems = getSystems(allZones, factor, currentSystem, top, allSystem)
    console.log('current systems are ' + currentSystems.length)

    console.log('all zones ' + allZones.length)

    // state.sys.push(label)
    section.appendChild(measure)
  }
}
// function check (midy, zones) {
//   const test = []
//   zones.forEach(zone => {
//     const uly2 = parseInt(zone.getAttribute('uly'))
//     console.log('uly2 ' + uly2 + ' midy ' + midy)
//     if (uly2 > midy && !test.includes(zone.getAttribute('xml:id'))) {
//       test.push(zone.getAttribute('xml:id'))
//     }
//   })
//   return test
// }
// function getPosition (arr, surface, xmlDoc, state) {
//   const pageHeight = surface.querySelector('graphic').getAttribute('height')
//
//   let heightSum = 0
//   let topZone = pageHeight
//   let minHeight = pageHeight
//   let maxHeight = 0
//
//   arr.forEach(zone => {
//     heightSum += zone.height
//     topZone = Math.min(topZone, zone.y)
//     minHeight = Math.min(minHeight, zone.height)
//     maxHeight = Math.max(maxHeight, zone.height)
//   })
//   const averageHeight = heightSum / arr.length
//
//   console.log('--------------')
//   console.log('averageHeight:', averageHeight)
//   console.log('topZone: ', topZone)
//   console.log('minHeight: ', minHeight)
//   console.log('maxHeight: ', maxHeight)
//   console.log('pageHeight: ', pageHeight)
//
//   const factor = 2 / 3
//   const thresholdDistance = minHeight * factor
//
//   const systems = compare(arr, thresholdDistance, state)
//   return systems
//
// // how much of the smallest measure is used
//   // todo: order array
// }
// function compare (arr, thresholdDistance, state) {
//   const firstSystem = []
//   let followUpSystems = []
//
//   const threshold = arr[0].y + thresholdDistance
//   console.log('result array ' + state.resultingArray)
//   arr.forEach(zone => {
//     if (zone.y < threshold) {
//       firstSystem.push(zone)
//     } else {
//       followUpSystems.push(zone)
//     }
//   })
//   if (followUpSystems.length > 0) {
//     followUpSystems = compare(followUpSystems, thresholdDistance, state)
//   }
//
//   return firstSystem
//
//   // return resultingArray
//   // get all measures above this line into one array, recursively call same function on all measures below this line
// }
// function getSurface (zones) {
//   return state.currentPage
// }
//
// function compareTo(measures, measure) {
//         const result = 0;
//         // The same zones
//         if (currentZone.ulx == zone.ulx && currentZone.uly == zone.uly &&
//                 currentZone.lry == zone.lry && currentZone.lrx == zone.lrx) {
//             return 0;
//         }
//         // If to be added zone has lower uly and lower ulx than the compared zone
//         if (currentZone.uly < zone.uly && currentZone.ulx < zone.ulx) {
//             return -1;
//         }
//         // If to be added zone has greater uly and greater ulx than the compared zone
//         if (currentZone.uly > zone.uly && currentZone.ulx > zone.ulx) {
//             return 1;
//         }
//
//         // Substracting the value of lrx from
//         if(Math.min(currentZone.lrx - currentZone.uly, zone.lrx - zone.uly) == 0) {
//             result = (const) (zone.ulx - currentZone.ulx);
//             if(result == 0) {
//                 result = (const) (zone.uly - currentZone.uly);
//             }
//             return result;
//         }
//         double yIsectFactor = (Math.min(currentZone.lrx, zone.lrx) - Math.max(currentZone.uly, zone.uly)) /
//                 Math.min(currentZone.lrx - currentZone.uly, zone.lrx - zone.uly);
//         if (yIsectFactor < 0.5) {
//             result = (const) (zone.ulx - currentZone.ulx);
//             if(result == 0) {
//                 result = (const) (currentZone.uly - zone.uly);
//             }
//             return result;
//         }
//         result = (const) (currentZone.ulx - zone.ulx);
//         if(result == 0) {
//             result = (const) (currentZone.uly - zone.uly);
//         }
//         return result;
//     }

export function addZoneToLastMeasure (xmlDoc, zoneId) {
  const measure = getLastMeasure(xmlDoc)
  const oldFacs = measure.hasAttribute('facs') ? measure.getAttribute('facs') + ' ' : ''
  console.log(oldFacs)
  measure.setAttribute('facs', oldFacs + '#' + zoneId)
}

function getLastMeasure (xmlDoc) {
  const measure = [...xmlDoc.querySelectorAll('measure')].slice(-1)[0]
  return measure
}

function createNewMdiv (xmlDoc) {
  const body = xmlDoc.querySelector('body')
  const mdivArray = xmlDoc.querySelectorAll('mdiv')

  const mdiv = document.createElementNS('http://www.music-encoding.org/ns/mei', 'mdiv')
  const mdivId = 'm' + uuid()
  mdiv.setAttribute('xml:id', mdivId)
  mdiv.setAttribute('label', 'Movement ' + (mdivArray.length + 1))

  const score = document.createElementNS('http://www.music-encoding.org/ns/mei', 'score')
  const section = document.createElementNS('http://www.music-encoding.org/ns/mei', 'section')

  score.appendChild(section)
  mdiv.appendChild(score)

  body.appendChild(mdiv)
  return mdivId
}

/*
{
  "type": "Annotation",
  "body": [
    {
      "type": "TextualBody",
      "purpose": "tagging",
      "value": "measure"
    }
  ],
  "target": {
    "source": "http://edirom-images.beethovens-werkstatt.de/Scaler/IIIF/US-NYj_31_B393cp_no.5_errata%2F001.jpg",
    "selector": {
      "type": "FragmentSelector",
      "conformsTo": "http://www.w3.org/TR/media-frags/",
      "value": "xywh=pixel:864.4168090820312,1217.0018310546875,1298.1351928710938,718.6104736328125"
    }
  },
  "@context": "http://www.w3.org/ns/anno.jsonld",
  "id": "#d808b879-1d1a-44e7-85e7-ae95584b7933"
} */
