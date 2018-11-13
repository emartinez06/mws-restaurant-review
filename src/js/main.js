import DBHelper from './dbhelper';
import Key from './keys';
var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
var L = require('leaflet');

let restaurants, neighborhoods, cuisines;
let mapLatitude = 40.713633;
let mapLongitude = -73.9905909;
let coordinates = [-73.989667, 40.713829];
self.markers = [];

mapboxgl.accessToken = Key.secretKey;
//L.marker([37.775408, -122.413682]).addTo(mapLeaflet);

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [mapLongitude, mapLatitude], // starting position
    zoom: 12 // starting zoom
});

var geojson = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: coordinates
        },
        properties: {
            title: 'Mapbox',
            description: 'Washington, D.C.'
        }
    }]
};

// add markers to map
geojson.features.forEach(function(marker) {

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    fetchNeighborhoods();
    fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
        if (error) { // Got an error
            console.error(error);
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    });
};

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
};

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
    DBHelper.fetchCuisines((error, cuisines) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    });
};

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
};

/**
 * Initialize Google map, called from HTML.
 */
// const initMap = () => {
//     let loc = {
//         lat: 40.713633,
//         lng: -73.9905909
//     };
//     self.map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 12,
//         center: loc,
//         scrollwheel: false
//     });
//     updateRestaurants();
// };

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
    })
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers, if any. If Google Maps was never initialized (initMap) Array is empty.
    //self.markers.forEach(m => m.setMap(null));
    if (self.markers) {
        self.markers.forEach(marker => marker.remove());
    }
    self.markers = [];

    // return restaurants with no changes. Just pipe it to the next promise chain
    return restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
const createRestaurantHTML = (restaurant) => {
    const li = document.createElement('li');

    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.alt = restaurant.alt;
    li.append(image);

    const name = document.createElement('h1');
    name.innerHTML = restaurant.name;
    name.tabIndex =restaurant.id + 2;
    li.append(name);

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);

    const more = document.createElement('a');
    more.innerHTML = 'View Details';
    more.href = DBHelper.urlForRestaurant(restaurant);
    more.tabIndex = restaurant.id + 3;
    li.append(more);

    return li
};

/**
 * Add markers for current restaurants to the map.
 */
// const addMarkersToMap = (restaurants = self.restaurants) => {
//     restaurants.forEach(restaurant => {
//         // Add marker to the map
//         const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
//         google.maps.event.addListener(marker, 'click', () => {
//             window.location.href = marker.url
//         });
//         self.markers.push(marker);
//     });
// };
