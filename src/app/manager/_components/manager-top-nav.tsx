import Link from 'next/link'
import React from 'react'

const ManagerTopNav = () => {
  return (
    <nav>
      <Link href="/" ><img src="./logo.svg" alt="Logo" className="w-12 h-12 stroke-red-500"/></Link> / 
      top nav ms3d
    </nav>
  )
}

export default ManagerTopNav
