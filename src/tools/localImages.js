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
 * Creates blob URLs for OpenSeadragon while storing file names for MEI references
 * @param {File[]} imageFiles - Array of image File objects
 * @returns {Promise<Array>} - Promise that resolves to an array of page objects
 */
export async function convertLocalImagesToPages(imageFiles) {
  // Log all available images from the folder
  const folderImageNames = imageFiles.map(file => file.name)
  console.log('📂 Images available in selected folder:', folderImageNames)
  console.log('📊 Total files found:', imageFiles.length)
  
  const pagePromises = imageFiles.map((file, index) => {
    console.log(`Processing file ${index + 1}/${imageFiles.length}: ${file.name}`)
    return new Promise((resolve, reject) => {
      // Create blob URL directly from the file (File is a type of Blob)
      const blobUrl = URL.createObjectURL(file)
      
      // Create a simple name for the image (image1, image2, etc.)
      const extension = file.name.substring(file.name.lastIndexOf('.')) || '.jpg'
      const imageName = `image${index + 1}${extension}`
      
      const img = new Image()
      
      img.onload = () => {
        console.log(`✅ Image loaded: ${file.name} (${img.width}x${img.height})`)
        // Create a tile source in OpenSeadragon's expected format
        // Using a simple image tile source configuration
        // Use original file path with folder structure if available, otherwise use filename
        const originalPath = file.webkitRelativePath || file.name
        const pageObject = {
          // OpenSeadragon tile source properties
          type: 'image',
          url: blobUrl,
          // Metadata for the application
          uri: originalPath,        // Use original path for MEI (preserves folder structure)
          imageUrl: blobUrl,       // Keep blob URL for OpenSeadragon
          width: img.width,
          height: img.height,
          n: (index + 1).toString(),
          label: imageName,
          fileName: file.name,
          imageName: imageName,    // Store the simple name for display
          filePath: originalPath,  // Store original path with folder structure for MEI
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
        console.error(`❌ FAILED to load: ${file.name}`)
        reject(new Error(`Failed to load image: ${file.name}`))
      }
      
      // Load the image from the blob URL
      img.src = blobUrl
    })
  })
  
  return Promise.all(pagePromises).then(pages => {
    console.log(`✅ Total images processed: ${pages.length}`)
    return pages
  }).catch(err => {
    console.error('Error during image processing:', err)
    throw err
  })
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
