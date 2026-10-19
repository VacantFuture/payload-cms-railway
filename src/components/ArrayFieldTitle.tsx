'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function ArrayRowLabel() {
  const { data, rowNumber } = useRowLabel<{
    Title?: string
    Role?: string
    Platform?: string
    Date?: string
  }>()

  console.log(data, rowNumber)
  // {} undefined

  // Convert the Date to a human-readable format if it exists
  const formattedDate = data.Date ? new Date(data.Date).toLocaleDateString() : null

  const customLabel = `${data.Title || data.Role || data.Platform || formattedDate || 'Info'}`
  console.log(customLabel)
  console.log(data)
  // Example: "Project Title" or "October 1, 2023"

  return <div>{customLabel}</div>
}
