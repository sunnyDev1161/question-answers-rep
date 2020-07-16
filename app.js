const express = require('express');
const app = express();
const router = require("./routes")
const bodyParser = require('body-parser')
const logger = require("morgan");

const mongoose = require("mongoose");
const uri = "mongodb+srv://questions:P@kistan1@questions.34fwa.mongodb.net/questions?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection
    .once("open", () => console.log("DB connection done"))
    .on("error", error => console.log("DB connection is failed: ", error))
app.use(logger("dev"))
app.use(bodyParser())
app.use("/questions", router);

//  catch 404 ERRORs
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error)
})


// ERROR handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error.message
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is running on the PORT : ${port}`))