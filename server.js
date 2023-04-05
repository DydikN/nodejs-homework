const mongoose = require("mongoose");

const app = require("./app");
// cybObgbYTMdAilG5

const DB_HOST =
  "mongodb+srv://Nazik:cybObgbYTMdAilG5@cluster0.wriigzi.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => app.listen(3000))
  .catch((error) => console.log(error.message));
