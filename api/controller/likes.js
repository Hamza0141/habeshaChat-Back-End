const pool = require("../../Config/DBconfig")
const jwt = require("jsonwebtoken");
const jwtSecreat = process.env.JWT_SECRET;

const getLikes = async (req, res) => {
  try {
    const query1 = `SELECT user_id from likes WHERE post_id =?`;
    const [row] = await pool.query(query1, [req.query.post_id]);
    if (!row) return res.status(500).json(err);
    return res.status(200).json(row.map((like) => like.user_id));
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
}; 


const addLike = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not logged in");
    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");
      const query1 = `INSERT INTO likes (user_id,post_id) VALUES (?, ?)`;
      const [row] = await pool.query(query1, [
        userInfo.id,
        req.body.post_id,
      ]);
      if (!row) return res.status(500).json(err);
      return res.status(200).json("Post has been liked!");
    });
  } catch (error) {
    return res.status(500).json("server error");
  }
};


const deleteLikes = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not logged in");
    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");
      const query1 = `DELETE FROM likes WHERE user_id = ? AND post_id = ?`;
      const [row] = await pool.query(query1, [userInfo.id, req.query.post_id]);
      if (!row) return res.status(500).json(err);
      return res.status(200).json("Like has been removed!");
    });
  } catch (error) {
    return res.status(500).json("server error");
  }
};


module.exports = {
  getLikes,
  addLike,
  deleteLikes,
};