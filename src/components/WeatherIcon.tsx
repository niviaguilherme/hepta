import { weatherService } from "@/services/weatherService";

interface WeatherIconProps {
  iconCode?: string; // Para compatibilidade com código antigo
  weatherCode?: number; // Para código numérico da Open-Meteo
  alt: string;
  size?: "2x" | "4x";
  loading?: boolean;
}

export function WeatherIcon({
  iconCode,
  weatherCode,
  alt,
  size = "2x",
  loading = false,
}: WeatherIconProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center w-20 h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const sizeClass = size === "2x" ? "w-20 h-20" : "w-32 h-32";

  // Determinar a URL do ícone baseado no tipo de código recebido
  let iconUrl: string;

  if (weatherCode !== undefined) {
    // Usar código numérico da Open-Meteo
    iconUrl = weatherService.getWeatherIconUrl(weatherCode, size);
  } else if (iconCode) {
    // Compatibilidade com código antigo (string)
    iconUrl = `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  } else {
    // Fallback para ícone padrão
    iconUrl = `https://openweathermap.org/img/wn/01d@${size}.png`;
  }

  return (
    <img src={iconUrl} alt={alt} className={`${sizeClass} object-contain`} />
  );
}
