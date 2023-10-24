const pool = require("../../Config/DBconfig");
const jwt = require("jsonwebtoken");
const jwtSecreat = process.env.JWT_SECRET;

const getRelationships = async (req, res) => {
  try {
    const query1 = `SELECT followers_user_id from relationShips WHERE followed_user_id =?`;
    const [row] = await pool.query(query1, [req.query.followed_user_id]);
    if (!row) return res.status(500).json(err);
    console.log(row);
    return res
      .status(200)
      .json(row.map((relationShips) => relationShips.followers_user_id));
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

const addRelationships = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not logged in");
    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");
      const query1 = `INSERT INTO relationShips (followers_user_id,followed_user_id) VALUES (?, ?)`;
      const [row] = await pool.query(query1, [userInfo.id, req.body.user_id]);
      if (!row) return res.status(500).json(err);
      console.log(row);
      return res.status(200).json("following!");
    });
  } catch (error) {
    return res.status(500).json("server error");
  }
};

const deleteRelationships = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not logged in");
    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");
      const query1 = `DELETE FROM relationShips WHERE followers_user_id = ? AND followed_user_id = ?`;
      const [row] = await pool.query(query1, [userInfo.id, req.query.user_id]);
      if (!row) return res.status(500).json(err);
      console.log(row);
      return res.status(200).json("Unfollow!");
    });
  } catch (error) {
    return res.status(500).json("server error");
  }
};

module.exports = {
  getRelationships,
  addRelationships,
  deleteRelationships,
};
