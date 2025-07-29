import { uuid } from '@/tools/uuid.js'
/**
 * Converts an MEI <zone> element into an Annotorious annotation object.
 * - Finds all measures linked to the zone (via @facs or @data).
 * - Gathers measure and mdiv references for annotation metadata.
 * - Computes a label for the annotation based on measure numbers or labels.
 * - Calculates the bounding box (xywh) for the zone.
 * - Returns an annotation object compatible with the W3C Web Annotation Data Model and Annotorious.
 *
 * @param {Document} mei - The MEI XML document.
 * @param {Element|string} zoneInput - The <zone> element or its xml:id.
 * @param {string} pageUri - The image URI for the page.
 * @returns {Object} - Annotorious-compatible annotation object.
 */
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

  if (measures.length === 0) {
    console.error('\nHouston!!!')
  }

  const mdivIds = []
  mei.querySelectorAll('mdiv').forEach(mdiv => { mdivIds.push(mdiv.getAttribute('xml:id')) })

  const measureNums = []
  const measureLinks = []
  const mdivLinks = []
  const mdivIndizes = []

  measures.forEach(measure => {
    measureNums.push(parseInt(measure.getAttribute('n'), 10))
    measureLinks.push('measure#' + measure.getAttribute('xml:id'))
    const mdivId = measure.closest('mdiv').getAttribute('xml:id')
    mdivIndizes.push('mov_' + mdivIds.indexOf(mdivId))
    if (mdivLinks.indexOf(mdivId) === -1) {
      mdivLinks.push('mdiv#' + mdivId)
    }
  })

  const additionalBodies = []
  const measureCssLink = measureLinks.join(', ')
  const mdivCssLink = mdivLinks.join(', ')
  const mdivIndexClasses = mdivIndizes.join(', ')
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
  additionalBodies.push({
    type: 'Dataset',
    selector: {
      type: 'CssSelector',
      value: mdivIndexClasses
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

/**
 * Converts an Annotorious annotation object into an MEI <zone> element.
 * - Extracts the bounding box (xywh) from the annotation's selector.
 * - Rounds and maps the coordinates to MEI zone attributes (ulx, uly, lrx, lry).
 * - Sets the zone type to "measure" and assigns the annotation's id.
 *
 * @param {Object} annot - Annotorious annotation object.
 * @returns {Element} - An MEI <zone> element representing the annotation region.
 */
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
/**
 * Converts a rectangle (e.g., from a measure detector tool) into an MEI <zone> element.
 * - Generates a unique zone ID.
 * - Sets the zone type to "measure".
 * - Maps and rounds the rectangle's coordinates to MEI zone attributes (ulx, uly, lrx, lry).
 *
 * @param {Object} rect - Rectangle object with ulx, uly, lrx, lry properties.
 * @returns {Element} - An MEI <zone> element representing the detected measure region.
 */

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
/**
 * Creates a new MEI <measure> element with a unique xml:id.
 *
 * @returns {Element} - A new MEI <measure> element.
 */
export function generateMeasure () {
  const measure = document.createElementNS('http://www.music-encoding.org/ns/mei', 'measure')
  measure.setAttribute('xml:id', 'b' + uuid())

  return measure
}

function incrementMeasureNum (num, diff) {
  return parseInt(num) + diff
}
function decrementMeasureNum (num, diff) {
  return parseInt(num) - diff
}

/**
 * Inserts a measure into the MEI file
 * @param  {[type]} xmlDoc                    the MEI file as DOM
 * @param  {[type]} measure                   the measure to be inserted. @n will be adjusted
 * @param  {[type]} state                     the Vuex state, barely used in here
 * @param  {[type]} currentZone               the zone that belongs to the new measure
 * @param  {[type]} pageIndex                 the index of the page on which it needs to be inserted, zero-based
 * @param  {[type]} targetMdiv                the mdiv in which this is supposed to be inserted
 * @return {[type]}             [description]
 */
export function insertMeasure (xmlDoc, measure, state, currentZone, pageIndex, targetMdiv) {
  const surfaceIDs = []
  xmlDoc.querySelectorAll('surface').forEach(surface => {
    surfaceIDs.push(surface.getAttribute('xml:id'))
  })

  const pbs = []
  pbs.length = surfaceIDs.length
  xmlDoc.querySelectorAll('pb').forEach(pb => {
    const surfaceID = pb.getAttribute('facs').substring(1)
    const index = surfaceIDs.indexOf(surfaceID)
    pbs[index] = pb
  })
  const pb = pbs[pageIndex]
  let relativeTo
  let relativeWhere

  const pbAlreadyStarted = pb !== undefined

  if (pbAlreadyStarted) {
    // insert relative to that page
    relativeTo = pb
    relativeWhere = 'within'
  } else {
    let nextPb
    let nextIndex = pageIndex + 1

    while (pbs[nextIndex] === undefined && nextIndex < pbs.length) {
      nextIndex++
    }
    if (pbs[nextIndex] !== undefined) {
      nextPb = pbs[nextIndex]
    }

    if (nextPb === undefined) {
      // insert at the end of last mdiv
      relativeTo = null
      relativeWhere = 'end'
    } else {
      // insert prior to nextPb
      relativeTo = nextPb
      relativeWhere = 'before'
    }
  }

  const surface = xmlDoc.querySelectorAll('surface')[pageIndex]
  const zones = [...surface.querySelectorAll('zone')]

  let mdiv  
  console.log("targetMdiv is ", targetMdiv)

if (targetMdiv === undefined) {
    const mdivArray = [...xmlDoc.querySelectorAll('mdiv')]
    if (mdivArray.length === 0) {
        const mdivId = createNewMdiv(xmlDoc)
        state.currentMdivId = mdivId
    } else {
        const lastMdiv = mdivArray[mdivArray.length - 1]
        state.currentMdivId = lastMdiv.getAttribute('xml:id')
    }

    mdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)
}else{
    mdiv = targetMdiv

}


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

  const insertIntoRightSystem = (xmlDoc, surface, targetMdiv, newZone, newMeasure, zones, pageHeight, thresholdDistance, zonesToIncrement, lastGroup, state) => {
    
    console.log("line 320 the firsts mdiv was ", targetMdiv)
    const currentTop = zones[0].top
    const currentThreshold = currentTop + thresholdDistance
    // Looking for measures above ' + currentThreshold

    const above = []
    const below = []

    zones.forEach(zone => {
      if (zone.top < currentThreshold) {
        above.push(zone)
      } else {
        below.push(zone)
      }
    })

    const newIsAbove = above.findIndex(zone => zone.new) !== -1

    if (newIsAbove) {
      // new zone is in current system

      // sort system from left to right
      above.sort((a, b) => {
        return a.left - b.left
      })

      if(above.length > 1){
          const measure = xmlDoc.querySelector(`measure[facs~="#${above[1].id}"]`);
          const mdiv = measure ? measure.closest('mdiv') : null;
          if (mdiv !== null) {
            targetMdiv = mdiv
          }
      }

      // get position of new zone within system
      const newIndex = above.findIndex(zone => zone.new)
      if (newIndex === 0 ) {
        if(targetMdiv.getAttribute("xml:id") ==  state.currentMdivId)
          {
        console.log("new index is zero, inserting at beginning of system ")
        
        // new zone is first within current system
        if (lastGroup.length === 0) {
          // must be the first measure on new page, so introduce new <pb/>
          const precedingZone = getPrecedingZone(xmlDoc, surface)
          if (precedingZone !== null) {
            // there are zones that can be continued
            surface.prepend(newZone)
            const precedingMeasure = getMeasuresFromZone(xmlDoc, precedingZone)[0]

            newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n'), 1))
            precedingMeasure.after(newMeasure)
            const facsId = surface.getAttribute('xml:id');
            const pageNum = surface.getAttribute('n');

            const body = xmlDoc.querySelector('body');

            const existingPb = body.querySelector(`pb[facs="#${facsId}"][n="${pageNum}"]`)
            if(existingPb){
              existingPb.remove()
            }
            // create pb, insert after preceding measure
            const pb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'pb')
            pb.setAttribute('facs', '#' + surface.getAttribute('xml:id'))
            pb.setAttribute('n', surface.getAttribute('n'))
            precedingMeasure.after(pb)

          } 
    else {
           if(targetMdiv !== undefined && targetMdiv !== null && targetMdiv.querySelector('measure') !== null){

             const section = targetMdiv.querySelector('section')


            const body = xmlDoc.querySelector('body');
            const mdivs = Array.from(body.querySelectorAll('mdiv'));
            const currentMdivIndex = mdivs.findIndex(mdiv => mdiv === targetMdiv);

            let previousMdiv = null;
            if (currentMdivIndex > 0) {
              previousMdiv = mdivs[currentMdivIndex - 1];
              previousMdiv.remove();
            }
             const pb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'pb')
              pb.setAttribute('facs', '#' + surface.getAttribute('xml:id'))
              pb.setAttribute('n', surface.getAttribute('n'))

            const firstMeasure = section.querySelector('measure');

              if (firstMeasure) {
                section.insertBefore(pb, firstMeasure);         // Insert pb before the first measure
                section.insertBefore(newMeasure, firstMeasure); // Insert newMeasure before the first measure (after pb)
              }
            const measures = Array.from(targetMdiv.querySelectorAll('measure'));  
            measures.forEach((measure, idx) => {
              measure.setAttribute('n', idx + 1);
            });
           }else{
            // this is the first zone for the whole document
            if (relativeWhere === 'before' && relativeTo !== null) {
              newMeasure.setAttribute('n', 1)
              const pb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'pb')
              pb.setAttribute('facs', '#' + surface.getAttribute('xml:id'))
              pb.setAttribute('n', surface.getAttribute('n'))
              relativeTo.before(pb)
              relativeTo.before(newMeasure)
            } else {
            const section = targetMdiv.querySelector('section')
            if (relativeWhere === 'before' && relativeTo !== null) {
              newMeasure.setAttribute('n', 1)
              const pb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'pb')
              pb.setAttribute('facs', '#' + surface.getAttribute('xml:id'))
              pb.setAttribute('n', surface.getAttribute('n'))
              relativeTo.before(pb)
              relativeTo.before(newMeasure)
              } else {
                surface.prepend(newZone)
                newMeasure.setAttribute('n', 1)
                if(section.querySelector('pb')){
                }
                if(section.querySelector('pb') && section.querySelector('pb').getAttribute('facs') ===  ('#' + surface.getAttribute('xml:id'))){
                    section.querySelector('pb').after(newMeasure)
                }else{
                    const pb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'pb')
                    pb.setAttribute('facs', '#' + surface.getAttribute('xml:id'))
                    pb.setAttribute('n', surface.getAttribute('n'))
                    section.append(pb)
                    section.append(newMeasure)

              }
            }
            }
           }



          }
        } else {
          // must be the first measure in new system, so introduce new <sb/> and get last measure from previous system
          // order by highest left value
          lastGroup.sort((a, b) => {
            return b.left - a.left
          })
          const precedingZone = lastGroup[0].elem
          precedingZone.after(newZone)
          var precedingZoneId = lastGroup[0].id
          if(targetMdiv != null){
            
              const precedingMeasure = targetMdiv.querySelector('measure[facs~="#' + precedingZoneId + '"]')

              if (!precedingMeasure) {
             
                  newMeasure.setAttribute('n', 1)
                  targetMdiv.querySelector('section').prepend(newMeasure)
                  //const followingMeasures = getFollowingMeasuresByMeasure(newMeasure)


                } else {
                const precedingMeasure = targetMdiv.querySelector('measure[facs~="#' + precedingZoneId + '"]')
                if(precedingMeasure.childNodes.length > 0){
                  const previousMultiRests = precedingMeasure.querySelectorAll('multiRest')

                  var multiRest =  previousMultiRests[0].getAttribute('num')

                
                  newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n'), parseInt(multiRest)))
                  precedingMeasure.after(newMeasure)
                  // create sb, insert after preceding measure
                  const sb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'sb')
                  precedingMeasure.after(sb)
        
                }else{
                  newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n'), 1))
                  precedingMeasure.after(newMeasure)
                  // create sb, insert after preceding measure
                  const sb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'sb')
                  precedingMeasure.after(sb)

                  if (newMeasure.nextSibling && newMeasure.nextSibling.tagName === 'sb') {
                    newMeasure.nextSibling.remove()
                  }

            }

                }
          }else {
            const mdivArray = [...xmlDoc.querySelectorAll('mdiv')]
            state.currentMdivId =  mdivArray[mdivArray.length-1].getAttribute("xml:id")
            targetMdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') === state.currentMdivId)
            const precedingMeasure = targetMdiv.querySelector('measure[facs~="#' + precedingZoneId + '"]')
            newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n'), 1))
            precedingMeasure.after(newMeasure)
            // create sb, insert after preceding measure
            const sb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'sb')
            precedingMeasure.after(sb)
            if(precedingMeasure.childNodes.length > 0){
              const previousMultiRests = precedingMeasure.querySelectorAll('multiRest')

              var multiRest =  previousMultiRests[0].getAttribute('num')

             
              newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n'), parseInt(multiRest)))
              precedingMeasure.after(newMeasure)
              // create sb, insert after preceding measure
              const sb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'sb')
              precedingMeasure.after(sb)
    
            }else{
              newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n'), 1))
              precedingMeasure.after(newMeasure)
              // create sb, insert after preceding measure
              const sb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'sb')
              precedingMeasure.after(sb)

              if (newMeasure.nextSibling && newMeasure.nextSibling.tagName === 'sb') {
                newMeasure.nextSibling.remove()
              }

            }
          }

        }
     } else{
            if(measure.getAttribute("n") === "1"){
              console.log("the measure line 509 ")
              state.newFirstMeasure = targetMdiv.querySelector('measure[n="1"]')  
              const prevSibling =   targetMdiv.querySelector('measure[n="1"]') ? targetMdiv.querySelector('measure[n="1"]').previousElementSibling : null;
              console.log("line 513 case 7 ", measure, " id is ", measure.getAttribute("n"), " and taragetMdiv is ", targetMdiv,  " new first measure is  ", state.newFirstMeasure, " sb is ", targetMdiv.querySelector('measure[n="1"]').previousElementSibling.tagName)
              targetMdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') ===  state.currentMdivId)
              const firstMdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('n') ===  "1")
              firstMdiv.remove()
              targetMdiv.querySelector('section').prepend(newMeasure)
              newMeasure.setAttribute('n', 1)    
              const section = targetMdiv.querySelector('section');    
              const sb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'sb')
              measure.after(sb)
            } 

     }} 
     
     else {
        console.log("line 507 ",  state.currentMdivId , " targetMdiv is ", targetMdiv)
           if(targetMdiv.getAttribute("xml:id") ==  state.currentMdivId)
          {
            if(newMeasure.getAttribute("n") != null && newMeasure.getAttribute("n") != undefined && newMeasure.getAttribute("n") === "1"){
            console.log("line 509 ",  state.currentMdivId , " targetMdiv is ", targetMdiv, " new measure is ", newMeasure)
            const precedingZone = above[newIndex - 1].elem
            precedingZone.after(newZone)

            const precedingZoneId = above[newIndex - 1].id
            const precedingMeasure = xmlDoc.querySelector('measure[facs~="#' + precedingZoneId + '"]')
            newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n'), 1))
            precedingMeasure.after(newMeasure)
            
          }else{
            const precedingZone = above[newIndex - 1].elem
            precedingZone.after(newZone)
            console.log("line 568 old mdiv ", targetMdiv, " measure is ", measure, " new measure is ", newMeasure, " state.currentMdivId is ", state.currentMdivId)

            const precedingZoneId = above[newIndex - 1].id
            const precedingMeasure = xmlDoc.querySelector('measure[facs~="#' + precedingZoneId + '"]')
            newMeasure.setAttribute('n', incrementMeasureNum(precedingMeasure.getAttribute('n'), 1))
            precedingMeasure.after(newMeasure)

          }}else{
            console.log("line 522 old mdiv ", targetMdiv, " measure is ", measure, " new measure is ", newMeasure, " state.currentMdivId is ", state.currentMdivId)
            targetMdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') ===  state.currentMdivId)

             if (state.newFirstMeasure !== "") {
                state.newFirstMeasure.after(newMeasure)
             }else{
                state.newFirstMeasure = newMeasure
                targetMdiv.querySelector('section').prepend(newMeasure)
                newMeasure.setAttribute('n', 1)        
             }
            console.log("line 522 ",  newMeasure, " targetMdiv is ", targetMdiv, " old mdiv", " old mdivs measures ", state.oldMdivMeasures, " new first measure is  ", state.newFirstMeasure, " measure is ", measure, " and measure next sibling is ", measure.nextElementSibling) 
            const sb = document.createElementNS('http://www.music-encoding.org/ns/mei', 'sb')
            measure.after(sb)

            const measures = Array.from(targetMdiv.querySelectorAll('measure'));  
            measures.forEach((measure, idx) => {
              console.log("line 568 the next measure is ", measure.previousElementSibling, " total number of measures are ", measures.length)
            });


            // keep track of all measures that have been incremented already, i.e. avoid to increment measures with multiple zones more than once
          } 
          const measures = Array.from(targetMdiv.querySelectorAll('measure'));
          measures.forEach((measure, idx) => {
            console.log("the measure ")
            measure.setAttribute('n', idx + 1);
          });
      }

      // make sure to increment all following measures on current system
      for (let i = newIndex + 1; i < above.length; i++) {
        console.log("incrementing measure " + above[i].id)
        zonesToIncrement.push(above[i].id)
      }

      // make sure to increment all measures on lower systems
      below.forEach(zone => {
        console.log("incrementing measure " + zone.id)
        zonesToIncrement.push(zone.id)
      })

      return zonesToIncrement
    } else {
      if(targetMdiv === undefined){
        console.log("line 570 case 1 ", measure)
        targetMdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') ===  state.currentMdivId) 
        return insertIntoRightSystem(xmlDoc, surface, targetMdiv, newZone, newMeasure, below, pageHeight, thresholdDistance, zonesToIncrement, above, state)

      }else{
      console.log("line 575 case 2 ", measure)
      return insertIntoRightSystem(xmlDoc, surface, targetMdiv, newZone, newMeasure, below, pageHeight, thresholdDistance, zonesToIncrement, above, state)
      }
    }
  }
    if (targetMdiv) {
  state.currentMdivId = targetMdiv.getAttribute('xml:id')
}
    if(targetMdiv === undefined){
    targetMdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') ===  state.currentMdivId) 
    insertIntoRightSystem(xmlDoc, surface, targetMdiv, currentZone, measure, allZones, pageHeight, thresholdDistance, [], [], state)
    const newZoneIndex = allZones.findIndex(z => z.new);
    // Only call insertIntoRightSystem if the new zone is NOT the first in the system
    if (newZoneIndex > 0) {
          console.log("line 583 case 3 ", measure)
      if(targetMdiv === undefined){
          console.log("line 591 case 4 ", measure)
          targetMdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') ===  state.currentMdivId) 
          insertIntoRightSystem(xmlDoc, surface, targetMdiv, currentZone, measure, allZones, pageHeight, thresholdDistance, [], [], state)
      }else{
         console.log("line 595 case 5 ", measure)
         insertIntoRightSystem(xmlDoc, surface, targetMdiv, currentZone, measure, allZones, pageHeight, thresholdDistance, [], [], state)
      }
      const followingMeasures = getFollowingMeasuresByMeasure(measure)
      // keep track of all measures that have been incremented already, i.e. avoid to increment measures with multiple zones more than once
      followingMeasures.forEach(measure => {
        console.log("line 600 case 6 ", measure)
        measure.setAttribute('n', incrementMeasureNum(measure.getAttribute('n'), 1))
      })
    } else {
      // Optionally handle the first-in-system case here, or do nothing
      console.log('This measure is the first in the system; skipping insertIntoRightSystem.')
    }
    }else{
        console.log("line 630 case 7 ", measure, " and targetMdiv is ", targetMdiv, " xmlDoc is ", xmlDoc)
        insertIntoRightSystem(xmlDoc, surface, targetMdiv, currentZone, measure, allZones, pageHeight, thresholdDistance, [], [], state)

    }
   

}
/**
 * Increments a measure number by a given difference.
 *
 * @param {string|number} num - The current measure number.
 * @param {number} diff - The amount to increment (can be negative).
 * @returns {number} - The new measure number.
 */
