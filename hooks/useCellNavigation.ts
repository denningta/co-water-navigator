/* eslint-disable react-hooks/exhaustive-deps */
import { MutableRefObject, useEffect, useState } from "react"
import useFocus from "./useFocus"
import useKeyPress from "./useKeyPress"

const useCellNavigation = (containerRef: MutableRefObject<any>, numberOfCells: number) => {
  const containerFocus = useFocus(containerRef)
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const arrowDown = useKeyPress('ArrowDown')
  const arrowUp = useKeyPress('ArrowUp')
  const tab = useKeyPress('Tab')
  const shift = useKeyPress('Shift')
  const enter = useKeyPress('Enter')
  const anyKey = useKeyPress()

  useEffect(() => {
    if (!containerFocus) setFocusIndex(null)
  }, [containerFocus])

  useEffect(() => {
    if (!containerFocus.state) return
    arrowDown.event?.preventDefault()
    arrowUp.event?.preventDefault()
    tab.event?.preventDefault()
    shift.event?.preventDefault()

    if (arrowDown.pressed) {
      let newIndex = focusIndex !== null ? focusIndex + 1 : 0
      if (newIndex >= (numberOfCells - 1)) newIndex = (numberOfCells - 1)
      setFocusIndex(newIndex)
    }
    if (arrowUp.pressed) {
      let newIndex = focusIndex !== null ? focusIndex - 1 : 0
      if (newIndex <= 0) newIndex = 0
      setFocusIndex(newIndex)
    }
    if (tab.pressed && !shift.pressed) {
      let newIndex = focusIndex !== null ? focusIndex + 1 : 0
      if (newIndex >= (numberOfCells)) newIndex = 0
      setFocusIndex(newIndex)
    }
    if (tab.pressed && shift.pressed) {
      let newIndex = focusIndex !== null ? focusIndex - 1 : 0
      if (newIndex < 0) newIndex = numberOfCells - 1
      setFocusIndex(newIndex)
    }
  }, [arrowDown, arrowUp, tab])

  useEffect(() => {
    if (!containerFocus) return
    enter.event?.preventDefault()
    if (enter.pressed) setEditingIndex(editingIndex === null ? focusIndex : null)
  }, [enter])

  const handleCellClick = (
    { state, detail }: {state: boolean, detail: number}, 
    index: number
  ) => {
    if (!state) {
      setFocusIndex(null)
      setEditingIndex(null)
    }
    if (state) {
      setTimeout(() => setFocusIndex(index), 1)
    }

    if (state && detail === 2) {
      setTimeout(() => setEditingIndex(index), 1)
    }
  }

  return {
    focusIndex: focusIndex,
    setFocusIndex: setFocusIndex,
    editingIndex: editingIndex,
    setEditingIndex: setEditingIndex,
    handleCellClick: handleCellClick,
  }

}

export default useCellNavigation