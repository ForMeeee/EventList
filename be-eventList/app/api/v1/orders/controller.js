const { getAllOrders, getOneOrder, updateOrder } = require("../../../services/mongoose/orders");

const { StatusCodes } = require("http-status-codes");

const index = async (req, res, next) => {
  try {
    const result = await getAllOrders(req);

    res.status(StatusCodes.OK).json({
      data: { order: result.data, pages: result.pages, total: result.total },
    });
  } catch (err) {
    next(err);
  }
};
const find = async (req, res, next) => {
  try {
    const result = await getOneOrder(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });

  } catch (err) {
    next(err);
  }
};
const update = async (req, res, next) => {
  try {
    const result = await updateOrder(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const emailRcp = async (req, res, next) => {
  try {
    const result = await getOneOrder(req);

    const rcpMail = await receiptMail(result);
    res.send(rcpMail)
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
  find,
  update,
  emailRcp,
};