const mongoose = require('mongoose')

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log('DB conectada')
  } catch (error) {
    console.log(error)
  }
}
module.exports = conectarDB

// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost/test", {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then(() => {
//     console.log("database conectada");
//   })
//   .catch((err) => console.log(err));

// module.exports = mongoose;
