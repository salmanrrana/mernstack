const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send({ hi: "there" });
});

//dynamically figures out what port we need to listen to
// looks at underlying enviroment and then look at the port they want us to use is what the code below is doing
//if there is an enviroment variable then assign it or by default use 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT);
// http://localhost:5000/
