"use client"

import Link from "next/link"
import React from "react"

/**
 * Single-country store: no country prefix needed in URLs.
 * Links go directly to the path (e.g. /store, /account).
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  return (
    <Link href={href} prefetch={true} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
