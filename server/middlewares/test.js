const validateSignupFields = (req, res, next) => {
  console.log("Inside validateSignupFields Middleware"); // Log to check if it's being hit

  const { name, email, password } = req.body;

  // Check if all required fields are present
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields (name, email, password) are required." });
  }

  console.log(
    "Validation passed. Passing control to the next middleware/controller."
  ); // Log validation success

  // If everything is valid, pass the request to the next middleware/controller
  next();
};

const validateLoginFields = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "All fields ( email, password) are required." });
  }

  console.log(
    "Validation passed. Passing control to the next middleware/controller."
  );
  next();
};
module.exports = { validateSignupFields, validateLoginFields };
