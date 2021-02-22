import { useEffect } from 'react'
import { useSafeSetState } from './utils/hooks'
import { isRequiredService } from './utils'

const SUCCESS_STATUS_REGEX = /^20[0-4]/

const REQUEST_STATUS = {
  idle: 'idle',
  fetching: 'fetching',
  success: 'success',
  error: 'error'
}

function useLazyRequest({
  service = isRequiredService(),
  payload,
  onSuccess,
  onFailure,
  onFetch,
  dataSelector = (response) => response.data,
  errorSelector = (response) => response.problem || response.data
} = {}) {

  const [state, setState] = useSafeSetState({
    data: null,
    error: null,
    status: REQUEST_STATUS.idle
  })

  const fetchData = async (directPayload) => {
    setState({ status: REQUEST_STATUS.fetching })

    try {
      const response = await service(directPayload || payload)
      const isSuccess = SUCCESS_STATUS_REGEX.test(String(response.status))

      if (isSuccess) {
        setState({
          data: dataSelector(response),
          error: null,
          status: REQUEST_STATUS.success
        })

        if (onSuccess) onSuccess(response)
      } else {
        setState({ data: null, error: errorSelector(response), status: REQUEST_STATUS.error })
        if (onFailure) onFailure(response)
      }

      if (onFetch) onFetch()
    } catch (error) {
      console.error(`🚨 ${error}`)
    }
  }

  const requestState = {
    isFetching: state.status === REQUEST_STATUS.fetching,
    isSuccess: state.status === REQUEST_STATUS.success,
    isError: state.status === REQUEST_STATUS.error,
    ...state
  }

  return [requestState, fetchData, setState]
}

function useRequest(options = {}, dependencies = []) {
  const [state, fetchData, setState] = useLazyRequest(options)

  useEffect(() => {
    fetchData()
  }, dependencies)

  return [state, fetchData, setState]
}

const customizeHook = (hook, customOptions) => (options) => hook({ ...customOptions, ...options })

export { useLazyRequest, useRequest, customizeHook }
