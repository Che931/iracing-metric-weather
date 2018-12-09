// ==UserScript==
// @name            iRacing Metric Weather
// @version         0.0.4
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

    function ConvertWeather()
    {
        let weather_conditions = document.getElementsByClassName("event_datawidth15 Conditions-TD")[0];
        let stringArray = weather_conditions.innerText.split(',');
        let index = stringArray.length === 5? 1 : 0;

        let elems = /(Generated)+.+:/.exec(weather_conditions.innerText);
        let sky_config = null;

        if (elems !== null)
        {
            sky_config = elems[0];
        }

        let celsius = extract_temperature_info(stringArray[index]);
        let wind = extract_wind_info(stringArray[index+1]);

        let p = document.createElement('p');
        let text = ' '+ celsius +'ºC, Wind ' + wind[0] + ' @ ' + wind[1] + ' KPH,';

        if(sky_config !== null)
        {
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

    function extract_temperature_info(text)
    /**
     * Extracts temperature info from session's string.
     * @param text String that contains temp info.
     * @returns Temperature(Celsius).
     */
    {
        let temp = /\d{2}/.exec(text);

        if (/F/.test(text))
        {
            temp = FahrenheitToCelsius(parseInt(temp));
        }

        return temp;
    }

    function extract_wind_info(text)
    /**
     * Extracts wind info from session's string.
     * @param text String that contains wind info
     * @returns {Array} First position is wind dir (NSEW) and second wind speed(KPH).
     */
    {
        let windDir = /\s[NSEW]+/.exec(text.trim());
        let windSpeed = /\d+/.exec(text);

        if (!/MPH/.test(text))
        {
            windSpeed = MphToKph(parseInt(windSpeed));
        }

        return [windDir,windSpeed]
    }

    ConvertWeather()
})();