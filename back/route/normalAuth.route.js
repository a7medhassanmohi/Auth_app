const app = require("express").Router()
const { sendMail } = require("../helper/mail")
const bcrypt = require("bcrypt")
const User = require("../model/user")
const GoogleUser = require("../model/googleUser")
const jwt = require("jsonwebtoken")
const e = require("express")
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client("818917350917-m2i93e7sgs46636m5t05pmd3r45b7nin.apps.googleusercontent.com")


app.post("/google/sucess", (req, res) => {
    const { token } = req.body
    jwt.verify(token, process.env.JWTSECRETGOOGLE, (err, data) => {
        if (err) res.status(400).json({ mess: err.message })
        if (!data) res.status(400).json({ mess: "you must login again" })
        GoogleUser.findOne({ googleId: data.googleId }).exec((err, dt) => {
            if (err) res.status(400).json({ mess: "somthing went wrong" })
            if (!dt) res.status(400).json({ mess: "somthing went wrong" })
            res.status(200).json({ user: dt })

        })
    })
})

app.post("/google", (req, res) => {
    const { tokenId, googleId } = req.body

    client.verifyIdToken({ idToken: tokenId, audience: "818917350917-m2i93e7sgs46636m5t05pmd3r45b7nin.apps.googleusercontent.com" }).then((respo) => {

        GoogleUser.findOne({ googleId: googleId }).exec((err, data) => {
            if (err) return res.status(400).json({ mess: "somthing Went wrong with google" })
            if (data) {
                const token = jwt.sign({ googleId: data.googleId, email: data.email, }, process.env.JWTSECRETGOOGLE)
                res.status(200).json({ token, user: data })

            } else {
                GoogleUser.create({
                    username: respo.payload.name,
                    email: respo.payload.email,
                    googleId: googleId,
                    isverify: respo.payload.email_verified

                }, (err, data2) => {
                    if (err) return res.status(400).json({ mess: "somthing Went wrong " })
                    if (!data2) return res.status(400).json({ mess: "somthing Went wrong2 " })
                    const token = jwt.sign({ googleId: data2.googleId, email: data2.email, }, process.env.JWTSECRETGOOGLE)
                    res.status(200).json({ token, user: data2 })
                })

            }

        })
    }).catch((e) => {
        res.status(400).json({ mess: e })
    })
})


app.post("/register", (req, res) => {


    const { username, email, password } = req.body

    if (!username) return res.status(400).json({ mess: "user name require" })
    if (!email) return res.status(400).json({ mess: "email  require" })
    if (!password) return res.status(400).json({ mess: "password  require" })
    User.findOne({ email }).exec((err, data) => {
        if (err) return res.status(400).json({ mess: "user  exist" })
        if (data) return res.status(400).json({ mess: "user  exist" })

        const hash = bcrypt.hashSync(password, 8)
        const token = jwt.sign({ email }, process.env.JWTSECRET,)
        sendMail(email, "activate your account", `<div>activate your account <a href='https://modest-panini-afc70d.netlify.app/#/activateaccount/${token}' target='_blank'>Click hear</a>  </div>`)

        User.create({
            username,
            email,
            password: hash,
            verifytoken: token
        }, (err, data) => {
            if (err) res.status(400).json({ mess: "somthing went wrong" })
            if (data) {
                res.status(200).json({ mess: "your account created" })

            }

        })

    })





})


app.post("/login", (req, res) => {
    const { email, password } = req.body
    if (!email) return res.status(400).json({ mess: "email  require" })
    if (!password) return res.status(400).json({ mess: "password  require" })
    User.findOne({ email }).select(["-verifytoken", "-resttoken"]).exec((err, data) => {
        if (err) return res.status(400).json({ mess: "something went wrong with login" })
        if (!data) return res.status(400).json({ mess: "user not exist" })

        const match = bcrypt.compareSync(password, data.password);
        if (match) {
            const token = jwt.sign({ email: data.email }, process.env.JWTSECRET)
            const { password, ...other } = data._doc
            res.status(200).json({ user: other, token })
        } else {
            res.status(400).json({ mess: "wrong crendintial" })
        }


    })




})


app.post("/activate", (req, res) => {

    const { token } = req.body
    jwt.verify(token, process.env.JWTSECRET, (err, data) => {
        if (err) return res.status(400).json({ mess: err.message })
        if (data) {
            User.findOne({ email: data.email }).select("-password").exec((err, user) => {
                if (err) return res.status(400).json({ mess: "somthing went wrong" })
                if (user) {

                    if (user.isverify) {
                        return res.status(200).json({ mess: "your account alerdy activated before" })
                    }
                    if (user.verifytoken && user.verifytoken == token) {
                        User.updateOne({ email: data.email }, { verifytoken: null, isverify: true }, (err, done) => {
                            if (err) return res.status(200).json({ mess: "somthing went wrong with update" })
                            return res.status(200).json({ mess: "your account has been activated" })
                        })
                    }

                }
            })

        }
    })
})


app.post("/forget", (req, res) => {
    const { email } = req.body
    if (!email) return res.status(400).json({ mess: "email  require" })
    User.findOne({ email }).exec((err, data) => {
        if (err) return res.status(400).json({ mess: "somtheing went wrong with froget" })
        if (!data) return res.status(400).json({ mess: "email not exist" })
        const token = jwt.sign({ email }, process.env.JWTSECRET, { expiresIn: "15m" })
        sendMail(email, "Rest your password ", `<div>Rest your password <a href='https://modest-panini-afc70d.netlify.app/#/newpassword/${token}' target='_blank'>Click Hear</a>  </div>`)

        User.updateOne({ email }, { resttoken: token }, (err, data2) => {
            if (err) return res.status(400).json({ mess: "somtheing went wrong with froget2" })
            if (!data2) return res.status(400).json({ mess: "email2 not exist" })

            res.status(200).json({ mess: "email was sent" })
        })
    })
})

app.post("/rest", (req, res) => {
    const { token, password } = req.body
    jwt.verify(token, process.env.JWTSECRET, (err, data) => {
        if (err) return res.status(400).json({ mess: "Link expire please go to rest password 1again", e: err })
        if (!data) return res.status(400).json({ mess: "Link expire please go to rest password11 again" })
        const hash = bcrypt.hashSync(password, 8)
        User.findOne({ email: data.email }).exec((err, data3) => {
            if (err) return res.status(400).json({ mess: "email2 not exist" })
            if (!data3) return res.status(400).json({ mess: "email not exist" })
            if (data3.resttoken == token) {

                User.updateOne({ email: data.email }, { resttoken: null, password: hash }, (err, data2) => {
                    if (err) return res.status(400).json({ mess: "somtheing went wrong with froget2" })
                    if (!data2) return res.status(400).json({ mess: "email2 not exist" })


                    return res.status(200).json({ mess: "password was change" })
                })
            } else {
                return res.status(400).json({ mess: "Link expire please go to rest password again111" })
            }

        })

    })

})


app.post("/login/sucess", (req, res) => {
    const { token } = req.body
    jwt.verify(token, process.env.JWTSECRET, (err, data) => {
        if (err) res.status(400).json({ mess: err.message })
        if (!data) res.status(400).json({ mess: "you must login again" })
        User.findOne({ email: data.email }).select(["-password", "-resttoken", "-verifytoken"]).exec((err, data2) => {
            if (err) res.status(400).json({ mess: "you must login again user not found" })
            if (!data2) res.status(400).json({ mess: "you must login again user not found" })

            return res.status(200).json({ mess: data2 })
        })
    })
})

module.exports = app

