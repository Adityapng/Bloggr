import express from "express";
import handleUserSignup from "../controllers/auth/handleUserSignup";
import handleUserSignin from "../controllers/auth/handleUserSignin";
import handleUserLogout from "../controllers/auth/handleUserLogout";

const router = express.Router();

router.post("/signup", handleUserSignup);
router.get("/signup", (req, res) => {
  res.send("Signup endpoint");
});
router.post("/signin", handleUserSignin);
router.post("/logout", handleUserLogout);

export default router;
