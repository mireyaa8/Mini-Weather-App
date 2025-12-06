const searchedInput = document.getElementById("user-input");
const storedCity = localStorage.getItem("city");
searchedInput.value = storedCity;

async function onClickButton() {
  const inputValue = searchedInput.value;
  const loader = document.getElementById("loader");
  const submitButton = document.getElementById("submitButton");
  const h2 = document.getElementById("h2");
  const pTemp = document.getElementById("pTemp");
  const pWindSpeed = document.getElementById("pWindSpeed");
  const pDayOrNight = document.getElementById("pDayOrNight");
  const pCaughtError = document.getElementById("pCaughtError");
  const pTime = document.getElementById("pTime");

  loader.style.display = "block";
  submitButton.disabled = true;

  h2.innerText = "";
  pTemp.innerText = "";
  pWindSpeed.innerText = "";
  pDayOrNight.innerText = "";
  pCaughtError.innerText = "";
  pTime.innerText = "";

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${inputValue}`
    );

    const responseData = await response.json();
    const firstElement = responseData.results[0];
    localStorage.setItem("city", firstElement.name);
    const { latitude, longitude } = firstElement;

    try {
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      const weatherData = await weatherResponse.json();
      const currentDate = new Date();
      const formatDate = new Intl.DateTimeFormat(
        weatherData.timezone_abbreviation,
        {
          timeZone: weatherData.timezone,
          dateStyle: "full",
          timeStyle: "short",
        }
      ).format(currentDate);

      loader.style.display = "none";
      h2.innerText = firstElement.name;
      pTemp.innerText = `${weatherData.current_weather.temperature} °C`;
      pWindSpeed.innerText = `${weatherData.current_weather.windspeed} km/h`;

      if (weatherData.current_weather.is_day == true) {
        pDayOrNight.innerText = `It's day in ${firstElement.name} ☀️`;
      } else if (weatherData.current_weather.is_day == false) {
        pDayOrNight.innerText = `It's night in ${firstElement.name}  🌃`;
      }

      pTime.innerText = `The weather was updated last at: ${formatDate}`;
      document.getElementById("city");
    } catch {
      pCaughtError.innerText =
        "Make sure you have set the correct name of the city.";
    }
  } catch {
    pCaughtError.innerText =
      "Make sure you have set the correct name of the city.";
  }
  submitButton.disabled = false;
}

onClickButton();
