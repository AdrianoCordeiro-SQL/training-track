import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

// Mock do next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from "next/navigation";

const mockUsePathname = usePathname as jest.Mock;

describe("Header", () => {
  it("deve renderizar o cabeçalho com o logotipo e o nome do aplicativo em uma página genérica", () => {
    mockUsePathname.mockReturnValue("/dashboard");
    render(<Header />);

    // Verifica se o nome do app (parte dele) está visível
    expect(screen.getByText("Training")).toBeInTheDocument();
    expect(screen.getByText("Track")).toBeInTheDocument();

    // Verifica se o HomeButton (identificado pelo seu link) está presente
    expect(screen.getByRole("link")).toHaveAttribute("href", "/");
  });

  it("não deve renderizar na página de login", () => {
    mockUsePathname.mockReturnValue("/login");
    const { container } = render(<Header />);

    // O container deve estar vazio pois o componente retorna null
    expect(container.firstChild).toBeNull();
  });

  it("não deve renderizar na página de registro", () => {
    mockUsePathname.mockReturnValue("/register");
    const { container } = render(<Header />);

    // O container deve estar vazio
    expect(container.firstChild).toBeNull();
  });
});