export function getFollowingMeasuresByMeasure(measure) {
  const arr = []

  const getFollowingByName = (elem, name) => {
    if (!elem) {
      console.warn('getFollowingByName: received null element, skipping.')
      return
    }

    const next = elem.nextElementSibling
    console.log('looking for ' + name + ' after ', elem)
    console.log('next is ', next)

    if (next === null) {
      if (name === 'measure') {
        const nextSection = getNextSection(elem)
        if (nextSection !== null) {
          const firstMeasure = nextSection.querySelector(name)
          if (firstMeasure !== null) {
            arr.push(firstMeasure)
            getFollowingByName(firstMeasure, name)
          }
        }
      }
    } else if (next.localName === name) {
      arr.push(next)
      getFollowingByName(next, name)
    } else {
      const nestedElems = next.querySelectorAll ? next.querySelectorAll(name) : []
      nestedElems.forEach(nestedElem => {
        arr.push(nestedElem)
      })
      getFollowingByName(next, name)
    }

 if(elem.tagName === 'sb'){
      console.log("line 700 next is ", next, " and name is ", name, ' previious element is ', elem.previousElementSibling)
    } 
  }

  const getNextSection = (measure) => {
    const parentSection = measure.closest ? measure.closest('section') : null
    if (!parentSection) {
      console.warn('getNextSection: no parent section found.')
      return null
    }

    const arrSections = []
    getFollowingByName(parentSection, 'section')
    if (arrSections.length > 0) {
      return arrSections[0]
    }

    return null
  }

  getFollowingByName(measure, 'measure')
  return arr
}


