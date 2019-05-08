import React from 'react';
import { Table } from 'react-bootstrap';

const GeomagneticDetails = (props) => {
  const data = props.data;

  const rows = Object.keys(data.meta).map( (key) => (
    <tr key={key}>
      <th>{key}</th>
      <td>{data.meta[key]}</td>
    </tr>
  ));

  return (
    <details>
      <summary>Additional Details</summary>
      <Table striped bordered hover>
        <tbody>
          { rows }
        </tbody>
      </Table>
    </details>
  )
};

export default GeomagneticDetails;