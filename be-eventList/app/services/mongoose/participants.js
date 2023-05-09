const Events = require("../../api/v1/events/model");
const Participant = require("../../api/v1/participants/model");
const Payments = require("../../api/v1/payments/model");
const Orders = require("../../api/v1/orders/model");
const Categories = require("../../api/v1/categories/model");

const { NotFoundError } = require("../../errors");
const { BadRequestError, UnauthorizedError } = require("../../errors");
const { createJWT, createTokenParticipant } = require("../../utils");
const { otpMail, invoiceMail } = require("../mail");

const getAllEvents = async (req) => {
  const { category, priceFrom, priceTo, not } = req.query;
  let filter = { statusEvent: "Published" };
  if (category) {
    filter = {
      ...filter,
      category: category,
    };
  }
  if (priceFrom) {
    filter = {
      ...filter,
      "tickets.price": {
        $gte: priceFrom,
      },
    };
  }
  if (priceTo) {
    filter = {
      ...filter,
      "tickets.price": {
        ...filter["tickets.price"],
        $lte: priceTo,
      },
    };
  }
  if (not) {
    filter = {
      ...filter,
      _id: {
        $nin: not,
      },
    };
  }
  const query = await Events.find(filter)
    .populate("category")
    .populate("image")
    .select("_id title date tickets venueName");
  return query;
};

const getOneEvent = async (req) => {
  const { id } = req.params;
  let result;
  try {
    // result = await Events.findOne({ _id: id })
    //   .populate("category")
    //   .populate("image")
    //   .populate({
    //     path: "talent",
    //     select: "_id name role image",
    //     populate: { path: "image", select: "_id  name" },
    //   });

    result = await Events.findOne({
      _id: id,
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
      });
  } catch ($e) {
    console.log("error", $e);
  }

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const signinParticipant = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const result = await Participant.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  if (result.status === "tidak aktif") {
    throw new UnauthorizedError("Akun anda belum aktif");
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Credentials");
  }

  const token = createJWT({ payload: createTokenParticipant(result) });
  return {
    token: token,
    user_id: result._id,
    firstName: result.firstName,
    lastNam: result.lastName,
  };
};

const signupParticipant = async (req) => {
  const { firstName, lastName, email, password, role } = req.body;
  // participant new -> create data baru dengan status  tidak aktif
  //
  // jika email dan status tidak aktif
  let result = await Participant.findOne({
    email,
    status: "tidak aktif",
  });

  if (result) {
    result.firstName = firstName;
    result.lastName = lastName;
    result.role = role;
    result.email = email;
    result.password = password;
    result.otp = Math.floor(Math.random() * 9999);
    await result.save();
  } else {
    result = await Participant.create({
      firstName,
      lastName,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999),
    });
  }
  await otpMail(email, result);

  delete result._doc.password;
  delete result._doc.otp;

  return result;
};

const activateParticipant = async (req) => {
  const { otp, email } = req.body;
  const check = await Participant.findOne({
    email,
  });

  if (!check) throw new NotFoundError("Partisipan belum terdaftar");

  if (check && check.otp !== otp) throw new BadRequestError("Kode otp salah");

  const result = await Participant.findByIdAndUpdate(
    check._id,
    {
      status: "aktif",
    },
    { new: true }
  );

  delete result._doc.password;

  return result;
};

const getAllPaymentByOrganizer = async (req) => {
  const { organizer } = req.params;

  const result = await Payments.find().populate("image");

  return result;
};

/**
 * Tugas Send email invoice
 * TODO: Ambil data email dari personal detail
 *  */
const checkoutOrder = async (req) => {
  const { event, personalDetail, payment, tickets, participant } = req.body;

  const checkingEvent = await Events.findOne({ _id: event });
  if (!checkingEvent) {
    throw new NotFoundError("Tidak ada acara dengan id : " + event);
  }

  const checkingPayment = await Payments.findOne({ _id: payment });

  if (!checkingPayment) {
    throw new NotFoundError(
      "Tidak ada metode pembayaran dengan id :" + payment
    );
  }

  let totalPay = 0,
    totalOrderTicket = 0;
  await tickets.forEach((tic) => {
    checkingEvent.tickets.forEach((ticket) => {
      if (tic.ticketCategories.type === ticket.type) {
        if (tic.sumTicket > ticket.stock) {
          throw new NotFoundError("Stock event tidak mencukupi");
        } else {
          ticket.stock -= tic.sumTicket;

          totalOrderTicket += tic.sumTicket;
          totalPay += tic.ticketCategories.price * tic.sumTicket;
        }
      }
    });
  });

  await checkingEvent.save();

  const historyEvent = {
    title: checkingEvent.title,
    date: checkingEvent.date,
    about: checkingEvent.about,
    tagline: checkingEvent.tagline,
    keyPoint: checkingEvent.keyPoint,
    venueName: checkingEvent.venueName,
    tickets: tickets,
    image: checkingEvent.image,
    category: checkingEvent.category,
    talent: checkingEvent.talent,
    organizer: checkingEvent.organizer,
  };

  const result = new Orders({
    date: new Date(),
    personalDetail: personalDetail,
    totalPay,
    totalOrderTicket,
    orderItems: tickets,
    participant: participant,
    event,
    historyEvent,
    payment,
  });

  await result.save().then(async (saved) => {
    //Coding send email
    id = saved.id;
    const data = await Orders.findOne({
      _id: id,
    })
      .populate("payment")
      .populate({
        path: "event",
        populate: {
          path: "image",
        },
      });
    await invoiceMail(data);
  });

  return result;
};

const getAllOrders = async (req) => {
  const result = await Orders.find({ participant: req.participant.id });
  return result;
};

const getAllCategories = async (req) => {
  const result = await Categories.find();
  return result;
};

module.exports = {
  getAllEvents,
  getOneEvent,
  signinParticipant,
  signupParticipant,
  activateParticipant,
  getAllPaymentByOrganizer,
  checkoutOrder,
  getAllOrders,
  getAllCategories,
};
