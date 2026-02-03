/**
 * Helper functions for handling local image imports
 */

/**
 * Convert local image files to OpenSeadragon-compatible format
 * @param {File[]} imageFiles - Array of image File objects
 * @returns {Promise<Array>} - Promise that resolves to an array of page objects
 */
/**
 * Helper functions for handling local image imports
 */

/**
 * Convert local image files to OpenSeadragon-compatible format
 * Creates blob URLs that OpenSeadragon can load as simple images
 * @param {File[]} imageFiles - Array of image File objects
 * @returns {Promise<Array>} - Promise that resolves to an array of tile sources compatible with OpenSeadragon
 */
export async function convertLocalImagesToPages(imageFiles) {
  const pagePromises = imageFiles.map((file, index) => {
    return new Promise((resolve, reject) => {
      // Create blob URL directly from the file (File is a type of Blob)
      const blobUrl = URL.createObjectURL(file)
      
      const img = new Image()
      
      img.onload = () => {
        // Create a tile source in OpenSeadragon's expected format
        // Using a simple image tile source configuration
        const pageObject = {
          // OpenSeadragon tile source properties
          type: 'image',
          url: blobUrl,
          // Metadata for the application
          uri: blobUrl,
          imageUrl: blobUrl,  // Required by addLocalImagePages action
          width: img.width,
          height: img.height,
          n: (index + 1).toString(),
          label: file.name,
          fileName: file.name,
          filePath: file.webkitRelativePath || file.name,
          isLocalImage: true,
          hasSvg: false,
          hasZones: false,
          // Keep references to prevent garbage collection
          _file: file,
          _blobUrl: blobUrl
        }
        resolve(pageObject)
      }
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${file.name}`))
      }
      
      // Load the image from the blob URL
      img.src = blobUrl
    })
  })
  
  return Promise.all(pagePromises)
}

/**
 * Sort image files by name (natural sort for numbered files)
 * @param {File[]} files - Array of File objects
 * @returns {File[]} - Sorted array of files
 */
export function sortImageFiles(files) {
  return files.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: 'base'
    })
  })
}

/**
 * Filter array to only include valid image files
 * @param {File[]} files - Array of File objects
 * @returns {File[]} - Filtered array containing only image files
 */
export function filterImageFiles(files) {
  return files.filter(file => {
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i.test(file.name)
  })
}

/**
 * Get the folder path from a File object
 * @param {File} file - File object with webkitRelativePath
 * @returns {string} - Folder path
 */
export function getFolderPath(file) {
  if (file.webkitRelativePath) {
    const parts = file.webkitRelativePath.split('/')
    parts.pop() // Remove filename
    return parts.join('/')
  }
  return ''
}
