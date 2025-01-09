const express = require("express");
const cors = require("cors");
const puzzlesRouter = require("./routes/puzzles");
const leaderboardRouter = require("./routes/leaderboard");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/puzzles", puzzlesRouter);
app.use("/api/leaderboard", leaderboardRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;