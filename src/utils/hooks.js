import { useEffect, useReducer, useRef } from 'react'

function useSetState(initialState = {}) {
  const reducer = useReducer((state, newState) => {
    return { ...state, ...newState }
  }, initialState)

  return reducer
}

export function useSafeSetState(initialState) {
  const [state, setState] = useSetState(initialState)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => (mountedRef.current = false)
  })

  const setSafeState = (...args) => mountedRef.current && setState(...args)

  return [state, setSafeState]
}