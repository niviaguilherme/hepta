import { TiThermometer } from "react-icons/ti";

interface TemperatureDisplayProps {
  temperature: number;
  feelsLike?: number;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function TemperatureDisplay({
  temperature,
  feelsLike,
  min,
  max,
  size = "md",
  showIcon = true,
}: TemperatureDisplayProps) {
  const fontSize = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  }[size];

  const iconSize = {
    sm: 16,
    md: 24,
    lg: 32,
  }[size];

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        {showIcon && <TiThermometer size={iconSize} color="#3182CE" />}
        <span className={`${fontSize} font-bold text-gray-800`}>
          {Math.round(temperature)}°C
        </span>
      </div>

      {feelsLike && (
        <span className="text-sm text-gray-600">
          Sensação: {Math.round(feelsLike)}°C
        </span>
      )}

      {(min !== undefined || max !== undefined) && (
        <div className="flex gap-2 text-sm text-gray-600">
          {min !== undefined && <span>Min: {Math.round(min)}°C</span>}
          {max !== undefined && <span>Max: {Math.round(max)}°C</span>}
        </div>
      )}
    </div>
  );
}
