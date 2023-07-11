const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RestaurantsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  text:{
    type:Strign,
    required:true,
  }
  avrating: {
    type: String,
    mininum: 0,
    maximum: 5,
    default: 0
  },
  maxrating: {
    type: Number,
    mininum: 0,
    maximum: 5,
    default: -1
  },
  minrating: {
    type: Number,
    mininum: 0,
    maximum: 5,
    default: 6
  },
  lastratingid: {
    type: String
  },
  reviewcount: {
    type: Number,
    default: 0,
    minimum: 0
  }, 
  location: {
    latitude: {type: Number},
    longitude: {type: Number}
  }
});

const Restaurants = mongoose.model("restaurants", RestaurantsSchema);

RestaurantSchema.statics.findByDistance = function (lat, lon, dist) {
  // Create a new promise
  return new Promise(function (resolve, reject) {
    // Find all restaurants in the database
    Restaurant.find({}, function (err, restaurants) {
      if (err) {
        // Reject the promise if there is an error
        reject(err);
      } else {
        // Filter the restaurants by distance
        var result = restaurants.filter(function (restaurant) {
          // Get the distance between the restaurant and the given coordinates
          var distance = geolib.getDistance(
            {latitude: lat, longitude: lon},
            {latitude: restaurant.location.latitude, longitude: restaurant.location.longitude}
          );
          // Return true if the distance is less than or equal to the given distance
          return distance <= dist;
        });
        // Resolve the promise with the filtered array
        resolve(result);
      }
    });
  });
};


module.exports = Restaurants;
