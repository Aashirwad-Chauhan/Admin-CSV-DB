export const personalizeEmail = (body, user) => {
    let personalizedBody = body.replace(/\[(\w+)\]/g, (match, propName) => {
        return user[propName] || match; 
    });

    //unsubscribe link
    personalizedBody += `<br><br><a href="http://localhost:3000/api/v1/user/info/${user._id}/unsubscribe">Unsubscribe</a>`;

    return personalizedBody;
};