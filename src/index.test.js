import { useLazyRequest, useRequest } from './'
import { act, renderHook } from '@testing-library/react-hooks'
import { create, CLIENT_ERROR } from 'apisauce'

const api = create({
  baseURL: 'https://moralesbang.dev'
})

const successfulService = () => api.get('/successful')
const failureService = () => api.post('/failure')

const requiredServiceError = Error('🚨 You must to provide a valid service')
const expectedFetchingState = { data: null, status: 'fetching', error: null }
const expectedSuccessfulState = { data: { message: 'Hello World' }, status: 'success', error: null }
const expectedErrorState = { data: null, status: 'error', error: CLIENT_ERROR }

describe('useLazyRequest', () => {
  test('instance with no options', () => {
    const {result} = renderHook(() => useLazyRequest())
    expect(result.error).toEqual(requiredServiceError)
  })

  test('instance with no service', () => {
    const {result} = renderHook(() => useLazyRequest({}))
    expect(result.error).toEqual(requiredServiceError)
  })

  test('request service is successful with status', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useLazyRequest({
      service: successfulService
    }))

    const [, fetchData] = result.current

    act(() => {
      fetchData()
    })

    const [fetchingState] = result.current
    expect(fetchingState).toMatchObject(expectedFetchingState)

    await waitForNextUpdate()

    const [successfulState] = result.current
    expect(successfulState).toMatchObject(expectedSuccessfulState)
  })

  test('request service is failure', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useLazyRequest({ service: failureService }))
    const [, fetchData] = result.current

    act(() => {
      fetchData()
    })

    await waitForNextUpdate()

    const [state] = result.current

    expect(state).toMatchObject(expectedErrorState)
  })
})

describe('useRequest', () => {
  test('no options', () => {
    const {result} = renderHook(() => useRequest())
    expect(result.error).toEqual(requiredServiceError)
  })

  test('instance with no service', () => {
    const {result} = renderHook(() => useRequest({}))
    expect(result.error).toEqual(requiredServiceError)
  })

  test('request service is successful', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useRequest({ service: successfulService }))

    const [fetchingState] = result.current
    expect(fetchingState).toMatchObject(expectedFetchingState)

    await waitForNextUpdate()

    const [successfulState] = result.current
    expect(successfulState).toMatchObject(expectedSuccessfulState)
  })

  test('request service is failure', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useRequest({ service: failureService }))

    const [fetchingState] = result.current
    expect(fetchingState).toMatchObject(expectedFetchingState)

    await waitForNextUpdate()

    const [failureState] = result.current
    expect(failureState).toMatchObject(expectedErrorState)
  })
})
