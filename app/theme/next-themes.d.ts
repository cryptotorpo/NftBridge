declare module 'next-themes' {
  import { ReactNode, Component } from 'react';

  export interface ThemeProviderProps {
    children?: ReactNode;
    attribute: string;
  }
  export class ThemeProvider extends Component<ThemeProviderProps> {}

  interface ThemeContextProps {
    theme: string;
    setTheme: (themeName: string) => void;
  }

  export function useTheme(): ThemeContextProps;
}
