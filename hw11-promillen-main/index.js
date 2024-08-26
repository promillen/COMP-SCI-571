
// You MUST have a file called "token.secret" in the same directory as this file!
// This should be the secret token found in https://dashboard.ngrok.com/
// Make sure it is on a single line with no spaces!
// It will NOT be committed.

// TO START
//   1. Open a terminal and run 'npm start'
//   2. Open another terminal and run 'npm run tunnel'
//   3. Copy/paste the ngrok HTTPS url into the DialogFlow fulfillment.
//
// Your changes to this file will be hot-reloaded!

import fetch from 'node-fetch';
import fs from 'fs';
import ngrok from 'ngrok';
import morgan from 'morgan';
import express from 'express';
import CS571 from '@cs571/mobile-client';

// Read and register with secret ngrok token.
ngrok.authtoken(fs.readFileSync("token.secret").toString().trim());

// Start express on port 53705
const app = express();
const port = 53705;

// Accept JSON bodies and begin logging.
app.use(express.json());
app.use(morgan(':date ":method :url" :status - :response-time ms'));

// "Hello World" endpoint.
// You should be able to visit this in your browser
// at localhost:53705 or via the ngrok URL.
app.get('/', (req, res) => {
  res.status(200).send(JSON.stringify({
    msg: 'Express Server Works!'
  }))
})

app.get('/hello', (req, res) => {
  res.status(200).send(JSON.stringify({
    msg: 'Hello World!'
  }))
})

// Dialogflow will POST a JSON body to /.
// We use an intent map to map the incoming intent to
// its appropriate async functions below.
// You can examine the request body via `req.body`
// See https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook#webhook_request
app.post('/', (req, res) => {
  const intent = req.body.queryResult.intent.displayName;

  // A map of intent names to callback functions.
  const intentMap = {
    "GetWhenPosted": getRecentPostDateTime,
    "GetChatroomMessages": getChatroomPosts
  }

  // // A map of intent names to callback functions.
  // const intentMap = {
  //   "HelloWorld": doHelloWorld
  // }

  if (intent in intentMap) {
    // Call the appropriate callback function
    intentMap[intent](req, res);
  } else {
    // Uh oh! We don't know what to do with this intent.
    // There is likely something wrong with your code.
    // Double-check your names.
    console.error(`Could not find ${intent} in intent map!`)
    res.status(404).send(JSON.stringify({ msg: "Not found!" }));
  }
})

// Open for business!
app.listen(port, () => {
  console.log(`DialogFlow Handler listening on port ${port}. Use 'npm run tunnel' to expose this.`)
})

// Your turn!
// Each of the async functions below maps to an intent from DialogFlow
// Complete the intent by fetching data from the API and
// returning an appropriate response to DialogFlow.
// See https://cloud.google.com/dialogflow/es/docs/fulfillment-webhook#webhook_response
// Use `res` to send your response; don't return!

async function doHelloWorld(req, res) {
  res.status(200).send({
    fulfillmentMessages: [
      {
        text: {
          text: [
            'You will see this if you trigger an intent named HelloWorld'
          ]
        }
      }
    ]
  })
}

async function getRecentPostDateTime(req, res) {
  const chatroom = req.body.queryResult.parameters.chatroom;
  try {
    const response = await fetch(`https://cs571.org/api/f23/hw11/messages?chatroom=${chatroom}&page=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3'
      }
    });
    //console.log("chatroom: " + chatroom)
    const data = await response.json();
    //console.log(data)
    const recentMessage = data.messages[0]; // Assuming the first message is the most recent
    console.log(recentMessage)
    const postDate = new Date(recentMessage.created);
    const dateString = postDate.toLocaleDateString();
    const timeString = postDate.toLocaleTimeString();

    res.status(200).send({
      fulfillmentMessages: [
        {
          text: {
            text: [
              `The last message in ${chatroom} was posted on ${dateString} at ${timeString}!`
            ]
          }
        }
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ fulfillmentText: "An error occurred while fetching the post data." });
  }
}

async function getChatroomPosts(req, res) {
  const chatroom = req.body.queryResult.parameters.chatroom;
  let numberOfPosts = req.body.queryResult.parameters.numMessages || 1;
  numberOfPosts = Math.min(numberOfPosts, 5); // Limit to 5 posts

  console.log(`Fetching ${numberOfPosts} posts from ${chatroom}...`);

  try {
    const response = await fetch(`https://cs571.org/api/f23/hw11/messages?chatroom=${encodeURIComponent(chatroom)}&page=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CS571-ID': 'bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3'
      }
    });
    const data = await response.json();
    const posts = data.messages.slice(0, numberOfPosts);

    const fulfillmentMessages = posts.map(post => ({
      card: {
        title: post.title,
        subtitle: `Author: ${post.poster}`,
        buttons: [
          {
            text: "Read More",
            postback: `https://www.cs571.org/f23/badgerchat/chatrooms/${encodeURIComponent(chatroom)}`
          }
        ]
      }
    }));

    res.status(200).send({ fulfillmentMessages });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ fulfillmentText: "An error occurred while fetching the posts." });
  }
}