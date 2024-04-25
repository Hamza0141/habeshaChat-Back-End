const pool = require("../../Config/DBconfig");
const jwt = require("jsonwebtoken");
const jwtSecreat = process.env.JWT_SECRET;
const moment = require("moment");

// const getPost = async (req, res) => {
//   try {
//     const user_id = req.query.user_id;
//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("not logged in");
//     jwt.verify(token, jwtSecreat, async (err, userInfo) => {
//       if (err) return res.status(401).json("Token is not valid");
//       const query1 =
//         user_id !== "undefined"
//           ? `SELECT p.*, u.id AS userId, u.name, u.profile_pic 
//    FROM posts AS p 
//    JOIN users AS u ON (u.id = p.user_id) 
//    WHERE p.user_id = ?`
//           : `SELECT p.*, u.id AS userId, u.name, u.profile_pic 
//    FROM posts AS p 
//    JOIN users AS u ON (u.id = p.user_id) 
//    LEFT JOIN relationships AS r ON (p.user_id = r.followed_user_id) 
//    WHERE r.followers_user_id = ? OR p.user_id = ? 
//    ORDER BY p.created_date DESC`;

//       const values =
//         user_id !== "undefined" ? [user_id] : [userInfo.id, userInfo.id];

//       const [row] = await pool.query(query1, values);
//       if (!row) return res.status(500).json(err);
//       console.log(row);
//       return res.status(200).json(row);
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json("Internal Server Error");
//   }
// };
const getPost = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json("not logged in");

    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");

      let query1;
      let values;

      if (user_id !== "undefined") {
        query1 = `SELECT DISTINCT p.*, u.id AS userId, u.name, u.profile_pic
          FROM posts AS p
          JOIN users AS u ON (u.id = p.user_id)
          WHERE p.user_id = ?`;
        values = [user_id];
      } else {
        // Determine the friends and followers of the current user
        const friendsQuery =
          "SELECT followed_user_id FROM relationShips WHERE followers_user_id = ?";
        const followersQuery =
          "SELECT followers_user_id FROM relationShips WHERE followed_user_id = ?";

        const [friendsResult] = await pool.query(friendsQuery, [userInfo.id]);
        const [followersResult] = await pool.query(followersQuery, [
          userInfo.id,
        ]);

        const friends = friendsResult.map((row) => row.followed_user_id);
        const followers = followersResult.map((row) => row.followers_user_id);

        // Include the current user's ID in the list of friends
        friends.push(userInfo.id);

        // Construct the SQL query with friends and followers
        query1 = `SELECT DISTINCT p.*, u.id AS userId, u.name, u.profile_pic
          FROM posts AS p
          JOIN users AS u ON (u.id = p.user_id)
          WHERE p.user_id IN (?) OR p.user_id = ?
          ORDER BY p.created_date DESC`;

        values = [friends, userInfo.id];
      }

      const [rows] = await pool.query(query1, values);

      if (!rows || rows.length === 0) {
        return res.status(404).json("No posts found.");
      }

      return res.status(200).json(rows);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};


const getStorePosts = async (req, res) => {
  try {
    const currentUserID = req.params.currentUserID;
    const query1 = `
      SELECT p.description, p.image, p.user_id, p.created_date
      FROM posts AS p
      WHERE p.user_id != ? AND p.created_date = (
        SELECT MAX(created_date)
        FROM posts
        WHERE user_id = p.user_id
      )
      LIMIT 3`;

    const [rows] = await pool.query(query1, [currentUserID]);

    if (!rows) return res.status(500).json(err);

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
};




const addPost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not logged in");
    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");
      const query1 = `INSERT INTO posts (description,image,created_date,user_id) VALUES  (?, ?, ?, ?)`;
      const [row] = await pool.query(query1, [
        req.body.description,
        req.body.image,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
      ]);
      if (!row) return res.status(500).json(err);
      return res.status(200).json(row);
    });
  } catch (error) {
    return res.status(500).json("server error");
  }
};

const deletePost = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("not logged in");
    jwt.verify(token, jwtSecreat, async (err, userInfo) => {
      if (err) return res.status(401).json("Token is not valid");
      const query1 = `DELETE FROM posts WHERE id = ? AND user_id = ?`;
      const [row] = await pool.query(query1, [req.params.id, userInfo.id]);
      if (!row) return res.status(500).json(err);
      if (row.affectedRows > 0)
        return res.status(200).json("post has been deleted ");
      return res.status(403).json("you can delete only your post !");
    });
  } catch (error) {
    return res.status(500).json("server error");
  }
};
module.exports = {
  getPost,
  addPost,
  deletePost,
  getStorePosts,
};
