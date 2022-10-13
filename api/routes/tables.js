import express from "express"
import { createTable, deleteTable, getTable, getTables, updateTable } from "../controllers/table.js";
import {verifyAdmin} from "../utils/verifyToken.js"


const router = express.Router();

router.post("/:restaurantId", verifyAdmin, createTable);

router.put("/:id", verifyAdmin, updateTable);

router.delete("/:id/:restaurantId", verifyAdmin, deleteTable);

router.get("/:id", getTable);

router.get("/", getTables);

export default router