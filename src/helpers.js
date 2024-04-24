exports.addUserMessageHelper = async (existsUsername, existsEmail, validEmail) => {
    let ret = "";
    if(existsUsername) ret += "username taken, please pick a new username, ";
    if(existsEmail) ret += "user with the same email exists, please try a different email, ";
    if(!validEmail) ret += "the email address given was not a valid email address, please try again ";
    return ret;
};

/*
    itemN {
  "index": #
  "person": "Christine Jorgensen",
  "img": "https://upload.wikimedia.org/wikipedia/commons/8/87/Christine_Jorgensen_1954.jpg",
  "info":"One of the first publicly transgender women, she was also one of the first people to have gender reassignment surgery.",
  "alt": "pretty woman :3",
  "eventcard": "transgenderism"
}

itemN {
  "index": #
  "event": "transgenderism",
  "img": "https://upload.wikimedia.org/wikipedia/commons/8/87/Christine_Jorgensen_1954.jpg",
  "info":"One of the first publicly transgender women, she was also one of the first people to have gender reassignment surgery.",
  "alt": "pretty woman :3",
  "personcard": "Christine Jorgensen"
}

    ref_arr = [itemN's]
*/


//returns a score to be sent back to the client
exports.calculateScore = (item1, item2) => {
    let val1 = item1.eventcard;
    let val2 = item2.event;

    if (val1 === val2) {
        return 100
    } else return 0

} 

