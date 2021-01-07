import { useEffect } from 'react'
import { useSafeSetState } from './utils/hooks'
import { validService } from './utils'

const SUCCESS_STATUS_REGEX = /^20[0-4]/

function useLazyRequest({
  service,
  payload,
  onSuccess,
  onFailure,
  onFetch,
  dataSelector = (response) => response.data,
  errorSelector = (response) => response.problem || response.data
} = {}) {
  validService('useLazyRequest', service)

  const [state, setState] = useSafeSetState({
    data: null,
    fetching: false,
    error: null
  })

  const fetchData = async (directPayload) => {
    setState({ fetching: true })

    try {
      const response = await service(directPayload || payload)
      const isSuccess = SUCCESS_STATUS_REGEX.test(String(response.status))

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

      if (onFetch) onFetch()
    } catch (error) {
      console.error(`🚨 ${error}`)
    } finally {
      setState({ fetching: false })
    }
  }

  return [state, fetchData, setState]
}

function useRequest(options = {}, dependencies = []) {
  validService('useRequest', options.service)
  const [state, fetchData, setState] = useLazyRequest(options)

  useEffect(() => {
    fetchData()
  }, dependencies)

  return [state, fetchData, setState]
}

const customizeHook = (hook, customOptions) => (options) => hook({ ...customOptions, ...options })

export { useLazyRequest, useRequest, customizeHook }
