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

export function insertMeasure (xmlDoc, measure, state) {
  const mdivArray = [...xmlDoc.querySelectorAll('mdiv')]

  if (mdivArray.length === 0) {
    const mdivId = createNewMdiv(xmlDoc)
    state.currentMdivId = mdivId
  }
  const mdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)

  // TODO: what if mdivId does not match the ID of an mdiv?
  const section = [...mdiv.querySelectorAll('section')].slice(-1)[0]

  // TODO: prepare for parts, right now it supports score only
  const measures = [...mdiv.querySelectorAll('measure')]
  const num = measures.length === 0 ? 1 : (parseInt(measures.slice(-1)[0].getAttribute('label'), 10) + 1)
  measure.setAttribute('label', num)
  measure.setAttribute('n', measures.length + 1)
  section.appendChild(measure)
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
