const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {

        const token = req.header('Authorization');



        if (!token) {

            return res.status(401).json({

                message: 'Acceso denegado'

            });

        }



        const verified = jwt.verify(

            token.replace('Bearer ', ''),

            'SECRET_KEY'

        );



        req.user = verified;



        next();

    }

    catch (error) {

        res.status(401).json({

            message: 'Token inválido'

        });

    }

};