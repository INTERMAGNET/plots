/**
 * @author Charles Blais <charles.blais@canada.ca>
 * 
 * Plotting of geomagnetic data
 */
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import moment from 'moment';

import './App.css';
import GeomagneticForm from './components/GeomagneticForm';
import GeomagneticPlot from './components/GeomagneticPlot';
import GeomagneticDetails from './components/GeomagneticDetails';

// Hooks
import useDataApi from './hooks/useDataApi';

const App = () => {
  const [ components, setComponents ] = useState(['x','y','z'])
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
    source: 'https://origin1.geomag.nrcan.gc.ca/intermagnet/data/',
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
          components={components}
          setComponents={setComponents}
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
              <GeomagneticPlot
                data={data}
                components={components}
              />
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

