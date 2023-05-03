import {
  START_FETCHING_ORDERS,
  SUCCESS_FETCHING_ORDERS,
  ERROR_FETCHING_ORDERS,
  SET_PAGE,
  SET_DATE,
  START_FETCHING_ORDER_DETAIL,
  ERROR_FETCHING_ORDER_DETAIL,
  SUCCESS_FETCHING_ORDER_DETAIL,
} from "./constants";

const statuslist = {
  idle: "idle",
  process: "process",
  success: "success",
  error: "error",
};

const initialState = {
  data: [],
  page: 1,
  limit: 10,
  pages: 1,
  date: {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  },
  id: '',
  status: statuslist.idle,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case START_FETCHING_ORDERS:
      return { ...state, status: statuslist.process };

    case ERROR_FETCHING_ORDERS:
      return { ...state, status: statuslist.error };

    case SUCCESS_FETCHING_ORDERS:
      return {
        ...state,
        status: statuslist.success,
        data: action.orders,
        pages: action.pages,
      };
    case START_FETCHING_ORDER_DETAIL:
      return { ...state, status: statuslist.process };

    case ERROR_FETCHING_ORDER_DETAIL:
      return { ...state, status: statuslist.error };

    case SUCCESS_FETCHING_ORDER_DETAIL:
      return {
        ...state,
        status: statuslist.success,
        data: action.detail,
      };

    case SET_PAGE:
      return {
        ...state,
        page: action.page,
      };

    case SET_DATE:
      return {
        ...state,
        date: action.ranges,
      };

    default:
      return state;
  }
}