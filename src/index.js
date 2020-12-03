import { useReducer, useEffect } from 'react'

function useSetState(initialState = {}) {
  const reducer = useReducer((state, newState) => {
    return { ...state, ...newState }
  }, initialState)

  return reducer
}

export function useLazyRequest({
  service,
  payload,
  onSuccess,
  onFailure,
  onFetch,
  dataSelector = (response) => response.data,
  errorSelector = (response) => response.problem || response.data
}) {
  const [state, setState] = useSetState({
    data: null,
    fetching: false,
    error: null
  })

  const fetchData = () => {
    try {
      const response = service(payload)
      const isSuccess = response.status === 200 // Update for handle all 2XX

      if (isSuccess) {
        setState({
          data: dataSelector(response.data),
          error: null
        })
        if (onSuccess) onSuccess(response)
      } else {
        setState({ data: null, error: errorSelector(response) })
        if (onFailure) onFailure(response)
      }
    } catch (error) {
      console.error(`🚨 ${error}`)
    } finally {
      setState({ fetching: false })
      if (onFetch) onFetch()
    }
  }

  return [state, fetchData, setState]
}

export function useRequest({ dependencies = [], ...options }) {
  const lazyRequest = useLazyRequest(options)

  useEffect(() => {
    lazyRequest.fetchData()
  }, dependencies)

  return lazyRequest
}

export const customizeHook = (hook, customOptions) => (options) => hook({ ...customOptions, options })
