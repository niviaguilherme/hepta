import { render } from "@testing-library/react";
import { WeatherCard } from "../WeatherCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock dos hooks
const mockUseCurrentWeather = jest.fn();
const mockUseForecast = jest.fn();

jest.mock("@/hooks/useWeather", () => ({
  useCurrentWeather: () => mockUseCurrentWeather(),
  useForecast: () => mockUseForecast(),
}));

// Mock dos componentes filhos
jest.mock("../WeatherIcon", () => ({
  WeatherIcon: () => <div data-testid="weather-icon">Weather Icon</div>,
}));

jest.mock("../TemperatureDisplay", () => ({
  TemperatureDisplay: () => <div data-testid="temperature-display">25°C</div>,
}));

jest.mock("../WeatherImage", () => ({
  WeatherImage: () => <div data-testid="weather-image">Weather Image</div>,
}));

// Helper para wrapper com QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("WeatherCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state", () => {
    mockUseCurrentWeather.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseForecast.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const { container } = render(
      <WeatherCard cityName="São Paulo" onRemove={() => {}} />,
      { wrapper: createWrapper() }
    );

    // Verifica se o componente renderiza (teste básico)
    expect(container.firstChild).toBeTruthy();
  });

  it("should render error state", () => {
    mockUseCurrentWeather.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Network error" },
      refetch: jest.fn(),
    });

    mockUseForecast.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const { container } = render(
      <WeatherCard cityName="São Paulo" onRemove={() => {}} />,
      { wrapper: createWrapper() }
    );

    // Verifica se o componente renderiza (teste básico)
    expect(container.firstChild).toBeTruthy();
  });

  it("should render with valid data", () => {
    const mockCurrentData = {
      latitude: -23.5505,
      longitude: -46.6333,
      current: {
        temperature_2m: 25,
        relative_humidity_2m: 65,
        apparent_temperature: 27,
        precipitation: 0,
        weather_code: 1,
        cloud_cover: 20,
        pressure_msl: 1013,
        wind_speed_10m: 2.5,
        wind_direction_10m: 180,
        time: "2023-12-01T12:00:00Z",
        rain: 0,
      },
      current_units: {
        temperature_2m: "°C",
        relative_humidity_2m: "%",
        apparent_temperature: "°C",
        precipitation: "mm",
        weather_code: "",
        cloud_cover: "%",
        pressure_msl: "hPa",
        wind_speed_10m: "km/h",
        wind_direction_10m: "°",
        time: "",
        rain: "mm",
      },
      name: "São Paulo",
      country: "BR",
    };

    const mockForecastData = {
      latitude: -23.5505,
      longitude: -46.6333,
      daily: {
        time: ["2023-12-01", "2023-12-02", "2023-12-03"],
        weather_code: [1, 2, 3],
        temperature_2m_max: [25, 26, 24],
        temperature_2m_min: [18, 19, 17],
        precipitation_sum: [0, 1, 0],
        wind_speed_10m_max: [10, 15, 12],
      },
      daily_units: {
        time: "",
        weather_code: "",
        temperature_2m_max: "°C",
        temperature_2m_min: "°C",
        precipitation_sum: "mm",
        wind_speed_10m_max: "km/h",
      },
    };

    mockUseCurrentWeather.mockReturnValue({
      data: mockCurrentData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseForecast.mockReturnValue({
      data: mockForecastData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
    });

    const { container } = render(
      <WeatherCard cityName="São Paulo" onRemove={() => {}} />,
      { wrapper: createWrapper() }
    );

    // Verifica se o componente renderiza (teste básico)
    expect(container.firstChild).toBeTruthy();
  });
});
