 import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import { useDarkMode } from './DarkModeContext';
import "../styles/weather.css";

export default function Weather({ onWeatherLoaded }) {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
  });
  const{isDarkMode,setDarkmode}=useDarkMode();
  // Fetch location data
  useEffect(() => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=hyderabad&limit=1&appid=fda78748a814b69515ca24c4df99e5c2`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setLocation({
            lat: data[0].lat,
            lon: data[0].lon,
          });
        } else {
          onWeatherLoaded();
        }
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
        onWeatherLoaded();
      });
  }, [onWeatherLoaded]);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=fda78748a814b69515ca24c4df99e5c2&units=metric&lang=en`
      )
        .then((response) => response.json())
        .then((val) => {
          setWeatherData(val);
          onWeatherLoaded();
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          onWeatherLoaded();
        });
    }
  }, [location, onWeatherLoaded]);

  if (!weatherData) {
    return null;
  }

  return (
    <section className="weatherContainer" style={isDarkMode?{backgroundColor:"#242a23"}:{}}>
      <div className="mainContent" >
        <div className="details">
          <p className="cityDetail">{weatherData.name}</p>
          <p className="weatherDetail" style={isDarkMode?{color:"white"}:{color:"black"}}>{weatherData.weather[0].main}</p>
        </div>
        <div className="mainDetails">
          <img
            className="weatherIcon"
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            width={80}
            alt="weather icon"
            draggable={false}
          />
          <div className="sideDetails">
            <p className="temp">{`${Math.floor(weatherData.main.temp)}°C`}</p>
            <p className="realFeel">
              RealFeel: {`${Math.floor(weatherData.main.feels_like)}°C`}
            </p>
          </div>
        </div>
      </div>
      <table className="extraContent">
        <tbody>
          <tr className="c wind">
            <td className="title">Wind</td>
            <td className="data f">
              <p>{weatherData.wind.speed || "No Data"} m/s</p>
              <p>{weatherData.wind.deg || "No Data"}°</p>
              <p>{weatherData.wind.gust ? `${weatherData.wind.gust} m/s (gust)` : "No Data"}</p>
            </td>
          </tr>
          <tr className="c humidity">
            <td className="title">Humidity</td>
            <td className="data">{weatherData.main.humidity}%</td>
          </tr>
          <tr className="c pressure">
            <td className="title">Pressure</td>
            <td className="data">{weatherData.main.pressure} hPa</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}