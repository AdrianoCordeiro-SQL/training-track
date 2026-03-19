import { render, screen } from "@testing-library/react";
import { HomeButton } from "./HomeButton";

describe("HomeButton", () => {
  it("deve renderizar um link", () => {
    render(<HomeButton />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toBeInTheDocument();
  });

  it("deve ter o atributo href correto", () => {
    render(<HomeButton />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "/");
  });

  it("deve ter o aria-label correto", () => {
    render(<HomeButton />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("aria-label", "Ir para o início");
  });

  it("deve renderizar o ícone do haltere", () => {
    const { container } = render(<HomeButton />);
    const svgElement = container.querySelector("svg");
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveClass("text-emerald-500");
  });
});
