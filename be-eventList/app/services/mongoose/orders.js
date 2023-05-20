const { populate } = require("../../api/v1/orders/model");
const Orders = require("../../api/v1/orders/model");
const QRCode = require('qrcode');
const { emailRcp } = require("../../api/v1/orders/controller");
const { otpMail, invoiceMail, receiptMail } = require("../mail");
const { NotFoundError } = require("../../errors");

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
    .sort([['date', -1]])
    .skip(limit * (page - 1));

  const count = await Orders.countDocuments(condition);

  return { data: result, pages: Math.ceil(count / limit), total: count };
};

const getOneOrder = async (req) => {
  const { id } = req.params;

  // const result = await Orders.findOne({
  //   _id: id,
  // })
  //   .populate("payment")
  //   .populate({
  //     path: "event",
  //     populate: {
  //       path: "image"
  //     }
  //   })
  // .select("_id type status image");

  const result = await Orders.findOne({
    _id: id,
  })
    .populate("payment")
    .populate({
      path: "event",
      populate: {
        path: "image"
      }
    });


  if (!result)
    throw new NotFoundError(`Tidak ada detail order dengan id :  ${id}`);
  return result;


};



const updateOrder = async (req) => {
  const { id } = req.params;

  const checkingModel = await Orders.findOne({ _id: id });

  const {
    status
  } = req.body;

  checkingModel.status = status

  new Promise((resolve) => {
    if (checkingModel.status === 'paid') {
      checkingModel.orderItems.forEach((item, k) => {
        item.userTickets.forEach((tic, kk) => {
          // QRCode.toDataURL(tic.id, function (err, url) {
          //   checkingModel.orderItems[k].userTickets[kk].qr_string = url;
          //   if ((checkingModel.orderItems.length - 1 == k) && (item.userTickets.length - 1 == kk)) {
          //     resolve(checkingModel)
          //   }
          // })

          const filename = Math.floor(Math.random() * 99999999) + "-" + tic.id + '.png'
          QRCode.toFile('public/uploads/' + filename, tic.id, {
            errorCorrectionLevel: 'H'
          }, function (err) {
            if (err) throw err;
            checkingModel.orderItems[k].userTickets[kk].qr_string = filename;
            if ((checkingModel.orderItems.length - 1 == k) && (item.userTickets.length - 1 == kk)) {
              resolve(checkingModel)
            }
          });
        })
      })
    } else {
      resolve(checkingModel)
    }
  }).then(async (res) => {
    // console.log(res)
    const result = await res.save().then(async (saved) => {

      if (res.status === 'paid') {
        //Coding send email 
        const data = await Orders.findOne({
          _id: id,
        })
          .populate("payment")
          .populate({
            path: "event",
            populate: {
              path: "image"
            }
          })
        await receiptMail(data)
      }

      return res;
    })

  })

  // const result = await Orders.findOneAndUpdate(
  //   { _id: id },
  //   {
  //     status
  //   },
  //   { new: true, runValidators: true }
  // );


};


module.exports = {
  getAllOrders,
  getOneOrder,
  updateOrder,
};