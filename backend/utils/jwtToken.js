//create and send token and save in the cookie.
const sendToken = (userObj, statusCode, res) => {
    //create Jwt token
    const JwtToken = userObj.getJwtToken();
    const user = { ...userObj.toObject(), password: undefined};
    //options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }

    res.status(statusCode).cookie('JwtToken', JwtToken, options).json({
        success: true,
        JwtToken,
        user
    });
}

module.exports = sendToken;