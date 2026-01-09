 module.exports = fn => { // Wrap asynck
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};