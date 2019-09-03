const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

require("./routes/dialogflowRoutes")(app);

if (process.env.NODE_ENV === "production") {
  //js and css file
  app.use(express.static("client/build"));

  //index.html for all routes
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("App is running at port " + PORT));
