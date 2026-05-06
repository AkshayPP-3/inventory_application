import express from "express";
import passport from "../config/passport.js";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

/* GOOGLE */
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as { token: string; email: string };
    if (user && user.token) {
      res.redirect(`http://localhost:5173/?token=${user.token}&email=${encodeURIComponent(user.email)}`);
    } else {
      res.redirect("http://localhost:5173/?error=auth_failed");
    }
  }
);

/* GITHUB */
router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const user = req.user as { token: string; email: string };
    if (user && user.token) {
      res.redirect(`http://localhost:5173/?token=${user.token}&email=${encodeURIComponent(user.email)}`);
    } else {
      res.redirect("http://localhost:5173/?error=auth_failed");
    }
  }
);

export default router;