/**
 * Adds a zone reference to the @facs attribute of the last measure in the MEI document.
 * - Retrieves the last <measure> element.
 * - Appends the new zone ID to the existing @facs attribute (if present).
 *
 * @param {Document} xmlDoc - The MEI XML document.
 * @param {string} zoneId - The xml:id of the zone to add.
 */

export function addZoneToLastMeasure (xmlDoc, zoneId) {
  const measure = getLastMeasure(xmlDoc)
  const oldFacs = measure.hasAttribute('facs') ? measure.getAttribute('facs') + ' ' : ''
  measure.setAttribute('facs', oldFacs + '#' + zoneId)
}

/**
 * Retrieves the last <measure> element from the MEI XML document.
 *
 * @param {Document} xmlDoc - The MEI XML document.
 * @returns {Element} - The last <measure> element, or undefined if none exist.
 */
function getLastMeasure (xmlDoc) {
  const measure = [...xmlDoc.querySelectorAll('measure')].slice(-1)[0]
  return measure
}

/**
 * retrieves the last zone from preceding pages, if any
 * @param  {[type]} xmlDoc                [description]
 * @param  {[type]} surface               [description]
 * @return {[type]}         [description]
 */
function getPrecedingZone (xmlDoc, surface) {
  let precedingZone = null
  let precedingPage = surface.previousElementSibling

  while (precedingPage !== null && precedingZone === null) {
    if (precedingPage.querySelector('zone') !== null) {
      precedingZone = [...precedingPage.querySelectorAll('zone')].at(-1)
    } else {
      precedingPage = precedingPage.previousElementSibling
    }
  }
  return precedingZone
}

