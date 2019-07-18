import React from 'react';
import { Form, Col } from 'react-bootstrap';
import moment from 'moment';

const GeomagneticForm = (props) => {
  const {
    station,
    setStation,
    sampling,
    setSampling,
    dataType,
    setDataType,
    date,
    setDate,
  } = props;

  return (
    <Form>
      <Form.Row>
        <Col>
          <Form.Group controlId="formStation">
            <Form.Label>Station</Form.Label>
            <Form.Control
              type="text"
              placeholder="IAGA code"
              value={station}
              onChange={(e) => setStation(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date.format("YYYY-MM-DD")}
              onChange={(e) => setDate(moment(e.target.value))}
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group controlId="formSampling">
            <Form.Label>Sampling Period</Form.Label>
            <Form.Control
              as="select"
              value={sampling}
              onChange={(e) => setSampling(parseFloat(e.target.value))}
            >
              <option value="60">minute</option>
              <option value="1">second</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formDataType">
            <Form.Label>Data Type</Form.Label>
            <Form.Control
              as="select"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
            >
              <option>all</option>
              <option>definitive</option>
              <option>quasi-definitive</option>
              <option>provisional</option>
              <option>variation</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Form.Row>
    </Form>
  )
};

export default GeomagneticForm;