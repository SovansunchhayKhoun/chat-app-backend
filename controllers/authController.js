const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegistration = async (req, res) => {
  const { firstname, lastname, password, confirmPassword, username } = req.body
  const duplicate = await User.findOne({ username: username }).exec()
  if (duplicate) {
    return res.status(409).json({
      message: `Username ${username} already exists.`
    })
  }
  
  const match = confirmPassword === password

  if(match) {
    const result = new User({
      firstname: firstname?.trim(),
      lastname: lastname?.trim(),
      password: bcrypt.hashSync(password?.trim(), 10), 
      username: username?.trim()
    })
    try {
      await result.save()
      return res.status(201).json({
        message: "User Created",
        result
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: err.errors })
    }
  } else {
    return res.status(400).json({ message: "Passwords do not match" })
  }

}

const handleLogin = async (req, res) => {
  const user = await User.findOne({ username: req?.body?.username }).exec();
  if (!user) return res.status(404).json({ message: "Invalid Username" });

  const { _id, password, username, firstname, lastname } = user;
  const { password: inputPassword } = req.body;

  const match = await bcrypt.compare(inputPassword, password);
  if (match) {
    // create jwt
    const accessToken = jwt.sign(
      { firstname, lastname, username, _id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "300s" }
    );
    const refreshToken = jwt.sign(
      { firstname, lastname, username, _id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // save refresh token to db
    user.refreshToken = refreshToken;
    const result = await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    
    return res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
};

const handleRefreshToken = async (req, res) => {
  // console.log(req.cookie)
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      const { _id, username, firstname, lastname } = decoded;

      const user = await User.findOne({ _id }).exec();
      if (!user) return res.status(401).json({ message: "Unauthorized " });

      const accessToken = jwt.sign(
        { firstname, lastname, _id, username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "300s" }
      );

      res.json({ accessToken });
    }
  );
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken }).exec();

  if (!user) {
    res.clearCookie("jwt", {
      sameSite: "none",
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    });
    return res.sendStatus(204);
  }
  user.refreshToken = "";
  await user.save();

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({ message: "Logout Success", refreshToken: user.refreshToken });
};

const getUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err) => {
    if(err) return res.status(403).json({ message: "Forbidden" })
    const user = await User.findOne({ refreshToken }).exec()

    if(!user) return res.status(404).json({ message: "User not found" })

    return res.status(200).json({user})

  })
};

module.exports = { handleRegistration, handleLogin, handleRefreshToken, handleLogout, getUser };