/**
 * retrieves the preceding zone, no matter where that is located
 * @param  {[type]} xmlDoc               [description]
 * @param  {[type]} zone                 [description]
 * @return {[type]}        [description]
 */
function getPrecedingZoneNoMatterWhere (xmlDoc, zone) {
  let precedingZone = null
  let precedingSibling = zone.previousElementSibling

  while (precedingSibling !== null && precedingZone === null) {
    if (precedingSibling.localName === 'zone') {
      precedingZone = precedingSibling
    } else {
      precedingSibling = precedingSibling.previousElementSibling
    }
  }
  if (precedingZone === null) {
    const surface = zone.closest('surface')
    precedingZone = getPrecedingZone(xmlDoc, surface)
  }
  return precedingZone
}

function getMeasuresFromZone (xmlDoc, zone) {
  const zoneId = zone.getAttribute('xml:id')
  const measures = []
  xmlDoc.querySelectorAll('measure[facs~="#' + zoneId + '"]').forEach(measure => {
    measures.push(measure)
  })
  return measures
}

/**
 * retrieves an array of zones related to the current measure
 * @param  {[type]} xmlDoc                [description]
 * @param  {[type]} measure               [description]
 * @return {[type]}         [description]
 */
function getZonesFromMeasure (xmlDoc, measure) {
  const facsArr = measure.getAttribute('facs').replace(/\s+/g, ' ').trim().split(' ')
  const zones = []
  facsArr.forEach(ref => {
    const zone = [...xmlDoc.querySelectorAll('zone')].find(zone => zone.getAttribute('xml:id') === ref.substring(1))

    if (zone !== undefined) {
      zones.push(zone)
    }
  })

  return zones
}
/**
 * Creates a new <mdiv> (movement division) element in the MEI document.
 * - Generates a unique xml:id and a label for the new movement.
 * - Appends a <score> and <section> as children of the new <mdiv>.
 * - Inserts the new mdiv at the end of <body> or after a specified mdiv.
 *
 * @param {Document} xmlDoc - The MEI XML document.
 * @param {string} [afterMdivId] - Optional xml:id of an existing mdiv after which to insert the new mdiv.
 * @returns {string} - The xml:id of the newly created mdiv.
 */
