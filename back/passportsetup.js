const passport = require("passport")
const express = require("express")

const app = express()

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.ClientIDGo,
    clientSecret: process.env.ClientsecretGo,
    callbackURL: "/auth/google/callback",

},
    (accessToken, refreshToken, profile, done) => {

        done(null, profile)
    }
));

passport.serializeUser(async (user, done) => {
    done(null, user)
})
passport.deserializeUser(async (user, done) => {


    done(null, user)
})