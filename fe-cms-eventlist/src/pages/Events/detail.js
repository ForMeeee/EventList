import moment from "moment";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import { getData } from "../../utils/fetch";
import { formatDate, FormatMoney } from "../../utils/formatDate";
import { config } from "../../configs";

function DetailEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listTalents, setListTalents] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [selectedSpeakers, setSelectedSpeakers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    date: "",
    file: "",
    avatar: "",
    about: "",
    venueName: "",
    tagline: "",
    keyPoint: [""],
    tickets: [
      {
        type: "",
        statusTicketCategories: "",
        stock: "",
        price: "",
      },
    ],
    category: "",
    talent: [],
  });

  const [alert, setAlert] = useState({
    status: false,
    type: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const getAPISingleEvents = async (id) => {
    const res = await getData(`/v1/cms/events/${id}`);

    const _temp = [];

    await res.data.data.tickets.forEach((tic) => {
      _temp.push({
        type: tic.type,
        price: tic.price,
        stock: tic.stock,
        sold: tic.sold,
        statusTicketCategories: {
          label: tic.statusTicketCategories ? "aktif" : "tidak aktif",
          value: tic.statusTicketCategories,
        },
      });
    });

    let _tempTalent = []
    await res.data.data.talent.forEach((tlt) => {
      _tempTalent.push({
        value: tlt._id,
        label: tlt.name,
        image: tlt.image.name,
      })
    })

    let _tempCat = { label: res.data.data.category.name, value: res.data.data.category._id }
    let _tempStatusEvt = { label: res.data.data.statusEvent, value: res.data.data.statusEvent }

    setForm({
      ...form,
      title: res.data.data.title,
      date: moment(res.data.data.date).format("YYYY-MM-DDTHH:SS"),
      file: res.data.data.image._id,
      avatar: res.data.data.image.name,
      about: res.data.data.about,
      venueName: res.data.data.venueName,
      tagline: res.data.data.tagline,
      keyPoint: res.data.data.keyPoint,
      tickets: _temp,
      category: _tempCat,
      talent: _tempTalent,
      statusEvent: _tempStatusEvt,
      total_ticket: res.data.totalTicket,
      sold: res.data.sold,
      income: res.data.income,
    });
  };

  useEffect(() => {
    getAPISingleEvents(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <BreadCrumb
        textSecound={"Events"}
        urlSecound={"/events"}
        textThird={form.title}
      />


      <section className="my-4">
        <Row>
          <Col xs="12" md="3">
            <Card>
              <Card.Body>
                <Row className="d-flex align-items-center">
                  <Col xs="12" md="4">
                    <div className="display-4 text-warning"><i className="fa fa-cogs"></i></div>
                  </Col>
                  <Col xs="12" md="8">
                    <h4 className="fs-4 fw-bolder">3</h4>
                    <span>Tipe Tiket</span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" md="3">
            <Card>
              <Card.Body>
                <Row className="d-flex align-items-center">
                  <Col xs="12" md="4">
                    <div className="display-4 text-primary"><i className="fa fa-database"></i></div>
                  </Col>
                  <Col xs="12" md="8">
                    <h4 className="fs-4 fw-bolder"><FormatMoney amount={form.total_ticket} /></h4>
                    <span>Total Tiket</span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" md="3">
            <Card>
              <Card.Body>
                <Row className="d-flex align-items-center">
                  <Col xs="12" md="4">
                    <div className="display-4 text-danger"><i className="fa fa-fire"></i></div>
                  </Col>
                  <Col xs="12" md="8">
                    <h4 className="fs-4 fw-bolder"><FormatMoney amount={form.sold} /></h4>
                    <span>Sold</span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs="12" md="3">
            <Card>
              <Card.Body>
                <Row className="d-flex align-items-center">
                  <Col xs="12" md="4">
                    <div className="display-4 text-success"><i className="fa fa-wallet"></i></div>
                  </Col>
                  <Col xs="12" md="8">
                    <h4 className="fs-4 fw-bolder"><FormatMoney amount={form.income} /></h4>
                    <span>Income</span>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="mb-3">
        <Row>
          <Col xs="12" md="6">
            <h1 className="display-5 fw-bold">{form.title}</h1>
            <span><small><strong>About</strong></small></span>
            <p>{form.about}</p>
            <span><small><strong>Tanggal</strong></small></span>
            <p>{(form.date)}</p>
            <span><small><strong>Tempat Acara</strong></small></span>
            <p>{form.venueName}</p>
          </Col>
          <Col xs="12" md="6">
            <img src={`${config.api_image}/${form.avatar}`} className={`img-fluid`} />
          </Col>
        </Row>

      </section>
      <section className="mb-3">
        <Row>
          <Col xs="12" md="6">
            <span><small><strong>Tagline</strong></small></span>
            <p>{form.tagline}</p>
            <span><small><strong>Kategori</strong></small></span>
            <p>{form.category.label}</p>
          </Col>
          <Col xs="12" md="6">
            <span><small><strong>Keypoint</strong></small></span>
            <p>{form.keyPoint.join(", ")}</p>
            <span><small><strong>Status Event</strong></small></span>
            <p>{form.statusEvent?.label}</p>
          </Col>
        </Row>
      </section>

      <section className="mb-3">
        <span><small><strong>Ticket</strong></small></span>
        <Row>
          {
            form.talent.map((val) => {
              return <Col xs="12" md="6">
                <Card className="my-1">
                  <Card.Body>
                    <Row className="mb-2">
                      <Col xs="12" md="2">
                        <img src={`${config.api_image}/${val.image}`} className={`img-fluid`} />
                      </Col>
                      <Col xs="12" md="8"><span className="h5">{val.label}</span></Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            })
          }
        </Row>
      </section>

      <section className="mb-3">
        <span><small><strong>Ticket</strong></small></span>
        <Row>
          {
            form.tickets.map((val) => {
              return <Col xs="12" md="6">
                <Card className="my-1">
                  <Card.Body>
                    <span className="h5">{val.type}</span>
                    <Row className="mb-2">
                      <Col xs="12" md="3">
                        <span><small><strong>Price</strong></small></span>
                        <p>{val.price}</p>
                      </Col>
                      <Col xs="12" md="3">
                        <span><small><strong>Stocks</strong></small></span>
                        <p>{val.stock}</p>
                      </Col>
                      <Col xs="12" md="3">
                        <span><small><strong>Sold</strong></small></span>
                        <p>{val.sold}</p>
                      </Col>
                      <Col xs="12" md="3">
                        <span><small><strong>Status</strong></small></span>
                        <p>{val.statusTicketCategories.label}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            })
          }
        </Row>
      </section>


    </Container>
  );
}

export default DetailEvent;