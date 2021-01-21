import { useLazyRequest, useRequest } from './'
import { act, renderHook } from '@testing-library/react-hooks'
import { create, CLIENT_ERROR } from 'apisauce'

const api = create({
  baseURL: 'https://moralesbang.dev'
})

const successfulService = () => api.get('/successful')
const failureService = () => api.post('/failure')

describe('useLazyRequest', () => {
  test('instance with no options', () => {
    const {result} = renderHook(() => useLazyRequest())
    expect(result.error).toEqual(Error('🚨 You must to provide a valid service for useLazyRequest'))
  })

  test('instance with no service', () => {
    const {result} = renderHook(() => useLazyRequest({}))
    expect(result.error).toEqual(Error('🚨 You must to provide a valid service for useLazyRequest'))
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
    expect(fetchingState).toMatchObject({ data: null, status: 'fetching', error: null })

    await waitForNextUpdate()

    const [successfulState] = result.current
    expect(successfulState).toMatchObject({ data: { message: 'Hello World' }, status: 'success', error: null })
  })

  test('request service is failure', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useLazyRequest({ service: failureService }))
    const [, fetchData] = result.current

    act(() => {
      fetchData()
    })

    await waitForNextUpdate()

    const [state] = result.current

    expect(state).toMatchObject({ data: null, status: 'error', error: CLIENT_ERROR })
  })
})

describe('useRequest', () => {
  test('no options', () => {
    const {result} = renderHook(() => useRequest())
    expect(result.error).toEqual(Error('🚨 You must to provide a valid service for useRequest'))
  })

  test('instance with no service', () => {
    const {result} = renderHook(() => useRequest({}))
    expect(result.error).toEqual(Error('🚨 You must to provide a valid service for useRequest'))
  })

  test('request service is successful', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useRequest({ service: successfulService }))

    const [fetchingState] = result.current
    expect(fetchingState).toMatchObject({ data: null, status: 'fetching', error: null })

    await waitForNextUpdate()

    const [successfulState] = result.current
    expect(successfulState).toMatchObject({ data: { message: 'Hello World' }, status: 'success', error: null })
  })

  test('request service is failure', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useRequest({ service: failureService }))

    const [fetchingState] = result.current
    expect(fetchingState).toMatchObject({ data: null, status: 'fetching', error: null })

    await waitForNextUpdate()

    const [successfulState] = result.current
    expect(successfulState).toMatchObject({ data: null, status: 'success', error: CLIENT_ERROR })
  })
})
