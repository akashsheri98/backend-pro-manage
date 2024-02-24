require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors =require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
//create a server
const app = express();

app.use(express.json());
app.use(cookieParser());
//for testing purposes only, should be removed in production.
app.use(cors()); 

//database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("----DB CONNECTED----"))
  .catch((error) => console.log("Failed to connect", error));

//routes
app.use("/api/v1/auth" ,authRoutes);


app.get("/health", (req, res) => {
  res.json({
    service: "pro-manage server",
    status: "Active",
    time: new Date(),
  });
});

const PORT =process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
