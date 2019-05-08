/**
 * @author Charles Blais <charles.blais@canada.ca>
 * 
 * Plotting of geomagnetic data
 */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import './App.css';
import GeomagneticForm from './components/GeomagneticForm';
import GeomagneticPlot from './components/GeomagneticPlot';
import GeomagneticDetails from './components/GeomagneticDetails';

// Hooks
import useDataApi from './hooks/useDataApi';

const App = () => {
  const {
    data,
    station,
    setStation,
    sampling,
    setSampling,
    dataType,
    setDataType,
    date,
    setDate,
  } = useDataApi({
    source: 'http://origin1.intermagnet.org/data/',
    station: 'ott',
    date: moment(),
  });

  return (
    <Container>
      <Row>
        <Col>
        <GeomagneticForm
          station={station}
          setStation={setStation}
          sampling={sampling}
          setSampling={setSampling}
          dataType={dataType}
          setDataType={setDataType}
          date={date}
          setDate={setDate}
        />
        </Col>
      </Row>
      <Row>
        <Col>
        { data.isEmpty
          ? (
            <div>Loading...</div>
          ):(
            <React.Fragment>
              <GeomagneticPlot data={data} />
              <GeomagneticDetails data={data} />
            </React.Fragment>
          )
        }    
        </Col>
      </Row>  
    </Container>
  )
}

export default App;

