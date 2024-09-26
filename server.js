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
    const airQualityApiKey = '0cfdccb1-ffe6-4800-b896-3e96bb5f6b9a';

    try {
        const weather = await fetchWithRetry(weatherUrl);
        const country = weather.sys.country;
        const state = ""; 
        const airQualityUrl = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=${country}&key=${airQualityApiKey}`;
        const airQuality = await fetchWithRetry(airQualityUrl);
        const newsApiKey = 'd52dcca6228b47a9bd4fe69bce77adf4';
        const newsUrl = `https://newsapi.org/v2/everything?q=${city}&apiKey=${newsApiKey}`;
        const newsArticles = await fetchWithRetry(newsUrl);

        const rain3h = weather.rain ? weather.rain['3h'] || 0 : 0;
        res.render('index', { weather, city, rain3h, newsArticles, error: null });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        const rain3h = 0;
        const newsArticles = [];
        res.render('index', { weather: null, city, rain3h, newsArticles, error: 'The city was not found or API timeout!' });
    }
});

app.listen(port, () => {
    console.log(`Weather app listening on port ${port}`);
});
