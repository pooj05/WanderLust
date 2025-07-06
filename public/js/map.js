

    // maptilersdk.config.apiKey = mapToken;
    // const map = new maptilersdk.Map({
    //   container: 'map', // container's id or the HTML element in which the SDK will render the map
    //   style: maptilersdk.MapStyle.STREETS,
    //   center: coordinates, // starting position [lng, lat]
    //   zoom: 9 // starting zoom
    // });
    //  new maptilersdk.Marker()
    // .setLngLat(coordinates)
    // .addTo(map);
// document.addEventListener("DOMContentLoaded", () => {
//   if (!window.mapToken || !window.coordinates) {
//     console.error("Missing map token or coordinates.");
//     return;
//   }

//   maptilersdk.config.apiKey = window.mapToken;

//   const map = new maptilersdk.Map({
//     container: 'map',
//     style: maptilersdk.MapStyle.STREETS,
//     center: window.coordinates,
//     zoom: 9
//   });

//   console.log("Coordinates:", window.coordinates);

//   new maptilersdk.Marker()
//     .setLngLat(window.coordinates)
//     .addTo(map);
// });


document.addEventListener("DOMContentLoaded", () => {
  if (!mapToken || !coordinates) {
    console.error("Missing map token or coordinates.");
    return;
  }

  maptilersdk.config.apiKey = mapToken;

  const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: coordinates,
    zoom: 9,
  });

  const popup = new maptilersdk.Popup({ offset: 25 }).setHTML(`
    <strong>${listingTitle || "Listing"}</strong><br>
    ${listingLocation || "No location"}
  `);

  new maptilersdk.Marker()
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);

  popup.setLngLat(coordinates).addTo(map); // show popup by default
});
