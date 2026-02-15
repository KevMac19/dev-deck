import React, { createContext, useContext, useReducer } from 'react';
import { parseCurlCommand, generateCurlCommand } from '../utils/curlManager';
import { v4 as uuidv4 } from 'uuid';

const CurlContext = createContext();

const initialState = {
  rawInput: '',
  generatedCurl: '',
  curlData: {
    method: 'GET',
    url: '',
    headers: [],
    body: '',
    auth: { type: 'none', username: '', password: '', token: '' },
    bodyType: 'raw', // 'raw', 'json', 'x-www-form-urlencoded', 'multipart/form-data'
    flags: { insecure: false, location: false, compressed: false },
    multipartData: [] // Array of { id, key, value }
  }
};

const ACTIONS = {
  SET_RAW_INPUT: 'SET_RAW_INPUT',
  PARSE_INPUT: 'PARSE_INPUT',
  UPDATE_FIELD: 'UPDATE_FIELD',
  ADD_HEADER: 'ADD_HEADER',
  UPDATE_HEADER: 'UPDATE_HEADER',
  REMOVE_HEADER: 'REMOVE_HEADER',
  ADD_MULTIPART: 'ADD_MULTIPART',
  UPDATE_MULTIPART: 'UPDATE_MULTIPART',
  REMOVE_MULTIPART: 'REMOVE_MULTIPART',
  RESET: 'RESET'
};

const curlReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_RAW_INPUT:
      return { ...state, rawInput: action.payload };

    case ACTIONS.PARSE_INPUT: {
      const parsed = parseCurlCommand(state.rawInput);
      if (!parsed) return state;
      return {
        ...state,
        curlData: parsed,
        generatedCurl: generateCurlCommand(parsed)
      };
    }

    case ACTIONS.UPDATE_FIELD: {
      const newCurlData = { ...state.curlData, ...action.payload };
      return {
        ...state,
        curlData: newCurlData,
        generatedCurl: generateCurlCommand(newCurlData)
      };
    }

    /* Headers logic */
    case ACTIONS.ADD_HEADER: {
      const newHeaders = [...state.curlData.headers, { id: uuidv4(), key: '', value: '' }];
      const newCurlData = { ...state.curlData, headers: newHeaders };
      return {
        ...state,
        curlData: newCurlData,
        generatedCurl: generateCurlCommand(newCurlData)
      };
    }

    case ACTIONS.UPDATE_HEADER: {
      const { id, field, value } = action.payload;
      const newHeaders = state.curlData.headers.map(h =>
        h.id === id ? { ...h, [field]: value } : h
      );
      const newCurlData = { ...state.curlData, headers: newHeaders };
      return {
        ...state,
        curlData: newCurlData,
        generatedCurl: generateCurlCommand(newCurlData)
      };
    }

    case ACTIONS.REMOVE_HEADER: {
      const newHeaders = state.curlData.headers.filter(h => h.id !== action.payload);
      const newCurlData = { ...state.curlData, headers: newHeaders };
      return {
        ...state,
        curlData: newCurlData,
        generatedCurl: generateCurlCommand(newCurlData)
      };
    }

    /* Multipart logic */
    case ACTIONS.ADD_MULTIPART: {
      const newData = [...(state.curlData.multipartData || []), { id: uuidv4(), key: '', value: '' }];
      const newCurlData = { ...state.curlData, multipartData: newData };
      return {
        ...state,
        curlData: newCurlData,
        generatedCurl: generateCurlCommand(newCurlData)
      };
    }

    case ACTIONS.UPDATE_MULTIPART: {
      const { id, field, value } = action.payload;
      const newData = (state.curlData.multipartData || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      const newCurlData = { ...state.curlData, multipartData: newData };
      return {
        ...state,
        curlData: newCurlData,
        generatedCurl: generateCurlCommand(newCurlData)
      };
    }

    case ACTIONS.REMOVE_MULTIPART: {
      const newData = (state.curlData.multipartData || []).filter(item => item.id !== action.payload);
      const newCurlData = { ...state.curlData, multipartData: newData };
      return {
        ...state,
        curlData: newCurlData,
        generatedCurl: generateCurlCommand(newCurlData)
      };
    }

    case ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
};

export const CurlProvider = ({ children }) => {
  const [state, dispatch] = useReducer(curlReducer, initialState);

  const value = {
    state,
    dispatch,
    actions: ACTIONS
  };

  return (
    <CurlContext.Provider value={value}>
      {children}
    </CurlContext.Provider>
  );
};

export const useCurl = () => {
  const context = useContext(CurlContext);
  if (!context) {
    throw new Error('useCurl must be used within a CurlProvider');
  }
  return context;
};
