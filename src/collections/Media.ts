import type {
  CollectionAfterChangeHook,
  CollectionBeforeOperationHook,
  CollectionConfig,
} from 'payload'
import { APIError } from 'payload'

/** Maximum file size in bytes (10MB) */
const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * Validates file size before upload to R2.
 * Runs on both create and update operations before the file is uploaded.
 */
const validateFileSize: CollectionBeforeOperationHook = ({ operation, req }) => {
  // Only validate on create/update operations that include a file
  if (operation !== 'create' && operation !== 'update') {
    return
  }

  const file = req.file

  if (!file) {
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new APIError(
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
      400,
    )
  }
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
  hooks: {
    beforeOperation: [validateFileSize],
    afterChange: [logMediaUpload],
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
}
