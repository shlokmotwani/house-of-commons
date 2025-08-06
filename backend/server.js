const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const postRouter = require("./routers/postRouter.js");
const { userRouter } = require("./routers/userRouter.js");

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//API routes
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
