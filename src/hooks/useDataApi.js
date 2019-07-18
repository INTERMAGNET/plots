import { useEffect, useReducer } from 'react';
import axios from 'axios';
import moment from 'moment';
import libs from '../libs';


const FETCH_INIT = 'FETCH_INIT';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_FAILURE = 'FETCH_FAILURE';
/**
 * Reducer for URL fetching
 * @param {*} state - previous state
 * @param {*} action - action dispatched
 */
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};


/**
 * Build the URL for query
 * @param {*} params - as found in param reducer
 */
const buildUrl = (params) => {
  let {
    source,
    station,
    sampling,
    dataType,
    format,
    date,
  } = params;

  // Convert station
  station = station.toLowerCase();

  // Convert sampling
  switch (sampling) {
    case 60:
      sampling = 'minute';
      break;
    case 1:
      sampling = 'second';
      break;
    default:
      throw new Error("Unknown sampling period");
  }

  // convert data type
  const dataTypes = (dataType === 'all') ? ['definitive','quasi-definitive','provisional','variation'] : [dataType];

  // Convert date to moment if not yet done so
  date = (date instanceof moment) ? date : moment(date);

  return dataTypes.map(v => {
    const filename = `${station}${date.format("YYYYMMDD")}${dataType.substr(0,1)}${sampling.substr(0,3)}.${sampling.substr(0,3)}`;
    const directory = `${source}/${sampling}/${dataType}/${format}/${date.format("YYYY/MM")}/`;
    return [
      `${directory}${filename}.gz`,
      `${directory}${filename}`
    ];
  }).flat();
};


const SET_SOURCE = 'SET_SOURCE';
const SET_STATION = 'SET_STATION';
const SET_SAMPLING = 'SET_SAMPLING';
const SET_DATATYPE = 'SET_DATATYPE';
const SET_FORMAT = 'SET_FORMAT';
const SET_DATE = 'SET_DATE';
/**
 * Reducer for param setting
 * @param {*} state - previous state
 * @param {*} action - action dispatched
 */
const paramReducer = (state, action) => {
  switch (action.type) {
    case SET_SOURCE:
      return { ...state, source: action.payload };
    case SET_STATION:
      return { ...state, station: action.payload };
    case SET_SAMPLING:
      return { ...state, sampling: action.payload };
    case SET_DATATYPE:
      return { ...state, dataType: action.payload };
    case SET_FORMAT:
      return { ...state, format: action.payload };
    case SET_DATE:
      return { ...state, date: action.payload };
    default:
      throw new Error();
  }
}


/**
 * React Hook - Fetch IAGA2002 from the web and parse the content
 */
const useDataApi = (initialParams) => {
  const [params, dispatchParams] = useReducer(paramReducer, Object.assign({
    source: '',
    station: '',
    sampling: 60,
    dataType: 'variation',
    format: 'IAGA2002',
    date: moment(),
  }, initialParams));

  const [state, dispatchFetch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: new libs.GeomagneticData(),
  });

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatchFetch({ type: FETCH_INIT });
      for (const url of buildUrl(params)) {
        try {
          let result = await axios(url);
          if (!didCancel) {
            dispatchFetch({ type: FETCH_SUCCESS, payload: libs.parseIAGA2002(result.data) });
            break;
          }
        } catch (error) {
          continue;
        }
        // if we have reach this stage, it means all attempts failed
        if (!didCancel) {
          dispatchFetch({ type: FETCH_FAILURE });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [params]);

  const actions = {
    setSource: source => dispatchParams({type: SET_SOURCE, payload: source}),
    setStation: station => dispatchParams({type: SET_STATION, payload: station}),
    setSampling: sampling => dispatchParams({type: SET_SAMPLING, payload: sampling}),
    setDataType: dataType => dispatchParams({type: SET_DATATYPE, payload: dataType}),
    setFormat: format => dispatchParams({type: SET_FORMAT, payload: format}),
    setDate: date => dispatchParams({type: SET_DATE, payload: date}),
  }

  return { ...state, ...params, ...actions };
};

export default useDataApi;