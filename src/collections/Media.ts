import type { CollectionBeforeOperationHook, CollectionConfig } from 'payload'

/** Maximum file size in bytes (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024

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
    throw new Error(
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
    )
  }
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeOperation: [validateFileSize],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
  },
}
