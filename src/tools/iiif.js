import { uuid } from '@/tools/uuid.js'
/**
 * Adds a page (surface) to the MEI file from a IIIF canvas.
 * @param {Object} canvas - The IIIF canvas object.
 * @param {Array} canvases - Array of all canvases (for dimension lookup).
 * @param {Array} dimension - [width, height] for the image.
 * @param {number} n - Page number (1-based).
 * @param {Document} file - The MEI XML document to modify.
 * @param {Document} meiSurfaceTemplate - The MEI surface template XML.
 * @param {boolean} hasItems - True if IIIF Presentation 3 (items), false if Presentation 2 (images).
 */
function addPage(canvas, canvases, dimension, n, file, meiSurfaceTemplate, hasItems) {
  // Get the label for the page
  const label = canvas.label
  let width, height

  // Use provided dimensions if available
  if (n <= canvases.length) {
    console.log("number is", n, "dimension", dimension, "canvas width", canvas.width, "canvas height", canvas.height)
    height = dimension[1]
    width = dimension[0]
  }

  // Determine the IIIF image info.json URI based on IIIF version
  let uri = ""
  if (hasItems === true) {
    // IIIF Presentation 3
    console.log("has item is true")
    uri = canvas?.items[0]?.items[0]?.body?.service[0].id
  }else{
    console.log("has item is false")
     uri = canvas?.images[0]?.resource?.service['@id']
  }

  // Generate unique IDs for surface and graphic
  const surfaceId = 's' + uuid()
  const graphicId = 'g' + uuid()

  // Clone the surface template and set attributes
  const surface = meiSurfaceTemplate.querySelector('surface').cloneNode(true)
  surface.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:id', surfaceId)
  surface.setAttribute('n', n)
  surface.setAttribute('label', label)
  surface.setAttribute('lrx', width)
  surface.setAttribute('lry', height)
  surface.removeAttribute('xmlns')

  // Set up the graphic element with image info
  const graphic = surface.querySelector('graphic')
  graphic.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:id', graphicId)
  graphic.setAttribute('target', uri)
  graphic.setAttribute('width', width)
  graphic.setAttribute('height', height)

  // Append the new surface to the facsimile section of the MEI file
  file.querySelector('facsimile').appendChild(surface)
}


/**
 * Converts a IIIF manifest JSON object into an MEI XML document.
 * - Loads MEI file and surface templates asynchronously.
 * - Sets up MEI metadata (title, source, date, etc.) from the IIIF manifest.
 * - Optionally fills in shelfmark and composer from IIIF metadata if available.
 * - Iterates over canvases (IIIF Presentation 2) or items (IIIF Presentation 3) and adds each as a surface/page using addPage().
 *
 * @param {Object} json - The IIIF manifest JSON.
 * @param {string} url - The manifest URL.
 * @param {DOMParser} parser - XML parser instance.
 * @param {Object} state - Application state (for page dimensions).
 * @returns {Promise<Document>} - Resolves to the generated MEI XML document.
 */
export async function iiifManifest2mei (json, url, parser, state) {
  const promises = []
  let meiFileTemplate
  let meiSurfaceTemplate
  promises.push(
    fetch('./assets/meiFileTemplate.xml')
      .then(res => res.text())
      .then(xml => { meiFileTemplate = parser.parseFromString(xml, 'application/xml') })
  )
  promises.push(
    fetch('./assets/meiSurfaceTemplate.xml')
      .then(res => res.text())
      .then(xml => { meiSurfaceTemplate = parser.parseFromString(xml, 'application/xml') })
  )

  return Promise.all(promises)
    .then(() => {
      const file = meiFileTemplate.querySelector('mei').cloneNode(true)

      const sourceId = 's' + uuid()
      // Set file id and metadata
      file.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:id', 'm' + uuid())
      file.querySelector('title').textContent = json.label
      file.querySelector('source').setAttribute('target', url)
      file.querySelector('source').setAttribute('xml:id', sourceId)
      file.querySelector('change date').setAttribute('isodate', new Date().toISOString().substring(0, 10))
      file.querySelector('changeDesc ptr').setAttribute('target', '#' + sourceId)

      // Try to extract shelfmark and composer from IIIF metadata
      try {   
        const metadata = json.metadata

        const shelfmark = metadata.find(entry => { return entry.label === 'Signatur' }).value
        file.querySelector('physLoc > identifier').textContent = shelfmark

        // const persistentIdentifier = metadata.find(entry => {entry.label = 'Persistente URL'}).value
        // file.querySelector('title').textContent = json.label

        const composer = metadata.find(entry => { return entry.label === 'Autor' }).value
        file.querySelector('composer persName').textContent = composer
      } catch (err) {
        console.log('Apparently, there is no metadata for this IIIF Manifest.')
      }
      // Add each page as a surface
      if(json.sequences){
        json.sequences[0].canvases.forEach((canvas, i) => {
          var hasItems = false
          addPage(canvas, json.sequences[0].canvases, state.pageDimension[i], i + 1, file, meiSurfaceTemplate, hasItems)
        })
      }else{
        json.items.forEach((canvas, i) => {
          var hasItems = true
          addPage(canvas, i + 1, file, meiSurfaceTemplate, hasItems)
        })
      }
      return file
    })
}

