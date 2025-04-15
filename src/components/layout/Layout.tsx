
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  HomeIcon, 
  BookOpenIcon, 
  Users2Icon, 
  UserIcon, 
  LayoutDashboardIcon, 
  CalendarIcon,
  LogOutIcon,
  MenuIcon,
  ShieldIcon,
  FileTextIcon,
  BarChart3Icon,
  MessageSquareIcon,
  SettingsIcon,
  BellIcon,
  ClipboardCheckIcon,
  HardHatIcon,
  BriefcaseIcon,
  BuildingIcon,
  ClockIcon,
  FolderIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  items?: MenuItem[];
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<number>(3);

  const getInitials = (nom?: string, prenom?: string) => {
    if (!nom || !prenom) return "U";
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const getRoleMenuItems = (): MenuItem[] => {
    if (!user) return [];

    const commonItems = [
      { name: "Tableau de bord", path: "/", icon: LayoutDashboardIcon },
    ];

    switch (user.role) {
      case 'administrateur':
        return [
          ...commonItems,
          { 
            name: "Formations", 
            path: "/formations", 
            icon: BookOpenIcon,
            items: [
              { name: "Formations HSE", path: "/formations/hse", icon: ShieldIcon },
              { name: "Formations Métiers", path: "/formations/metiers", icon: BriefcaseIcon },
              { name: "Toutes les formations", path: "/formations", icon: FolderIcon }
            ]
          },
          { name: "Formateurs", path: "/formateurs", icon: Users2Icon },
          { name: "Participants", path: "/participants", icon: UserIcon },
          { 
            name: "Planning", 
            path: "/planning", 
            icon: CalendarIcon, 
            badge: "Urgent", 
            variant: "destructive" 
          },
          { name: "Vérifications HSE", path: "/hse/verification-documents", icon: FileTextIcon },
          { name: "Budget", path: "/budget", icon: BarChart3Icon },
          { name: "Collaboration", path: "/collaboration", icon: MessageSquareIcon },
          { name: "Admin Console", path: "/admin/console", icon: SettingsIcon }
        ];
      case 'formateur':
        return [
          { name: "Tableau de bord", path: "/formateur", icon: LayoutDashboardIcon },
          { name: "Mes formations", path: "/formateur/formations", icon: BookOpenIcon },
          { name: "Mon planning", path: "/formateur/planning", icon: CalendarIcon },
          { name: "Pointage", path: "/formateur/pointage", icon: ClockIcon },
          { name: "Évaluations", path: "/formateur/evaluations", icon: ClipboardCheckIcon },
        ];
      case 'personnel':
        return [
          { name: "Tableau de bord", path: "/personnel", icon: LayoutDashboardIcon },
          { name: "Catalogue formations", path: "/personnel/formations", icon: BookOpenIcon },
          { name: "Mon historique", path: "/personnel/historique", icon: FileTextIcon },
        ];
      case 'sous-traitant':
        return [
          { name: "Tableau de bord", path: "/personnel", icon: LayoutDashboardIcon },
          { name: "Catalogue formations", path: "/personnel/formations", icon: BookOpenIcon },
          { name: "Mes documents", path: "/personnel/documents", icon: FileTextIcon },
        ];
      case 'hse':
        return [
          ...commonItems,
          { name: "Formations HSE", path: "/formations/hse", icon: ShieldIcon },
          { name: "Vérification documents", path: "/hse/verification-documents", icon: FileTextIcon, badge: "Nouveau", variant: "secondary" },
          { name: "Planning HSE", path: "/planning", icon: CalendarIcon },
          { name: "Évaluations", path: "/hse/evaluations", icon: ClipboardCheckIcon },
        ];
      case 'rh':
        return [
          ...commonItems,
          { 
            name: "Formations", 
            path: "/formations", 
            icon: BookOpenIcon,
            items: [
              { name: "Formations HSE", path: "/formations/hse", icon: ShieldIcon },
              { name: "Formations Métiers", path: "/formations/metiers", icon: BriefcaseIcon },
              { name: "Toutes les formations", path: "/formations", icon: FolderIcon }
            ]
          },
          { name: "Participants", path: "/participants", icon: UserIcon },
          { name: "Planning", path: "/planning", icon: CalendarIcon },
          { name: "Budget", path: "/budget", icon: BarChart3Icon },
          { name: "Appels d'offre", path: "/appels-offre", icon: BuildingIcon },
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getRoleMenuItems();

  const handleLogout = async () => {
    await logout();
  };

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!user && !location.pathname.includes('/login')) {
      navigate('/login');
    }
  }, [user, navigate, location]);

  // Fonction pour rendre les éléments de menu avec sous-menus éventuels
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <SidebarMenuItem key={item.path}>
        {item.items ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <Badge variant={item.variant || "default"} className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {item.items.map(subItem => (
                <DropdownMenuItem key={subItem.path} asChild>
                  <Link to={subItem.path} className="flex items-center gap-3">
                    <subItem.icon className="h-4 w-4" />
                    <span>{subItem.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <SidebarMenuButton asChild>
            <Link to={item.path} className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge variant={item.variant || "default"} className="ml-2">
                  {item.badge}
                </Badge>
              )}
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    ));
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* Desktop sidebar */}
        <Sidebar className="hidden md:flex h-screen sticky top-0">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                CTC
              </div>
              <span className="font-bold text-lg">CertTrackCentral</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {renderMenuItems(menuItems)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="h-5 w-5 mr-3" />
                  <span>Se déconnecter</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity",
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:hidden",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                CTC
              </div>
              <span className="font-bold text-lg">CertTrackCentral</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          </div>
          <div className="p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={item.variant || "default"} className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent text-destructive w-full text-left mt-4"
              >
                <LogOutIcon className="h-5 w-5" />
                <span>Se déconnecter</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top navigation */}
          <header className="h-16 border-b bg-white flex items-center px-4 sticky top-0 z-30">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <MenuIcon className="h-6 w-6" />
                </Button>
                <div className="md:hidden flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                    CTC
                  </div>
                </div>
                <div className="hidden md:block">
                  <SidebarTrigger />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <BellIcon className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={`${user.prenom} ${user.nom}`} />
                        ) : (
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {getInitials(user.nom, user.prenom)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user ? `${user.prenom} ${user.nom}` : "Utilisateur"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-xs leading-none text-muted-foreground capitalize mr-2">
                            {user.role}
                          </p>
                          {user.role === 'administrateur' && (
                            <Badge variant="secondary" className="text-xs">Admin</Badge>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Mon profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/parametres")}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      <span>Se déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
