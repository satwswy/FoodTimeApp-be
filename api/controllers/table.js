import Table from "../models/Table.js";
import Restaurant from "..//models/Restaurant.js";
import { createError } from "../utils/error.js";

export const createTable = async (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  const newTable = new Table(req.body);
  try {
    const savedTable = await newTable.save();
    try {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        $push: { tables: savedTable._id },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json(savedTable);
  } catch (error) {
    next(error);
  }
};

export const updateTable = async (req, res, next) => {
  try {
    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTable);
  } catch (error) {
    next(error);
  }
};
export const updateTableAvailability = async (req, res, next) => {
  try {
    await Table.updateOne(
      { "tableNumbers._id": req.params.id },
      {
        $push: {
          "tableNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Table status has been updated.");
  } catch (err) {
    next(err);
  }
};

export const deleteTable = async (req, res, next) => {
  const restaurantId = req.params.restaurantId;
  try {
    await Table.findByIdAndDelete(req.params.id);
    try {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        $pull: { tables: req.params.id },
      });
    } catch (error) {
      next(error);
    }
    res.status(200).json("Table has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    res.status(200).json(table);
  } catch (error) {
    next(error);
  }
};

export const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables);
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  // we need to call this endpoint passing the id of restaurant as a query param
  // then use this id to grab the restaurant object from his controller
  // and take just the tables of that particular restaurant
  try {
    const reservations = await Table.find(); // TODO: don't grab all the tables, but just the ones
    // for the restaurant you're passing in the query param
    let array = []
    reservations.forEach(table =>{
      table.tableNumbers.forEach(tableNumber=>{
        if(tableNumber.unavailableDates.length >0){
          array.push(tableNumber)
        }
        
      })
    })
    res.status(200).json(array);
  } catch (error) {
    next(error);
  }
};
