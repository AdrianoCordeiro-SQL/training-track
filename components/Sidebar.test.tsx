import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import React from "react";

jest.mock("@/hooks/useAuth");
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock dos ícones para evitar complexidade de SVG no JSDOM
jest.mock("lucide-react", () => ({
  Home: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="home-icon" {...props} />
  ),
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="user-icon" {...props} />
  ),
  LogOut: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="logout-icon" {...props} />
  ),
}));

const mockUseAuth = useAuth as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

describe("Sidebar", () => {
  const logoutMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não deve renderizar na página de login", () => {
    mockUsePathname.mockReturnValue("/login");
    mockUseAuth.mockReturnValue({ logout: logoutMock });

    const { container } = render(<Sidebar />);
    expect(container.firstChild).toBeNull();
  });

  it("deve renderizar os itens de navegação e destacar o ativo", () => {
    mockUsePathname.mockReturnValue("/profile");
    mockUseAuth.mockReturnValue({
      userName: "John Doe",
      userInitials: "JD",
      avatarUrl: null,
      logout: logoutMock,
    });

    render(<Sidebar />);

    const homeLink = screen.getByRole("link", { name: /início/i });
    const profileLink = screen.getByRole("link", { name: /perfil/i });

    expect(homeLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();

    // Profile deve estar ativo
    expect(profileLink).toHaveClass("text-emerald-500");
    // Home não deve estar ativo
    expect(homeLink).not.toHaveClass("text-emerald-500");
    expect(homeLink).toHaveClass("text-zinc-400");
  });

  it("deve exibir as iniciais do usuário quando avatarUrl não for fornecido", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      userName: "Jane Doe",
      userInitials: "JD",
      avatarUrl: null,
      logout: logoutMock,
    });

    render(<Sidebar />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("deve exibir o avatar do usuário quando avatarUrl for fornecido", () => {
    const avatar = "http://example.com/avatar.png";
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({
      userName: "Jane Doe",
      userInitials: "JD",
      avatarUrl: avatar,
      logout: logoutMock,
    });

    render(<Sidebar />);
    const avatarImg = screen.getByAltText("Avatar");
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute("src", avatar);
  });

  it("deve chamar o logout quando o botão de logout do desktop for clicado", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ logout: logoutMock });

    render(<Sidebar />);

    // Encontra o botão de sair do desktop (o que contém o texto 'Sair')
    const desktopLogoutButton = screen.getByRole("button", { name: /sair/i });
    fireEvent.click(desktopLogoutButton);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it("deve chamar o logout quando o botão de logout móvel for clicado", () => {
    mockUsePathname.mockReturnValue("/");
    mockUseAuth.mockReturnValue({ logout: logoutMock });

    render(<Sidebar />);

    // Encontra o botão de sair do mobile (o que NÃO contém o texto 'Sair', mas tem o ícone)
    // Existem dois botões com o ícone, mas um deles é o de desktop.
    // Vamos pegar todos e clicar no que está visível para mobile.
    const logoutButtons = screen.getAllByTestId("logout-icon");
    const mobileLogoutButton = logoutButtons.find((btn) =>
      btn.closest("button")?.classList.contains("md:hidden"),
    );

    expect(mobileLogoutButton).toBeInTheDocument();
    fireEvent.click(mobileLogoutButton!.closest("button")!);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
