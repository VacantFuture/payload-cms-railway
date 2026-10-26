import type { CollectionBeforeChangeHook } from 'payload'
import { Forbidden, APIError } from 'payload'

/**
 * A factory function that creates a Payload `beforeChange` hook to validate
 * that mainImage is set before an article can be published.
 *
 * @returns A `CollectionBeforeChangeHook` function.
 */
export const createMainImageValidationHook =
  (): CollectionBeforeChangeHook =>
  async ({ data, req, operation, originalDoc }) => {
    const user = req.user
    if (!user) throw new Forbidden(req.t)

    // Check if this is a publish operation (status changing to 'published')
    const isPublishing =
      operation === 'update' &&
      (data._status as string) === 'published' &&
      (originalDoc?._status as string) !== 'published'

    if (isPublishing) {
      // Validate that mainImage is set
      if (!data.mainImage) {
        throw new APIError(
          'Article must have a Main Image before publishing. Please upload and select an image.',
          400,
        )
      }
    }

    return data
  }
