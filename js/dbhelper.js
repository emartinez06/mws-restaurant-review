/**
 * Common database helper functions.
 */
class DBHelper {

    /**
    * IndexedDB function check
    **/
    static indDB() {
        return "indexedDB" in window && !/iPad|iPhone|iPod/.test(navigator.platform);
    }

    /**
     * 404 Error handling
     */
    static ErrorPage(){
        let port = window.location.port;
        let url = 'http://localhost:';
        let page = '/error.html';
        let redirect = url + port + page;
        return window.location.replace(redirect);
    }

    /**
     * Database URL.
     */
    static get API(){

        //Change here whatever port you want to use. This is the default for the Sails server endpoins
        const port = 1337;
        return `http://localhost:${port}/restaurants`;
    }

    /**
     * Fetch all restaurants.
     */
    // static fetchRestaurants(callback) {
    //     let xhr = new XMLHttpRequest();
    //     xhr.open('GET', `${DBHelper.API}/restaurants`);
    //     xhr.onload = () => {
    //         if (xhr.status === 200) { // Got a success response from server!
    //             const restaurants = JSON.parse(xhr.responseText);
    //             //console.log(restaurants);
    //             callback(null, restaurants);
    //         } else { // Oops!. Got an error from server.
    //             const error = (`Request failed. Returned status of ${xhr.status}`);
    //             callback(error, null);
    //         }
    //     };
    //     xhr.send();
    // }

    /**
     * Fetch all restaurants data from API
     */
    static fetchRestaurants(callback) {
         let dbVersion = 1;
        fetch(DBHelper.API).then(
            function (response) {
                if (!response.ok){
                    return Promise.reject("Restaurants data couldn't be fetched from remote server");
                }else{
                    return response.json();
                }
            })
            .then(
                function addRestaurantsData(data) {
                    if(DBHelper.indDB){
                        console.log('IDB supported');
                        const dbPromise = idb.open(
                            'restaurantsData', dbVersion, function (createDb) {
                                createDb.createObjectStore('restaurantsInfo', {
                                    keyPath: 'id',
                                    autoIncrement: true
                                });
                            });
                        dbPromise.then(

                            //insert data object in the database
                            function (db) {
                                let tx = db.transaction('restaurantsInfo', 'readwrite');
                                let store = tx.objectStore('restaurantsInfo');
                                data.forEach(rests => {
                                    store.put(rests);
                                });
                            }).catch(

                            //Use offline data in case of network error
                            function (error) {
                                console.log('Error: ' + error);
                                alert('Working in offline mode');
                                dbPromise.then(function (db) {//get the data from out of the store
                                    let tx = db.transaction('restaurantsInfo');
                                    let cache = tx.objectStore('restaurantsInfo');
                                    return cache.getAll();
                                })
                            });
                        callback(null, data)
                    }
                    else{
                        console.log('IndexedDb not supported.');
                    }
                })
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        // fetch restaurant by id
        fetch(`${DBHelper.API}/${id}`).then(response => {
            if (!response.ok) return Promise.reject("Restaurant couldn't be fetched from remote server");
            return response.json();
        }).then(getRestaurant => {
            // if restaurant could be fetched from remote server:
            return callback(null, getRestaurant);
        }).catch(connectionError => {
            // if restaurant couldn't be fetched from remote server or indexedDB:
            connectionError = DBHelper.ErrorPage();
            return callback(connectionError, null);
        });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type === cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood === neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants;
                if (cuisine !== 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type === cuisine);
                }
                if (neighborhood !== 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood === neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) === i);
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) === i);
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {

        //return image restaurant by restaurant id or photo number with a medium default scale
        return (`/img/${(restaurant.photograph||restaurant.id)}-medium.jpg`);
    }

    /**
     * Restaurant images srcset.
     */
    static imageSetForRestaurant(restaurant) {
        const image = `/img/${(restaurant.photograph||restaurant.id)}`;
        return `${image}-small.jpg 300w,
            ${image}-medium.jpg 600w,
            ${image}-large.jpg 800w`;
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP
        });
        return marker;
    }
}
