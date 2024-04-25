const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});

// const pool = mysql.createPool(process.env.DATABASE_URL);

const users = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL,
    password VARCHAR(200) NOT NULL,
    name VARCHAR(200) NOT NULL,
    cover_pic VARCHAR(300),
    profile_pic VARCHAR(300),
    city VARCHAR(200),
    website VARCHAR(200),
    facebook_address VARCHAR(200),
    instagram_address VARCHAR(200),
    twitter_address VARCHAR(200),
    linkedin_address VARCHAR(200),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
const posts = `CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    description VARCHAR(250),
    image VARCHAR(250),
    user_id INT NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
const comments = `CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    description VARCHAR(250) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    post_id INT NOT NULL
)`;

const relationShips = `CREATE TABLE IF NOT EXISTS relationShips(
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            followers_user_id INT NOT NULL,
            followed_user_id INT NOT NULL
            )`;

const likes = `CREATE TABLE IF NOT EXISTS likes(
            id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            user_id INT NOT NULL,
            post_id INT NOT NULL
            )`;
const message = `CREATE TABLE IF NOT EXISTS message (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    message VARCHAR(1000) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      followers_user_id INT NOT NULL,
      followed_user_id INT NOT NULL
)`;

(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(users);
    await connection.query(posts);
    await connection.query(comments);
    await connection.query(relationShips);
    await connection.query(likes);
    await connection.query(message);
    connection.release();
    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err.message);
  }
})();
module.exports = pool;
