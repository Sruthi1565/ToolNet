require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const jwtSecret = "MynameisSruthiThotaNeighbourhoodtoolshare";
console.log()

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,       // Sender email from .env
        pass: process.env.EMAIL_PASS // Sender password from .env
    }
});

// Route to create a new user
router.post("/createuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 }),
    body('latitude').isNumeric(),
    body('longitude').isNumeric()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
        const newUser = await User.create({
            name: req.body.name,
            password: secPassword,
            email: req.body.email,
            location: req.body.location,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        });

        // Prepare welcome email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: newUser.email,
            subject: 'Welcome to Neighborhood Tool Share!',
            text: `Hello ${newUser.name},\n\nWelcome to Neighborhood Tool Share! Your account has been successfully created. Start exploring and sharing tools within your community!\n\nBest regards,\nNeighborhood Tool Share Team`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'User created but failed to send email.' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({ success: true, userId: newUser._id });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
});

// Route to log in a user
router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 })
], async (req, res) => {
    let email = req.body.email;
    try {
        let userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "Try logging in with correct credentials" });
        }
        const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Try logging in with correct credentials" });
        }

        const data = {
            user: {
                id: userData.id
            }
        };
        const authToken = jwt.sign(data, jwtSecret);

        // Include latitude and longitude in the response
        return res.json({ 
            success: true, 
            authToken: authToken, 
            userId: userData._id, 
            name:userData.name,
            latitude: userData.latitude, 
            longitude: userData.longitude,
            profileImage:userData.profile.profileImage
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

module.exports = router;

