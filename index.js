const express = require("express");
const PORT = process.env.PORT ?? 4040;

const app = express();
app.use(express.json());

app.post("*", async (req, res) => {
  res.send("Hello world !");
});

app.get("*", async (req, res) => {
  res.send("Hello world !");
});

app.listen(PORT, function (err) {
  if (err) {
    console.log("Error in server setup");
    return;
  }
  console.log("Server listening on PORT", PORT);
});
