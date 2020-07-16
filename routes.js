const app = require('express');
const router = app.Router();
const Questions = require("./models").Questions

router.param("qId", function (req, res, next, id) {
    Questions.findById(id, function (err, doc) {
        if (err) return next();
        if (!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err)
        }
        req.question = doc;
        next()
    })
})

router.param("aId", function (req, res, next, id) {
    req.answer = req.question.answers.id(id);
    if (!req.answer) {
        err = new Error("Not Found");
        err.status = 404;
        return next(err)
    }
    next();
})
// GET all questtions
router.get("/", (req, res, next) => {
    Questions.find({})
        .sort({ createdAt: -1 })
        .exec(function (err, questions) {
            if (err) return next(err);
            res.json(questions)
            next()
        })
})
// POST THE question
router.post("/", function (req, res, next) {
    var question = new Questions(req.body);
    question.save(function (err, ques) {
        if (err) return next(err);
        res.status(201);
        res.json(ques)
        next()
    })
})

// GET the specific THE question
router.get("/:qId", function (req, res, next) {
    res.json(req.question)

})

// Routes for creating answers
router.post("/:qId/answers", (req, res, next) => {
    req.question.answers.push(req.body);
    req.question.save(function (err, ques) {
        if (err) return next(err);
        res.status(201);
        res.json(ques)
    })
})

// Routes for to EDIT specific answer
router.put("/:qId/answers/:aId", function (req, res, next) {
    req.answer.update(req.body, function (err, res) {
        if (err) return next(err);
        res.json(res)
    })
})

// Routes for to DELETE answer
//  we can use m,ultiple call backs in node
router.delete("/:qId/answers/:aId", function (req, res, next) {
    req.answer.remove(function (err) {
        req.question.save(function (err, question) {
            if (err) return next(err);
            res.json(question)
        })
    })
})

// Routes for to voting answer
router.post("/:qId/answers/:aId/vote-:dir", function (req, res, next) {

    if (req.params.dir.search(/^(up|down)$/)) {
        const err = new Error("Not Found");
        err.status = 404;
        next(err)
    } else {
        req.vote = req.params.dir
        next()
    }

}, function (req, res, next) {
    req.answer.vote(req.vote, function (err, question) {
        if (err) return next(err);
        res.json(question)
    })
    next()
})

module.exports = router;