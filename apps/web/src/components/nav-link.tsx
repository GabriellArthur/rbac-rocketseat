'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavLinkProps = React.ComponentProps<typeof Link>

export function NavLink(props: NavLinkProps) {
  const pathname = usePathname()

  const isCurrent = pathname === props.href.toString()

  return <Link data-current={isCurrent} {...props} />
}
