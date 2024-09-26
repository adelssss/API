const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const fetchWithRetry = async (url, retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, { timeout: 10000 });
            return response.data;
        } catch (error) {
            if (i < retries - 1) {
                console.log(`Retrying... (${i + 1})`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw error;
            }
        }
    }
};

app.get('/', async (req, res) => {
    const city = req.query.city || 'London';
    const apiKey = '10bd769e2f1a30f65a9ab5bdaa8e5184';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const weather = await fetchWithRetry(weatherUrl);
        const newsApiKey = 'd52dcca6228b47a9bd4fe69bce77adf4';
        const newsUrl = `https://newsapi.org/v2/everything?q=${city}&apiKey=${newsApiKey}`;
        const newsArticles = await fetchWithRetry(newsUrl);

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
        console.error('Error fetching weather data:', error.message);
        const rain3h = 0;
        const newsArticles = [];
        res.render('index', { weather: null, city, backgroundColor: "white", rain3h, newsArticles, error: 'The city was not found or API timeout!' });
    }
});

app.listen(port, () => {
    console.log(`Weather app listening on port ${port}`);
});
