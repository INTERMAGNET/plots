/**
 * @author Charles Blais <charles.blais@canada.ca>
 * @description
 *  Magnetic data library
 *  Parse common IAGA2002 format message
 */
// Custom Errors
class InvalidIAGA2002 extends Error {};
class MissingComponent extends Error {};

const calcDeclination = (x, y) => Math.atan2(y, x) * (180.0 / Math.PI) * 60.0;
const calcInclination = (h, z) => Math.atan2(z, h) * (180.0 / Math.PI) * 60.0;
const calcHorizontal = (x, y) => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
const calcNorth = (h, d) => h * Math.cos(d * ( Math.PI / 180.0 / 60.0 ));
const calcEast = (h, d) => h * Math.sin(d * ( Math.PI / 180.0 / 60.0 ));

/**
 * Geomagnetic data handler and response
 */
class GeomagneticData {
    /**
     * @description
     *  Handler for data object properties
     * @param {Object} data 
     */
    constructor(meta={}, data = {}) {
        this._meta = meta;
        this._data = data;
    }

    get isEmpty(){
        return !Object.keys(this._meta).length;
    }

    get meta(){
        return this._meta;
    }

    get data(){
        return this._data;
    }

    get datetime(){
        return this._data.datetime;
    }

    get x(){
        if ('x' in this._data) {
            return this._data.x;
        } else if('h' in this._data && 'd' in this._data) {
            return this._data.h.map((val, idx) => {
                return (val !== null && this._data.d[idx] !== null) ? calcNorth(val, this._data.d[idx]) : null;
            });
        }
        throw new MissingComponent("Require x or (h and d) components");
    }

    get y(){
        if ('y' in this._data) {
            return this._data.y;
        } else if('h' in this._data && 'd' in this._data) {
            return this._data.h.map((val, idx) => {
                return (val !== null && this._data.d[idx] !== null) ? calcEast(val, this._data.d[idx]) : null;
            });
        }
        throw new MissingComponent("Require y or (h and d) components");
    }

    get z(){
        if ('z' in this._data ){
            return this._data.z
        }
        throw new MissingComponent("Require z component");
    }

    get f(){
        if ('f' in this._data ){
            return this._data.f
        }
        throw new MissingComponent("Require f component");
    }

    get d(){
        if ('d' in this._data) {
            return this._data.d;
        } else if('x' in this._data && 'y' in this._data) {
            return this._data.x.map((val, idx) => {
                return (val !== null && this._data.y[idx] !== null) ? calcDeclination(val, this._data.y[idx]) : null;
            });
        }
        throw new MissingComponent("Require d or (x and y) components");
    }

    get h(){
        if ('h' in this._data) {
            return this._data.h;
        } else if('x' in this._data && 'y' in this._data) {
            return this._data.x.map((val, idx) => {
                return (val !== null && this._data.y[idx] !== null) ? calcHorizontal(val, this._data.y[idx]) : null;
            });
        }
        throw new MissingComponent("Require h or (x and y) components");
    }

    get i(){
        if ('i' in this._data) {
            return this._data['i'];
        } else if('z' in this._data && 'h' in this._data) {
            return this._data.h.map((val, idx) => {
                return (val !== null && this._data.z[idx] !== null) ? calcInclination(val, this._data.z[idx]) : null;
            });
        } else if('z' in this._data && 'x' in this._data && 'y' in this._data) {
            return this._data.x.map((val, idx) => {
                return (val !== null && this._data.y[idx] !== null && this._data.z[idx] !== null) ? calcInclination(calcHorizontal(val, this._data.y[idx]), this._data.z[idx]) : null;
            });
        }
        throw new MissingComponent("Require i or (z and h) or (z, x, and y) components");
    }

}

/**
 * Parse the content of the IAGA2002 string
 * @param {string} content 
 * @returns GeomagneticData
 */
const parseIAGA2002 = content => {
  const lines = content.split("\n");
  let headers = [];
  let data = {
    'datetime': []
  };
  let meta = {};

  // Loop each line of data
  lines.forEach((line) => {
    // Header line
    if (line.search(/^DATE /) !== -1) {
      line = line.split(/[ ]+/);
      headers = [3,4,5,6].map(key => {
        const component = line[key].substr(-1).toLowerCase();
        data[component] = []; //initialize array
        return component;
      });
    }
    // Data line
    else if (line.search(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/) !== -1) {
      if (headers.length !== 4) {
        throw new InvalidIAGA2002("Missing elements in header");
      }
      line = line.split(/[ ]+/);
      data['datetime'].push(line[0] + "T" + line[1]);
      headers.forEach((key, idx) => {
        const value = parseFloat(line[idx+3]);
        data[key].push((value > 80000) ? null : value);
      });
    }
    // Meta information is any line spaced with a string
    else if (line.search(/^ [A-Z]/) !== -1) {
        meta[line.substr(0,22).trim()] = line.substr(23, line.length-23-2).trim();
    }
  });
  return new GeomagneticData(meta, data);
};

export default { parseIAGA2002, GeomagneticData };
