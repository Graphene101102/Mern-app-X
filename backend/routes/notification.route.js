import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotification, deleteNotifications, getNotifications } from "../controllers/notification.controller.js";

const router = express.Router()

router.get("/", protectRoute, getNotifications);
router.delete("/:id", protectRoute, deleteNotification)
router.delete("/", protectRoute, deleteNotifications)

export default router;