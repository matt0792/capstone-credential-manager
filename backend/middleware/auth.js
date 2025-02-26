import jwt from "jsonwebtoken";

// middleware to verify token and check if role is allowed for a specific route
// called from authwrapper in the frontend
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

// check if the user is an admin (for conditional rendering)
export const checkAdminPrivileges = (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No auth token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    if (req.user.role === "admin") {
      return res.status(200).json({ message: "admin" });
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
