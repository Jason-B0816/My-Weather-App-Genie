import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather implements Coordinates {
  constructor(
    public readonly temp: number,
    public readonly humidity: number,
    public readonly windDirection: string,
    public readonly windSpeed: number,
    public readonly feelsLike: number,
    public readonly date: string,
    public readonly iconDescription: string,
    public readonly icon: string,
    public readonly lat: number,
    public readonly lon: number
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  //private cityName: "";
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey= process.env.API_KEY || '';
  }
  // TODO: Define the baseURL, API key, and city name properties.


  // TODO: Create fetchLocationData method
  async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return {
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
  }

  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  destructureLocationData(locationData: Coordinates) {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.apiKey}&&units=imperial`;
  }
  // private buildGeocodeQuery(): string {}

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  private buildForecastQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  async fetchAndDestructureLocationData(city: string) {
    const query = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // private async fetchAndDestructureLocationData() {}

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }

  private async fetchForecastData(coordinates: Coordinates) {
    const query = this.buildForecastQuery(coordinates);
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }


  // TODO: Build parseCurrentWeather method
  parseCurrentWeather(response: any) {
    const { list } = response;
    const { main, weather, wind, dt, } = list[0];
    return new Weather(
      main.temp,
      main.humidity,
      wind.deg,
      wind.speed,
      main.feels_like,
      new Date(dt * 1000).toLocaleDateString(),
      weather[0].description,
      weather[0].icon,
      response.city.coord.lat,
      response.city.coord.lon
    );
  }
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  buildForecastArray(currentWeather: Weather, weatherData: { list: any[] }) {
    const forecastArray = weatherData.list.map((item: any) => {
      const { main, weather, wind, dt } = item;
      return new Weather(
        main.temp,
        main.humidity,
        wind.deg,
        wind.speed,
        main.feels_like,
        new Date(dt * 1000).toLocaleDateString(),
        weather[0].description,
        weather[0].icon,
        currentWeather.lat,
        currentWeather.lon
      );
    });
    return forecastArray;
  }
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const forecastData = await this.fetchForecastData(coordinates);


    const filteredData = forecastData.list.filter((item: any) => {
      return item.dt_txt.includes('12:00:00');
    })
    console.log(filteredData);



    // city, date, icon, iconDescription, tempF, windSpeed, humidity
    const formattedData = {
      city: city,
      date: new Date().toLocaleDateString(),
      icon: weatherData.weather[0].icon,
      iconDescription: weatherData.weather[0].description,
      tempF: weatherData.main.temp,
      windSpeed: weatherData.wind.speed,
      humidity: weatherData.main.humidity,
    }


    const formattedForecastData = filteredData.map((item: any) => {
      return {
        city: city,
        date: new Date(item.dt * 1000).toLocaleDateString(),
        icon: item.weather[0].icon,
        iconDescription: item.weather[0].description,
        tempF: item.main.temp,
        windSpeed: item.wind.speed,
        humidity: item.main.humidity,
      }

    })


    return [
      formattedData,
      ...formattedForecastData
    ];
  }
}

export default new WeatherService();
