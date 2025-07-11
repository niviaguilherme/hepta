import axios from "axios";
import { env } from "@/config/env";
import type { WeatherData, ForecastData, LocationData } from "@/types/weather";
import { weatherCodeDescriptions } from "@/types/weather";

const api = axios.create({
  baseURL: env.openMeteo.baseUrl,
});

const geocodingApi = axios.create({
  baseURL: env.openMeteo.geocodingUrl,
});

export const weatherService = {
  // Buscar dados meteorológicos atuais por nome da cidade
  async getCurrentWeather(cityName: string): Promise<WeatherData> {
    // Primeiro, buscar as coordenadas da cidade
    const locations = await this.searchLocations(cityName);
    if (locations.length === 0) {
      throw new Error(`Cidade "${cityName}" não encontrada`);
    }

    const location = locations[0];
    return this.getCurrentWeatherByCoords(
      location.lat,
      location.lon,
      location.name,
      location.country
    );
  },

  // Buscar dados meteorológicos atuais por coordenadas
  async getCurrentWeatherByCoords(
    lat: number,
    lon: number,
    cityName?: string,
    country?: string
  ): Promise<WeatherData> {
    const response = await api.get("/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "precipitation",
          "rain",
          "weather_code",
          "cloud_cover",
          "pressure_msl",
          "wind_speed_10m",
          "wind_direction_10m",
        ].join(","),
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum",
        ].join(","),
        timezone: "auto",
        forecast_days: 1,
      },
    });

    const data = response.data;

    // Adicionar informações de localização se disponíveis
    if (cityName) data.name = cityName;
    if (country) data.country = country;

    return data;
  },

  // Buscar previsão de 7 dias por nome da cidade
  async getForecast(cityName: string): Promise<ForecastData> {
    // Primeiro, buscar as coordenadas da cidade
    const locations = await this.searchLocations(cityName);
    if (locations.length === 0) {
      throw new Error(`Cidade "${cityName}" não encontrada`);
    }

    const location = locations[0];
    return this.getForecastByCoords(
      location.lat,
      location.lon,
      location.name,
      location.country
    );
  },

  // Buscar previsão de 7 dias por coordenadas
  async getForecastByCoords(
    lat: number,
    lon: number,
    cityName?: string,
    country?: string
  ): Promise<ForecastData> {
    const response = await api.get("/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "precipitation_sum",
          "wind_speed_10m_max",
        ].join(","),
        hourly: [
          "temperature_2m",
          "relative_humidity_2m",
          "precipitation",
          "weather_code",
          "wind_speed_10m",
        ].join(","),
        timezone: "auto",
        forecast_days: 7,
      },
    });

    const data = response.data;

    // Adicionar informações de localização se disponíveis
    if (cityName) data.name = cityName;
    if (country) data.country = country;

    return data;
  },

  // Buscar localizações por nome (geocoding)
  async searchLocations(query: string): Promise<LocationData[]> {
    const response = await geocodingApi.get("/search", {
      params: {
        name: query,
        count: 5,
        language: "pt",
        format: "json",
      },
    });

    // Mapear para o formato esperado e adicionar aliases de compatibilidade
    return (
      response.data.results?.map(
        (location: {
          id: number;
          name: string;
          latitude: number;
          longitude: number;
          country: string;
          country_code: string;
          admin1?: string;
          admin2?: string;
          admin3?: string;
          admin4?: string;
        }) => ({
          ...location,
          lat: location.latitude,
          lon: location.longitude,
          state: location.admin1,
        })
      ) || []
    );
  },

  // Obter localização atual do usuário
  async getCurrentPosition(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização não é suportada neste navegador"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Erro ao obter localização: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutos
        }
      );
    });
  },

  // Formatar ícone do tempo baseado no código do Open-Meteo
  getWeatherIconUrl(weatherCode: number, size: "2x" | "4x" = "2x"): string {
    const weather = weatherCodeDescriptions[weatherCode];
    const iconCode = weather?.icon || "01d";
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  },

  // Obter descrição do tempo em português
  getWeatherDescription(weatherCode: number): string {
    return (
      weatherCodeDescriptions[weatherCode]?.description ||
      "Condição desconhecida"
    );
  },

  // Converter dados do Open-Meteo para formato compatível com componentes existentes
  formatCurrentWeatherForDisplay(data: WeatherData) {
    const current = data.current;
    const weatherCode = current.weather_code;

    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      pressure: Math.round(current.pressure_msl),
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      cloudCover: current.cloud_cover,
      precipitation: current.precipitation,
      description: this.getWeatherDescription(weatherCode),
      iconUrl: this.getWeatherIconUrl(weatherCode),
      location: data.name || "Localização atual",
      country: data.country || "",
      weatherCode: weatherCode,
    };
  },
};
