# Microsoft Teams Clone

Greetings to the readers! This is an interactive videoconferencing web app that is clone of the application named "MICROSOFT TEAMS". It is used to deliver a platform to the user in which one can easily communicate, share content, hold meetings/classes, chat with groups all around. 

`This project is built under Microsoft Engage Mentorship Program-2021 by Aditi Agrawal.`
## Demo link of the project
https://youtu.be/vtVxZeEzRT8

## Built Using: 
 1) EJS
 2) CSS
 3) Bootstrap
 4) JavaScript
 5) jQuery
 6) Node.js
 7) Express.js
 8) WebRTC
 9) Socket.IO
 10) PeerJs
 11) uuid
 12) Typed.js
 13) Particle.js
 14) Tilt.jquery.js
 

## Features of the Video Conferencing Application:
  1) Create a new Meeting feature on Home Page
  2) Join the meeting using meeting link on Home Page
  3) Video Call One-to-one
  2) Invite link is generated and can be shared through email
  3) Group Video-Call (Connection upto 6 users is possible, but it works perfectly for upto 4 users. Hangs a little when 6 users join)
  4) User can Mute/Unmute himself (Audio Controls)
  5) User can Mute/Unmute other users on call during Group as well as One-on-One Call
  6) User can turn on/off his own Video.(Video Controls)
  7) Chat Feature during both One-on-One and Group Call
  8) ScreenShare allowed during One-on-One Call
  9) ScreenShare during Group Call is only visible to one of the Users (To be Enhanced)
  10) Picture-in-Picture mode allowed
  11) User can switch anyone's video (including himself) to Full Screen mode.
  12) User can Play/Pause anyone's video (Loop Controls)
  13) User can Leave the Meeting
  14) User can record their video
  15) User can record the whole Screen
  16) Record the Meeting Feature
  17) User Can Save the Recording Locally
  18) Great UI/UX
  19) Moving the Record dialogbox is possible

## Screenshots 📸

### Home Page
![Home Page](https://user-images.githubusercontent.com/68473349/125276321-b8e54a00-e32d-11eb-9ca7-cc2a5a3be29c.png)

### During the Video call
![on Call](https://user-images.githubusercontent.com/68473349/125280440-ac172500-e332-11eb-9be2-9e30b0869734.png)

### Chat Box
![Chat](https://user-images.githubusercontent.com/68473349/125281102-732b8000-e333-11eb-9eef-52505b22d840.png)

### Screenshare
![ScreenShare](https://user-images.githubusercontent.com/68473349/125281369-c4d40a80-e333-11eb-8671-52501b976f34.png)
### Floating Record Block Button
![Float Record](https://user-images.githubusercontent.com/68473349/125281726-3318cd00-e334-11eb-84cc-3f56284c1220.png)

## Agile Methodology Implementation

| Week          | Bugs and Deliverables |          
| ------------- | ------------- | 
| 1     | Designed, planned and researched for the technologies, APIs about the solution | 
| 2-3    | Built the UI, minimum video-calling functionality along with audio/video controls,recording, screenshare etc. |  
| 4 | Improved the UI as suggested by mentors, peers and added Chat feature. Got the feedback to work on documentations and improving code quality. |  

### Prerequisites

You have to install [Node.js](https://nodejs.org/en/) in your machine.

## How to run this Project on Local System ?

* Download the Zip. 
* Extract the folder
* Open the above folder on any editor you prefer to use. Visual Studio Code was used for this project.
* In script.js file, change the port of peer variable. Replace it from '443' to '3030'
* Open the terminal and check the directory and path.
* Install essential dependencies of node by running the command "npm i"
* Run command "node server.js"
* Open Google Chrome (preferred) and go to the link "localhost:3030/"
* Copy this link and open it in a new tab.
* Wohoo! You can see your peer. You managed to run the webapp on your local system.

## Platform Used to deploy the WebApp:
`Heroku`


## Link and Steps to run the deployed App :
Link: https://teams-msclone.herokuapp.com/

<br />Steps:
* `Open` the above link in your browser.
* `Click` on "Create New Meeting". Unique room id will be generated each time when you open the above link.
* `Enter` your name.
* `Give` permission to your camera and microphone when using this app for the first time.
* `Click` on "Participants". Copy the link just prompted on screen.
* `Share` this unique link with your friends with whom you want to talk. They can open the link in browser.
* Or they may paste the link in "Enter the meeting link here" input and then click on "Join Meeting"

