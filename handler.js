const aws = require('aws-sdk');
var https = require('https');
const ses = new aws.SES();
const myEmail = process.env.EMAIL;
const myDomain = process.env.DOMAIN;

async function getData(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, resp => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(JSON.parse(data).text);
        });
      })
      .on('error', err => {
        reject(err.message);
      });
  });
}

function generateResponse(code, payload) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(payload)
  };
}

function generateError(code, err) {
  console.log(err);
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': myDomain,
      'Access-Control-Allow-Headers': 'x-requested-with',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(err.message)
  };
}

function generateEmailParams(body, apiData) {
  const { email, name, content } = JSON.parse(body);
  console.log(email, name, content);
  if (!(email && name && content)) {
    throw new Error(
      "Missing parameters! Make sure to add parameters 'email', 'name', 'content'."
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
    const res = await getData('https://cat-fact.herokuapp.com/facts/random');
    const emailParams = generateEmailParams(event.body, res);
    const data = await ses.sendEmail(emailParams).promise();
    return generateResponse(200, data);
  } catch (err) {
    return generateError(500, err);
  }
};
