
# Interfeud Watson
Remember that time an AI [won Jeopardy][Watson_Jeopardy]? Interfeud Watson was inspired by IBM Watson's run on Jeopardy, but adapted for a game played at [Fullstack Academy][Fullstack_Academy] where teams answer technical interview questions. Go ask him some questions now at [interfeud-watson.mybluemix.net][Interfeud_Watson]!

## Platform
Interfeud Watson is hosted on IBM's Bluemix platform, through which we can connect to any of a number of interesting [Watson Services][Watson_Services]. We're using the [Text-to-Speech][https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/text-to-speech.html] service to give our Watson a voice, the same voice he has on Jeopardy!

For the reverse, speech-to-text, this app also makes use of the Chrome Web Speech API. Although IBM Watson has its own speech-to-text service, I found the [Chrome Web Speech API][Chrome_Web_Speech_API] to work better.

## Sources
To build this project, I needed to learn to use the Watson Text-to-Speech service and the Web Speech API. I used starter applications to get a feel for how they worked and to get things off the ground. I recommend these two:
* [IBM Text-to-Speech Node.js Starter Application][Text-to-Speech-Starter]
* [Chrome Web Speech API demo][Chrome-Web-Speech-Starter]

## Screenshot
![Interfeud Watson](https://raw.githubusercontent.com/kriztynna/interfeud-watson/master/public/images/InterfeudWatsonScreenshot.png)

[Chrome-Web-Speech-Starter]: https://github.com/GoogleChrome/webplatform-samples/tree/master/webspeechdemo
[Chrome_Web_Speech_API]: https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API?hl=en
[Text-to-Speech-Starter]: https://github.com/watson-developer-cloud/text-to-speech-nodejs
[Text-to-Speech]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/text-to-speech.html
[Watson_Services]: https://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud
[Interfeud_Watson]: https://interfeud-watson.mybluemix.net
[Fullstack_Academy]: http://www.fullstackacademy.com
[Watson_Jeopardy]: https://youtu.be/P18EdAKuC1U?t=1m23s
[service_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/text-to-speech.html
[cloud_foundry]: https://github.com/cloudfoundry/cli
[sign_up]: https://apps.admin.ibmcloud.com/manage/trial/bluemix.html?cm_mmc=WatsonDeveloperCloud-_-LandingSiteGetStarted-_-x-_-CreateAnAccountOnBluemixCLI
