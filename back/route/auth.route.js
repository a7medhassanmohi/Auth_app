const app = require("express").Router()
const { json } = require("express/lib/response")
const passport = require("passport")


app.get("/login/failed", (req, res) => {
    res.status(400), json({ mess: "failure" })
})
app.get("/logout", (req, res) => {
    req.logout()
    res.redirect("http://localhost:3000")
})

app.get("/login/success", (req, res) => {


    if (req.user) {

        res.status(200).json({ mess: "sucess", user: req.user, })

    }
})
app.get("/google", passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account"

}))
app.get("/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "/login/failed"
}))
module.exports = app