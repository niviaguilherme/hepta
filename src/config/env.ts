export const env = {
  openMeteo: {
    baseUrl: "https://api.open-meteo.com/v1",
    geocodingUrl: "https://geocoding-api.open-meteo.com/v1",
  },
} as const;

// Validação das variáveis de ambiente (não precisamos mais de API key!)
export function validateEnv() {
  // Open-Meteo não requer API key, então não há nada para validar
  console.log("✅ Open-Meteo configurado - sem necessidade de API key!");
}
