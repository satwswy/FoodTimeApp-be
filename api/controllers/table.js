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
