const express = require("express");
const Article = require("./../models/models");
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (!article) return res.redirect("/");
  res.render("articles/show", { article: article });
});

router.post("/", async (req, res, next) => {
  req.article = new Article(); // ✅ Fixed typo
  next();
}, saveArticleAndRedirect("new"));

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.redirect("/"); // ✅ Handle null case
  res.render("articles/edit", { article: article }); // ✅ Corrected view path
});

router.put("/:id", async (req, res, next) => {
  req.article = await Article.findById(req.params.id);
  if (!req.article) return res.redirect("/"); // ✅ Prevents errors if article not found
  next();
}, saveArticleAndRedirect("edit"));

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router;
