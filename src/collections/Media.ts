import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
} from 'payload'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

/**
 * Hook to validate file size on upload.
 * Ensures uploaded files do not exceed 10 MB.
 */
const validateFileSize: CollectionBeforeChangeHook = async ({ data, operation }) => {
  // Only validate on create operation
  if (operation === 'create' && data.filesize) {
    if (data.filesize > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum limit of 10 MB. Uploaded file is ${(data.filesize / (1024 * 1024)).toFixed(2)} MB.`,
      )
    }
  }

  return data
}

/**
 * Hook to log successful media uploads for debugging and validation.
 * Logs key metadata: id, filename, mimeType, filesize.
 */
const logMediaUpload: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation === 'create') {
    req.payload.logger.info({
      msg: 'Media uploaded successfully',
      mediaId: doc.id,
      filename: doc.filename,
      mimeType: doc.mimeType,
      filesize: doc.filesize,
    })
  }

  return doc
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional caption displayed below the media',
      },
    },
  ],
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
    // MIME type restrictions for security
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  },
  hooks: {
    beforeChange: [validateFileSize],
    afterChange: [logMediaUpload],
  },
}
