"use strict"
const mongoose = require("mongoose");

const db = mongoose.connection;

db.on("error", (err) => console.log("ERROR: ", err));

//  once connnection is created than this function will run
db.once("open", () => {
    console.log("DB connection is successful.");

    // now all the database communication goes here!

    // making Schema

    const Schema = mongoose.Schema;
    const AnimalSchema = new Schema({
        type: { type: String, default: "goldfish" },
        name: { type: String, default: "gold fish" },
        size: String,
        mass: { type: Number, default: 0.0003 },
        color: {
            type: String, default: "gold"
        }
    })

    // to put some thing into schema before the db updates

    AnimalSchema.pre("save", function (next) {
        if (this.mass >= 100) {
            this.size = "big"
        } else if (this.mass >= 5 && this.mass < 100) {
            this.size = "medium"
        } else {
            this.size = "small"
        }

        next();
    })

    //  adding static method to the modal
    AnimalSchema.statics.findSize = function (size, callback) {
        return this.find({ size: size }, callback)
    }
    // now giving the schema to the modal
    const Animals = mongoose.model("animals", AnimalSchema);

    // creting animal document to give it to the animal document
    const elephant = new Animals({ type: "animal", name: "johnny", mass: 6000, color: "gray" });

    const animal = new Animals({})
    const whale = new Animals({
        type: "whale",
        name: "fig",
        mass: 100200,
        color: "blue"
    })
    const animalsData = [
        {
            type: "mouse",
            name: "jack",
            mass: 0.02,
            color: "gray"
        },
        {
            type: "dog",
            name: "jackie",
            mass: 40,
            color: "black"
        },
        {
            type: "hen",
            name: "amanda",
            mass: 2,
            color: "white"
        },
        elephant,
        whale,
        animal

    ]
    // to remove the database
    Animals.remove({}, error => {
        if (error) console.log(error)
        Animals.create(animalsData, (err, animals) => {
            if (err) console.log(err)
            Animals.findSize("big", function (err) {
                animals.forEach(function (animal) {
                    console.log(`${animal.name} the ${animal.color}  ${animal.size} sized ${animal.type}`)
                })
            })
            db.close(() => console.log("DB connection closed"))
        })
    })
})
mongoose.connect("mongodb://localhost:27017/sandbox")