import React from 'react';
import { useThemeStore } from '../store/themeStore';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full w-10 h-10 border border-border/50 bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-300"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100 text-amber-500'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${isDark ? 'rotate-0 scale-100 text-indigo-400' : 'rotate-90 scale-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
