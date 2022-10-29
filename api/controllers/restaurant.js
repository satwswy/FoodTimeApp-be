import Restaurant from "../models/Restaurant.js";
import Table from "../models/Table.js";

export const createRestaurant = async (req, res, next) => {
  const newRestaurant = new Restaurant(req.body);

  try {
    const savedRestaurant = await newRestaurant.save();
    res.status(200).json(savedRestaurant);
  } catch (error) {
    next(error);
  }
};

export const updateRestaurant = async (req, res, next) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (req, res, next) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.status(200).json("Restaurant has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

export const getRestaurants = async (req, res, next) => {
  const { ...queries } = req.query;
  try {
    const restaurants = await Restaurant.find();
    if ( req.query.type && req.query.city) {
      const typesList = req.query.type.split(",");
      const filteredRestaurantsWithCity = []
      const filteredRestaurants = [] 
      restaurants.map(restaurant=> {
        let foodList=[]
        restaurant.type.map(current =>{
         let food = typesList.includes(current)
         foodList.push(food)
        })
        if(foodList.includes(true)){
          filteredRestaurants.push(restaurant)
        }
      }
        )
        filteredRestaurants.map(restau=>{
          if(restau.city=== req.query.city){
            filteredRestaurantsWithCity.push(restau)
          }
        })
      res.status(200).json(filteredRestaurantsWithCity);
    } else if(req.query.type) {
      const typesList = req.query.type.split(",");
      const filteredRestaurants = [] 
      restaurants.map(restaurant=> {
        let foodList=[]
        restaurant.type.map(current =>{
         let food = typesList.includes(current)
         foodList.push(food)
        })
        console.log(foodList)
        if(foodList.includes(true)){
          filteredRestaurants.push(restaurant)
        }
      }
        )
      res.status(200).json(filteredRestaurants);
    }
    else if(req.query.city){
      const filteredRestaurants = []
      restaurants.map(restaur=>{
        if(restaur.city===req.query.city){
          filteredRestaurants.push(restaur)
        }
      })
      res.status(200).json(filteredRestaurants);
    }
    else {
      res.status(200).json(restaurants);
    }
  } catch (error) {
    next(error);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Restaurant.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const pizzaCount = await Restaurant.countDocuments({ type: "pizza" });
    const burgersCount = await Restaurant.countDocuments({ type: "burgers" });
    const pastaCount = await Restaurant.countDocuments({ type: "pasta" });
    const grillCount = await Restaurant.countDocuments({ type: "grill" });
    const seaFoodCount = await Restaurant.countDocuments({ type: "seeFood" });

    res.status(200).json([
      { type: "pizza", count: pizzaCount },
      { type: "burgers", count: burgersCount },
      { type: "pasta", count: pastaCount },
      { type: "grill", count: grillCount },
      { type: "seaFood", count: seaFoodCount },
    ]);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantTables = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    const list = await Promise.all(
      restaurant.tables.map((table) => {
        return Table.findById(table);
      })
    );
    console.log("LIST", list);
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const getReservations = async (req, res, next) => {
  // we need to call this endpoint passing the id of restaurant as a query param
  // then use this id to grab the restaurant object from his controller
  // and take just the tables of that particular restaurant
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    const list = await Promise.all(
      restaurant.tables.map((table) => {
        return Table.findById(table);
      })
    );
    // const reservations = await Table.find(); // TODO: don't grab all the tables, but just the ones
    // for the restaurant you're passing in the query param
    let array = [];
    list.forEach((table) => {
      table.tableNumbers.forEach((tableNumber) => {
        if (tableNumber.unavailableDates.length > 0) {
          array.push(tableNumber);
        }
      });
    });
    res.status(200).json(array);
  } catch (error) {
    next(error);
  }
};
