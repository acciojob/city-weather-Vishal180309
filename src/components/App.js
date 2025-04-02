// Importing required modules
const http = require("http");
const https = require("https");
const url = require("url");
const querystring = require("querystring");

// Replace with your OpenWeatherMap API key
const API_KEY = "your_api_key_here";

// HTML for the front-end
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>City Weather</title>
    <style>
        .container {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 1rem;
            text-align: center;
            border: 1px solid #ddd;
        }
        .search {
            margin-bottom: 1rem;
        }
        .weather {
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>City Weather</h1>
        <input class="search" id="cityInput" type="text" placeholder="Enter city name" />
        <button onclick="getWeather()">Get Weather</button>
        <div class="weather" id="weatherOutput"></div>
    </div>
    <script>
        function getWeather() {
            const city = document.getElementById('cityInput').value;
            fetch(\`http://localhost:3000/weather?city=\${city}\`)
                .then(response => response.json())
                .then(data => {
                    const weatherOutput = document.getElementById('weatherOutput');
                    if (data.error) {
                        weatherOutput.innerHTML = \`<p>\${data.error}</p>\`;
                    } else {
                        weatherOutput.innerHTML = \`
                            <h2>Weather in \${data.city}</h2>
                            <p>Temperature: \${data.temperature}°C</p>
                            <p>Description: \${data.description}</p>
                            <img src="http://openweathermap.org/img/wn/\${data.icon}@2x.png" alt="Weather Icon" />
                        \`;
                    }
                });
        }
    </script>
</body>
</html>
`;

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const query = querystring.parse(parsedUrl.query);

    if (parsedUrl.pathname === "/weather" && req.method === "GET") {
        const city = query.city;
        if (!city) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "City name is required" }));
        } else {
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
            https.get(apiUrl, (apiRes) => {
                let data = "";
                apiRes.on("data", (chunk) => {
                    data += chunk;
                });
                apiRes.on("end", () => {
                    const weatherData = JSON.parse(data);
                    if (weatherData.cod === 200) {
                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(
                            JSON.stringify({
                                city: weatherData.name,
                                temperature: weatherData.main.temp,
                                description: weatherData.weather[0].description,
                                icon: weatherData.weather[0].icon,
                            })
                        );
                    } else {
                        res.writeHead(400, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ error: weatherData.message }));
                    }
                });
            }).on("error", (err) => {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to fetch weather data" }));
            });
        }
    } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlContent);
    }
});

// Start the server
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
