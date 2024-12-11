import { useEffect, useState } from "react";
import { useDarkMode } from "../../../DarkModeContext";
import LoadingScreen from "../../loadingscreen/LoadingScreen";
import dirnCircle from "./dirnCircle.png";
import "./Weather.css";

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=hyderabad&limit=1&appid=fda78748a814b69515ca24c4df99e5c2`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setLocation({ lat: data[0].lat, lon: data[0].lon });
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching location data:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=fda78748a814b69515ca24c4df99e5c2&units=metric&lang=en`
      )
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          setIsLoading(false);
        });
    }
  }, [location]);

  if (isLoading) {
    return (
      <section
        className="weatherContainer"
        style={
          isDarkMode
            ? { color: "white", backgroundColor: "#242a23" }
            : { color: "black" }
        }
      >
        <LoadingScreen />
      </section>
    );
  }

  if (!weatherData) return null;

  return (
    <section
      className="weatherContainer"
      style={isDarkMode ? { backgroundColor: "#242a23" } : {}}
    >
      <div className="mainContent">
        <div className="details">
          <p className="cityDetail">{weatherData.name}</p>
          <p
            className="weatherDetail"
            style={isDarkMode ? { color: "white" } : { color: "black" }}
          >
            {weatherData.weather[0].main}
          </p>
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
            <p className="realFeel">Feels like:</p>
            <p className="realFeel">{`${Math.floor(
              weatherData.main.feels_like
            )}°C`}</p>
          </div>
        </div>
      </div>
      <div className="extraContent">
        <div className="meta metaWind">
          Wind:
          <span className="direction">
            <img
              className="circle"
              src={dirnCircle}
              alt="circle"
              style={{
                position: "relative",
                filter: isDarkMode ? 'invert(1) brightness(1.5)' : 'none'
              }}
            />
            <svg
              fill="#000000"
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              id="right-direction"
              xmlns="http://www.w3.org/2000/svg"
              className=""
              alt="Direction"
              style={{
                transition: "transform 0.3s ease",
                transform: `rotate(${
                  -1 * (weatherData.wind.deg || 30) + 270
                }deg)`, // Ensure this is the only place the rotation happens
              }}
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                <path
                  id="secondary"
                  d="M20.76,12.65,14.46,20l-3-2.6L14.34,14H4a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1H14.34L11.42,6.6l3-2.6,6.3,7.35A1,1,0,0,1,20.76,12.65Z"
                  style={{
                    fill: "#ffff",
                    strokeWidth: 2,
                  }}
                />
                <path
                  id="primary"
                  d="M20.76,12.65,14.46,20l-3-2.6L14.34,14H4a1,1,0,0,1-1-1V11a1,1,0,0,1,1-1H14.34L11.42,6.6l3-2.6,6.3,7.35A1,1,0,0,1,20.76,12.65Z"
                  style={{
                    fill: "none",
                    stroke: "#000000",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                  }}
                />
              </g>
            </svg>
          </span>
        </div>
        <div className="meta metaHumidity">Humidity:</div>
        <div className="meta metaPressure">Pressure:</div>

        <div className="data wind">
          <div>
            {(weatherData.wind.speed * (3600 / 1000)).toFixed(2) || "No Data"}{" "}
            <p className="kmph">kmph</p> {/* <img */}
          </div>
          <div>
            {weatherData.wind.gust ? (
              <>
                {(weatherData.wind.gust * (3600 / 1000)).toFixed(2)}{" "}
                <p className="kmph">kmph (gust)</p>
              </>
            ) : (
              <span style={{ fontSize: "11px" }}>No Data</span>
            )}
          </div>
        </div>
        <div className="data humidity">{weatherData.main.humidity}%</div>
        <div className="data pressure">{weatherData.main.pressure} hPa</div>
      </div>
    </section>
  );
}
