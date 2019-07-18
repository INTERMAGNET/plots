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
  const {
    data,
    components
  } = props;

  const averages = components.map(v => {
    return getAverage(data[v]);
  });

  const comps = components.map((v, idx) => {
    return removeAverage(data[v], averages[idx]);
  });

  const dataPlot = components.map((v, idx) => {
    return {
      x: data.datetime,
      y: comps[idx],
      xaxis: 'x',
      yaxis: `y${idx+1}`,
      type: 'scatter',
      mode: 'line',
      name: `${v.toUpperCase()} (${averages[idx].toFixed(2)} nT)`,
    }
  });

  const yaxis = components.map((v, idx) => {
    // round up to the nearest 10th for the yrange
    const yaxisrange = Math.ceil(Math.max(...comps[idx].map(Math.abs))/10.0)*10;
    return {
      title: 'nT',
      zeroline: false,
      showdividers: false,
      range: [-yaxisrange, yaxisrange],
      fixedrange: true,
    }
  });

  const title = `${data.meta['Station Name']} (${data.meta['IAGA CODE']})`

  return (
    <Plot
      style={{
        width: "100%",
        height: 600,
      }}
      data={dataPlot}
      layout={{
        yaxis: yaxis[0],
        yaxis2: yaxis[1],
        yaxis3: yaxis[2],
        title,
        grid: {
          rows: components.length,
          columns: 1,
          pattern: 'independant',
        },
      }}
    />
  );
};

export default GeomagneticPlot;