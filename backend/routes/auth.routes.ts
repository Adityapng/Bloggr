import { Router, Response, Request } from "express";
import handleUserSignup from "../controllers/auth/signup.controller";
import handleUserSignin from "../controllers/auth/signin.controller";
import handleUserLogout from "../controllers/auth/logout.controller";
import authenticateUserToken from "../middleware/authenticateUserToken";
import { ensureDatabaseConnection } from "../middleware/databaseConnection";

const authRoutes = Router();

authRoutes.get("/signup", (req: Request, res: Response) => {
  res.send("Signup endpoint");
});
authRoutes.post("/signup", ensureDatabaseConnection, handleUserSignup);
authRoutes.post("/signin", ensureDatabaseConnection, handleUserSignin);
authRoutes.post("/logout", authenticateUserToken, handleUserLogout);

export default authRoutes;
