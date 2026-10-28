'use client'

import { useField } from '@payloadcms/ui'
import type { TextFieldDescriptionClientComponent } from 'payload'
import React, { CSSProperties } from 'react'

const TagLabelCharacterCount: TextFieldDescriptionClientComponent = ({ path }) => {
  const { value } = useField<string>({ path: path as string })
  const max = 50
  const length = typeof value === 'string' ? value.length : 0
  const remaining = max - length
  let message: string
  let color: CSSProperties['color'] = undefined

  if (remaining < 0) {
    message = `${Math.abs(remaining)} characters over limit`
    color = '#e74c3c'
  } else if (remaining <= 5) {
    message = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`
    color = '#e67e22'
  } else {
    message = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`
  }

  return <span style={{ color, fontSize: '0.8rem' }}>{message}</span>
}

export default TagLabelCharacterCount