export function createNewMdiv (xmlDoc,state, afterMdivId) {
  const body = xmlDoc.querySelector('body')
  const mdivArray = xmlDoc.querySelectorAll('mdiv')

  const mdiv = document.createElementNS('http://www.music-encoding.org/ns/mei', 'mdiv')
  const mdivId = 'm' + uuid()
  mdiv.setAttribute('xml:id', mdivId)
  mdiv.setAttribute('label', 'Movement ' + (mdivArray.length + 1))
  mdiv.setAttribute('n', mdivArray.length + 1)

  const score = document.createElementNS('http://www.music-encoding.org/ns/mei', 'score')
  const section = document.createElementNS('http://www.music-encoding.org/ns/mei', 'section')

  score.appendChild(section)
  mdiv.appendChild(score)

  if (afterMdivId === undefined) {
    body.appendChild(mdiv)
  } else {
    const precedingMdiv = [...mdivArray].find(mdiv => mdiv.getAttribute('xml:id') === afterMdivId)
    if (precedingMdiv !== undefined) {
      precedingMdiv.after(mdiv)
    }
  }
  return mdivId
}
/**
 * Deletes a zone and updates related measures in the MEI document.
 * - Finds the zone on the current page by its xml:id.
 * - For each measure linked to the zone:
 *   - If the measure references multiple zones, just remove the zone reference from @facs.
 *   - If the measure only references this zone:
 *     - Adjust following measure numbers (including multiRest if present).
 *     - Remove system/page breaks if necessary.
 *     - Remove the measure itself.
 * - Finally, removes the zone element from the document.
 *
 * @param {Document} xmlDoc - The MEI XML document.
 * @param {string} id - The xml:id of the zone to delete.
 * @param {Object} state - Application state (must include currentPage).
 */
