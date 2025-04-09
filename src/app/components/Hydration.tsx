'use client'
import { usePlayersStore } from "@/store/players"
import { useTacticBoardStore } from "@/store/tactic-board"
import { useEffect, useState } from "react"

const Hydration = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false)


  // Wait till Next.js rehydration completes
  useEffect(() => {
    console.log('Hydration')
    useTacticBoardStore.persist.rehydrate()
    usePlayersStore.persist.rehydrate()
    setIsHydrated(true)
  }, [])

  return <>{isHydrated ? <div>{children}</div> : null}</>
}

export default Hydration