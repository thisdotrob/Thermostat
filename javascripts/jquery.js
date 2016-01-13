$(document).ready(function(){
  var thermostat = new Thermostat();

  var _getTempPercent = function(){
    var minTemp = thermostat._MINIMUM_TEMPERATURE;
    var maxTemp = thermostat._MAXIMUM_TEMPERATURE_PSM_OFF;
    var currentTemp = thermostat.temperature();
    return (currentTemp - minTemp)/(maxTemp - minTemp);
  };

  var showExtTemperature = function(resp){
    var tempInC = _convertKtoC(resp.main.temp);
    $('#outside-temp').text(tempInC);
  };

  var updateLocalWeatherDisplay = function(location){
    var url = "http://api.openweathermap.org/data/2.5/weather";
    var city = "q=" + location;
    var appID = "appid=0fe786c5ab2f53ba371796181af553b4";
    var params = city + "&" + appID;
    $.getJSON(url, params, showExtTemperature);
  };

  var _convertKtoC = function (kelvins){
    return Math.round(kelvins - 273.15);
  };

  var updateDisplay = function(){
    $('#thermostat-temp').text(thermostat.temperature());
    _updatePSMStatus();
    _updateBackgroundColor();
  };

  var _getRGB = function(percent){
    var green = Math.round(255 - (percent * 255));
    var red = Math.round(percent < 0.5 ? percent * 2 * 255 : 255);
    var blue = 0;
    var opacity = 0.5;
    var string = 'rgba(' + red + ',' + green + ',' + blue + ',' + opacity + ')';
    return string;
  };

  var _updateBackgroundColor = function(){
    percent = _getTempPercent();
    console.log(percent);
    console.log(_getRGB(percent));
    $('.background-overlay').css('background-color',_getRGB(percent));
  };

  var _updatePSMStatus = function(){
    var statusStr = thermostat.isPowerSavingOn() ? "On" : "Off";
    $('#psm-status').text(statusStr);
  };

  updateDisplay();
  updateLocalWeatherDisplay($('#location-input').val());

  $('#location-form').submit(function(event){
    var location = $('#location-input').val();
    updateLocalWeatherDisplay(location);
    event.preventDefault();
  });
  $('#reset-temp-button').on('click',function(){
    thermostat.resetButton();
    updateDisplay();
  });
  $('#increase-temp-button').on('click',function(){
    thermostat.increaseTemperature();
    updateDisplay();
  });
  $('#decrease-temp-button').on('click',function(){
    thermostat.decreaseTemperature();
    updateDisplay();
  });
  $('#toggle-psm-button').on('click',function(){
    thermostat.powerSavingButton();
    updateDisplay();
  });

});
