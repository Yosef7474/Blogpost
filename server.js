const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();
const PORT = 5000;
const app = express();
const article = require("./models/models")
const articleRouter = require("./routes/articles");
const methodOverride = require('method-override')

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch(err => console.error("MongoDB Connection Error:", err));

app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'))

app.get("/", async (req, res) => {
  const articles = await article.find().sort({createdAt: 'desc'})

  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
