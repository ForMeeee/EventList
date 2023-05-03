const { populate } = require("../../api/v1/orders/model");
const Orders = require("../../api/v1/orders/model");

const getAllOrders = async (req) => {
  const { limit = 10, page = 1, startDate, endDate } = req.query;
  let condition = {};

  if (req.user.role !== "owner") {
    condition = { ...condition, "historyEvent.organizer": req.user.organizer };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);
    condition = {
      ...condition,
      date: {
        $gte: start,
        $lt: end,
      },
    };
  }

  const result = await Orders.find(condition)
    .limit(limit)
    .skip(limit * (page - 1));

  const count = await Orders.countDocuments(condition);

  return { data: result, pages: Math.ceil(count / limit), total: count };
};

const getOneOrder = async (req) => {
  const { id } = req.params;

  const result = await Orders.findOne({
    _id: id,
  })
    .populate("payment")
    .populate({
      path: "event",
      populate:{
        path: "image"
      }
    })
  // .select("_id type status image");

  if (!result)
    throw new NotFoundError(`Tidak ada detail order dengan id :  ${id}`);

  return result;
};


module.exports = {
  getAllOrders,
  getOneOrder
};