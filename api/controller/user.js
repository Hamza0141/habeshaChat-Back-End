const pool = require("../../Config/DBconfig");
const jwt = require("jsonwebtoken");
const jwtSecreat = process.env.JWT_SECRET;

const getAllUnfriends = async (req, res) => {
  try {
    const currentUserID = req.params.currentUserID;
    console.log(currentUserID);

    const query1 = `SELECT DISTINCT u.id, u.user_name, u.email, u.name, u.cover_pic,u.created_date, u.profile_pic, u.city, u.website FROM users u LEFT JOIN relationShips r ON u.id = r.followed_user_id AND r.followers_user_id = ?
WHERE u.id != ? AND r.followers_user_id IS NULL ORDER BY u.created_date DESC LIMIT 5`;

    const [rows] = await pool.query(query1, [currentUserID, currentUserID]);

    if (!rows) return res.status(500).json(err);

    const info = rows; // This should now only contain the selected columns for users who are not the current user or their followers
    return res.status(200).json(info);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};
const getFriends = async (req, res) => {
  try {
    const currentUserID = req.params.currentUserID;

    const query = `
SELECT DISTINCT u.id, u.user_name, u.email, u.name, u.cover_pic, u.profile_pic, u.city, u.website
FROM users u
LEFT JOIN relationShips r1 ON u.id = r1.followers_user_id AND r1.followed_user_id = ?
LEFT JOIN relationShips r2 ON u.id = r2.followed_user_id AND r2.followers_user_id = ?
WHERE u.id != ?
AND (r1.followed_user_id IS NOT NULL AND r2.followers_user_id IS NOT NULL)`;
    //  SELECT DISTINCT u.id, u.user_name, u.email, u.name, u.cover_pic, u.profile_pic, u.city, u.website
    //   FROM users u
    //   LEFT JOIN relationShips r1 ON u.id = r1.followers_user_id AND r1.followed_user_id = ?
    //   LEFT JOIN relationShips r2 ON u.id = r2.followed_user_id AND r2.followers_user_id = ?
    //   WHERE u.id != ? AND r1.followed_user_id IS NOT NULL AND r2.followers_user_id IS NOT NULL

    const [rows] = await pool.query(query, [
      currentUserID,
      currentUserID,
      currentUserID,
    ]);

    if (!rows) return res.status(500).json(err);

    const info = rows;
    return res.status(200).json(info);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

const getFollowers = async (req, res) => {
  try {
    const currentUserID = req.params.currentUserID;
    console.log(currentUserID);

    const query = `SELECT u.id, u.user_name, u.email, u.name, u.cover_pic, u.profile_pic, u.city, u.website
FROM users u
INNER JOIN relationShips r ON u.id = r.followers_user_id
WHERE r.followed_user_id = ?
AND r.followers_user_id != ? 
AND u.id NOT IN (
  SELECT r2.followed_user_id
  FROM relationShips r2
  WHERE r2.followers_user_id = ? 
)`;

    const [rows] = await pool.query(query, [
      currentUserID,
      currentUserID,
      currentUserID,
    ]);

    console.log("Query Result:", rows); // Add this line for debugging

    if (!rows) return res.status(500).json(err);

    const info = rows;
    return res.status(200).json(info);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};








const getUser = async (req, res) => {
  try {

    const user_id = req.params.user_id; 
    const query1 = "SELECT * FROM users WHERE id=?";
    const [row] = await pool.query(query1, [user_id]);
      const token = jwt.sign({ id: row[0].id }, jwtSecreat);
    if (!row) return res.status(500).json(err);
    const { password, ...info } = row[0]; 
    return res.status(200).json(info);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

const updateUser = async (req,res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("not logged in");
  jwt.verify(token, jwtSecreat, async (err, userInfo) => {
    if (err) return res.status(401).json("Token is not valid");
    const query = `UPDATE users SET name=?, city=?, website=?,facebook_address=?,instagram_address=?,twitter_address=?,linkedin_address=?, profile_pic=?, cover_pic=? WHERE id = ?`;
    const [row] = await pool.query(query, [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.facebook_address,
      req.body.instagram_address,
      req.body.twitter_address,
      req.body.linkedin_address,
      req.body.profile_pic,
      req.body.cover_pic,
      userInfo.id,
    ]);

    if (!row) return res.status(500).json(err);
    if (row.affectedRows > 0) return res.json("updated");
    return res.status(500).json("Update Unsuccessful");
  });
};

module.exports = {
  getAllUnfriends,
  getUser,
  updateUser,
  getFriends,
  getFollowers,
};
