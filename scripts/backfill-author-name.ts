/**
 * One-off (re-runnable) backfill: copies each article author's current
 * `fullName` into the article's denormalized `authorName` field.
 *
 * Run after deploying the Articles schema change so existing articles have
 * byline data before the users collection read restriction goes live:
 *
 *   DATABASE_URL=... pnpm backfill:author-name
 *
 * Safe to run repeatedly — it only updates articles whose snapshot is
 * missing or out of date, and it never touches articles without an author.
 */
import { getPayload } from 'payload'

import config from '../src/payload.config'

const run = async () => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'Articles',
    limit: 100,
    pagination: false,
    overrideAccess: true,
  })

  let updated = 0
  let skipped = 0

  for (const doc of docs) {
    if (doc.Author == null) {
      skipped++
      continue
    }

    const authorId = typeof doc.Author === 'object' ? doc.Author.id : doc.Author
    const author = await payload
      .findByID({
        collection: 'users',
        id: authorId,
        depth: 0,
        overrideAccess: true,
      })
      .catch((error) => {
        console.warn(`[backfill] article ${doc.id}: could not read author ${authorId}:`, error.message)
        return null
      })

    if (!author?.fullName) {
      skipped++
      continue
    }

    if (author.fullName !== doc.authorName) {
      await payload.update({
        collection: 'Articles',
        id: doc.id,
        data: { authorName: author.fullName },
        overrideAccess: true,
      })
      updated++
    }
  }

  console.log(`[backfill] done — ${updated} updated, ${skipped} skipped, ${docs.length} total`)
  process.exit(0)
}

run().catch((error) => {
  console.error('[backfill] failed:', error)
  process.exit(1)
})
