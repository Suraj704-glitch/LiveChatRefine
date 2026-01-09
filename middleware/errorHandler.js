module.exports = (err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    
    // Log for the developer
    console.error(`[ERROR] ${err.message}`);

    res.status(statusCode).render("error", { err }); 
    // Or res.json({ error: err.message }) for API
};