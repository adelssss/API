# Weather Forecast app
# Discription
This Weather App provides current weather information and news articles for a specified city. It utilizes the OpenWeather API for weather data and the News API for news related to the city. 
# Features
- Search for weather information by entering the name of the city
- Display current weather conditions
- Show news articles related to the city
- Interactive map displaying the city's location
# Technologies Used
- Node.js
- Express.js
- EJS (Embedded JavaScript)
- Axios for API requests
- Leaflet for map visualization
- OpenWeather API
- News API
# Setup Instructions
- Choose repository name
- npm install
- API_KEY=10bd769e2f1a30f65a9ab5bdaa8e5184
- node server.js
# API usage
- OpenWeather API
- Endpoint: https://api.openweathermap.org/data/2.5/weather
- Parameters:
- q: City name
- appid: Your API key
-News API
-Endpoint: https://newsapi.org/v2/everything
-Parameters:
-q: Search term (city name)
-apiKey: Your News API key
-Key Design Decisions
-The weather information and news articles are fetched and rendered on the server-side for better performance.
-The frontend uses EJS for templating, allowing dynamic content to be easily injected into the HTML.
-Leaflet is used to display an interactive map of the searched city.
