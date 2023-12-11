const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URL)

    /* here mongoose.connect method giving promise(true or false value),
    so I am using .then and .catch*/
    .then((con) => {
      console.log(`MongoDB is connected to the host: ${con.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
