// ==UserScript==
// @name            iRacing Metric Weather
// @version         1.0.0
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

(function()
{
    'use strict';

    function Convert_Weather()
    {
        let weather_conditions = document.getElementsByClassName("event_datawidth15 Conditions-TD")[0];
        let stringArray = weather_conditions.innerHTML.split(',');

        for (let index = 0; index < stringArray.length; index++)
        {
            let text = stringArray[index];

            if (/°F/.test(text))
            {
                let temp = /\d{2}/.exec(text);
                let celsius = fahrenheit_to_celsius(parseInt(temp));

                text = text.replace(/°F/,"C").replace(/\d{2}/, celsius);
                stringArray[index] = text;
            }

            else if (/MPH/.test(text))
            {
                let windSpeed = /\d+/.exec(text);
                let windMetric = mph_to_kph(parseInt(windSpeed));

                text = text.replace(/\d+/, windMetric).replace(/MPH/, " KPH");
                stringArray[index] = text;
            }
        }

        weather_conditions.innerHTML = stringArray.join(',');
    }

    function fahrenheit_to_celsius(value)
    {
        return Math.trunc((value - 32) / 1.8);
    }

    function mph_to_kph(value)
    {
        return Math.trunc(value * 1.60934);
    }

    Convert_Weather()
})();