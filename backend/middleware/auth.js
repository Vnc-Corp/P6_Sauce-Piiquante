// Authorisation token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId;

        // sécurité pour la supprétion d'une sauce qui n'est pas celle du client
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !'
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'requête non authentifiée !' });
    }
}