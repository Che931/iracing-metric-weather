// ==UserScript==
// @name            iRacing Metric Weather
// @version         0.0.3
// @description     This script converts iracing event result weather from imperial to metric units (wind speed and temperature)
// @author          Francisco J Romero
// @licence         MIT
// @namespace       https://github.com/Che931
// @match           *://members.iracing.com/membersite/member/EventResult.*
// @updateURL       https://raw.githubusercontent.com/Che931/iracing-metric-weather/master/iracing-metric-weather.user.js
// @downloadURL     https://raw.githubusercontent.com/Che931/iracing-metric-weather/master/iracing-metric-weather.user.js
// @run-at          document-end
// @grant           none
// ==/UserScript==

(function() {
    'use strict';

    function ConvertWeather() {
        let weather_conditions = document.getElementsByClassName("event_datawidth15 Conditions-TD")[0];

        if (!/MPH/.test(weather_conditions.innerText)) { //Some hosted results contain metric units.
            console.log("Metric units detected");
            return;
        }

        let sky_config = null;
        let elems = /(Generated)+.+:/.exec(weather_conditions.innerText);

        if (elems !== null) {

            sky_config = elems[0];
        }

        let stringArray = weather_conditions.innerText.split(',');
        let index = stringArray.length === 5? 1 : 0;

        let fahTemp = /\d{2}/.exec(stringArray[index]);
        let celsius = FahrenheitToCelsius(parseInt(fahTemp));

        let windDir = /\s[NSEW]+/.exec(stringArray[index+1].trim());
        let mph =  /\d+/.exec(stringArray[index+1]);
        let kph = MphToKph(parseInt(mph));

        let p = document.createElement('p');
        let text = ' '+ celsius +'ºC, Wind ' + windDir + ' @ ' + kph + ' KPH,';

        if(sky_config !== null) {
            text = "<b>" + sky_config + "</b>" + text
        }

        p.innerHTML = text + "<br>" + stringArray[index+2] + "<br>" + stringArray[index+3];
        weather_conditions.innerText = "";
        weather_conditions.append(p);
    }

    function FahrenheitToCelsius(value)
    {
        return Math.trunc((value - 32) / 1.8);
    }

    function MphToKph(value)
    {
        return Math.trunc(value * 1.60934);
    }

    ConvertWeather();

})();