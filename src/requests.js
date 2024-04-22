exports.fetchUserEmail = async (accessToken) => {
    const options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${accessToken}`
        }};
    await fetch('https://api.github.com/user/emails', options).then((result) => console.log(result))
}