const { Octokit, App } = require("octokit");
require("dotenv").config();
let token;
exports.fetchEmailsByAccessToken = async (code) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code,
    redirect_uri: process.env.REDIRECT,
  });
  await fetch("https://github.com/login/oauth/access_token?" + params,
  {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  }
    
  ).then(async (result) => { token = await result.json()} );
  return await fetchUserEmail(await token.access_token);
};
fetchUserEmail = async (accessToken) => {
  let emails;
  const octokit = new Octokit({
    auth: accessToken,
  });
  console.log("mmmmm");

  await octokit
    .request("GET /user/emails", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .then(async (resp) => {emails = await resp.data});
  return (await emails);
};
