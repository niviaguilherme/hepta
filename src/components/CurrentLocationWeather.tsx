"use client";

import { WeatherImage } from "./WeatherImage";
import {
  useGeolocation,
  useCurrentWeatherByCoords,
  useForecastByCoords,
} from "@/hooks/useWeather";
import { weatherService } from "@/services/weatherService";
import { WiHumidity, WiStrongWind, WiSunrise, WiSunset } from "react-icons/wi";
import { FiRefreshCw, FiNavigation } from "react-icons/fi";

export function CurrentLocationWeather() {
  const {
    getCurrentPosition,
    coordinates,
    isLoading: geoLoading,
    error: geoError,
    isSuccess: geoSuccess,
  } = useGeolocation();

  const {
    data: weatherData,
    isLoading: weatherLoading,
    isError: weatherError,
    error: weatherErrorMsg,
    refetch: refetchWeather,
  } = useCurrentWeatherByCoords(coordinates ?? null, geoSuccess);

  const {
    data: forecastData,
    isLoading: forecastLoading,
    isError: forecastError,
    refetch: refetchForecast,
  } = useForecastByCoords(coordinates ?? null, geoSuccess);

  const isLoading = geoLoading || weatherLoading || forecastLoading;
  const hasError = geoError || weatherError || forecastError;
  const errorMessage =
    geoError ||
    weatherErrorMsg?.message ||
    (forecastError ? "Erro ao carregar previsão" : "");

  const handleRefresh = () => {
    refetchWeather();
    refetchForecast();
  };

  if (!geoSuccess && !geoLoading && !geoError) {
    return (
      <div className="relative w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
        {/* Efeito de estrelas/partículas */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-8 left-8 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-16 right-12 w-1 h-1 bg-white rounded-full animate-pulse delay-75"></div>
          <div className="absolute bottom-20 left-16 w-3 h-3 bg-white rounded-full animate-pulse delay-150"></div>
          <div className="absolute bottom-32 right-8 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        </div>

        <div className="relative z-10 p-8 text-white text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <FiNavigation size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-wide">
                CLIMA DA SUA LOCALIZAÇÃO
              </h3>
              <p className="text-white/80 text-lg">
                Descubra o clima atual e previsão de 7 dias
              </p>
            </div>
            <button
              onClick={() => getCurrentPosition()}
              className="flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-white/90 transition-all font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <FiNavigation size={20} />
              Usar Minha Localização
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative p-8 text-white">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-white/30 border-t-white"></div>
              <span className="text-xl font-medium">
                {geoLoading
                  ? "Obtendo localização..."
                  : "Carregando dados meteorológicos..."}
              </span>
            </div>
            <div className="w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
            <div className="space-y-2 w-full max-w-sm">
              <div className="h-6 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="relative w-full bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-8 text-white">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FiNavigation size={24} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Erro na Localização</h3>
              <p className="text-white/90">{errorMessage}</p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                onClick={() => getCurrentPosition()}
              >
                <FiNavigation size={16} />
                Tentar Localização
              </button>
              {weatherData && (
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  onClick={handleRefresh}
                >
                  <FiRefreshCw size={16} />
                  Atualizar Dados
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const formattedWeather =
    weatherService.formatCurrentWeatherForDisplay(weatherData);
  const currentTime = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentDate = new Date()
    .toLocaleDateString("pt-BR", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

  // Determinar gradiente baseado na condição do tempo
  const getBackgroundGradient = (weatherCode: number) => {
    if ([0, 1].includes(weatherCode)) {
      return "from-orange-400 via-yellow-400 to-blue-400"; // Céu limpo
    } else if ([2, 3].includes(weatherCode)) {
      return "from-gray-500 via-blue-400 to-blue-500"; // Nublado
    } else if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      return "from-gray-700 via-blue-600 to-blue-700"; // Chuva
    } else if ([95, 96, 99].includes(weatherCode)) {
      return "from-gray-900 via-purple-700 to-indigo-800"; // Tempestade
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      return "from-gray-400 via-blue-300 to-white"; // Neve
    } else {
      return "from-blue-500 via-indigo-500 to-purple-600"; // Padrão
    }
  };

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${getBackgroundGradient(
        formattedWeather.weatherCode
      )} rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:-translate-y-1`}
    >
      {/* Efeito de nuvens/textura de fundo */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-12 left-12 w-40 h-40 bg-white rounded-full mix-blend-overlay"></div>
        <div className="absolute top-24 right-16 w-28 h-28 bg-white rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-16 left-20 w-24 h-24 bg-white rounded-full mix-blend-overlay"></div>
      </div>

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20"></div>

      {/* Botão refresh */}
      <button
        onClick={handleRefresh}
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
        title="Atualizar"
      >
        <FiRefreshCw size={16} />
      </button>

      <div className="relative z-10 p-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          {/* Localização e data */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiNavigation size={14} className="opacity-80" />
              <span className="text-sm font-medium opacity-90 uppercase tracking-wide">
                {formattedWeather.location || "LOCALIZAÇÃO ATUAL"}
              </span>
            </div>
            <div className="text-sm opacity-75 font-light tracking-wide">
              {currentDate}
            </div>
            {coordinates && (
              <div className="text-xs opacity-60 mt-1">
                {coordinates.lat.toFixed(3)}, {coordinates.lon.toFixed(3)}
              </div>
            )}
          </div>

          {/* Informações extras */}
          <div className="text-right text-xs opacity-75 space-y-1">
            <div>PRESSÃO: {formattedWeather.pressure} hPa</div>
            <div className="flex items-center gap-1">
              <WiSunrise size={16} />
              <span>6:34</span>
            </div>
            <div className="flex items-center gap-1">
              <WiSunset size={16} />
              <span>18:05</span>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex items-center justify-between mb-8">
          {/* Hora e ícone */}
          <div className="flex flex-col items-start">
            <div className="text-4xl font-light mb-4 tracking-wide">
              {currentTime}
            </div>
            <div className="flex flex-col items-center">
              <WeatherImage
                weatherCode={formattedWeather.weatherCode}
                size="lg"
                showDescription={false}
              />
              <span className="text-sm font-medium opacity-90 mt-2 uppercase tracking-widest">
                {formattedWeather.description}
              </span>
            </div>
          </div>

          {/* Temperatura */}
          <div className="text-right">
            <div className="text-6xl font-extralight mb-2">
              +{formattedWeather.temperature}°
            </div>
            <div className="text-sm opacity-75 space-y-1">
              <div>Sensação: {formattedWeather.feelsLike}°</div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <WiHumidity size={16} />
                  {formattedWeather.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <WiStrongWind size={16} />
                  {Math.round(formattedWeather.windSpeed * 3.6)}km/h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Precipitação se houver */}
        {formattedWeather.precipitation > 0 && (
          <div className="mb-6 p-3 bg-white/15 rounded-lg backdrop-blur-sm">
            <span className="text-sm">
              💧 Precipitação: {formattedWeather.precipitation}mm
            </span>
          </div>
        )}

        {/* Previsão 7 dias */}
        {forecastData && (
          <div className="mt-auto">
            <div className="grid grid-cols-7 gap-2">
              {forecastData.daily.time.slice(0, 7).map((day, index) => {
                const maxTemp = Math.round(
                  forecastData.daily.temperature_2m_max[index]
                );
                const minTemp = Math.round(
                  forecastData.daily.temperature_2m_min[index]
                );
                const weatherCode = forecastData.daily.weather_code[index];

                const dayName =
                  index === 0
                    ? "HOJ"
                    : index === 1
                    ? "AMÃ"
                    : new Date(day)
                        .toLocaleDateString("pt-BR", { weekday: "short" })
                        .toUpperCase()
                        .slice(0, 3);

                return (
                  <div
                    key={day}
                    className={`p-3 rounded-xl text-center transition-all duration-200 ${
                      index === 0
                        ? "bg-white/25 backdrop-blur-sm shadow-lg"
                        : "bg-white/15 hover:bg-white/20"
                    }`}
                  >
                    <div className="text-xs font-medium mb-2 opacity-90">
                      {dayName}
                    </div>

                    <div className="mb-2">
                      <WeatherImage
                        weatherCode={weatherCode}
                        size="sm"
                        showDescription={false}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-semibold">{maxTemp}°</div>
                      <div className="text-xs opacity-70">{minTemp}°</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hora da última atualização */}
        <div className="text-center mt-4 pt-4 border-t border-white/20">
          <span className="text-xs opacity-60">
            Atualizado:{" "}
            {new Date(weatherData.current.time).toLocaleTimeString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  );
}
