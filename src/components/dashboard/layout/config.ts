import type { NavItemConfig } from '@/types/nav';

export const navItems = [
  { key: 'dashboard', title: '???? ??????', href: '/dashboard', icon: 'chart-pie' },
  { key: 'home', title: '????????', href: '/', icon: 'user' },
  { key: 'archive', title: '????? ?????????', href: '/archive', icon: 'users' },
  { key: 'add', title: '????? ????', href: '/add-parasite', icon: 'plugs-connected' },
  { key: 'settings', title: '?????????', href: '/dashboard', icon: 'gear-six' }
] satisfies NavItemConfig[];
