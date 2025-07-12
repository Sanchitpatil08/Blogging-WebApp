require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser"); // ✅ fixed spelling
const Blog = require("./models/blog");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Set view engine and views path (remove the space!)
app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); // ✅ fixed the extra space

// ✅ Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // ✅ fixed spelling
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// ✅ Make `user` globally available in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// ✅ Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// ✅ Start server
app.listen(PORT, () => console.log(`Server started on Port: ${PORT}`));
