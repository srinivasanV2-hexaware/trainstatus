const express = require('express');
var requestAPI = require('request');
var Promise = require('promise');
var rp = require('request-promise');

const app = express();
app.use(express.json());
const {
    WebhookClient
} = require('dialogflow-fulfillment');
const {
    Card,
    Suggestion
} = require('dialogflow-fulfillment');
app.get('/', (req, res) => res.send('success'))
app.post('/', (req, res) => processWebhook(req, res));
app.listen(process.env.PORT || 3000, () => console.log('App listening on port 3000!'));
function callApis() {

}
var processWebhook = function (request, response) {
    const agent = new WebhookClient({
        request,
        response
    });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    async function pnrStatus(agent) {
        var pnr = request.body.queryResult.parameters.pnr;

        var requestpromise = require("request");
        agent.add(`Here is the status for your pnr no ${pnr}`);

        var options = {
            method: 'GET',
            url: 'http://testapi.confirmtkt.com/api/pnr/status/' + pnr,
            headers: {
                'postman-token': '9a7f59ac-e271-3492-384e-950978bbef83',
                'cache-control': 'no-cache'
            }
        };

        await requestpromise(options, (error, body, response) => {

            if (error) throw new Error(error);

            if (body.hasOwnProperty("Error") && body.Error) {
                agent.add(`${body.Error}`);
                return false;
            }
            console.log("-----------------------Srini------------------")
            let conv = agent.conv();
            conv.ask(conv.buildRichResponse()
                // Create a basic card and add it to the rich response

                .addSimpleResponse('Do you need anything else?')
                .addBasicCard(app1.buildBasicCard(`**Departure:** \n\n\n\n
                s\n 
                *Est:* ${estimatedd.substring(0, estimatedd.length - 4)} \n\n 
                s \n\n**Arrival:** \n\n s \n\n
                s\n 
                *Est:* s \n\n s`)
                    .setTitle(`Flight Status  => `)
                    .setImage(`https://www.dropbox.com/s/g7avz78npsqcm2n/flight647x404_101116021054.jpg?raw=1', 'Flight Status`)
                )
            );
            agent.add(conv)
            // agent.add(new Card({
            //     title: "This is the card Title",
            //     imageUrl: "https://www.dropbox.com/s/5t6nwhwd338p8jb/download3.png?raw=1",
            //     text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
            // }))
            // agent.add(new Suggestion('Quick Reply'))
            // agent.add(new Suggestion('Suggestion'))

        })

    }
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('pnr status', pnrStatus)
    intentMap.set('Default Fallback Intent', fallback);
    // intentMap.set('your intent name here', yourFunctionHandler);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
}