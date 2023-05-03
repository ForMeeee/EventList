/* eslint-disable @next/next/no-img-element */
import moment from "moment";
import Head from "next/head";
import Footer from "../../components/Footer";
import FormCheckout from "../../components/FormCheckout";
import Navbar from "../../components/Navbar";
import { getData } from "../../utils/fetchData";
import { formatDate } from "../../utils/formatDate";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Checkout({ detailPage, participant }) {
  const router = useRouter();
  const { ticketId, orderdata } = router.query;
  const [orderData, setOrderData] = useState({})

  useEffect(() => {
    let data = atob(orderdata);
    data = JSON.parse(data);
    setOrderData(data);
  }, [orderdata])

  return (
    <>
      <Head>
        <title>EventList || Checkout</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="bg-navy">
        <Navbar />
      </section>

      <section className="bg-navy">
        <div className="checkout container">
          <div className="text-center checkout-title">Invest In Yourself</div>

          <div className="event-details container d-flex flex-wrap justify-content-lg-center align-items-center gap-5">
            <img
              src="/images/details-image.png"
              className="event-image"
              alt="EventList"
            />
            <div className="d-flex flex-column gap-3">
              <h5>{detailPage.title}</h5>

              <div className="d-flex align-items-center gap-3">
                <img src="/icons/ic-marker-white.svg" alt="" />
                <span>{detailPage.venueName}</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <img src="/icons/ic-time-white.svg" alt="" />
                <span> {moment(detailPage.date).format("HH.MM A")}</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <img src="/icons/ic-calendar-white.svg" alt="" />
                <span>{formatDate(detailPage.date)}</span>
              </div>
            </div>
            <div className="total-price">
              {detailPage.tickets.map((ticket) => (
                <>
                  {ticket._id === ticketId
                    ? ticket.price === 0
                      ? "free"
                      : `Rp${ticket.price}`
                    : ""}
                </>
              ))}
            </div>
          </div>

          {/* form */}
          <FormCheckout tickets={detailPage.tickets} orderData={orderData} event={detailPage} participant={participant} />
        </div>
      </section>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const { token, user_id } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  const req = await getData(`/api/v1/events/${context.params.id}`);

  const res = req.data;
  return {
    props: { detailPage: res, participant: user_id },
  };
}