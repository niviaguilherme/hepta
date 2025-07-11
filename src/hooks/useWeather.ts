import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { weatherService } from "@/services/weatherService";
import { useState } from "react";

// Chaves para cache do React Query
export const weatherKeys = {
  all: ["weather"] as const,
  current: (location: string | { lat: number; lon: number }) =>
    [...weatherKeys.all, "current", location] as const,
  forecast: (location: string | { lat: number; lon: number }) =>
    [...weatherKeys.all, "forecast", location] as const,
  search: (query: string) => [...weatherKeys.all, "search", query] as const,
};

// Hook para dados meteorológicos atuais por cidade
export function useCurrentWeather(cityName: string, enabled = true) {
  return useQuery({
    queryKey: weatherKeys.current(cityName),
    queryFn: () => weatherService.getCurrentWeather(cityName),
    enabled: enabled && !!cityName,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
}

// Hook para dados meteorológicos atuais por coordenadas
export function useCurrentWeatherByCoords(
  coordinates: { lat: number; lon: number } | null,
  enabled = true
) {
  return useQuery({
    queryKey: coordinates
      ? weatherKeys.current(coordinates)
      : ["weather", "current", "null"],
    queryFn: () => {
      if (!coordinates) throw new Error("Coordenadas não fornecidas");
      return weatherService.getCurrentWeatherByCoords(
        coordinates.lat,
        coordinates.lon
      );
    },
    enabled: enabled && !!coordinates,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
}

// Hook para previsão de 5 dias por cidade
export function useForecast(cityName: string, enabled = true) {
  return useQuery({
    queryKey: weatherKeys.forecast(cityName),
    queryFn: () => weatherService.getForecast(cityName),
    enabled: enabled && !!cityName,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
  });
}

// Hook para previsão de 5 dias por coordenadas
export function useForecastByCoords(
  coordinates: { lat: number; lon: number } | null,
  enabled = true
) {
  return useQuery({
    queryKey: coordinates
      ? weatherKeys.forecast(coordinates)
      : ["weather", "forecast", "null"],
    queryFn: () => {
      if (!coordinates) throw new Error("Coordenadas não fornecidas");
      return weatherService.getForecastByCoords(
        coordinates.lat,
        coordinates.lon
      );
    },
    enabled: enabled && !!coordinates,
    staleTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
  });
}

// Hook para buscar localizações
export function useLocationSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: weatherKeys.search(query),
    queryFn: () => weatherService.searchLocations(query),
    enabled: enabled && query.length > 2, // Só busca com mais de 2 caracteres
    staleTime: 15 * 60 * 1000, // 15 minutos
    retry: 1,
  });
}

// Hook para obter localização atual do usuário
export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: weatherService.getCurrentPosition,
    onMutate: () => {
      setIsLoading(true);
      setError(null);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
    onError: (error: Error) => {
      setIsLoading(false);
      setError(error.message);
    },
  });

  return {
    getCurrentPosition: mutation.mutate,
    coordinates: mutation.data,
    isLoading: isLoading || mutation.isPending,
    error: error || mutation.error?.message,
    isSuccess: mutation.isSuccess,
  };
}

// Hook para gerenciar cidades favoritas (versão simplificada)
export function useWeatherDashboard() {
  const [favoriteCities, setFavoriteCities] = useState<string[]>([
    "São Paulo",
    "Rio de Janeiro",
  ]);
  const queryClient = useQueryClient();

  const addFavoriteCity = (cityName: string) => {
    if (!favoriteCities.includes(cityName) && favoriteCities.length < 5) {
      setFavoriteCities((prev) => [...prev, cityName]);
    }
  };

  const removeFavoriteCity = (cityName: string) => {
    setFavoriteCities((prev) => prev.filter((city) => city !== cityName));
    // Limpar cache da cidade removida
    queryClient.removeQueries({ queryKey: weatherKeys.current(cityName) });
    queryClient.removeQueries({ queryKey: weatherKeys.forecast(cityName) });
  };

  return {
    favoriteCities,
    addFavoriteCity,
    removeFavoriteCity,
  };
}
