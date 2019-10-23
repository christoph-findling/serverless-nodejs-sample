const util = require('./util');
const catfact = require('./catfact');
const aws = require('aws-sdk');
const ses = new aws.SES();
const myEmail = process.env.EMAIL;

function generateEmailParams(params, apiData) {
    const email = params.email;
    const name = params.name;
    console.log(params);
    if (!(email && name)) {
        throw new Error(
            "Missing parameters! Make sure to add parameters 'email', 'name'."
        );
    }

    return {
        Source: myEmail,
        Destination: { ToAddresses: [myEmail] },
        ReplyToAddresses: [email],
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: `Message sent from email ${email} by ${name} \nRandom cat fact: ${apiData}`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `You received a random cat fact from ${name}!`
            }
        }
    };
}

module.exports.send = async event => {
    try {
        const emailParams = generateEmailParams(event.queryStringParameters, catfact.fetchCatFact());
        const data = await ses.sendEmail(emailParams).promise();
        console.log('sent email', data);
        return util.generateResponse(200, `Email has been sent. Check the supplied email adress from the secrets.json.`);
    } catch (err) {
        console.error(err);
        return util.generateResponse(500, err.message);
    }
};