import express from "express";
import handleUserSignup from "../controllers/auth/handleUserSignup";

const router = express.Router();

router.post('/signup', handleUserSignup);
router.get('/signup', (req, res) => {
    res.send("Signup endpoint");
});

export default router;