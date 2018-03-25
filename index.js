'use strict';

const Alexa = require('alexa-sdk');
const https = require('https')

const APP_ID = 'amzn1.ask.skill.3113d2d7-c3c4-426f-8939-c653695330e7';

const handlers = {
	'LaunchRequest': function () {
		this.emit('GetMarketCapIntent');
	},
	'GetMarketCapIntent': function () {
		https.get('https://api.coinmarketcap.com/v1/global/?convert=EUR', (response) => {
			
			let res = ''
			response.on('data', (data) => {
				res += data.toString()
			})
			
			response.on('end', () => {
				const data = JSON.parse(res)
				const mcap = String(data.total_market_cap_eur).slice(0, -9) + '000000000'
				const [percent, decimals] = String(data.bitcoin_percentage_of_market_cap).split('.')
				const btc = `${percent} komma ${decimals.split('').join(' ')}`
				const answer = `Die aktuelle Marktkapitalisierung im Kryptomarkt beträgt ungefähr ${mcap} Euro mit einem Bitcoin Anteil von ${btc} Prozent`
				this.emit(':tell', answer)
			})
		})
	},
	'AMAZON.HelpIntent': function () {
		const speechOutput = 'Du kannst sagen: "Alexa öffne Kryptomarkt". Wie kann ich dir helfen?';
		const reprompt = 'Wie kann ich dir helfen?';
		this.emit(':ask', speechOutput, reprompt);
	},
	'AMAZON.CancelIntent': function () {
		this.emit(':tell', 'Auf Wiedersehen!');
	},
	'AMAZON.StopIntent': function () {
		this.emit(':tell', 'Auf Wiedersehen!');
	},
	'SessionEndedRequest': function () {
		this.emit(':tell', 'Auf Wiedersehen!');
	},
	'Unhandled': function () {
		this.emit(':tell', 'Es tut mir Leid! Das habe ich nicht verstanden. Du kannst sagen: "Alexa öffne Kryptomarkt". Versuche es erneut.');
	}
};

exports.handler = function (event, context) {
	const alexa = Alexa.handler(event, context);
	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};
