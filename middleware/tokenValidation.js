const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {

  let token;

  let authHeader = req.headers.Authorization || req.headers.authorization;

  // Check if an authorization header exists and if it starts with "Bearer".
  if (authHeader && authHeader.startsWith("Bearer")) {
    // If it does, split the header to extract the actual token (the second part).
    token = authHeader.split(" ")[1];

    // Verify the token's validity using a secret key and a callback function.
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token!" });
      }
      else{
      // If the token is valid, assign the decoded user data to the request object.
      req.user = decoded.user;
      
      // Call the "next()" function to pass control to the next middleware.
      next();
      }
    });
  } else {
    return res.status(401).json({ error: "User is not authorized or token is missing" });
  }
};

module.exports = validateToken;
