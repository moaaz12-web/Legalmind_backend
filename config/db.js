const mongoose = require("mongoose");
const env = require("dotenv").config()
mongoose.set("strictQuery", false);

mongoose

.connect(process.env.MONGO_URI, {
    
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
    )
    .then(() => console.log("mongoose connected"))
    .catch((err) => console.log(err));

const db = mongoose.connection;

module.exports = db;
