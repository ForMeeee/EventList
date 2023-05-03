import { Button } from "bootstrap";
import React, { useEffect } from "react";
import { Card, Col, Container, Form, FormGroup, Image, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import { fetchOrderDetail } from "../../redux/orders/actions";

export default function OrderDetail() {
    const dispatch = useDispatch();
    const { id } = useParams();

    const orders = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrderDetail(id));
    }, [dispatch, id]);

    useEffect(() => {
        console.log('status', orders.status)
    }, [orders.status])

    const PersonalDetail = ({ person }) => {
        return (
            <>
                <FormGroup as={Row} className="mb-1">
                    <Form.Label column xs="12" lg="4">First Name</Form.Label>
                    <Col xs="12" lg="8">
                        <Form.Control name="firstName" value={person?.firstName} />
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="mb-1">
                    <Form.Label column xs="12" lg="4">Last Name</Form.Label>
                    <Col xs="12" lg="8">
                        <Form.Control name="lastName" value={person?.lastName} />
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="mb-1">
                    <Form.Label column xs="12" lg="4">Email</Form.Label>
                    <Col xs="12" lg="8">
                        <Form.Control name="email" value={person?.email} />
                    </Col>
                </FormGroup>
                <FormGroup as={Row} className="mb-1">
                    <Form.Label column xs="12" lg="4">Role</Form.Label>
                    <Col xs="12" lg="8">
                        <Form.Control name="role" value={person?.role} />
                    </Col>
                </FormGroup>
            </>

        )
    }


    return (
        <Container className="mt-3">
            <BreadCrumb textSecound={"orders"} />
            {
                orders.status !== "success" && <Spinner animation="border" variant="primary" />
            }
            {
                orders.status === "success" && <>
                    <h1 className="mb-4">Detail Order ID : {orders.data._id}</h1>
                    <Row>
                        <Col xs="12" lg="6">
                            <h4><strong>Personal Detail</strong></h4>
                            <Card className="mb-3">
                                <Card.Body>
                                    <PersonalDetail person={orders.data.personalDetail} />
                                </Card.Body>
                            </Card>

                            <h4><strong>Ticket User</strong></h4>
                            <Card className="mb-2">
                                {
                                    orders.data.orderItems?.map((val) => {
                                        return val.userTickets.map((user) => {
                                            return <Card.Body className="border-bottom">
                                                <p><strong>{val.ticketCategories.type}</strong></p>
                                                <Row>
                                                    <Col xs="12" lg={{ span: 11, offset: 1 }} >
                                                        <PersonalDetail person={user} />
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        })
                                    })
                                }
                            </Card>
                        </Col>
                        <Col xs="12" lg="6">
                            <h4><strong>Event</strong></h4>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Image src={process.env.REACT_APP_HOST_IMAGE_DEV + '/' + orders.data.event?.image?.name} className="img-fluid" />
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">Title</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Control name="role" value={orders.data.historyEvent?.title} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">Date</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Control name="role" value={orders.data.historyEvent?.date} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">About</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Control as="textarea" name="role" value={orders.data.historyEvent?.about} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">Tagline</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Control name="role" value={orders.data.historyEvent?.tagline} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">Venue Name</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Control name="role" value={orders.data.historyEvent?.venueName} />
                                        </Col>
                                    </FormGroup>

                                </Card.Body>
                            </Card>
                            <h4><strong>Other Information</strong></h4>
                            <Card className="mb-3">
                                <Card.Body>
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">Total Ticket</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Control name="role" value={orders.data.totalOrderTicket} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">Total Price</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Control name="role" value={orders.data.totalPay} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">Payment Method</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Control name="role" value={orders.data.payment?.type} />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup as={Row} className="mb-1">
                                        <Form.Label column xs="12" lg="4">Status Payment</Form.Label>
                                        <Col xs="12" lg="8">
                                            <Form.Select value={orders.data.status}>
                                                <option value={"pending"}>pending</option>
                                                <option value={"paid"}>paid</option>
                                                <option value={"failed"}>failed</option>
                                            </Form.Select>
                                        </Col>
                                    </FormGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-center p-2 border rounded mb-4">
                        <div>
                            <button className="btn btn-success">Submit</button>
                        </div>
                    </div>
                </>
            }
        </Container >
    )
}
