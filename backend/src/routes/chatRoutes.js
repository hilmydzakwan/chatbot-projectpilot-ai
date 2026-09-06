import { Router } from "express";
import { handleChat, handleQuickAction } from "../controllers/chatController.js";

const router = Router();

router.post("/chat", handleChat);
router.post("/chat/quick-action", handleQuickAction);

export default router;
