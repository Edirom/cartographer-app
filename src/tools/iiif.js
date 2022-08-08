import { uuid } from '@/tools/uuid.js'

function addPage (canvas, n, file, meiSurfaceTemplate) {
  const label = canvas.label
  const height = canvas.height
  const width = canvas.width
  const uri = canvas?.images[0]?.resource?.service['@id']

  const surfaceId = 's' + uuid()
  const graphicId = 'g' + uuid()

  // const mdivId = 'm' + uuid()
  // const sectionId = 's' + uuid()

  const surface = meiSurfaceTemplate.querySelector('surface').cloneNode(true)
  surface.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:id', surfaceId)
  surface.setAttribute('n', n)
  surface.setAttribute('label', label)
  surface.setAttribute('lrx', width)
  surface.setAttribute('lry', height)

  const graphic = surface.querySelector('graphic')
  graphic.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:id', graphicId)
  graphic.setAttribute('target', uri)
  graphic.setAttribute('width', width)
  graphic.setAttribute('height', height)

  file.querySelector('facsimile').appendChild(surface)
}

export async function iiifManifest2mei (json, url, parser) {
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
      // set file id
      file.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:id', 'm' + uuid())
      // set file title
      file.querySelector('title').textContent = json.label
      // set reference to Manifest
      file.querySelector('source').setAttribute('target', url)
      file.querySelector('source').setAttribute('xml:id', sourceId)
      // add current date
      file.querySelector('change date').setAttribute('isodate', new Date().toISOString().substring(0, 10))
      file.querySelector('changeDesc ptr').setAttribute('target', '#' + sourceId)

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
      // handle pages
      json.sequences[0].canvases.forEach((canvas, i) => {
        addPage(canvas, i + 1, file, meiSurfaceTemplate)
      })

      return file
    })
}

export function checkIiifManifest (json) {
  const claimsIiif2 = json['@context'] === 'http://iiif.io/api/presentation/2/context.json'
  const claimsIiif3 = json['@context'] === 'http://iiif.io/api/presentation/3/context.json'
  const claimsManifest = json['@type'] === 'sc:Manifest'

  const hasId = typeof json['@id'] === 'string' && json['@id'].length > 0
  const hasSequences = Array.isArray(json.sequences)

  return (claimsIiif2 || claimsIiif3) && claimsManifest && hasId && hasSequences
}

export function getPageArray (mei) {
  const arr = []
  mei.querySelectorAll('surface').forEach((surface, n) => {
    const graphic = surface.querySelector('graphic')

    const obj = {}
    obj.uri = graphic.getAttributeNS('', 'target').trim()
    obj.id = surface.getAttribute('xml:id').trim()
    obj.n = surface.getAttributeNS('', 'n').trim()
    obj.label = surface.getAttributeNS('', 'label').trim()
    obj.width = parseInt(graphic.getAttributeNS('', 'width').trim(), 10)
    obj.height = parseInt(graphic.getAttributeNS('', 'height').trim(), 10)
    obj.hasSvg = surface.querySelector('svg') !== null // exists(svg:svg) inside relevant /surface
    obj.hasZones = surface.querySelector('zone') !== null // exists(mei:zone) inside relevant /surface
    arr.push(obj)
    console.log('Does the facsimile has zones ' + arr[0].hasZone)
  })
  return arr
}
