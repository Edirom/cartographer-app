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
    if (measures[0].hasAttribute('label') && measures[0].getAttribute('label').length > 0) {
      label = measures[0].getAttribute('label')
    } else {
      label = measures[0].getAttribute('n')
    }
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

// TODO: this needs to be more clever
function incrementMeasureNum (num) {
  return parseInt(num) + 1
}

export function insertMeasure (xmlDoc, measure, state, currentZone) {
  console.log('current zone is ' + currentZone)
  // 1. lets have current page refernce
  // 2. Retrieve all the existing zones from that pages
  // 3. Compare the comparision based on the zonesOnCurrentPage
  // 4. Get the position to insert the current zone
  // const currentPage = parseInt(state.currentPage) + 1
  // console.log(currentPage + ' is the current page')

  const currentPage = state.currentPage
  console.log('current zone is ' + currentZone)

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

  // Determine position of new zone on page
  const pageHeight = parseInt(surface.querySelector('graphic').getAttribute('height'))
  // let heightSum = 0
  let topZone = pageHeight
  let minHeight = pageHeight
  // let maxHeight = 0

  const allZones = []

  // ID of new zone
  const newZoneId = currentZone.getAttribute('xml:id')

  zones.forEach(zone => {
    const top = parseInt(zone.getAttribute('uly'))
    const bottom = parseInt(zone.getAttribute('lry'))
    const left = parseInt(zone.getAttribute('ulx'))
    const height = bottom - top

    // heightSum += height
    topZone = Math.min(topZone, top)
    minHeight = Math.min(minHeight, height)
    // maxHeight = Math.max(maxHeight, height)

    allZones.push({
      top: top,
      height: height,
      left: left,
      id: zone.getAttribute('xml:id'),
      new: zone.getAttribute('xml:id') === newZoneId,
      elem: zone
    })
  })
  // const avgHeight = heightSum / existingZones.length
  allZones.sort((a, b) => {
    return a.uly - b.uly
  })

  const thresholdDistance = minHeight * 0.8

  // function to compare newZone against existingZones
  const insertIntoRightSystem = (xmlDoc, surface, targetMdiv, newZone, newMeasure, zones, pageHeight, thresholdDistance, zonesToIncrement, lastGroup) => {
    const currentTop = zones[0].top
    const currentThreshold = currentTop + thresholdDistance
    console.log('looking for measures above ' + currentThreshold)

    const above = []
    const below = []

    zones.forEach(zone => {
      if (zone.top < currentThreshold) {
        above.push(zone)
      } else {
        below.push(zone)
      }
    })

    console.log('above', above)
    console.log('below', below)

    const newIsAbove = above.findIndex(zone => zone.new) !== -1

    if (newIsAbove) {
      // new zone is in current system

      // sort system from left to right
      above.sort((a, b) => {
        return a.left - b.left
      })

      // get position of new zone within system
      const newIndex = above.findIndex(zone => zone.new)

      if (newIndex === 0) {
        // new zone is first within current system
        if (lastGroup.length === 0) {
          // must be the first measure on new page, so introduce new <pb/>

          // get preceding page that has zones
          let precedingZone = null
          let previousPage = surface.previousElementSibling

          while (previousPage !== null && precedingZone === null) {
            const zones = [...previousPage.querySelectorAll('zone')]
            if (zones.length > 0) {
              precedingZone = zones.at(-1)
              previousPage = null
            } else {
              previousPage = previousPage.previousElementSibling
            }
          }

          if (precedingZone !== null) {
            // there are zones that can be continued
            console.log('adding first measure to new page')

            surface.append(newZone)

            const precedingZoneId = precedingZone.getAttribute('xml:id')
            const precedingMeasure = targetMdiv.querySelector('measure[facs~="#' + precedingZoneId + '"]')

            newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n')))
            precedingMeasure.after(newMeasure)

            // create pb, insert after preceding measure
            const pb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'pb')
            pb.setAttribute('facs', '#' + surface.getAttribute('xml:id'))
            precedingMeasure.after(pb)
          } else {
            // this is the first zone for the whole document
            console.log('adding first measure to document')

            const section = targetMdiv.querySelector('section')

            surface.append(newZone)
            newMeasure.setAttribute('n', 1)
            const pb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'pb')
            pb.setAttribute('facs', '#' + surface.getAttribute('xml:id'))
            section.append(pb)
            section.append(newMeasure)
          }
        } else {
          // must be the first measure in new system, so introduce new <sb/> and get last measure from previous system
          console.log('adding measure to new system')

          // order by highest left value
          lastGroup.sort((a, b) => {
            return b.left - a.left
          })

          const precedingZone = lastGroup[0].elem
          precedingZone.after(newZone)

          const precedingZoneId = lastGroup[0].id
          const precedingMeasure = targetMdiv.querySelector('measure[facs~="#' + precedingZoneId + '"]')

          newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n')))
          precedingMeasure.after(newMeasure)

          // create sb, insert after preceding measure
          const sb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'sb')
          precedingMeasure.after(sb)
        }
      } else {
        // measure goes somewhere in current system
        console.log('new measure has ' + newIndex + ' preceding measures in current system')

        const precedingZone = above[newIndex - 1].elem
        precedingZone.after(newZone)

        const precedingZoneId = above[newIndex - 1].id
        const precedingMeasure = targetMdiv.querySelector('measure[facs~="#' + precedingZoneId + '"]')

        newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n')))
        precedingMeasure.after(newMeasure)
      }

      // make sure to increment all following measures on current system
      for (let i = newIndex + 1; i < above.length; i++) {
        zonesToIncrement.push(above[i].id)
      }

      // make sure to increment all measures on lower systems
      below.forEach(zone => {
        zonesToIncrement.push(zone.id)
      })

      return zonesToIncrement
    } else {
      return insertIntoRightSystem(xmlDoc, surface, targetMdiv, newZone, newMeasure, below, pageHeight, thresholdDistance, zonesToIncrement, above)
    }
  }

  const zonesToIncrement = insertIntoRightSystem(xmlDoc, surface, mdiv, currentZone, measure, allZones, pageHeight, thresholdDistance, [], [])
  console.log('zonesToIncrement:')
  console.log(zonesToIncrement)
  // keep track of all measures that have been incremented already, i.e. avoid to increment measures with multiple zones more than once
  const measuresAlreadyIncremented = []
  zonesToIncrement.forEach(zoneId => {
    mdiv.querySelectorAll('measure[facs~="#' + zoneId + '"]').forEach(measure => {
      const measureId = measure.getAttribute('xml:id')
      if (measuresAlreadyIncremented.indexOf(measureId) === -1) {
        measure.setAttribute('n', incrementMeasureNum(measure.getAttribute('n')))
        measuresAlreadyIncremented.push(measureId)
      }
    })
  })

  //  Increament the next measures by one
  const type = 'increment'
  updateNextMeasures(currentPage, type, xmlDoc)
}
function updateNextMeasures (currentPage, type, xmlDoc, zone, measure) {
  const surfaces = [...xmlDoc.querySelectorAll('surface')]
  if (type === 'decreament') {
    surfaces.forEach(sur => {
      if (sur.children.length > 1) {
        for (let i = 1; i < sur.children.length; i++) {
          const zoneId = sur.children[i].getAttribute('xml:id')
          const meas = [...xmlDoc.querySelectorAll('measure')].find(meas => meas.getAttribute('facs') === '#' + zoneId)
          if (parseInt(meas.getAttribute('n')) > parseInt(measure.getAttribute('n'))) {
            console.log('this will be deleted zone ' + measure.getAttribute('n') + ' ' + meas.getAttribute('n'))
            meas.setAttribute('n', parseInt(meas.getAttribute('n')) - 1)
          } else {
            // meas.setAttribute('n', parseInt(meas.getAttribute('n')))
          }
        }
      }
    })
  }
  // else if (type === 'increament') {
  //   const page = parseInt(currentPage) + 1
  //   surfaces.forEach(sur => {
  //     if (sur.getAttribute('n') > page && sur.children.length > 1) {
  //       for (let i = 1; i < sur.children.length; i++) {
  //         const zoneId = sur.children[i].getAttribute('xml:id')
  //         const meas = [...xmlDoc.querySelectorAll('measure')].find(meas => meas.getAttribute('facs') === '#' + zoneId)
  //         if (type === 'increment') {
  //           meas.setAttribute('n', parseInt(meas.getAttribute('n')) + 1)
  //         }
  //       }
  //     }
  //   })
  // }
}
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

