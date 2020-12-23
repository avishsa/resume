/**
 * 
 * @param {a function} func 
 * returns the function wrapped with catch statement to execute next function in case of an exception
 */
module.exports = func => {
    return (req, res, next) => {
        console.log("try catch",next);
        func(req, res, next).catch(next)
    }
}