const pool = require("../../Config/DBconfig");
const jwt = require("jsonwebtoken");
const jwtSecreat = process.env.JWT_SECRET;
// const moment = require("moment");

const getmessage = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not logged in");
    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");
      const query1 = `
        SELECT DISTINCT m.*
FROM message AS m
INNER JOIN relationShips AS r1 ON (
    (m.followers_user_id = r1.followers_user_id AND m.followed_user_id = r1.followed_user_id) 
    OR 
    (m.followers_user_id = r1.followed_user_id AND m.followed_user_id = r1.followers_user_id)
)
WHERE (r1.followers_user_id = ? AND r1.followed_user_id = ?)
;
`;
      const [rows] = await pool.query(query1, [
        userInfo.id,
        req.query.followed_user_id,
      ]);
      if (!rows || rows.length === 0)
        return res.status(500).json("No messages found");
      console.log(rows);
      return res.status(200).json(rows);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};
const addMessage = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not logged in");
    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");
      const query1 = `INSERT INTO message (message,followers_user_id,followed_user_id) VALUES (?, ?, ?)`;
      const [row] = await pool.query(query1, [
        req.body.message,
        userInfo.id,
        req.body.followed_user_id,
      ]);
      if (!row) return res.status(500).json(err);
      return res.status(200).json("Message sent!");
    });
  } catch (error) {
    return res.status(500).json("server error");
  }
};
module.exports = {
  addMessage,
  getmessage,
};