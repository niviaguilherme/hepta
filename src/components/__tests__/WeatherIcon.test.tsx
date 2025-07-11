import { render, screen } from "@testing-library/react";
import { WeatherIcon } from "../WeatherIcon";

// Mock do weatherService
jest.mock("@/services/weatherService", () => ({
  weatherService: {
    getWeatherIconUrl: jest.fn(
      (weatherCode: number, size: string) =>
        `https://openweathermap.org/img/wn/0${weatherCode}d@${size}.png`
    ),
  },
}));

describe("WeatherIcon", () => {
  it("should render weather icon with iconCode", () => {
    render(<WeatherIcon iconCode="01d" alt="Clear sky" />);

    const image = screen.getByRole("img");
    expect(image).toBeDefined();
    expect(image.getAttribute("alt")).toBe("Clear sky");
    expect(image.getAttribute("src")).toContain("01d");
  });

  it("should render weather icon with weatherCode", () => {
    render(<WeatherIcon weatherCode={1} alt="Clear sky" />);

    const image = screen.getByRole("img");
    expect(image).toBeDefined();
    expect(image.getAttribute("alt")).toBe("Clear sky");
    expect(image.getAttribute("src")).toContain("01d");
  });

  it("should render loading state", () => {
    const { container } = render(
      <WeatherIcon iconCode="01d" alt="Clear sky" loading={true} />
    );

    const image = screen.queryByRole("img");
    expect(image).toBeNull();

    // Verifica se o elemento de loading está presente (div com spinner)
    const loadingDiv = container.querySelector(".animate-spin");
    expect(loadingDiv).toBeTruthy();
  });

  it("should render with 4x size", () => {
    render(<WeatherIcon iconCode="01d" alt="Clear sky" size="4x" />);

    const image = screen.getByRole("img");
    expect(image).toBeDefined();
    expect(image.getAttribute("src")).toContain("4x");
  });

  it("should use fallback icon when no iconCode or weatherCode provided", () => {
    render(<WeatherIcon alt="Default" />);

    const image = screen.getByRole("img");
    expect(image).toBeDefined();
    expect(image.getAttribute("src")).toContain("01d");
  });
});
