import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { loading: false, error: action.error };
    case "RESET":
      return initialState;
    default:
      throw new Error("Should not be here");
  }
};

const useHttp = () => {
  const [httpState, httpDispatch] = useReducer(httpReducer, initialState);

  const reset = useCallback(() => httpDispatch({ type: "RESET" }), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      httpDispatch({
        type: "SEND",
        extra: reqExtra,
        identifier: reqIdentifier,
      });

      fetch(url, {
        method: method,
        body: body,
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((resData) => {
          httpDispatch({
            type: "RESPONSE",
            responseData: resData,
            extra: reqExtra,
          });
        })
        .catch((err) => {
          httpDispatch({ type: "ERROR", error: err.message });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    reset: reset,
  };
};

export default useHttp;
