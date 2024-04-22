exports.addUserMessageHelper = async (existsUsername, existsEmail, validEmail) => {
    let ret = "";
    if(existsUsername) ret += "username taken, please pick a new username, ";
    if(existsEmail) ret += "user with the same email exists, please try a different email, ";
    if(!validEmail) ret += "the email address given was not a valid email address, please try again ";
    return ret;
};