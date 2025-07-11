"use client";

import { useState } from "react";
import { WeatherCard } from "./WeatherCard";
import { CurrentLocationWeather } from "./CurrentLocationWeather";
import { useWeatherDashboard, useLocationSearch } from "@/hooks/useWeather";
import { FiPlus, FiCloud } from "react-icons/fi";

export function WeatherDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { favoriteCities, addFavoriteCity, removeFavoriteCity } =
    useWeatherDashboard();
  const { data: searchResults } = useLocationSearch(searchQuery);

  const handleAddCity = (cityName: string) => {
    if (!cityName.trim()) return;
    addFavoriteCity(cityName.trim());
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="flex flex-col gap-8">
          {/* Cabeçalho */}
          <div className="flex flex-col items-center gap-6 text-center relative">
            {/* Efeito de brilho no fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-3xl blur-3xl -z-10"></div>

            <div className="flex items-center gap-4 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FiCloud size={24} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Previsão do Tempo
              </h1>
            </div>
            <p className="text-gray-700 text-xl font-medium max-w-2xl">
              Acompanhe o clima das suas cidades favoritas com dados precisos e
              atualizados
            </p>
          </div>

          {/* Clima da Localização Atual */}
          <div className="max-w-2xl mx-auto w-full h-[32rem]">
            <CurrentLocationWeather />
          </div>

          {/* Barra de pesquisa */}
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-3xl shadow-xl border border-white/60 backdrop-blur-sm">
            {/* Efeito de brilho */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-3xl blur-xl"></div>

            <div className="relative flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Pesquisar cidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl 
                             focus:bg-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300
                             placeholder-gray-500 text-gray-800 font-medium transition-all duration-300
                             shadow-lg hover:shadow-xl"
                  />
                  {/* Ícone de pesquisa */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiCloud size={20} />
                  </div>
                </div>

                <button
                  onClick={() => handleAddCity(searchQuery)}
                  disabled={!searchQuery.trim()}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 
                           text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 
                           disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed 
                           transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 
                           active:scale-95 font-medium"
                >
                  <FiPlus size={18} />
                  <span>Adicionar</span>
                </button>
              </div>

              {/* Sugestões de pesquisa */}
              {searchResults &&
                searchResults.length > 0 &&
                searchQuery.length > 2 && (
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FiCloud size={14} className="text-blue-500" />
                      Sugestões:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {searchResults.slice(0, 5).map((location, index) => (
                        <button
                          key={index}
                          className="px-4 py-2 text-sm bg-white/80 backdrop-blur-sm border border-white/90 
                                   rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
                                   hover:border-blue-200 hover:shadow-lg transition-all duration-300 
                                   text-gray-700 font-medium hover:text-blue-700 hover:scale-105"
                          onClick={() =>
                            handleAddCity(
                              `${location.name}, ${location.country}`
                            )
                          }
                        >
                          {location.name}, {location.country}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Grid de cidades */}
          {favoriteCities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {favoriteCities.map((city) => (
                <div key={city} className="h-[32rem]">
                  <WeatherCard
                    cityName={city}
                    onRemove={() => removeFavoriteCity(city)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-16 px-8 rounded-3xl shadow-xl border border-white/60 backdrop-blur-sm">
              {/* Efeito de brilho sutil */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-400/5 via-gray-400/5 to-blue-400/5 rounded-3xl blur-2xl"></div>

              <div className="relative flex flex-col items-center gap-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                  <FiCloud size={36} className="text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-700">
                    Nenhuma cidade adicionada
                  </h3>
                  <p className="text-gray-600 text-lg max-w-md">
                    Adicione suas primeiras cidades para começar a acompanhar o
                    clima
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informações adicionais */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl shadow-lg">
              <FiCloud size={16} className="text-blue-500" />
              <p className="text-gray-600 text-sm font-medium">
                Dados fornecidos por Open-Meteo • Atualização automática a cada
                5 minutos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