export function deleteZone (xmlDoc, id, state) {
  const currentPage = state.currentPage
  const type = 'decreament'
  console.log('this is deleted zone id  ' + id)
  const surface = xmlDoc.querySelectorAll('surface')[currentPage]
  const zone = [...surface.querySelectorAll('zone')].find(zone => zone.getAttribute('xml:id') === id)
  const zoneId = zone.getAttribute('xml:id')
  const meas = [...xmlDoc.querySelectorAll('measure')].find(meas => meas.getAttribute('facs') === '#' + zoneId)
  updateNextMeasures(currentPage, type, xmlDoc, zone, meas)
  zone.remove()
  if (meas.nextSibling != null) {
    if (meas.previousSibling.tagName === 'pb' && meas.nextSibling.tagName === 'sb') {
      meas.nextSibling.remove()
      meas.remove()
    } else if (meas.previousSibling.tagName === 'sb' && meas.nextSibling.tagName === 'sb') {
      meas.nextSibling.remove()
      meas.remove()
    }
  }
  // const type = 'decreament'
}

export function setMultiRest (measure, val) {
  const existingMultiRests = measure.querySelectorAll('multiRest')
  // there are already multiRests
  if (existingMultiRests.length > 0) {
    // a new value for multiRest shall be written
    if (val !== null) {
      console.log('case 1')
      existingMultiRests.forEach(mr => {
        mr.setAttribute('num', val)
      })
    } else { // multiRest is supposed to be deleted
      const layerContent = measure.querySelectorAll('layer *')
      const otherContent = [...layerContent].find(elem => elem.localName !== 'multiRest')
      if (otherContent !== undefined) { // remove multiRests only
        console.log('case 2a')
        existingMultiRests.forEach(mr => mr.remove())
      } else { // remove whole tree
        console.log('case 2b')
        measure.querySelectorAll('staff').forEach(staff => staff.remove())
      }
    }
  } else { // no prior multiRests available
    if (val !== null) { // insert new multiRest to measure
      console.log('case 3')
      const staff = document.createElementNS('http://www.music-encoding.org/ns/mei', 'staff')
      staff.setAttribute('n', 1)
      const layer = document.createElementNS('http://www.music-encoding.org/ns/mei', 'layer')

      const multiRest = document.createElementNS('http://www.music-encoding.org/ns/mei', 'multiRest')
      multiRest.setAttribute('num', val)

      staff.append(layer)
      layer.append(multiRest)
      measure.append(staff)
    } else {
      console.log('case 4')
      // no existing multiRest, and no multiRest is wanted -> do nothing
    }
  }
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
