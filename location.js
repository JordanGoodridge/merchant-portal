const {Client, Status} = require("@googlemaps/google-maps-services-js");
require('dotenv').config();

const mapsKey = process.env.MAPKEY;
console.log(`Mapkey: ${mapsKey}`)

var getCoords;

// var PrintNearestStore; // `undefined` by default
// // still `undefined`, hence `module.exports.PrintNearestStore` is `undefined`
// module.exports.PrintNearestStore = PrintNearestStore;

// PrintNearestStore = async function(session, lat, lon) {}
// // now has a function as value, but it's too late

async function getCoords(address_lookup) {
    return new Promise(function(resolve, reject) {
    let coords;
    const client = new Client({});
    client.geocode({
        params: {
          address: address_lookup,
          key: mapsKey,
        },
        timeout: 1000, // milliseconds
      })
      .then((r) => {
        resolve(r.data.results[0].geometry.location);


      })
      .catch((e) => {
        console.log(e.response.data.error_message);
      });
    });
    };



  module.exports.getCoords = getCoords;

  