require('dotenv').config();

const express = require('express');

const app = express();

const mongoose = require('mongoose');

const cors = require('cors');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const sendEmail =
require('./utils/sendEmail');

const User =
require('./models/User');

const ideaRoutes =
require('./routes/ideaRoutes');





// PORT

const PORT =
process.env.PORT || 5000;
// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());




app.use(cors({
    origin: true,
    credentials: true
}));

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log('MongoDB connected successfully!');

    console.log(
        'Connected DB:',
        mongoose.connection.name
    );

})
.catch((err) => {

    console.log(
        'MongoDB Error:',
        err
    );

});




// ===============================
// JWT SECRET CHECK
// ===============================

if (!process.env.JWT_SECRET) {

    console.error(
        'JWT_SECRET missing in .env'
    );

    process.exit(1);
}







app.post('/api/auth/register', async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;





        // REQUIRED FIELDS

        if (!name || !email || !password) {

            return res.status(400).json({
                message:
                'Please fill all fields.'
            });
        }





        // EMAIL VALIDATION

        const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({
                message:
                'Please enter valid email.'
            });
        }





        // PASSWORD VALIDATION

        const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!passwordRegex.test(password)) {

            return res.status(400).json({
                message:
                'Password must contain uppercase, number, special character and minimum 8 characters.'
            });
        }






        // CHECK EXISTING USER

        const existingUser =
        await User.findOne({
            email
        });

        if (existingUser) {

            return res.status(400).json({
                message:
                'User already exists.'
            });
        }






        // HASH PASSWORD

        const salt =
        await bcrypt.genSalt(10);

        const hashedPassword =
        await bcrypt.hash(
            password,
            salt
        );






        // GENERATE OTP

        const otp =
        Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();






        // CREATE USER

        const user =
        new User({

            name,

            email,

            password:
            hashedPassword,

            otp,

            otpExpires:
            Date.now() +
            5 * 60 * 1000,

            isVerified: false
        });






        // SAVE USER

        await user.save();






        // SEND OTP EMAIL

        // await sendEmail(

        //     user.email,

        //     'Verify Your Account',

        //     `Your OTP is: ${otp}`

        // );






        // RESPONSE

        // res.status(201).json({

        //     message:
        //     'OTP sent to your email.',

        //     email:
        //     user.email
        // });

        // TEMPORARY TEST MODE

res.status(201).json({

    success: true,

    message:
    'User created successfully.',

    email:
    user.email,

    otp

});

    } catch (err) {

    console.error(
        'REGISTER ERROR:'
    );

    console.error(err);

    res.status(500).json({

        message:
        err.message

    });
}
});


// ===============================
// VERIFY OTP ROUTE
// ===============================

app.post(
'/api/auth/verify-otp',

async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;





        // FIND USER

        const user =
        await User.findOne({
            email
        });





        if (!user) {

            return res.status(400).json({

                message:
                'User not found.'
            });
        }





        // CHECK OTP

        if (user.otp !== otp) {

            return res.status(400).json({

                message:
                'Invalid OTP.'
            });
        }





        // CHECK OTP EXPIRY

        if (
            user.otpExpires <
            Date.now()
        ) {

            return res.status(400).json({

                message:
                'OTP expired.'
            });
        }





        // VERIFY USER

        user.isVerified = true;

        user.otp = null;

        user.otpExpires = null;

        await user.save();





        // JWT PAYLOAD

        const payload = {

            user: {

                id: user._id,

                name: user.name,

                email: user.email
            }
        };





        // GENERATE TOKEN

        jwt.sign(

            payload,

            process.env.JWT_SECRET,

            {
                expiresIn: '7d'
            },

            (err, token) => {

                if (err) throw err;

                res.json({

                    message:
                    'Email verified successfully!',

                    token,

                    user:
                    payload.user
                });
            }

        );

    } catch (err) {

        console.log(err);

        res.status(500).json({

            message:
            'Server error.'
        });
    }
});



// ===============================
// LOGIN ROUTE
// ===============================

app.post('/api/auth/login', async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;





        if (!email || !password) {

            return res.status(400).json({
                message:
                'Please enter email and password.'
            });
        }






        // FIND USER

        const user =
        await User.findOne({
            email
        });

        if (!user) {

            return res.status(400).json({
                message:
                'Invalid credentials.'
            });
        }

// CHECK IF EMAIL VERIFIED

if (!user.isVerified) {

    return res.status(400).json({

        message:
        'Please verify your email first.'
    });
}




        // PASSWORD CHECK

        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message:
                'Invalid credentials.'
            });
        }






        // PAYLOAD

        const payload = {

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };






        // TOKEN

        jwt.sign(

            payload,

            process.env.JWT_SECRET,

            {
                expiresIn: '7d'
            },

            (err, token) => {

                if (err) throw err;

                res.json({

                    message:
                    'Login successful!',

                    token,

                    user: payload.user
                });
            }

        );

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message:
            'Server error during login.'
        });
    }
});






// ===============================
// IDEA ROUTES
// ===============================

app.use('/api/ideas', ideaRoutes);






// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});