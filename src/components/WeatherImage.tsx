"use client";

import { weatherCodeDescriptions } from "@/types/weather";

interface WeatherImageProps {
  weatherCode: number;
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
}

export function WeatherImage({
  weatherCode,
  size = "md",
  showDescription = true,
}: WeatherImageProps) {
  const weather =
    weatherCodeDescriptions[weatherCode] || weatherCodeDescriptions[0];

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  }[size];

  const iconSize = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-5xl",
  }[size];

  // Função para obter ícones mais realistas e gradientes baseados no código do tempo
  const getWeatherVisuals = (code: number) => {
    if (code === 0 || code === 1) {
      // Céu limpo
      return {
        gradient: "from-yellow-400 via-orange-400 to-yellow-500",
        emoji: "☀️",
        glow: "shadow-yellow-300/50",
        animation: "animate-pulse",
      };
    } else if (code === 2) {
      // Parcialmente nublado
      return {
        gradient: "from-blue-300 via-white to-gray-300",
        emoji: "⛅",
        glow: "shadow-blue-200/40",
        animation: "",
      };
    } else if (code === 3) {
      // Nublado
      return {
        gradient: "from-gray-300 via-gray-400 to-gray-500",
        emoji: "☁️",
        glow: "shadow-gray-300/40",
        animation: "",
      };
    } else if ([45, 48].includes(code)) {
      // Névoa
      return {
        gradient: "from-gray-200 via-white to-gray-300",
        emoji: "🌫️",
        glow: "shadow-gray-200/30",
        animation: "",
      };
    } else if ([51, 53, 55, 56, 57].includes(code)) {
      // Garoa
      return {
        gradient: "from-blue-400 via-gray-300 to-blue-500",
        emoji: "🌦️",
        glow: "shadow-blue-300/40",
        animation: "",
      };
    } else if ([61, 63, 65].includes(code)) {
      // Chuva
      return {
        gradient: "from-gray-500 via-blue-500 to-blue-600",
        emoji: "🌧️",
        glow: "shadow-blue-400/50",
        animation: "",
      };
    } else if ([66, 67].includes(code)) {
      // Chuva gelada
      return {
        gradient: "from-cyan-200 via-blue-400 to-blue-600",
        emoji: "🌨️",
        glow: "shadow-cyan-300/40",
        animation: "",
      };
    } else if ([71, 73, 75, 77].includes(code)) {
      // Neve
      return {
        gradient: "from-white via-blue-100 to-gray-200",
        emoji: "❄️",
        glow: "shadow-blue-100/50",
        animation: "animate-pulse",
      };
    } else if ([80, 81, 82].includes(code)) {
      // Pancadas de chuva
      return {
        gradient: "from-gray-600 via-blue-500 to-indigo-600",
        emoji: "⛈️",
        glow: "shadow-indigo-400/50",
        animation: "",
      };
    } else if ([85, 86].includes(code)) {
      // Pancadas de neve
      return {
        gradient: "from-gray-100 via-blue-200 to-blue-400",
        emoji: "🌨️",
        glow: "shadow-blue-200/40",
        animation: "",
      };
    } else if ([95, 96, 99].includes(code)) {
      // Tempestade
      return {
        gradient: "from-gray-800 via-purple-600 to-gray-900",
        emoji: "⚡",
        glow: "shadow-purple-500/60",
        animation: "animate-pulse",
      };
    }

    // Fallback
    return {
      gradient: "from-blue-300 via-white to-blue-400",
      emoji: "🌤️",
      glow: "shadow-blue-200/30",
      animation: "",
    };
  };

  const visuals = getWeatherVisuals(weatherCode);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          ${sizeClasses} 
          bg-gradient-to-br ${visuals.gradient}
          ${visuals.glow}
          ${visuals.animation}
          rounded-full 
          flex 
          items-center 
          justify-center 
          shadow-2xl 
          border-2 
          border-white/30
          backdrop-blur-sm
          relative
          overflow-hidden
        `}
      >
        {/* Efeito de brilho interno */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>

        <span className={`${iconSize} filter drop-shadow-lg relative z-10`}>
          {visuals.emoji}
        </span>
      </div>

      {showDescription && (
        <span className="text-xs text-gray-700 text-center font-medium tracking-wide uppercase">
          {weather.description}
        </span>
      )}
    </div>
  );
}
