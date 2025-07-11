import { render, screen } from "@testing-library/react";
import { TemperatureDisplay } from "../TemperatureDisplay";

describe("TemperatureDisplay", () => {
  it("should render temperature value", () => {
    render(<TemperatureDisplay temperature={25.6} />);

    expect(screen.getByText("26°C")).toBeDefined();
  });

  it("should round temperature values", () => {
    render(<TemperatureDisplay temperature={25.4} />);

    expect(screen.getByText("25°C")).toBeDefined();
  });

  it("should display feels like temperature when provided", () => {
    render(<TemperatureDisplay temperature={25} feelsLike={27.3} />);

    expect(screen.getByText("25°C")).toBeDefined();
    expect(screen.getByText("Sensação: 27°C")).toBeDefined();
  });

  it("should display min and max temperatures when provided", () => {
    render(<TemperatureDisplay temperature={25} min={20.2} max={30.8} />);

    expect(screen.getByText("Min: 20°C")).toBeDefined();
    expect(screen.getByText("Max: 31°C")).toBeDefined();
  });

  it("should not display icon when showIcon is false", () => {
    const { container } = render(
      <TemperatureDisplay temperature={25} showIcon={false} />
    );

    // Verifica se não há SVG (ícone) no componente
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeNull();
  });
});
