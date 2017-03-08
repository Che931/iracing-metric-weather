// ==UserScript==
// @name            iRacing Metric Weather
// @version         0.0.1
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

(() => {
    'use strict';

    function ConvertWeather() {
        var weather_conditions = document.getElementsByClassName("event_datawidth15 Conditions-TD")[0];
        var stringArray = weather_conditions.innerText.split(',');

        var dynamic = /\D{7}/.exec(stringArray[0]);
        var isDynamic = dynamic !== null;

        var fahTemp = /\d{2}/.exec(stringArray[0]);
        var celsius = Math.trunc(FahrenheitToCelsius(parseInt(fahTemp)));

        var windDir = /\s[NSEW]+/.exec(stringArray[1].trim());
        var mph =  /\d+/.exec(stringArray[1]);
        var kph = Math.trunc(MphToKph(parseInt(mph)));

        var p = document.createElement('p');
        var text = ''+ celsius +'ºC, Wind ' + windDir + ' @ ' + kph + ' KPH,';

        if (isDynamic) {
            text = "<b>Dynamic: </b> " + text;
        }

        p.innerHTML = text + "<br>" + stringArray[2] + "<br>" + stringArray[3];

        weather_conditions.innerText = "";
        weather_conditions.append(p);
    }

    function FahrenheitToCelsius(value)
    {
        return (value - 32) / 1.8;
    }

    function MphToKph(value)
    {
        return value * 1.60934;
    }

    ConvertWeather();

})();
