const pool = require("../../Config/DBconfig");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecreat = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    const user_name = req.body.user_name;
    const query = `SELECT * FROM users WHERE user_name = ?`;
    const [row] = await pool.query(query, [user_name]);
    console.log(row);
  
    if (row.length > 0) {
      return res.status(400).json({ error: "user name already exist !" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const query2 = `INSERT INTO users(user_name, email, password, name) VALUES (?, ?, ?, ?)`;

      const [row]= await pool.query(query2, [
        req.body.user_name,
        req.body.email,
        hashedPassword,
        req.body.name,
      ]);
        console.log(row);
      return res.status(200).json("User has been created");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    const query = "SELECT * FROM users WHERE user_name=?";
    const [row] = await pool.query(query, [req.body.user_name], (err) => {
      if (err) return res.status(500).json(err);
    });
    console.log(row);
    if (row.length === 0) {
      return res.status(404).json("user not found!");
    } else {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        row[0].password
      );
      if (!checkPassword){
        return res.status(404).json("Wrong password or username!");
      }
      const token = jwt.sign({ id: row[0].id }, jwtSecreat);
      const { password, ...others } = row[0];
      console.log(others);
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    }
  } catch (err) {
    return res.status(500).json("server error");
  }
};

const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("user loged out");
};

module.exports = {
  register,
  login,
  logout,
};
