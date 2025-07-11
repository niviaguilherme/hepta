import { WeatherImage } from "./WeatherImage";
import { useCurrentWeather, useForecast } from "@/hooks/useWeather";
import { weatherService } from "@/services/weatherService";
import { WiHumidity, WiStrongWind, WiSunrise, WiSunset } from "react-icons/wi";
import { FiMapPin, FiRefreshCw } from "react-icons/fi";

interface WeatherCardProps {
  cityName: string;
  onRemove?: () => void;
}

export function WeatherCard({ cityName, onRemove }: WeatherCardProps) {
  const {
    data: currentData,
    isLoading: currentLoading,
    isError: currentError,
    error: currentErrorMsg,
    refetch: refetchCurrent,
  } = useCurrentWeather(cityName);

  const {
    data: forecastData,
    isLoading: forecastLoading,
    isError: forecastError,
    refetch: refetchForecast,
  } = useForecast(cityName);

  const isLoading = currentLoading || forecastLoading;
  const isError = currentError || forecastError;
  const error =
    currentErrorMsg ||
    (forecastError ? { message: "Erro ao carregar previsão" } : null);

  const handleRefresh = () => {
    refetchCurrent();
    refetchForecast();
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-80 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative p-6 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-4 bg-white/30 rounded animate-pulse w-24"></div>
              <div className="h-6 bg-white/30 rounded animate-pulse w-32"></div>
            </div>
            <div className="h-4 bg-white/30 rounded animate-pulse w-20"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-white/30 rounded animate-pulse w-20"></div>
              <div className="w-24 h-24 bg-white/30 rounded-full animate-pulse"></div>
            </div>
            <div className="h-16 bg-white/30 rounded animate-pulse w-24"></div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white/20 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative w-full h-80 bg-gradient-to-br from-red-400 to-red-500 rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative p-6 h-full flex flex-col items-center justify-center text-white text-center space-y-4">
          <span className="text-lg font-medium">
            Erro ao carregar {cityName}
          </span>
          <span className="text-sm opacity-90">
            {error?.message || "Erro desconhecido"}
          </span>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            onClick={handleRefresh}
          >
            <FiRefreshCw size={16} />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!currentData) return null;

  const formattedWeather =
    weatherService.formatCurrentWeatherForDisplay(currentData);
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
      return "from-blue-400 via-sky-300 to-yellow-200"; // Céu limpo
    } else if ([2, 3].includes(weatherCode)) {
      return "from-gray-400 via-blue-300 to-blue-400"; // Nublado
    } else if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      return "from-gray-600 via-blue-500 to-blue-600"; // Chuva
    } else if ([95, 96, 99].includes(weatherCode)) {
      return "from-gray-800 via-purple-600 to-indigo-700"; // Tempestade
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      return "from-gray-300 via-blue-200 to-white"; // Neve
    } else {
      return "from-blue-400 via-blue-500 to-blue-600"; // Padrão
    }
  };

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${getBackgroundGradient(
        formattedWeather.weatherCode
      )} rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:-translate-y-1`}
    >
      {/* Efeito de nuvens/textura de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-white rounded-full mix-blend-overlay"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-white rounded-full mix-blend-overlay"></div>
      </div>

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10"></div>

      {/* Botão remover */}
      {onRemove && (
        <button
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
          onClick={onRemove}
        >
          ×
        </button>
      )}

      {/* Botão refresh */}
      <button
        onClick={handleRefresh}
        className="absolute top-4 right-16 z-20 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
        title="Atualizar"
      >
        <FiRefreshCw size={14} />
      </button>

      <div className="relative z-10 p-6 h-full text-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          {/* Localização e data */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FiMapPin size={14} className="opacity-80" />
              <span className="text-sm font-medium opacity-90 uppercase tracking-wide">
                {formattedWeather.location}
              </span>
            </div>
            <div className="text-sm opacity-75 font-light tracking-wide">
              {currentDate}
            </div>
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
          <div className="mb-6 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
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
                        ? "bg-white/20 backdrop-blur-sm shadow-lg"
                        : "bg-white/10 hover:bg-white/15"
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
      </div>
    </div>
  );
}
