import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LogOut, User, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ttsService } from "@/lib/tts-service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(() => ttsService.isEnabled());
  const { user, logout } = useAuth();

  const handleTTSToggle = () => {
    const newState = ttsService.toggle();
    setTtsEnabled(newState);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/schedule", label: "Schedule" },
    { path: "/resources", label: "Resources" },
    { path: "/explore", label: "Explore" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2 skip-tts" data-testid="link-home">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">BizBudz</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant={isActive(link.path) ? "secondary" : "ghost"}
                  className="font-medium skip-tts"
                  data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            <div className="flex items-center gap-2">
              {/* TTS Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleTTSToggle}
                    data-testid="button-tts-toggle"
                    className="skip-tts"
                  >
                    {ttsEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="skip-tts">
                    {ttsEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
                  </p>
                </TooltipContent>
              </Tooltip>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="skip-tts" data-testid="button-user-menu">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="skip-tts">
                    <DropdownMenuItem onClick={logout} data-testid="button-logout">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/signin">
                    <Button variant="ghost" className="skip-tts" data-testid="button-signin-nav">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/join">
                    <Button variant="default" className="skip-tts" data-testid="button-join-nav">
                      Join Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <Button
                    variant={isActive(link.path) ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Link href="/join">
                <Button
                  variant="default"
                  className="w-full mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-join-mobile"
                >
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