export function deleteZone(xmlDoc, id, state) {
  const currentPage = state.currentPage;
  const surface = xmlDoc.querySelectorAll('surface')[currentPage];
  const zone = [...surface.querySelectorAll('zone')].find(zone => zone.getAttribute('xml:id') === id);
  
  if (!zone) return;
  const measures = getMeasuresFromZone(xmlDoc, zone);
  measures.forEach(measure => {
    let followingMeasures = [];
    const facsArr = measure.getAttribute('facs').trim().split(' ');
    if (facsArr.length > 1) {
      // Remove only this zone from @facs
      const index = facsArr.indexOf('#' + id);
      if (index !== -1) {
        facsArr.splice(index, 1);
        measure.setAttribute('facs', facsArr.join(' '));
      }
    } else {
      // Only one zone, remove the measure and update following
      let measureCount = 1;
      const multiRest = measure.querySelector('multiRest');
      if (multiRest !== null) {
        measureCount = parseInt(multiRest.getAttribute('num'));
      }
      const diff = measureCount * -1;
      followingMeasures = getFollowingMeasuresByMeasure(measure);
      followingMeasures.forEach(m => {
        m.setAttribute('n', incrementMeasureNum(m.getAttribute('n'), diff));
      });

      // Remove pb if it's before this measure and not used elsewhere
    const pb = measure.previousElementSibling;
    if (pb && pb.localName === 'pb') {
      const section = pb.closest('section');
      if (section) {
        // Check if there are any <measure> elements after pb (not just after the current measure)
        let hasFollowingMeasure = false;
        let node = pb.nextElementSibling;
        while (node) {
          if (node.localName === 'measure') {
            hasFollowingMeasure = true;
            break;
          }
          node = node.nextElementSibling;
        }
        // Only remove pb if there are NO following measures
        if (!hasFollowingMeasure) {
          pb.remove();
        }
      }
    }

      // Remove sb if it's after this measure and not needed
      if (measure.nextElementSibling && measure.nextElementSibling.tagName === 'sb') {
        measure.nextElementSibling.remove();
      }

      // Remove the measure
      const section = measure.closest('section');
      measure.remove();

      // If section is now empty, remove its mdiv and update movement numbers
      if (section && section.querySelectorAll('measure').length === 0) {
        const mdiv = section.closest('mdiv');
        if (mdiv) {
          const mdivN = parseInt(mdiv.getAttribute('n'));
          mdiv.remove();
          // Update n and label for all following mdivs
          const body = xmlDoc.querySelector('body');
          const mdivs = [...body.querySelectorAll('mdiv')];
          mdivs.forEach(md => {
            const n = parseInt(md.getAttribute('n'));
            if (n > mdivN) {
              md.setAttribute('n', n - 1);
              md.setAttribute('label', 'Movement ' + (n - 1));
            }
          });
        }
      }
    }
  });

  // Remove the zone itself
  zone.remove();
}
/**
 * Toggles whether a zone is associated with a new measure or merged with the preceding measure.
 * - If the zone is already part of the preceding measure, it creates a new measure for this zone.
 * - If not, it merges the zone into the preceding measure and removes the current measure.
 * - Handles both modes: with and without existing music content (state.existingMusicMode).
 * - Updates @facs attributes and measure numbers as needed.
 *
 * @param {Document} xmlDoc - The MEI XML document.
 * @param {string} id - The xml:id of the zone to toggle.
 * @param {Object} state - Application state (must include currentPage and existingMusicMode).
 */
