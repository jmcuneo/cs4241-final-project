const db = require("./db");

exports.getUserWithGhEmail = async (emails) => {
  let found = false,
    i = 0,
    ret;
  while (!found && i < (emails.length)) {
    const curEmail = emails[i].email;
    const user = await db.getUserByEmail(curEmail)
    console.log(curEmail);
    if(user){
      ret = user;
      found = true;
    } 
    console.log();
    i += 1;
  }
  return ret;
};
