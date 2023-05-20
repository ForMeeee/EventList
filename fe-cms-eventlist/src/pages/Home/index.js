import React from "react";
import { useEffect } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config } from "../../configs";
import { fetchEvents } from "../../redux/events/actions";
import { formatDate } from "../../utils/formatDate";

export default function HomePage() {

  const { lists, events } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return <Container className="my-4">
    {events.status === "process" ? (
      <Spinner animation="border" variant="primary" />
    ) : events.data.length > 0 ? ( <Row>
        {
          events.data.map((data, index) => {
            return <Col xs="12" lg="3" md="3">
              <Card onClick={() => navigate(`/events/detail/${data._id}`)}>
                <Card.Img src={`${config.api_image}/${data.image.name}`} className={`img-fluid`} />
                <Card.Body>
                  <Card.Text>
                    <div className="d-flex flex-column">
                      <div><small>{data.category.name}</small></div>
                      <div><strong>{data.title}</strong></div>
                      <div>{data.venueName}, {formatDate(data.date)}</div>
                      <div className="d-flex flex-row">
                        <div className="d-flex flex-column">
                          <div><small><strong>Total Stock</strong></small></div>
                          <div>{data.stock}</div>
                        </div>
                        <div className="d-flex flex-column ms-auto me-0">
                          <div><small><strong>Sold</strong></small></div>
                          <div>{data.sold}</div>
                        </div>
                      </div>
                    </div>
                    </Card.Text>
                </Card.Body>
              </Card>
            </Col>;
          })
        }
      </Row>

    ) : (
      <>
        Tidak Ditemukan Data
      </>
    )}
  </Container>;
}