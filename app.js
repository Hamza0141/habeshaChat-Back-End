const express = require("express")
const pool = require("./Config/DBconfig")
const app = express()
require("dotenv").config();
const cors = require("cors");
const cookiParser = require("cookie-parser");
const port = process.env.PORT
const userRoute = require("./api/routes/user")
const relationships = require("./api/routes/relationship");
const postRoute = require("./api/routes/post");
const commentsRoute = require("./api/routes/comments");
const likeRoute = require("./api/routes/likes");
const authRoute = require("./api/routes/auth");
const messagesRoute = require("./api/routes/message")
const sanitize = require("sanitize");

// firebase requires
const { upload } = require("./middleware/multer");
const { getStorage, ref, uploadBytesResumable } = require("firebase/storage");
const {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth");
const { auth } = require("./Config/firebase.config");



app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Credentials", true)
  next()
})
const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookiParser());
app.use(express.json())
app.use(sanitize.middleware);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/", commentsRoute);
app.use("/api/likes", likeRoute);
app.use("/api/users", userRoute);
app.use("/api/relationships", relationships);
app.use("/api/messages", messagesRoute);


async function uploadImage(file, quantity) {
const storageFB = getStorage();

  await signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_USER,
    process.env.FIREBASE_AUTH
  );

  if (quantity === "single") {
    const dateTime = Date.now();
    const fileName = `image/${dateTime}`;
    const storageRef = ref(storageFB, fileName);
    const metadata = {
      contentType: file.type,
    };
    await uploadBytesResumable(storageRef, file.buffer, metadata);
    return fileName;
  }
}

app.post("/api/upload", upload, async (req, res) => {
  const file = {
    type: req.file.mimetype,
    buffer: req.file.buffer,
  };
  try {
    const buildImage = await uploadImage(file, "single");
    res.send({
      status: "SUCCESS",
      imageName: buildImage,
    });
    console.log(buildImage);
  } catch (err) {
    console.log(err);
  }
});










app.listen(port,()=>{
  console.log(`server running on port ${port}`);
});