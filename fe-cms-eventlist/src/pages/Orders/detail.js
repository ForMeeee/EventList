import { Button } from "bootstrap";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, FormGroup, Image, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb";
import { fetchOrderDetail } from "../../redux/orders/actions";
import { postData, getData, putData } from "../../utils/fetch";
import Swal from "sweetalert2";

export default function OrderDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [orders, setOrders] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getAPISingle = async (id) => {
        const res = await getData(`/v1/cms/orders/${id}`);
        setOrders(res.data)
        setLoaded(true)
    }

    useEffect(() => {
        getAPISingle(id);
    }, []);

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
                    <Form.Label column xs="12" lg="4">Phone Number</Form.Label>
                    <Col xs="12" lg="8">
                        <Form.Control name="phone" value={person?.phone} />
                    </Col>
                </FormGroup>
                {
                    person.qr_status && <>
                        <FormGroup as={Row} className="mb-1">
                            <Form.Label column xs="12" lg="4">QR Status</Form.Label>
                            <Col xs="12" lg="8">
                                <Form.Control name="phone" value={person?.qr_status} />
                            </Col>
                        </FormGroup>
                        <FormGroup as={Row} className="mb-1">
                            <Form.Label column xs="12" lg="4">QR Scan Time</Form.Label>
                            <Col xs="12" lg="8">
                                <Form.Control name="phone" value={person?.qr_scan_time} />
                            </Col>
                        </FormGroup>
                        <FormGroup as={Row} className="mb-1">
                            <Form.Label column xs="12" lg="4">QR Image</Form.Label>
                            <Col xs="12" lg="8">
                                {
                                    person.qr_string && <Image src={process.env.REACT_APP_HOST_IMAGE_DEV + 'uploads/' + person.qr_string} className="img-fluid" />
                                }
                            </Col>
                        </FormGroup>
                    </>
                }
            </>

        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrders({
            ...orders,
            data: {
                ...orders.data,
                [name]: value,
            }
        })
    }

    const handleSubmit = async (e) => {
        try {
            setIsLoading(true);
            const payload = {
                status: orders.data.status
            }
            const res = await putData(`/v1/cms/orders/${id}`, payload);
            if (res.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Berhasil ubah data`,
                    showConfirmButton: false,
                    timer: 1500,
                });
                navigate(`/orders/${id}`);
                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(false);
        }
    }


    return (
        <>
            {
                (loaded) && <Container className="mt-3">
                    <BreadCrumb textSecound={"orders"} />
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
                                            <Form.Select value={orders.data.status} name="status" onChange={handleChange}>
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
                            <button className="btn btn-success" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </Container >
            }
        </>

    )
}
