// eslint-disable @next/next/no-img-element
import React, { useState, useEffect } from "react";
import Button from "../Button";
import { useRouter } from "next/router";
import { getData, postData } from "../../utils/fetchData";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { Form, InputGroup } from "react-bootstrap";
import { FormatMoney } from "utils/formatDate";

export default function FormCheckout({ tickets, orderData, event, participant }) {
  const router = useRouter();
  // const { ticketId, organizer } = router.query;

  const [ticketId, setTicketId] = useState([]);
  const [organizer, setOrganizer] = useState([]);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const composeOrder = async () => {
      let newOrder = [];
      let ticketTotal = 0;
      orderData.dataOrder?.map((val, key) => {
        let toPush = {
          ticketId: val.id,
          price: val.price,
          type: val.type,
          lastName: '',
          firstName: '',
          email: '',
          phone: ''
        }

        for (let i = 0; i < val.order; i++) {
          newOrder.push(toPush);
        }

        ticketTotal += val.price * val.order;
      });

      setOrder(newOrder);
      setForm(prevState => ({
        ...prevState,
        ticketTotal: ticketTotal
      }))
    }
    composeOrder();
  }, [orderData])

  const [form, setForm] = useState({
    email: "",
    lastName: "",
    firstName: "",
    phone: "",
    payment: "",
    event: router.query.id,
  });

  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const fetctData = async () => {
      try {
        const res = await getData(
          `api/v1/payments`,
          {},
          Cookies.get("token")
        );
        res.data.forEach((res) => {
          res.isChecked = false;
        });
        setPayments(res.data);
      } catch (err) { }
    };

    fetctData();

  }, []);

  useEffect(() => {
    let paymentId = "";
    payments.filter((payment) => {
      if (payment.isChecked) {
        paymentId = payment._id;
      }
    });
    setForm({
      ...form,
      payment: paymentId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {


    try {
      const _temp = [];
      let tickets = [];

      order.map(async (val) => {

        let exists = false;
        tickets.map((t, k) => {
          if (val.ticketId === t.ticketCategories?._id) {
            exists = true;
          }
        });

        if (!exists) {
          let toPush = {
            ticketCategories: {
              _id: val.ticketId,
              type: val.type,
              price: val.price,
            },
            userTickets: [],
            sumTicket: 0,
          }
          tickets.push(toPush);
        }

      });

      order.map((val) => {
        tickets.map((t, k) => {
          if (val.ticketId === t.ticketCategories._id) {
            tickets[k].sumTicket += 1;
            tickets[k].userTickets.push({
                lastName: val.lastName,
                firstName: val.firstName,
                email: val.email,
                phone: val.phone,
              });
          }
        })
      })

      let payload = {
        event: form.event,
        payment: form.payment,
        personalDetail: {
          lastName: form.lastName,
          firstName: form.firstName,
          email: form.email,
          phone: form.phone,
        },
        participant: participant,
        tickets: tickets,
      };

      // console.log(payload);
      // return;

      const res = await postData(
        "api/v1/checkout",
        payload,
        Cookies.get("token")
      );

      if (res.data) {
        toast.success("berhasil checkout", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("gagal checkout. " + err.response.data.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleChangePayment = (e, i) => {
    const _temp = [...payments];

    _temp[i].isChecked = e.target.checked;

    _temp.forEach((t) => {
      if (t._id !== e.target.value) {
        t.isChecked = false;
      }
    });

    if (_temp[i].isChecked) {
      setForm({
        ...form,
        payment: payments[i]._id,
      });
    }

  };

  const handleChangeOrder = (idx) => (e) => {
    const { name, value } = e.target;

    let newOrder = [...order];
    let newDetail = newOrder[idx];

    newDetail = {
      ...newDetail,
      [name]: value
    }

    newOrder[idx] = newDetail;
    setOrder(newOrder);
  }


  return (
    <form action="" className="container form-eventlist">
      <div className="personal-details">
        <div className="row row-cols-lg-8 row-cols-md-2 row-cols-1 justify-content-lg-center">
          <div className="form-title col-lg-8">
            <span>01</span>
            <div>Contact Person</div>
          </div>
        </div>
        <div className="row row-cols-lg-8 row-cols-md-2 row-cols-1 justify-content-center">
          <div className="mb-4 col-lg-4">
            <label htmlFor="first_name" className="form-label">
              First Name
            </label>
            <input
              type="text"
              placeholder="First name here"
              className="form-control"
              id="first_name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 col-lg-4">
            <label htmlFor="last_name" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last name here"
              className="form-control"
              name="lastName"
              id="last_name"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row row-cols-lg-8 row-cols-md-2 row-cols-12 justify-content-center">
          <div className="mb-4 col-lg-4">
            <label htmlFor="email_address" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email_address"
              placeholder="EventList@gmail.com"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 col-lg-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Phone
            </label>
            <input
              type="number"
              className="form-control"
              id="phone"
              placeholder="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row row-cols-lg-8 row-cols-md-2 row-cols-1 justify-content-lg-center">
          <div className="form-title col-lg-8">
            <span>02</span>
            <div>Ticket User</div>
          </div>
        </div>
        {order.map((val, key) => {
          return (
            <>
              <div className="row row-cols-lg-8 row-cols-md-2 row-cols-1 justify-content-center">
                <div className="mb-1 col-lg-1">
                  <button className="btn btn-secondary">{key + 1}</button>
                </div>
                <div className="mb-1 col-lg-7">
                  <div className="form-title">
                    <div>{val.type}</div>
                    <hr />
                  </div>
                </div>
              </div>
              <div className="row row-cols-lg-8 row-cols-md-2 row-cols-1 justify-content-center">
                <div className="mb-4 col-lg-3 offset-lg-1">
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First name here"
                    className="form-control"
                    id="first_name"
                    name="firstName"
                    value={val.firstName}
                    onChange={handleChangeOrder(key)}
                  />
                </div>
                <div className="mb-4 col-lg-3">
                  <label htmlFor="last_name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last name here"
                    className="form-control"
                    name="lastName"
                    id="last_name"
                    value={val.lastName}
                    onChange={handleChangeOrder(key)}
                  />
                </div>
              </div>
              <div className="row row-cols-lg-8 row-cols-md-2 row-cols-12 justify-content-center">
                <div className="mb-4 col-lg-3 offset-lg-1">
                  <label htmlFor="email_address" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email_address"
                    placeholder="EventList@gmail.com"
                    name="email"
                    value={val.email}
                    onChange={handleChangeOrder(key)}
                  />
                </div>

                <div className="mb-4 col-lg-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Phone
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phone"
                    placeholder="Phone number"
                    name="phone"
                    value={val.phone}
                    onChange={handleChangeOrder(key)}
                  />
                </div>
              </div>
            </>
          );
        })}
      </div>

      <div className="payment-method mt-4">
        <div className="row row-cols-lg-8 row-cols-md-2 row-cols-1 justify-content-lg-center">
          <div className="form-title col-lg-8">
            <span>03</span>
            <div>Payment Method</div>
          </div>
        </div>
        <div className="row row-cols-lg-8 row-cols-md-2 row-cols-1 justify-content-center gy-4 gy-md-0">
          {payments.map((payment, i) => (
            <div className="col-lg-4" key={payment._id}>
              <label className="payment-radio h-100 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API}/${payment.image.name}`}
                    alt=""
                    className="img-fluid"
                  />
                  <div>{payment.type}</div>
                </div>
                <input
                  type="radio"
                  checked={payment.isChecked}
                  name="isChecked"
                  value={payment._id}
                  onChange={(e) => handleChangePayment(e, i)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="row row-cols-lg-8 row-cols-md-2 row-cols-1 justify-content-lg-center">
          <div className="form-title col-lg-8">
            <span>04</span>
            <div>Payment Detail</div>
          </div>
        </div>
        <div className="row row-cols-lg-8 row-cold-md-2 justify-content-lg-center">
          <div className="mb-4 col-lg-2">
            <label htmlFor="email_address" className="form-label">
              Ticket Total
            </label>
          </div>
          <div className="mb-4 col-lg-6">
            <InputGroup>
              <InputGroup.Text>Rp</InputGroup.Text>
              <Form.Control
                value={FormatMoney({ amount: form.ticketTotal })}
                readOnly
              />
            </InputGroup>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center footer-payment gap-4">
        <Button variant="btn-green" action={() => handleSubmit()}>
          Pay Now
        </Button>
        <div>
          <img src="/icons/ic-secure.svg" alt="" />
          <span>Your payment is secure and encrypted</span>
        </div>
      </div>
    </form>
  );
}