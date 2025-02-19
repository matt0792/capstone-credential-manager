import jwt from "jsonwebtoken";

// verify token and check if role is allowed
export const verifyTokenWithRole =
  (roles = []) =>
  (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No auth token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;

      // superadmin bypasses all role restrictions
      if (req.user.role === "superadmin") {
        return next();
      }

      // check if user has permission to access route
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
