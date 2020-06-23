var express = require("express");
var app = express();
connectionString = {
connectionString: process.env.DATABASE_URL,
ssl: true
};


app.get("/", (req, res, next) => {
 res.json(["Tony"]);
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});