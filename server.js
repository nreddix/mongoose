const express = require("express");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3030;

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(
  MONGODB_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  },
  function(err) {
    if (err) {
      console.log(err);
    }
  }
);

app.get("/", function(req, res) {
  res.sendFile(path.resolve(__dirname + "public/index.html"));
});

app.get("/scrape", function(req, res) {
  let response;
  const url = "https://www.npr.org/sections/news/";

  axios
    .get(url)
    .then(function(response) {
      //   we're loading the data from the response that's given to us by using cheerio
      var $ = cheerio.load(response.data);

      //   console.log(response.data);
      $("article.item").each(function(i, art) {
        let article = {};

        article.title = $(this)
          .find("h2.title")
          .text();

        article.teaser = $(this)
          .find("p.teaser")
          .text();

        // trying to find Image, does not work
        // article.image = $(this)
        //   .find("img.respArchListImg")
        //   .text();

        console.log(article);
      });

      res.sendStatus(200);
    })
    .catch(function(error) {
      console.log(error);
      // do something
      res.sendStatus(500);
    });
});
app.listen(PORT, function() {
  console.log("started on " + PORT);
});