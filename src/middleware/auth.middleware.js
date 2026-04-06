import jwt from "jsonwebtoken";
export const authMiddleware = async (req, res, next) => {
  try {
    const headers = req.headers.authorization;

    if (!headers) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const token = headers.split(" ").pop();

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Token expired",
          success: false,
        });
      }
      console.log(decoded);

      const { id, role } = decoded;
      req.user = { id, role };

      next();
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Invalid token",
      success: false,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  console.log(req.user);
  const { id, role } = req.user;

  const hasAdminRole = Array.isArray(role)
    ? role.includes("admin")
    : role === "admin";

  if (!hasAdminRole) {
    return res.status(403).json({
      message: "Only admin can create & delete brands",
      success: false,
    });
  }
  next();
};
