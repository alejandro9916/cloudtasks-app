const User = require('../models/User');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');



// REGISTER

exports.register = async (req, res) => {

    try {

        const { username, email, password } = req.body;



        const existingUser = await User.findOne({

            $or: [

                { email },

                { username }

            ]

        });



        if (existingUser) {

            return res.status(400).json({

                message: 'Usuario ya existe'

            });

        }



        const hashedPassword = await bcrypt.hash(password, 10);



        const user = new User({

            username,

            email,

            password: hashedPassword

        });



        await user.save();



        res.status(201).json({

            message: 'Usuario registrado correctamente'

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// LOGIN

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;



        const user = await User.findOne({ email });



        if (!user) {

            return res.status(400).json({

                message: 'Usuario no encontrado'

            });

        }



        const validPassword = await bcrypt.compare(

            password,

            user.password

        );



        if (!validPassword) {

            return res.status(400).json({

                message: 'Contraseña incorrecta'

            });

        }



        const token = jwt.sign(

            {

                id: user._id

            },

            'SECRET_KEY',

            {

                expiresIn: '1d'

            }

        );



        res.json({

            token,

            user: {

                id: user._id,

                username: user.username,

                email: user.email

            }

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};