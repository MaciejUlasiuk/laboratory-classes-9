const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectToDb } = require("./config/mongo"); 

const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('error');
});

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Seerver running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("App failed to start", err)
    process.exit(1);
  });