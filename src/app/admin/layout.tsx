
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  DollarSign,
  FileText,
  BarChart3,
  MessageSquareHeart,
  UsersRound,
  Settings,
  Megaphone,
  Activity,
  LogOut,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage users, profiles, and settings for Mitho Sambandha.',
};


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/mitho-sambandha-c4959.firebasestorage.app/o/mitho-Sambandha-Logo-.avif?alt=media&token=3de63ad0-a01e-466c-8454-d04da7df9533"
                alt="Mitho Sambandha Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <h2 className="font-headline text-xl text-primary">
                Mitho Sambandha
              </h2>
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/users">
                  <Users />
                  User Management (CRM)
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/matchmaking">
                  <HeartHandshake />
                  Match Management
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/monetization">
                  <DollarSign />
                  Monetization
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/content">
                  <FileText />
                  Content Management (CMS)
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/analytics">
                  <BarChart3 />
                  Analytics & Reports
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/support">
                  <MessageSquareHeart />
                  Support & Ticketing
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/community">
                  <UsersRound />
                  Community Features
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/settings">
                  <Settings />
                  Settings & Configuration
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/marketing">
                  <Megaphone />
                  Marketing & Campaigns
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/admin/monitoring">
                  <Activity />
                  System Monitoring
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <LogOut />
                  Exit Admin
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
