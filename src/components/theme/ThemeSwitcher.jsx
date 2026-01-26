import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-pink-400" />
      ) : (
        <Moon className="w-5 h-5 text-pink-600" />
      )}
    </Button>
  );
}