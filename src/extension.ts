'use strict';

import { ExtensionContext, StatusBarAlignment, window, commands, workspace, ConfigurationTarget } from 'vscode';
import * as request from 'request-promise';

const ICONS = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '⛅',
  '02n': '⛅',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '☔️',
  '09n': '☔️',
  '10d': '☔️',
  '10n': '☔️',
  '11d': '⚡️',
  '11n': '⚡️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫',
  '50n': '🌫'
};

enum WeatherType {
  'Temperature',
  'Humidity',
  'Wind',
  'Location'
}

interface WeatherInfo {
  weather: [
    {
      description: string,
      icon: string
    }
  ],
  main: {
    temp: number,
    humidity: number
  },
  wind: {
    speed: number,
    deg: number
  }
  name: string,
  sys: {
    country: string
  }
}

let weatherType = WeatherType.Temperature;
let weatherInfo:WeatherInfo|null = null;
let location = workspace.getConfiguration('InstantWeather').get<string>('location');
let appKey = workspace.getConfiguration('InstantWeather').get<string>('key');

const statusBar = window.createStatusBarItem(StatusBarAlignment.Right, -10);

export function activate(context: ExtensionContext) {
  statusBar.command = 'instatntweather.switchWeatherType';
  context.subscriptions.push(statusBar);

  context.subscriptions.push(commands.registerCommand('instatntweather.switchWeatherType', () => {
    switchWeatherType()
  }));

  context.subscriptions.push(commands.registerCommand('instatntweather.updateConfiguration', () => {
    updateConfiguration()
  }));

  if (!location || !appKey) {
    statusBar.text = '🌈 Set location and API Key';
    statusBar.tooltip = 'Instant Weather';
    statusBar.show();
  }

  updateWeatherInfo();
  setInterval(updateWeatherInfo, 60 * 1000);
}

function getDirection(deg: number) {
  const index = Math.floor(((deg + 22.5) % 360) / 45);
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][index];
}

function switchWeatherType() {
  if (!location || !appKey) {
    updateConfiguration();
    return;
  }

  if (!weatherInfo) {
    return;
  }

  if (weatherType + 1 > 3) {
    weatherType = WeatherType.Temperature;
  } else {
    weatherType++;
  }

  updateStatus();
}

function updateLocation(newLocation: string) {
  location = newLocation;
  workspace.getConfiguration('InstantWeather').update('location', newLocation, ConfigurationTarget.Global);
}

function updateAppKey(newKey) {
  appKey = newKey;
  workspace.getConfiguration('InstantWeather').update('key', newKey, ConfigurationTarget.Global);
}

async function updateConfiguration() {
  const _location = await window.showInputBox({
    value: location,
    ignoreFocusOut: true,
    prompt: 'City. i.e. Shanghai,CN'
  });
  updateLocation(_location);
  const _appKey = await window.showInputBox({
    value: appKey,
    ignoreFocusOut: true,
    prompt: 'API Key for OpenWeatherMap.org'
  });
  updateAppKey(_appKey);

  if (!location || !appKey) {
    statusBar.text = '🌈 Set location and API Key';
    statusBar.tooltip = 'Instant Weather';
    statusBar.show();
  } else {
    updateWeatherInfo();
  }
}

async function updateWeatherInfo() {
  if (!location || !appKey) {
    return;
  }
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${appKey}`;

  try {
    const info = await request({
      uri: apiUrl,
      json: true
    }) as WeatherInfo;
    
    if (info) {
      weatherInfo = info;
      updateStatus();
    } else {
      weatherInfo = null;
      statusBar.text = '🌏 Weather Unavailable';
      statusBar.tooltip = 'Instant Weather';
      statusBar.show();
    }
  } catch(err) {
    weatherInfo = null;
    statusBar.text = '🌏 Weather Unavailable';
    statusBar.tooltip = 'Instant Weather';
    statusBar.show();
  }
}

function updateStatus(): void {
  let text = '';

  switch(weatherType) {
    case WeatherType.Temperature: {
      text = Math.round(weatherInfo.main.temp) + '℃/' + Math.round(weatherInfo.main.temp * 1.8 + 32) + '℉';
      break;
    }
    case WeatherType.Humidity: {
      text = weatherInfo.main.humidity + '%';
      break;
    }
    case WeatherType.Wind: {
      text = weatherInfo.wind.speed + 'm/s ' + getDirection(weatherInfo.wind.deg);
      break;
    }
    case WeatherType.Location: {
      text = weatherInfo.name + ', ' + weatherInfo.sys.country;
      break;
    }
    default: {
      break;
    }
  }

  text = ICONS[weatherInfo.weather[0].icon] + ' ' + text;
  statusBar.text = text;
  statusBar.tooltip = weatherInfo.weather[0].description;
  statusBar.show();
}
