import {
  START_FETCHING_ORDERS,
  SUCCESS_FETCHING_ORDERS,
  ERROR_FETCHING_ORDERS,
  START_FETCHING_ORDER_DETAIL,
  SUCCESS_FETCHING_ORDER_DETAIL,
  ERROR_FETCHING_ORDER_DETAIL,
  SET_DATE,
  SET_PAGE,
} from "./constants";

import { getData } from "../../utils/fetch";
import debounce from "debounce-promise";

import moment from "moment";

let debouncedFetchOrders = debounce(getData, 1000);

export const startFetchingOrders = () => {
  return {
    type: START_FETCHING_ORDERS,
  };
};

export const successFetchingOrders = ({ orders, pages }) => {
  return {
    type: SUCCESS_FETCHING_ORDERS,
    orders,
    pages,
  };
};

export const errorFetchingOrders = () => {
  return {
    type: ERROR_FETCHING_ORDERS,
  };
};

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    dispatch(startFetchingOrders());

    try {
      let params = {
        page: getState().orders.page || 1,
        limit: getState().orders.limit || 10,
        startDate: moment(
          getState().orders.date.startDate || new Date()
        ).format("YYYY-MM-01"),
        endDate: moment(getState().orders.date.endDate || new Date()).format(
          "YYYY-MM-DD"
        ),
      };

      let res = await debouncedFetchOrders("/v1/cms/orders", params);

      dispatch(
        successFetchingOrders({
          orders: res.data.data.order,
          pages: res.data.data.pages,
        })
      );
    } catch (error) {
      dispatch(errorFetchingOrders());
    }
  };
};

export const startFetchingOrderDetail = () => {
  return {
    type: START_FETCHING_ORDER_DETAIL,
  };
};

export const successFetchingOrderDetail = ({ detail }) => {
  return {
    type: SUCCESS_FETCHING_ORDER_DETAIL,
    detail
  };
};

export const errorFetchingOrderDetail = () => {
  return {
    type: ERROR_FETCHING_ORDER_DETAIL,
  };
};

export const fetchOrderDetail = (id) => {
  return async (dispatch, getState) => {
    dispatch(startFetchingOrderDetail());

    try {
      let params = {};

      let res = await debouncedFetchOrders(`/v1/cms/orders/${id}`, params);

      dispatch(
        successFetchingOrderDetail({
          detail: res.data.data,
        })
      );
    } catch (error) {
      dispatch(errorFetchingOrderDetail());
    }
  };
};

export const setPage = (page) => {
  return {
    type: SET_PAGE,
    page,
  };
};

export const setDate = (ranges) => {
  return {
    type: SET_DATE,
    ranges,
  };
};