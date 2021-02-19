# JavaScript Client SDK Drop in Audio Chat Server

<img src="https://developer.nexmo.com/assets/images/Vonage_Nexmo.svg" height="48px" alt="Nexmo is now known as Vonage" />

This is a JavaScript project that creates a HTTP server for the [Vonage Conversation API](https://developer.nexmo.com/conversation/overview). This project was built to be used with an [accompanying app](https://github.com/nexmo-community/swift-client-sdk-drop-in-audio), learn more about both projects on [our blog](LINKICOMING).

## Welcome to Vonage

If you're new to Vonage, you can [sign up for a Vonage API account](https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=js-express-drop-in-audio) and get some free credit to get you started.

## Prerequisites

+ NPM

+ Node

## Running the project

### Remix on Glitch

You can open the project on [Glitch](glitch.com) and the project will be deployed for you. 

Add your `private.key` file to the root folder. 

Add your Vonage Application ID to the new `.env` file.

[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/js-express-drop-in-audio?CAN_ACCESS_DB=true&APPLICATION_PRIVATE_KEY=./private.key&APPLICATION_ID=APPLICATION_ID)


### Locally

After cloning the project to your machine change into the project directory. 

Install the dependencies with `npm install`.

Copy the .env.example file to a new .env file with `cp .env.example > .env` and add your Vonage Application ID to the new `.env` file.

Add your `private.key` file to the root folder.

Once done, run `node server.js` and the server will be accessible on port 3000. 

## Endpoints

The project serves to 3 endpoints:

+ `/auth` (POST): 

This returns a JWT to log the Client SDK in.

Request Body:
```
{
  "name": "value" // String - username
}
```
Request Reponse:
```
{
  "name": "value", // String - username
  "jwt": "value" // String - JWT for the username
}
```
+ `/rooms` (GET):

This returns a list of open chat rooms.

Request Reponse:
```
[
  {
    "id": "value", // String - ID for the room/conversation
    "display_name": "value" // String - Name for the room/conversation
  },
  {
    "id": "value", // String - ID for the room/conversation
    "display_name": "value" // String - Name for the room/conversation
  }
]
```
+ `/rooms` (POST):

This allows the app to create a new room.

Request Body:
```
{
  "display_name": "value" // String - Name for the room/conversation
}
```
Request Reponse:
```
{
  "id": "value" // String - ID for the room/conversation
}
```


## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us know! You can either:

* Open an issue on this repository
* Tweet at us! We're [@VonageDev on Twitter](https://twitter.com/VonageDev)
* Or [join the Vonage Developer Community Slack](https://developer.nexmo.com/community/slack)

## Further Reading

* Check out the Developer Documentation at <https://developer.nexmo.com>

