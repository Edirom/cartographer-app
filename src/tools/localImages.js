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
 * Uses blob URLs instead of base64 to ensure OpenSeadragon compatibility
 * @param {File[]} imageFiles - Array of image File objects
 * @returns {Promise<Array>} - Promise that resolves to an array of page objects
 */
export async function convertLocalImagesToPages(imageFiles) {
  const pagePromises = imageFiles.map((file, index) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const img = new Image()
        
        img.onload = () => {
          // Create a blob URL from the file - OpenSeadragon can handle this
          const blobUrl = URL.createObjectURL(file)
          
          // Local image format - separate from IIIF pages
          // Uses a dedicated imageUrl property to avoid conflicts
          const pageObject = {
            // Use imageUrl for local images instead of uri
            imageUrl: blobUrl,
            // Keep uri as null to distinguish from IIIF pages
            uri: null,
            // Metadata for the application
            width: img.width,
            height: img.height,
            n: (index + 1).toString(),
            label: file.name,
            fileName: file.name,
            filePath: file.webkitRelativePath || file.name,
            isLocalImage: true,  // Flag to identify this as a local image
            hasSvg: false,
            hasZones: false
          }
          resolve(pageObject)
        }
        
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${file.name}`))
        }
        
        img.src = e.target.result
      }
      
      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${file.name}`))
      }
      
      reader.readAsDataURL(file)
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
