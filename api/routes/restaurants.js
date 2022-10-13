import express from "express";
import { countByCity, createRestaurant, deleteRestaurant, getRestaurant, getRestaurants, updateRestaurant } from "../controllers/restaurant.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import Restaurant from "../models/Restaurant.js";
import { createError } from "../utils/error.js";

const router = express.Router();

router.post("/", verifyAdmin, createRestaurant);

router.put("/:id", verifyAdmin, updateRestaurant);

router.delete("/:id", verifyAdmin, deleteRestaurant);

router.get("/find/:id", getRestaurant);

router.get("/", getRestaurants);

router.get("/countByCity", countByCity);
router.get("/countByType", getRestaurants);

export default router;
