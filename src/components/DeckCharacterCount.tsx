'use client'

import { useField } from '@payloadcms/ui'
import type { TextFieldDescriptionClientComponent } from 'payload'
import React, { CSSProperties } from 'react'

const DeckCharacterCount: TextFieldDescriptionClientComponent = ({ path }) => {
  const { value } = useField<string>({ path: path as string })
  const min = 90
  const max = 150
  const length = typeof value === 'string' ? value.length : 0
  let message: string
  let color: CSSProperties['color'] = undefined

  message = `${length} / ${min}–${max} characters`
  if (length < min) {
    color = '#e67e22'
  } else if (length > max) {
    color = '#e74c3c'
  } else {
    color = '#27ae60'
  }

  return <span style={{ color, fontSize: '0.8rem' }}>{message}</span>
}

export default DeckCharacterCount
