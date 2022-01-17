const express = require("express")
const cors = require("cors")
const cooliessession = require("cookie-session")
const passport = require("passport")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const path = require("path")
dotenv.config()
require("./passportsetup")
const authRoute = require("./route/auth.route")
const mormalauthRoute = require("./route/normalAuth.route")

const app = express()
app.use(express.json())
app.use(cors(

))
// app.use(cooliessession({ name: "sessions", keys: ['mohi'], maxAge: 24 * 60 * 60 * 100 }))
// app.use(passport.initialize())
// app.use(passport.session())

mongoose.connect(process.env.URL).then(() => {
    console.log("data base start");
}).catch((e) => {
    console.log(e);

})
// app.use("/auth", authRoute)
app.use("/normalauth", mormalauthRoute)

app.get("/", (req, res) => {
    res.send("welcome")
})
app.listen(process.env.PORT || 5000, () => {
    console.log("server is running");
})