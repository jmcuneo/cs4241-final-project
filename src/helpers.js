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
exports.calculateScore = (item1, item2, ref_arr) => {

    const val = ref_arr.find((element) => element.name === item1).card

    console.log(item2)
    console.log(val)

    if (item2 == val) return 100;
    else return -50;

} 

