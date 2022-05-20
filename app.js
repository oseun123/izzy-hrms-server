const express = require("express");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { NODE_ENV } = process.env;

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.json());
// form data
app.use(
  express.urlencoded({
    extended: true,
  })
);
//middleware for cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.cookie(`Cookie token name`, `encrypted cookie string Value`);
  res.send({ message: "welcome" });
});

// Routes
app.use("/api/auth/", authRoute);

// Error Handling
app.use((req, res, next) => {
  const error = new Error("Route not found.");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  return res.status(error.status || 500).send({
    status: "error",
    message:
      NODE_ENV === "development" ? error.message : "Something went wrong",
    payload: {},
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server ready at http://localhost:${port}`));