export function toggleAdditionalZone (xmlDoc, id, state) {
  const currentPage = state.currentPage
  const surface = xmlDoc.querySelectorAll('surface')[currentPage]
  const zone = [...surface.querySelectorAll('zone')].find(zone => zone.getAttribute('xml:id') === id)

  const precedingZone = getPrecedingZoneNoMatterWhere(xmlDoc, zone)
  if (precedingZone === null) {
    return
  }

  const precedingZoneId = precedingZone.getAttribute('xml:id')

  const measures = getMeasuresFromZone(xmlDoc, zone)
  measures.forEach(measure => {
    const facsArr = measure.getAttribute('facs').trim().split(' ')

    if (!state.existingMusicMode) {
      if (facsArr.indexOf('#' + precedingZoneId) !== -1) {
        const index = facsArr.indexOf('#' + id)
        facsArr.splice(index, 1)
        measure.setAttribute('facs', facsArr.join(' '))
        const followingMeasures = getFollowingMeasuresByMeasure(measure)
        const newMeasure = generateMeasure()
        newMeasure.setAttribute('facs', '#' + id)
        newMeasure.setAttribute('n', incrementMeasureNum(measure.getAttribute('n'), 1))
        measure.after(newMeasure)
        followingMeasures.forEach(measure => {
          measure.setAttribute('n', incrementMeasureNum(measure.getAttribute('n'), 1))
        })
      } else {
        const precedingMeasures = getMeasuresFromZone(xmlDoc, precedingZone)
        precedingMeasures.forEach(precedingMeasure => {
          precedingMeasure.setAttribute('facs', precedingMeasure.getAttribute('facs') + ' #' + id)
        })
        const followingMeasures = getFollowingMeasuresByMeasure(measure)
        followingMeasures.forEach(measure => {
          measure.setAttribute('n', incrementMeasureNum(measure.getAttribute('n'), -1))
        })
        // TODO: If there is content, these two measures should be merged instead…
        measure.remove()
      }

    // shifting zones in measures with existing content
    } else {
      if (facsArr.indexOf('#' + precedingZoneId) !== -1) {
        // This zone is part of preceding measure and should get a new measure instead'
        const index = facsArr.indexOf('#' + id)
        facsArr.splice(index, 1)
        measure.setAttribute('facs', facsArr.join(' '))
        const followingMeasures = getFollowingMeasuresByMeasure(measure)
        let zones = '#' + id
        followingMeasures.forEach(measure => {
          if (measure.hasAttribute('facs')) {
            const nextZones = measure.getAttribute('facs')
            measure.setAttribute('facs', zones)
            zones = nextZones
          } else {
            if (zones !== null) {
              measure.setAttribute('facs', zones)
            }
            zones = null
          }
        })
      } else {
        // conflate -> move zones closer to begin of mdiv
        // I need to add this zone to the measure of the preceding zone'
        const precedingMeasures = getMeasuresFromZone(xmlDoc, precedingZone)
        precedingMeasures.forEach(precedingMeasure => {
          precedingMeasure.setAttribute('facs', precedingMeasure.getAttribute('facs') + ' #' + id)
        })
        const followingMeasures = getFollowingMeasuresByMeasure(measure)
        followingMeasures.unshift(measure)

        followingMeasures.forEach((measure, i) => {
          const nextMeasure = followingMeasures[i + 1]
          if (nextMeasure !== undefined && nextMeasure.hasAttribute('facs')) {
            const nextZones = nextMeasure.getAttribute('facs')
            measure.setAttribute('facs', nextZones)
          } else {
            measure.removeAttribute('facs')
          }
        })
      }
    }
  })
}
/**
 * Sets, updates, or removes a <multiRest> element in a measure.
 * - If a multiRest exists and a value is provided, updates its 'num' attribute.
 * - If a multiRest exists and value is null, removes the multiRest(s) or the entire staff if empty.
 * - If no multiRest exists and a value is provided, creates a new multiRest structure in the measure.
 * - Adjusts following measure numbers if the multiRest value changes.
 *
 * @param {Element} measure - The MEI <measure> element to update.
 * @param {number|null} val - The new value for multiRest, or null to remove.
 */
export function setMultiRest (measure, val) {
  const existingMultiRests = measure.querySelectorAll('multiRest')
  let oldVal = 1
  // there are already multiRests
  if (existingMultiRests.length > 0) {
    oldVal = parseInt(existingMultiRests[0].getAttribute('num'))
    // a new value for multiRest shall be written
    if (val !== null) {
      existingMultiRests.forEach(mr => {
        mr.setAttribute('num', val)
      })
    } else { // multiRest is supposed to be deleted
      const layerContent = measure.querySelectorAll('layer *')
      const otherContent = [...layerContent].find(elem => elem.localName !== 'multiRest')
      if (otherContent !== undefined) { // remove multiRests only
        existingMultiRests.forEach(mr => mr.remove())
      } else { // remove whole tree
        measure.querySelectorAll('staff').forEach(staff => staff.remove())
      }
    }
  } else { 
    // no prior multiRests available
    if (val !== null) { 
      // insert new multiRest to measure
      const staff = document.createElementNS('http://www.music-encoding.org/ns/mei', 'staff')
      staff.setAttribute('n', 1)
      const layer = document.createElementNS('http://www.music-encoding.org/ns/mei', 'layer')

      const multiRest = document.createElementNS('http://www.music-encoding.org/ns/mei', 'multiRest')
      multiRest.setAttribute('num', val)

      staff.append(layer)
      layer.append(multiRest)
      measure.append(staff)
    } else {
      // no existing multiRest, and no multiRest is wanted -> do nothing
    }
  }

  const diff = ((val !== null) ? val : 1) - oldVal
  const followingMeasures = getFollowingMeasuresByMeasure(measure)
  if (diff !== 0) {
    followingMeasures.forEach(measure => {
      measure.setAttribute('n', incrementMeasureNum(measure.getAttribute('n'), diff))
    })
  }
}

