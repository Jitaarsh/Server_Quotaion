import express from "express";
import { getPublicCustomers } from "./customers.controller.js";

const router = express.Router();

router.get("/customers", getPublicCustomers);

export default router;
