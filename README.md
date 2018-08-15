# Instant Weather for Visual Studio Code

Shows instant weather information for specific city in Visual Studio Code status bar.

<img width="620" src="https://raw.githubusercontent.com/Sneezry/vscode-instant-weather/master/screenshot.png" />

## Installation

Install from [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sneezry.vscode-instant-weather)

## Build from Source Code

```bash
git clone https://github.com/Sneezry/vscode-instant-weather.git
cd vscode-instant-weather
npm i
npm i vsce -g
vsce package .
```

## Prerequisites

Instant Weather gets weather information from OpenWeatherMap. An API key for OpenWeatherMap is required. OpenWeatherMap provides free API key, and you can get it very easy from [openweathermap.org](https://openweathermap.org/).

> Activation of an API key for Free and Startup accounts takes 10 minutes.

## Set Location City and API Key

When you first run, the extension needs to know your location and OpenWeatherMap API key. You can click `🌈 Set location and API Key` button on status bar, or press `F1` (or `Ctrl` + `Shift` + `P` on Windows and Linux, `Command` + `Shift` + `P` on macOS) to open command palette, and execute `Instant Weather: Configurate Location and API Key` to configurate location city and API key.

## Location City

The location city is in format of `<city name>,<country code>`. For example, `Shanghai,CN`. You can find full list of country code from [Wikipedia](https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes).

## Weather Information

The extension has 4 types of weather information to show: temprature, humidity, wind and location. You can swich type by clicking the weather information icon in status bar. Tooltip of the weather information icon shows the weather summary, such as light rain.

## Timeliness

The weather information updates every minute automatically.

## License

MIT License.