/**
 * Moves a sequence of measures (and related elements) starting from a given measure to a target <mdiv>.
 * - Determines the first node to move (may include preceding pb/sb).
 * - Collects all following sibling elements to move as a group.
 * - If the target mdiv is empty, appends all elements and renumbers measures.
 * - If the target mdiv has measures, reinserts each measure using insertMeasure to preserve structure.
 *
 * @param {Document} xmlDoc - The MEI XML document.
 * @param {string} firstMeasureId - The xml:id of the first measure to move.
 * @param {string} targetMdivId - The xml:id of the target mdiv.
 * @param {Object} state - Application state (used for page lookup).
 */
export function moveContentToMdiv (xmlDoc, firstMeasureId, targetMdivId, state) {
  const firstMeasure = [...xmlDoc.querySelectorAll('measure')].find(measure => measure.getAttribute('xml:id') === firstMeasureId)
  console.log("line 1040 first measure is ", firstMeasure, " target mdiv is ", [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') === targetMdivId))

  const precedingSibling = firstMeasure.previousElementSibling
  let firstNode
  

  if (precedingSibling === null) {
    console.log("mdiv case 1")
    firstNode = firstMeasure
  } else if (precedingSibling.localName === 'pb') {
    firstNode = firstMeasure
    console.log("mdiv case 2")

  } else if (precedingSibling.localName === 'sb') {
    firstNode = firstMeasure
    console.log("mdiv case 3")
  } else {
    firstNode = firstMeasure
    console.log("mdiv case 4")
  }

  const elements = [firstNode]
  let nextSibling = firstNode.nextElementSibling

  while (nextSibling) {
    elements.push(nextSibling)
    nextSibling = nextSibling.nextElementSibling
  }
  console.log("line 1046 selected mdiv is ", targetMdivId)

  const mdiv = [...xmlDoc.querySelectorAll('mdiv')].find(mdiv => mdiv.getAttribute('xml:id') === targetMdivId)
  const existingMeasures = [...mdiv.querySelectorAll('measure')]
  console.log("line 1050 new mdiv is  ", mdiv)

  if (existingMeasures.length === 0) {
    console.log("mdiv case 5")
    // TODO: We need to identify if that position is correct
    const section = [...mdiv.querySelectorAll('section')].at(-1)

    let i = 1
    elements.forEach(elem => {
      if (elem.localName === 'measure') {
        if (elem.hasAttribute('label')) {
          // we may want to mod labels as well, I think!
        } else {
          elem.setAttribute('n', i)
          i++
        }
      }
    })

    elements.forEach(element => {
      section.appendChild(element)
    })
  } else {
    console.log("mdiv case 6")

    const followingMeasures = getFollowingMeasuresByMeasure(firstMeasure)

    const zones = getZonesFromMeasure(xmlDoc, firstMeasure)
    const surfaceId = zones[0].closest('surface').getAttribute('xml:id')
    const pageIndex = state.pages.findIndex(page => page.id === surfaceId)
    console.log("zones are ", zones)
    console.log("pageIndex is ", pageIndex)
    console.log("surdace id is ", surfaceId)
    console.log("following measures ", followingMeasures)

    

    insertMeasure(xmlDoc, firstMeasure, state, zones[0], pageIndex, mdiv)

    followingMeasures.forEach(measure => {
      console.log("line 1143 inserting measure ", measure)

      const zones = getZonesFromMeasure(xmlDoc, measure)
      const surfaceId = zones[0].closest('surface').getAttribute('xml:id')
      const pageIndex = state.pages.findIndex(page => page.id === surfaceId)
      insertMeasure(xmlDoc, measure, state, zones[0], pageIndex, mdiv)
    })
  }
}

/**
 * This creates a new page through the image import modal
 * @param {[  type]} xmlDoc  [description]
 * @param {[type]} index   [description]
 * @param {[type]} url     [description]
 * @param {[type]} width   [description]
 * @param {[type]} height  [description]
 */
export function addImportedPage (xmlDoc, index, url, width, height) {
  const surface = document.createElementNS('http://www.music-encoding.org/ns/mei', 'surface')
  surface.setAttribute('xml:id', 's' + uuid())
  surface.setAttribute('n', index + 1)
  surface.setAttribute('label', index + 1)
  surface.setAttribute('ulx', 0)
  surface.setAttribute('uly', 0)
  surface.setAttribute('lrx', width)
  surface.setAttribute('lry', height)

  const graphic = document.createElementNS('http://www.music-encoding.org/ns/mei', 'graphic')
  graphic.setAttribute('xml:id', 'g' + uuid())
  graphic.setAttribute('type', 'facsimile')
  graphic.setAttribute('target', url)
  graphic.setAttribute('width', width)
  graphic.setAttribute('height', height)

  surface.append(graphic)

  const hasFacs = xmlDoc.querySelector('facsimile')
  if (hasFacs !== null) {
    hasFacs.append(surface)
  } else {
    const newFacs = document.createElementNS('http://www.music-encoding.org/ns/mei', 'facsimile')
    xmlDoc.querySelector('music').prepend(newFacs)
    newFacs.append(surface)
  }
}