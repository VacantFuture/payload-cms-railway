'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function ArrayRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    title?: string | null
  }>()

  const customLabel = data.title || `Note ${rowNumber}`

  return <div>{customLabel}</div>
}
