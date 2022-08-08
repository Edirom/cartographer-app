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
function generateMeasureMeasureDetector (label, n, measure) {
  measure.setAttribute('label', label)
  measure.setAttribute('n', n + 1)
  return measure
}
export function generateMeasure () {
  const measure = document.createElementNS('http://www.music-encoding.org/ns/mei', 'measure')
  measure.setAttribute('xml:id', 'b' + uuid())

  return measure
}
function generateSection (state) {
  const section = document.createElementNS('http://www.music-encoding.org/ns/mei', 'section')
  section.setAttribute('n', state.currentPage + 1)
  section.setAttribute('uuid', uuid())
  console.log('section is generating ')
  return section
}
function checksmMinimumSection (sections, state) {
  console.log(sections.length + ' this is sections')
  if (sections.length > 0) {
    for (let i = 0; i < sections.length; i++) {
      const n = sections[i].getAttribute('n')
      if (n > state.currentPage + 1) {
        return true
      }
      if (i === sections.length - 1) {
        return false
      }
    }
  } else {
    return false
  }
}
function getMeasurePosition (sections, state) {
  if (sections.length > 0) {
    for (let i = 0; i < sections.length; i++) {
      const n = sections[i].getAttribute('n')
      if (n > state.currentPage + 1) {
        console.log('thi is the size of sections ' + sections.length + ' the current section is ' + i)
        return i
      }
      if (i === sections.length - 1) {
        return 0
      }
    }
  } else {
    return 0
  }
}
function sortMeasure (measures, sections, position, state) {
  for (let i = parseInt(position); i < sections.length; i++) {
    for (let j = 0; j < sections[i].children.length; j++) {
      console.log('which section is it ' + i)
      sections[i].children[j].setAttribute('label', state.startLabel + 1)
      state.startLabel = state.startLabel + 1
    }
  }
}
function checkFirstPage (sections, state) {
  if (sections.length > 0) {
    for (let i = 0; i < sections.length; i++) {
      const n = sections[i].getAttribute('n')
      if (state.currentPage < n) {
        if (i === sections.length - 1) {
          return true
        }
      } else {
        return false
      }
    }
  }
}
function getPreviousLabel (sections, state) {
  for (let i = 0; i < sections.length; i++) {
    console.log('this section ' + sections[i].getAttribute('n') + ' current page ' + state.currentPage)
    if (sections[i].getAttribute('n') < state.currentPage + 1) {
      // for (let j = 0; j = sections[i].children.length; j++) {
      //   state.startLabel = sections[i].children[j].getAttribute('label')
      // }
      state.startLabel = parseInt(sections[i].lastChild.getAttribute('label'))
    }
  }
}

export function insertMeasure (xmlDoc, measure, state, rects, rect, startLabel) {
  const mdivArray = [...xmlDoc.querySelectorAll('mdiv')]
  if (mdivArray.length === 0) {
    const mdivId = createNewMdiv(xmlDoc)
    state.currentMdivId = mdivId
  }
  const mdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)
  const score = [...mdiv.querySelectorAll('score')].slice(-1)[0]
  const measures = [...mdiv.querySelectorAll('measure')]
  const sections = xmlDoc.querySelectorAll('section')
  const sect = checksmMinimumSection(sections, state)
  if (sect) {
    if (rects[0] === rect) {
      if (checkFirstPage(sections, state)) {
        state.startLabel = 1
        generateMeasureMeasureDetector(state.startLabel, measures.length, measure)
        // measure.setAttribute('label', state.startLabel)
        // measure.setAttribute('n', measures.length + 1)
      } else if (!checkFirstPage(sections, state)) {
        getPreviousLabel(sections, state)
        generateMeasureMeasureDetector(state.startLabel + 1, measures.length, measure)

        // measure.setAttribute('label', state.startLabel + 1)
        // measure.setAttribute('n', measures.length + 1)
      }
    } else {
      // const num = startLabel + 1
      state.startLabel = startLabel + 1
      generateMeasureMeasureDetector(state.startLabel, measures.length, measure)

      // measure.setAttribute('label', state.startLabel)
      // measure.setAttribute('n', measures.length + 1)
    }
  } else {
    state.startLabel = startLabel + 1
    generateMeasureMeasureDetector(state.startLabel, measures.length, measure)
    // measure.setAttribute('label', state.startLabel)
    // measure.setAttribute('n', measures.length + 1)
  }
  if (rects[rects.length - 1] === rect && sect) {
    sortMeasure(measures, sections, getMeasurePosition(sections, state), state)
  }
  if (rects[0] === rect) {
    const section = generateSection(state)
    section.appendChild(measure)
    const sect = checksmMinimumSection(sections, state)
    if (sect) {
      score.insertBefore(section, sections[getMeasurePosition(sections, state)])
    } else {
      score.appendChild(section)
    }
  } else {
    const section = [...mdiv.querySelectorAll('section')].slice(-1)[0]
    const sections = xmlDoc.querySelectorAll('section')
    const sect = checksmMinimumSection(sections, state)
    if (sect) {
      sections[getMeasurePosition(sections, state) - 1].appendChild(measure)
    } else {
      section.appendChild(measure)
    }
  }
}

export function addZoneToLastMeasure (xmlDoc, zoneId) {
  const measure = getLastMeasure(xmlDoc)
  const oldFacs = measure.hasAttribute('facs') ? measure.getAttribute('facs') + ' ' : ''
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
