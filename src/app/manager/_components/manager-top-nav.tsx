import Link from 'next/link'
import React from 'react'

const ManagerTopNav = () => {
  return (
    <nav>
      <Link href="/" ><img src="./logo.svg" alt="Logo" className="w-15 h-15"/></Link> / 
      top nav ms
    </nav>
  )
}

export default ManagerTopNav
