const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role; // THIS is correct

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden. You do not have permission." });
    }
    next();
  };
};
export default checkRole