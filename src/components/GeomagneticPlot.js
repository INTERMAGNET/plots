import React from 'react';
import Plot from 'react-plotly.js';

/**
 * Calculate average of component while ignore null elements
 */
const getAverage = component => {
  const sum =  component.reduce((a,b) => (b === null) ? a : a+b, 0);
  const total = component.reduce((a,b) => (b === null) ? a : a+1, 0);
  return (total === 0) ? null : sum/total;
};

/**
 * Remove average from component
 */
const removeAverage = (component, average) => {
  return component.map(v => (v === null) ? null : v - average );
};


const GeomagneticPlot = (props) => {
  const data = props.data;

  // Calculate the x, y, z average and remove that average
  const xAvg = getAverage(data.x);
  const xComp = removeAverage(data.x, xAvg);
  const xMax = Math.max(...xComp.map(Math.abs));
  const yAvg = getAverage(data.y);
  const yComp = removeAverage(data.y, yAvg);
  const yMax = Math.max(...yComp.map(Math.abs));
  const zAvg = getAverage(data.z);
  const zComp = removeAverage(data.z, zAvg);
  const zMax = Math.max(...zComp.map(Math.abs))

  // round up to the nearest 10th for the yragne
  const yaxisrange = Math.ceil(Math.max(xMax, yMax, zMax)/10.0)*10;

  const title = `${data.meta['Station Name']} (${data.meta['IAGA CODE']})`

  const yaxis = {
    title: 'nT',
    zeroline: false,
    showdividers: false,
    range: [-yaxisrange, yaxisrange],
    fixedrange: true,
  };

  return (
    <Plot
      style={{
        width: "100%",
        height: 600,
      }}

      data={[
        {
          x: data.datetime,
          y: xComp,
          type: 'scatter',
          mode: 'line',
          name: `X (${xAvg.toFixed(2)} nT)`,
        },
        {
          x: data.datetime,
          y: yComp,
          xaxis: 'x',
          yaxis: 'y2',
          type: 'scatter',
          mode: 'line',
          name: `Y (${yAvg.toFixed(2)} nT)`,
        },
        {
          x: data.datetime,
          y: zComp,
          xaxis: 'x',
          yaxis: 'y3',
          type: 'scatter',
          mode: 'line',
          name: `Z (${zAvg.toFixed(2)} nT)`,
        }
      ]}
      layout={{
        yaxis,
        yaxis2: yaxis,
        yaxis3: yaxis,
        title,
        grid: {
          rows: 3,
          columns: 1,
          pattern: 'independant',
        },
      }}
    />
  );
};

export default GeomagneticPlot;