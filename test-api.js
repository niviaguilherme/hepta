// Script para testar sua API key do OpenWeatherMap
require("dotenv").config({ path: ".env.local" });

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL =
  process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL ||
  "https://api.openweathermap.org/data/2.5";

console.log("🔑 Testando API Key do OpenWeatherMap...");
console.log(
  "API Key:",
  API_KEY ? `${API_KEY.substring(0, 8)}...` : "❌ NÃO ENCONTRADA"
);

if (!API_KEY || API_KEY === "your_api_key_here") {
  console.log("❌ ERRO: Configure sua API key no arquivo .env.local");
  console.log(
    "📝 Exemplo: NEXT_PUBLIC_OPENWEATHER_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  );
  process.exit(1);
}

// Testar com uma cidade
const testUrl = `${BASE_URL}/weather?q=London&appid=${API_KEY}&units=metric`;

fetch(testUrl)
  .then((response) => {
    console.log("📡 Status da resposta:", response.status);

    if (response.status === 401) {
      console.log("❌ ERRO 401: API key inválida ou não ativada");
      console.log("💡 Soluções:");
      console.log("   1. Verifique se a chave está correta");
      console.log("   2. Aguarde até 2 horas para ativação");
      console.log(
        "   3. Gere uma nova chave em: https://openweathermap.org/api_keys"
      );
      return null;
    }

    if (response.status === 200) {
      console.log("✅ SUCCESS: API key funcionando!");
      return response.json();
    }

    console.log("⚠️  Erro inesperado:", response.status);
    return response.text();
  })
  .then((data) => {
    if (data) {
      console.log(
        "📋 Dados recebidos:",
        data.name ? `${data.name}, ${data.sys?.country}` : "Dados válidos"
      );
    }
  })
  .catch((error) => {
    console.log("❌ Erro de rede:", error.message);
  });
