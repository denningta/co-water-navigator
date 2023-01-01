import { useEffect, useState } from "react"
import { tailwindBreakpoints } from "../lib/tailwindcss/tailwindConfig"

const useTailwindBreakpoints = () => {
  const [breakpoint, setBreakpoint] = useState<string | undefined>(undefined)

  useEffect(() => {
    window.addEventListener('resize', handleResize)
  })

  const determineBreakpoint = () => {
    const width = window.innerWidth
    Object.entries(tailwindBreakpoints).every(([key, value]) => {
      if (width <= +value.toString().split('px')[0]) {
        setBreakpoint(key)
        return false
      }
      return true
    })
  }

  useEffect(() => {
    determineBreakpoint()
  })

  const handleResize = () => {
    determineBreakpoint()
  }

  return breakpoint
}

export default useTailwindBreakpoints