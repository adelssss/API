const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    const city = req.query.city || 'London';
    const apiKey = '10bd769e2f1a30f65a9ab5bdaa8e5184';
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric';

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const weather = weatherResponse.data;

        const newsApiKey = 'd52dcca6228b47a9bd4fe69bce77adf4';
        const newsUrl = 'https://newsapi.org/v2/everything?q=${city}&apiKey=${newsApiKey}';
        const newsResponse = await axios.get(newsUrl);
        const newsArticles = newsResponse.data.articles;

        let backgroundColor;
        const weatherDescription = weather.weather[0].description.toLowerCase();
        if (weatherDescription.includes("rain")) {
            backgroundColor = "lightblue";
        } else if (weatherDescription.includes("clear")) {
            backgroundColor = "yellow";
        } else if (weatherDescription.includes("clouds")) {
            backgroundColor = "lightgrey";
        } else {
            backgroundColor = "white";
        }

        const rain3h = weather.rain ? weather.rain['3h'] || 0 : 0;

        res.render('index', { weather, city, backgroundColor, rain3h, newsArticles, error: null });
    } catch (error) {
        const rain3h = 0;
        res.render('index', { error: 'The city was not found!', city, backgroundColor: "white", rain3h, newsArticles: [] });
    }
});

app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});
