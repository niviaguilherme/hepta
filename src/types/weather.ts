// Tipos para Open-Meteo API
export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    rain: string;
    weather_code: string;
    cloud_cover: string;
    pressure_msl: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
  };
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily_units?: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
  // Campos adicionais para compatibilidade com componentes existentes
  name?: string;
  country?: string;
}

export interface ForecastData {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    weather_code: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    wind_speed_10m_max: string;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    precipitation: string;
    weather_code: string;
    wind_speed_10m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  // Campos adicionais para compatibilidade
  name?: string;
  country?: string;
}

export interface LocationData {
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
  // Aliases para compatibilidade
  lat: number;
  lon: number;
  state?: string;
}

// Mapeamento de códigos do Open-Meteo para descrições em português
export const weatherCodeDescriptions: {
  [key: number]: { description: string; icon: string };
} = {
  0: { description: "Céu limpo", icon: "01d" },
  1: { description: "Principalmente limpo", icon: "01d" },
  2: { description: "Parcialmente nublado", icon: "02d" },
  3: { description: "Nublado", icon: "03d" },
  45: { description: "Névoa", icon: "50d" },
  48: { description: "Névoa com geada", icon: "50d" },
  51: { description: "Garoa leve", icon: "09d" },
  53: { description: "Garoa moderada", icon: "09d" },
  55: { description: "Garoa densa", icon: "09d" },
  56: { description: "Garoa gelada leve", icon: "09d" },
  57: { description: "Garoa gelada densa", icon: "09d" },
  61: { description: "Chuva leve", icon: "10d" },
  63: { description: "Chuva moderada", icon: "10d" },
  65: { description: "Chuva forte", icon: "10d" },
  66: { description: "Chuva gelada leve", icon: "13d" },
  67: { description: "Chuva gelada forte", icon: "13d" },
  71: { description: "Neve leve", icon: "13d" },
  73: { description: "Neve moderada", icon: "13d" },
  75: { description: "Neve forte", icon: "13d" },
  77: { description: "Granizo", icon: "13d" },
  80: { description: "Pancadas de chuva leves", icon: "09d" },
  81: { description: "Pancadas de chuva moderadas", icon: "09d" },
  82: { description: "Pancadas de chuva violentas", icon: "09d" },
  85: { description: "Pancadas de neve leves", icon: "13d" },
  86: { description: "Pancadas de neve fortes", icon: "13d" },
  95: { description: "Tempestade", icon: "11d" },
  96: { description: "Tempestade com granizo leve", icon: "11d" },
  99: { description: "Tempestade com granizo forte", icon: "11d" },
};
