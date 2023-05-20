const Events = require("../../api/v1/events/model");
const Orders = require("../../api/v1/orders/model");
const { checkingImage } = require("./images");
const { checkingCategories } = require("./categories");
const { checkingTalents, checkingMultiTalents } = require("./talents");
const { BadRequestError, NotFoundError } = require("../../errors");

const createEvents = async (req) => {
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  // cari image, category dan talent dengan field id
  await checkingImage(image);
  await checkingCategories(category);
  await checkingTalents(talent);

  // cari Events dengan field name
  const check = await Events.findOne({ title, organizer: req.user.organizer });

  // apa bila check true / data Events sudah ada maka kita tampilkan error bad request dengan message pembicara duplikat
  if (check) throw new BadRequestError("judul event duplikat");

  const result = await Events.create({
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
    organizer: req.user.organizer,
  });

  return result;
};

const getAllEvents = async (req) => {
  const { keyword, category, talent } = req.query;
  let condition = { organizer: req.user.organizer };

  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: "i" } };
  }

  if (category) {
    condition = { ...condition, category: category };
  }

  if (talent) {
    condition = { ...condition, talent: talent };
  }

  const result = await Events.find(condition)
    .populate({ path: "image", select: "_id name" })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "_id  name" },
    });
  
  let newResult = [];

  for await (const res of result.map(async (item, kk) => {
    let totalTicket = 0;
    let sold = 0;
    let income = 0;
    for await (const res of item.tickets.map(async(val, key) => {
      totalTicket += val.stock;
      let incomeOne = 0;
      let soldOne = 0;    
      let orders = await Orders
        .find({ "orderItems.ticketCategories.id": val.id })
        .select("orderItems")
        .exec()

      for await (const valord of orders) {
        for await (const vv of valord.orderItems) {
          soldOne += vv.sumTicket
          incomeOne += (vv.sumTicket * val.price)
        }
      }

      income += incomeOne
      sold += soldOne
      
    }));

    newResult.push({
      ...item._doc,
      sold: sold,
      stock: totalTicket,
    })

  }));

  return newResult;
};

const getOneEvents = async (req) => {
  const { id } = req.params;
  let totalTicket = 0;
  let sold = 0;
  let income = 0;

  let result = await Events.findOne({
    _id: id,
    organizer: req.user.organizer,
  })
    .populate({ path: "image", select: "_id name" })
    .populate({
      path: "category",
      select: "_id name",
    })
    .populate({
      path: "talent",
      select: "_id name role image",
      populate: { path: "image", select: "_id  name" },
    })
    ;



  return new Promise(async (resolve) => {
    let newTickets = [];
    for await (const res of result.tickets.map(async (val, key) => {
      totalTicket += val.stock;
      let incomeOne = 0;
      let soldOne = 0;

      let orders = await Orders
        .find({ "orderItems.ticketCategories.id": val.id })
        .select("orderItems")
        .exec()

      for await (const valord of orders) {
        for await (const vv of valord.orderItems) {
          soldOne += vv.sumTicket
          incomeOne += (vv.sumTicket * val.price)
        }
      }

      income += incomeOne
      sold += soldOne

      newTickets.push({
        ...val,
        sold: soldOne
      })

    }))

      result.tickets = newTickets

    resolve(result)
  }).then((result) => {
    if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

    return { result: result, totalTicket: totalTicket, sold: sold, income: income };
  })



};

const updateEvents = async (req) => {
  const { id } = req.params;
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body;

  // cari image, category dan talent dengan field id
  await checkingImage(image);
  await checkingCategories(category);
  await checkingMultiTalents(talent);

  // cari Events dengan field name dan id selain dari yang dikirim dari params
  const check = await Events.findOne({
    title,
    organizer: req.user.organizer,
    _id: { $ne: id },
  });

  // apa bila check true / data Events sudah ada maka kita tampilkan error bad request dengan message pembicara duplikat
  if (check) throw new BadRequestError("judul event duplikat");

  const result = await Events.findOneAndUpdate(
    { _id: id },
    {
      title,
      date,
      about,
      tagline,
      venueName,
      keyPoint,
      statusEvent,
      tickets,
      image,
      category,
      talent,
      organizer: req.user.organizer,
    },
    { new: true, runValidators: true }
  );

  // jika id result false / null maka akan menampilkan error `Tidak ada pembicara dengan id` yang dikirim client
  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const deleteEvents = async (req) => {
  const { id } = req.params;

  const result = await Events.findOne({
    _id: id,
    organizer: req.user.organizer,
  });

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  await result.remove();

  return result;
};

module.exports = {
  createEvents,
  getAllEvents,
  getOneEvents,
  updateEvents,
  deleteEvents,
};