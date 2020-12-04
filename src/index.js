import { useReducer, useEffect } from 'react'

function validOptions (hookName, options) {
  if (options?.service?.constructor.name !== 'Function') {
    throw Error(`🚨 You must to provide a valid service for ${hookName}`)
  }
}

function useSetState(initialState = {}) {
  const reducer = useReducer((state, newState) => {
    return { ...state, ...newState }
  }, initialState)

  return reducer
}

export function useLazyRequest(options) {
  validOptions('useLazyRequest', options)

  const {
    service,
    payload,
    onSuccess,
    onFailure,
    onFetch,
    dataSelector = (response) => response.data,
    errorSelector = (response) => response.problem || response.data
  } = options

  const [state, setState] = useSetState({
    data: null,
    fetching: false,
    error: null
  })

  const fetchData = async () => {
    setState({ fetching: true })

    try {
      const response = await service(payload)
      const isSuccess = response.status === 200 // Update for handle all 2XX

      if (isSuccess) {
        setState({
          data: dataSelector(response),
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

export function useRequest(options, dependencies = []) {
  validOptions('useRequest', options)
  const [state, fetchData, setState] = useLazyRequest(options)

  useEffect(() => {
    fetchData()
  }, dependencies)

  return [state, fetchData, setState]
}

export const customizeHook = (hook, customOptions) => (options) => hook({ ...customOptions, ...options })
