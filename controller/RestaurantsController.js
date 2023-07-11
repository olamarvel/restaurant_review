const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurants = require("../models/Restaurants");
const Reviews = require("../models/Reviews");
const validateRestaurant = require("../validation/restaurants");

const findAll = res => {
  Restaurants.find({}, (err, doc) => {
    doc.sort((a, b) => Number(b.avrating) - Number(a.avrating));
    return res.json(doc);
  });
};

exports.getAll = (req, res) => {
  findAll(res);
};

exports.getRestaurant = (req, res) => {
  Restaurants.find(req.params.id, (err, doc) => {
    return res.json(doc);
  });
};

exports.getAllByLocation = async function (req, res) {
  // Get the query parameters
  var lat = req.query.lat;
  var lon = req.query.lon;
  var dist = req.query.dist;
  // Validate the parameters
  if (lat && lon && dist) {
    // Find restaurants by distance using the model method
    try {
      // Await for the promise to resolve and assign the result to a variable
      var restaurants = await Restaurant.findByDistance(lat, lon, dist);
      // Send the result as JSON response
      res.json(restaurants);
    } catch (err) {
      // Send an error message if there is an error
      res.status(500).send('Something went wrong: ' + err);
    }
  } else {
    // Send a bad request message if the parameters are missing or invalid
    res.status(400).send('Bad request: missing or invalid parameters');
  }
};

exports.addRestaurant = (req, res) => {
  const { errors, isValid } = validateRestaurant(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  new Restaurants({ name: req.body.name })
    .save()
    .then(rest => {
      console.log("Adding restaurant succeed.", rest);
      findAll(res);
    })
    .catch(error => {
      return res.status(400).json({
        error: "Something went wrong with adding the restaurant"
      });
    });
};

exports.editRestaurant = (req, res) => {
  const { errors, isValid } = validateRestaurant(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  Restaurants.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: "Something went wrong with updating the restaurant"
        });
      } else {
        if (!doc) {
          return res.status(400).json({
            error: "operation failed"
          });
        }
        console.log("Updating restaurant succeed.", doc);
        findAll(res);
      }
    }
  );
};

exports.deleteRestaurant = (req, res) => {
  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  Restaurants.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong with deleting the restaurant"
      });
    } else {
      if (!doc) {
        return res.status(400).json({
          error: "operation failed"
        });
      }
      Reviews.deleteMany({ resid: req.params.id })
        .then(() => {
          console.log("Deleting restaurant succeed.", doc);
          findAll(res);
        })
        .catch(err => {
          return res.status(400).json({
            error: "Something went wrong with deleting the restaurant"
          });
        });
    }
  });
};