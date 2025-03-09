declare module 'flowbite-react' {
  import { ComponentType, ReactNode } from 'react';

  interface BadgeProps {
    color?: 'info' | 'gray' | 'failure' | 'success' | 'warning' | 'indigo' | 'purple' | 'pink';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    children: ReactNode;
  }

  interface CardProps {
    children: ReactNode;
    className?: string;
  }

  interface TableProps {
    children: ReactNode;
  }

  interface NavbarProps {
    fluid?: boolean;
    className?: string;
    children: ReactNode;
  }

  interface SidebarProps {
    'aria-label'?: string;
    className?: string;
    children: ReactNode;
  }

  export const Badge: ComponentType<BadgeProps>;
  export const Card: ComponentType<CardProps>;
  export const Table: ComponentType<TableProps> & {
    Head: ComponentType<{ children: ReactNode }>;
    Body: ComponentType<{ className?: string; children: ReactNode }>;
    Row: ComponentType<{ className?: string; children: ReactNode }>;
    Cell: ComponentType<{ className?: string; children: ReactNode }>;
    HeadCell: ComponentType<{ children: ReactNode }>;
  };
  export const Navbar: ComponentType<NavbarProps> & {
    Brand: ComponentType<{ href?: string; children: ReactNode }>;
  };
  export const Sidebar: ComponentType<SidebarProps> & {
    Items: ComponentType<{ children: ReactNode }>;
    ItemGroup: ComponentType<{ children: ReactNode }>;
    Item: ComponentType<{
      as?: any;
      href?: string;
      icon?: any;
      active?: boolean;
      children: ReactNode;
    }>;
  };
} 