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
  transformData = (data) => data,
  transformError
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
      const responseError = transformError(response)

      if (isSuccess) {
        setState({
          data: response.data && transformData(response.data),
          error: null
        })
        if (onSuccess) onSuccess(response)
      } else {
        setState({ data: null, error: responseError }) // Update for handle every rest client
        if (onFailure) onFailure(responseError)
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
