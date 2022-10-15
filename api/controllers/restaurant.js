import Restaurant from "../models/Restaurant.js";
import Table from "../models/Table.js";

export const createRestaurant = async (req,res,next)=>{
    const newRestaurant = new Restaurant(req.body);

    try {
      const savedRestaurant = await newRestaurant.save();
      res.status(200).json(savedRestaurant);
    } catch (error) {
      next(error)
    }
}

export const updateRestaurant = async (req,res,next)=>{
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedRestaurant);
      } catch (error) {
        next(error)
      }
}

export const deleteRestaurant = async (req,res,next)=>{
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.status(200).json("Restaurant has been deleted");
      } catch (error) {
        next(error)
      }
}

export const getRestaurant = async (req,res,next)=>{
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        res.status(200).json(restaurant);
      } catch (error) {
        next(error);
      }
}

export const getRestaurants = async (req,res,next)=>{
  const {...queries} = req.query;
    try {
        const restaurants = await Restaurant.find({
          ...queries
        });
        res.status(200).json(restaurants);
      } catch (error) {
        next(error)
      }
}

export const countByCity = async (req,res,next)=>{
  const cities = req.query.cities.split(",")
  try {
      const list = await Promise.all(cities.map(city=>{
        return Restaurant.countDocuments({city:city})
      }))
      res.status(200).json(list);
    } catch (error) {
      next(error)
    }
}

export const countByType = async (req,res,next)=>{

  try {
    const pizzaCount = await Restaurant.countDocuments({type:"pizza"})
    const burgersCount = await Restaurant.countDocuments({type:"burgers"})
    const pastaCount = await Restaurant.countDocuments({type:"pasta"})
    const grillCount = await Restaurant.countDocuments({type:"grill"})
    const seaFoodCount = await Restaurant.countDocuments({type:"seeFood"})

      res.status(200).json([
        {type:"pizza",count:pizzaCount},
        {type:"burgers",count:burgersCount},
        {type:"pasta",count:pastaCount},
        {type:"grill",count:grillCount},
        {type:"seaFood",count:seaFoodCount},
      ]);
    } catch (error) {
      next(error)
    }
}

export const getRestaurantTables = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    const list = await Promise.all(
      restaurant.tables.map((table) => {
        return Table.findById(table);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};