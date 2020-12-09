import { useReducer, useEffect, useCallback } from "react";

function validService (hookName, service) {
  if (service?.constructor.name !== 'Function') {
    throw Error(`🚨 You must to provide a valid service for ${hookName}`)
  }
}

function useSetState(initialState = {}) {
  const reducer = useReducer((state, newState) => {
    return { ...state, ...newState }
  }, initialState)

  return reducer
}

function useLazyRequest({
  service,
  payload,
  onSuccess,
  onFailure,
  onFetch,
  dataSelector = (response) => response.data,
  errorSelector = (response) => response.problem || response.data,
} = {}) {
  validService("useLazyRequest", service);

  const [state, setState] = useSetState({
    data: null,
    fetching: false,
    error: null,
  });

  const fetchData = async (directPayload) => {
    setState({ fetching: true });
    
    try {
      const response = await service(directPayload || payload);
      const isSuccess = response.status === 200; // Update for handle all 2XX

      if (isSuccess) {
        setState({
          data: dataSelector(response),
          error: null,
        });
        if (onSuccess) onSuccess(response);
      } else {
        setState({ data: null, error: errorSelector(response) });
        if (onFailure) onFailure(response);
      }
    } catch (error) {
      console.error(`🚨 ${error}`);
    } finally {
      setState({ fetching: false });
      if (onFetch) onFetch();
    }
  };

  return [state, fetchData, setState];
}

function useRequest(options = {}, dependencies = []) {
  validService("useRequest", options.service);
  const [state, fetchData, setState] = useLazyRequest(options);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return [state, fetchData, setState];
}

const customizeHook = (hook, customOptions) => (options) =>
  hook({ ...customOptions, ...options });

export { useLazyRequest, useRequest, customizeHook };
