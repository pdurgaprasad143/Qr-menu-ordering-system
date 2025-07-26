import express from "express";
import {
  registerChef,
  loginChef,
  getChefProfile,
  updateChefProfile,
} from "../controllers/chefController.js";

const router = express.Router();

router.post("/register", registerChef);
router.post("/login", loginChef);
router.get("/profile/:id", getChefProfile);
router.put("/profile/:id", updateChefProfile);

export default router;
