const pool = require("../../Config/DBconfig");
const jwt = require("jsonwebtoken");
const jwtSecreat = process.env.JWT_SECRET;
const moment = require("moment");

const getComments = async (req, res) => {
  try {
    const query1 = `SELECT c.*, u.id AS userId,name, profile_pic FROM comments AS c JOIN users AS u ON (u.id = c.user_id) WHERE c.post_id=? ORDER BY c.created_date DESC`;
    const [row] = await pool.query(query1, [req.query.post_id]);
    if (!row) return res.status(500).json(err);
    console.log(row);
    return res.status(200).json(row);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};

const addComments =async(req,res)=>{
 try{
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("not logged in");
        jwt.verify(token, jwtSecreat, async (err, userInfo) => {
          if (err) return res.status(401).json("Token is not valid");
          const query1 = `INSERT INTO comments (description,created_date,user_id,post_id) VALUES (?, ?, ?, ?)`;
          const [row] = await pool.query(query1, [
            req.body.description,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.post_id
          ]);
          if (!row) return res.status(500).json(err);
          console.log(row);
          return res.status(200).json("comment created!");
        });
    

  }catch(error){
    return res.status(500).json("server error")

  }
}
module.exports = {
  getComments,
  addComments,
};