/**
 * Checks if a given JSON object is a valid IIIF manifest (Presentation 2 or 3).
 * - Verifies the IIIF context, manifest type, presence of an ID, and sequences/items arrays.
 * - Returns true for IIIF Presentation 3 if items exist, otherwise checks for IIIF Presentation 2/3 with required fields.
 *
 * @param {Object} json - The IIIF manifest JSON object.
 * @returns {boolean} - True if the manifest is valid, false otherwise.
 */
export function checkIiifManifest (json) {
  const claimsIiif2 = json['@context'] === 'http://iiif.io/api/presentation/2/context.json'
  const claimsIiif3 = json['@context'] === 'http://iiif.io/api/presentation/3/context.json'
  const claimsManifest = json['@type'] === 'sc:Manifest'

  const hasId = typeof json['@id'] === 'string' && json['@id'].length > 0
  const hasSequences = Array.isArray(json.sequences)
  const hasItems = Array.isArray(json.items)
  console.log("has items is " , claimsManifest)

  if (hasItems == true) {
    return true
  } else {
    return (claimsIiif2 || claimsIiif3) && claimsManifest && hasId && (hasSequences || hasItems)
  }
}

/**
 * Extracts an array of page objects from an MEI XML document.
 * Each object contains metadata and properties for a single page/surface,
 * including image URI, MEI surface ID, page number, width, height, and flags for SVG and zones.
 *
 * @param {Document} mei - The MEI XML document.
 * @returns {Array} - Array of page objects for use in the application.
 */
export function getPageArray (mei) {
  const arr = []
  mei.querySelectorAll('surface').forEach((surface, n) => {
    const graphic = surface.querySelector('graphic')
    const obj = {}
    
    // Try multiple ways to get the target attribute
    let target = null
    if (graphic) {
      target = graphic.getAttribute('target') || 
               graphic.getAttributeNS('', 'target') ||
               graphic.getAttributeNS('http://www.music-encoding.org/ns/mei', 'target')
    }
    
    obj.uri = target ? target.trim() : null
    obj.id = surface.getAttribute('xml:id') ? surface.getAttribute('xml:id').trim() : null
    obj.n = surface.getAttribute('n') ? surface.getAttribute('n').trim() : null
    obj.label = surface.getAttribute('label') ? surface.getAttribute('label').trim() : null
    
    // Get width and height from graphic
    if (graphic) {
      const width = graphic.getAttribute('width') || graphic.getAttributeNS('', 'width')
      const height = graphic.getAttribute('height') || graphic.getAttributeNS('', 'height')
      obj.width = width ? parseInt(width.trim(), 10) : 0
      obj.height = height ? parseInt(height.trim(), 10) : 0
    }
    
    // Get width/height from surface as fallback
    if (!obj.width && surface.getAttribute('lrx')) {
      obj.width = parseInt(surface.getAttribute('lrx'), 10) - (parseInt(surface.getAttribute('ulx'), 10) || 0)
    }
    if (!obj.height && surface.getAttribute('lry')) {
      obj.height = parseInt(surface.getAttribute('lry'), 10) - (parseInt(surface.getAttribute('uly'), 10) || 0)
    }
    
    obj.hasSvg = surface.querySelector('svg') !== null // true if an SVG exists in this surface
    obj.hasZones = surface.querySelector('zone') !== null // true if any zone exists in this surface

    arr.push(obj)
  })
  return arr
}
