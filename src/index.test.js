import { useLazyRequest, useRequest } from './'
import { act, renderHook } from '@testing-library/react-hooks'

const mockServiceSuccessful = () => Promise.resolve({ status: 200, data: [{ foo: 'bar' }] })
const mockServiceFailure = () => Promise.resolve({ status: 404, problem: { message: 'Not Found' } })

describe('useLazyRequest', () => {
  test('instance with no options', () => {
    const {result} = renderHook(() => useLazyRequest())
    expect(result.error).toEqual(Error('🚨 You must to provide a valid service for useLazyRequest'))
  })

  test('instance with no service', () => {
    const {result} = renderHook(() => useLazyRequest({}))
    expect(result.error).toEqual(Error('🚨 You must to provide a valid service for useLazyRequest'))
  })

  test('request service is successful', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useLazyRequest({ service: mockServiceSuccessful }))
    const [, fetchData] = result.current

    act(() => {
      fetchData()
    })

    const [fetchingState] = result.current
    expect(fetchingState).toMatchObject({ data: null, fetching: true, error: null })

    await waitForNextUpdate()

    const [successfulState] = result.current
    expect(successfulState).toMatchObject({ data: [{ foo: 'bar' }], fetching: false, error: null })
  })

  test('request service is failure', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useLazyRequest({ service: mockServiceFailure }))
    const [, fetchData] = result.current

    act(() => {
      fetchData()
    })

    await waitForNextUpdate()

    const [state] = result.current

    expect(state).toMatchObject({ data: null, fetching: false, error: { message: 'Not Found' } })
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
    const {result, waitForNextUpdate} = renderHook(() => useRequest({ service: mockServiceSuccessful }))

    const [fetchingState] = result.current
    expect(fetchingState).toMatchObject({ data: null, fetching: true, error: null })

    await waitForNextUpdate()

    const [successfulState] = result.current
    expect(successfulState).toMatchObject({ data: [{ foo: 'bar' }], fetching: false, error: null })
  })

  test('request service is failure', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useRequest({ service: mockServiceFailure }))

    const [fetchingState] = result.current
    expect(fetchingState).toMatchObject({ data: null, fetching: true, error: null })

    await waitForNextUpdate()

    const [successfulState] = result.current
    expect(successfulState).toMatchObject({ data: null, fetching: false, error: { message: 'Not Found' } })
  })
})
