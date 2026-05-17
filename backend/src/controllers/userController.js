

const registerUser = async (req, res) => {
 
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    res.status(201).json({
      _id: "fake-id-123",
      name: name,
      email: email,
      token: "fake-jwt-token-for-now",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Backend received login attempt for:", email);

    // 1. Validate the data
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    // TODO: Later, we will check the Database to see if this user actually exists
    // TODO: Later, we will verify if the typed password matches the hashed database password

    // 2. For right now, just send a success message back so the frontend can log in!
    res.status(200).json({
      _id: "fake-id-123",
      name: "Robu User", // Fake name for now
      email: email,
      token: "fake-jwt-token-for-now",
    });

  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = {
  registerUser,
  loginUser, 
};