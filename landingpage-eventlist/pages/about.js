import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import Brand from "../components/Brand";
import CardEvent from "../components/CardEvent";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Statistics from "../components/Statistics";
import Stories from "../components/Stories";
import { getData } from "../utils/fetchData";

export default function About({ data }) {
  useEffect(() => {
    document.title = "About Us";
  });

  // console.log("data");
  // console.log(data);
  return (
    <>
      <div className="about-page">
        <header className="header bg-navy">
          <Navbar />
        </header>
        <Container className="about-us-welcome">
          <Row className="d-flex align-items-center my-5">
            <Col xs="12" lg="7">
              <div className="welcome-text">
                <h1>
                  Harness the power of
                  <br />
                  experience businesses
                </h1>
                <span>
                  We amplify your businesses into the world of unforgettable
                  experience for your customers.
                </span>
              </div>
            </Col>
            <Col xs="12" lg="5">
              <div className="p-4">
                <Image src={`/images/about-us-tagline.png`} fluid />
              </div>
            </Col>
          </Row>
          <div className="aboutUs-page_features">
            <Row className="d-flex align-items-center my-5">
              <Col xs="12" lg="6">
                <div className="p-4">
                  <Image src={`/images/about-us-device.png`} fluid />
                </div>
              </Col>
              <Col xs="12" lg="6">
                <div className="welcome-text-2">
                  <h3>EventList</h3>
                  <span>
                    Our solution is end-to-end, ranges from web and app-based
                    ticketing marketplace, online booking and reservation system
                    to on-ground visitation management handling. Our features
                    also supports promotion for your businesses and connect with
                    your customers.
                  </span>
                </div>
              </Col>
            </Row>
          </div>
          <div className="image-group my-5">
            <Image
              src={`/images/about-us-group.1fc49df9207067ff2935.jpg`}
              className="border-radius-4 mx-auto d-block"
            />
          </div>
          <Row className="d-flex flex-column align-items-center text-center my-5">
            <Col xs="12" lg="8">
              <h3>Our Mission</h3>
              <p>
                Our mission - provide a great event experience and connect the
                community with events that inspire and educate. We are committed
                to being a platform that facilitates the easy sale of event
                tickets, providing broad access for users to find events that
                are relevant to their interests and preferences.
              </p>
              <p>
                We also want to empower individuals and communities to easily
                organize their own events through our platform. In doing so, we
                look forward to embracing a diversity of events, from seminars
                and conferences to concerts, art exhibitions, festivals and
                more.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Footer />
    </>
  );
}
