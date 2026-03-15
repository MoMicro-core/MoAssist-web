import * as Headless from '@headlessui/react'
import React, { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const isExternal = (value) =>
  value?.startsWith('http') ||
  value?.startsWith('mailto:') ||
  value?.startsWith('tel:')

export const Link = forwardRef(function Link({ href, to, ...props }, ref) {
  const destination = to || href
  if (!destination) {
    return (
      <Headless.DataInteractive>
        <a {...props} ref={ref} />
      </Headless.DataInteractive>
    )
  }
  if (isExternal(destination)) {
    return (
      <Headless.DataInteractive>
        <a {...props} href={destination} ref={ref} />
      </Headless.DataInteractive>
    )
  }
  return (
    <Headless.DataInteractive>
      <RouterLink {...props} to={destination} ref={ref} />
    </Headless.DataInteractive>
  )
})
