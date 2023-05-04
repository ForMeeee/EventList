import { Slider } from "@mui/material";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Accordion, Badge, Button, Card, Col, Container, Form, FormGroup, FormLabel, Image, Row } from "react-bootstrap";
import { formatDate, FormatMoney } from "utils/formatDate";
import Brand from "../components/Brand";
import CardEvent from "../components/CardEvent";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Statistics from "../components/Statistics";
import Stories from "../components/Stories";
import { getData } from "../utils/fetchData";

export default function Browse() {

  const [state, setState] = useState({
    filter: {},
  })

  useEffect(() => {
    document.title = "Browse"
    getCategories()
    getEvent()
  }, [])

  useEffect(() => {
    getEvent()
  }, [state.filter])

  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [range, setRange] = useState([0, 25000001])
  const handleChangeRange = (e, val) => {
    setRange(val);
    setState(prevState => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        priceFrom: val[0],
        priceTo: val[1],
      }
    }))
  }

  const getEvent = async () => {
    const req = await getData("api/v1/events", state.filter);
    const res = req.data;
    setData(res)
  }

  const getCategories = async () => {
    const req = await getData("api/v1/eventcategories");
    const res = req.data;
    setCategories(res);
  }

  const handleChangeCat = (id) => (e) => {
    setState(prevState => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        category: id
      }
    }))
  }

  const handleChangeRadio = (e) => {
    const {value} = e.target
    setState(prevState => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        lokasi: value
      }
    }))
  }

  return (
    <>


      <div className="browse-page">
        <header className="header bg-navy">
          <Navbar />
        </header>
        <div className="wrapper">
          <Container>
            <Row>
              <Col xs="12" lg="3">
                <Card>
                  <Card.Header className="py-3">
                    <div className="d-flex flex-row">
                      <div><strong>Filter</strong></div>
                      <div className="me-0 ms-auto"><small>Reset</small></div>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Accordion alwaysOpen flush>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Lokasi</Accordion.Header>
                        <Accordion.Body>
                          <div key={`radio`} className="form-group">
                            <Form.Check type="radio" label="Online" name="lokasi" value={`online`} onChange={handleChangeRadio} checked={state.filter.lokasi === 'online'}/>
                            <Form.Check type="radio" label="Offline" name="lokasi" value={`offline`} onChange={handleChangeRadio} checked={state.filter.lokasi === 'offline'}/>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>Rentang Harga</Accordion.Header>
                        <Accordion.Body>
                          <Slider value={range} onChange={handleChangeRange} min={0} max={2500001} />
                          <div className="d-flex flex-row">
                            <div><small>IDR {
                              (range[0]) > 2500000 ? <><FormatMoney amount={2500000} />+</>
                                : <FormatMoney amount={range[0]} />
                            }</small></div>
                            <div className="me-0 ms-auto">
                              <div><small>IDR {
                                (range[1]) > 2500000 ? <><FormatMoney amount={2500000} />+</>
                                  : <FormatMoney amount={range[1]} />
                              }</small></div>
                            </div>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="12" lg="9">
                <div className="mb-3">
                  <Badge pill bg={state.filter.category === '' ? 'secondary' : 'light'} text="dark" className="me-2" onClick={handleChangeCat('')}>Semua</Badge>
                  {
                    categories.map((val, key) => {
                      return <Badge pill bg={state.filter.category === val._id ? 'secondary' : 'light'} text="dark" className="me-2" onClick={handleChangeCat(val._id)}>{val.name}</Badge>
                    })
                  }
                </div>
                <section className="grow-today">
                  <div className="mt-1 row gap">
                    {data.map((data, index) => (
                      <div className="col-lg-4 col-md-6 col-12" key={index}>
                        <div className="card-grow h-100">
                          <span className="badge-pricing">
                            {data.tickets[0].price === 0
                              ? "free"
                              : <>Rp<FormatMoney amount={data.tickets[0].price} /></>}
                          </span>
                          <img
                            src={`${process.env.NEXT_PUBLIC_API}/${data.image.name}`}
                            alt="EventList"
                            className="img-fluid"
                          />
                          <div className="card-content">
                            <div className="card-title">{data.title}</div>
                            <div className="card-subtitle">{data.category.name}</div>
                            <div className="description">
                              {data.venueName}, {formatDate(data.date)}
                            </div>
                            <Link
                              href={`/detail/${data._id}`}
                              className="stretched-link"
                            ></Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </Col>
            </Row>
          </Container>
        </div>

      </div>

      <Footer />
    </>
  );
}
