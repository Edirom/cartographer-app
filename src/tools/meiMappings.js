import { uuidv4 } from '@/tools/iiif.js'

export function meiZone2annotorious (mei, zoneInput, pageUri) {
  const zone = (typeof zoneInput === 'string') ? mei.querySelector('#' + zoneInput) : zoneInput
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
      value: 'measure'
    }],
    target: {
      source: pageUri,
      selector: {
        type: 'FragmentSelector',
        conformsTo: 'http://www.w3.org/TR/media-frags/',
        value: 'xywh=pixel:' + xywh
      }
    },
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id: '#' + zoneId
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
  const id = annot.id.substring(1)

  const zone = document.createElementNS('zone')
  zone.setAttribute('xml:id', id)
  zone.setAttribute('type', 'measure')
  zone.setAttribute('ulx', xywh.x)
  zone.setAttribute('uly', xywh.y)
  zone.setAttribute('lrx', xywh.x + xywh.w)
  zone.setAttribute('lry', xywh.y + xywh.h)

  return zone
}

export function generateMeasure () {
  const measure = document.createElement('measure')
  measure.setAttribute('xml:id', 'm' + uuidv4())

  return measure
}

export function insertMeasure (xmlDoc, measure, mdivId) {
  const mdivArray = xmlDoc.querySelectorAll('mdiv')
  if (mdivArray.length === 0) {
    createNewMdiv(xmlDoc)
  }

  if (mdivId === null || mdivId === undefined) {
    // get last section in last mdiv, append measure
    const mdiv = [...xmlDoc.querySelectorAll('mdiv')].slice(-1)[0]
    const section = [...mdiv.querySelectorAll('section')].slice(-1)[0]
    section.appendChild(measure)
  } else {
    const mdiv = mdivArray.find(mdiv => mdiv.getAttribute('xml:id') === mdivId)

    // todo: what if mdivId does not match the ID of an mdiv?
    const section = mdiv.querySelectorAll('section').slice(-1)[0]
    section.appendChild(measure)
  }
}

function createNewMdiv (xmlDoc) {
  const body = xmlDoc.querySelector('body')
  const mdivArray = xmlDoc.querySelectorAll('mdiv')

  const mdiv = document.createElement('mdiv')
  mdiv.setAttribute('xml:id', 'm' + uuidv4())
  mdiv.setAttribute('label', 'Movement ' + (mdivArray.length + 1))

  const score = document.createElement('score')
  const section = document.createElement('section')

  score.appendChild(section)
  mdiv.appendChild(score)

  body.appendChild(mdiv)
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
