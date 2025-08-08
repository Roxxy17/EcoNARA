"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Leaf,
  Home,
  Package,
  CheckSquare,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Camera,
  Heart,
  Wheat,
  TrendingUp,
  ShoppingCart,
  Menu,
  Landmark,
  Shield, // <-- TAMBAHKAN IKON INI
} from 'lucide-react'
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { userProfile, loadingUser, setUserProfile } = useUser();
  const userDisplayName = userProfile?.name || "Pengguna";
  const userEmail = userProfile?.email || "email@example.com";
  const userInitial = userDisplayName.charAt(0).toUpperCase();
  const userRole = userProfile?.role;

  let navItemsToShow;

  if (userRole === 'admin') {
    // Navigasi khusus untuk role 'admin'
    navItemsToShow = [
      // --- MENU BARU DITAMBAHKAN DI SINI ---
      { label: "Home", href: "/dashboard", icon: Home, type: "link" },
      { label: "Dashboard", href: "/admin/dashboard", icon: Shield, type: "link" },
      {
        label: "Admin",
        icon: Settings,
        type: "dropdown",
        items: [
          { label: "Kelola Donasi", href: "/admin/donasi", icon: Heart, description: "Lihat dan kelola data donasi." },
          { label: "Tambah Desa", href: "/admin/desa", icon: Landmark, description: "Tambahkan data desa baru ke sistem." }
        ],
      },
    ];
  } else {
    // Logika navigasi yang sudah ada untuk role lainnya
    const navItems = [
      { label: "Dashboard", href: "/dashboard", icon: Home, type: "link" },
      {
        label: "Produk",
        icon: Package,
        type: "dropdown",
        items: [
          { label: "Kelola Stok", href: "/manage-stock", icon: Package, description: "Atur inventaris dan produk Anda." }
        ],
      },
      {
        label: "Aksi Lingkungan",
        icon: Leaf,
        type: "dropdown",
        items: [
          { label: "Eco Habit Tracker", href: "/habit-tracker", icon: CheckSquare, description: "Lacak kebiasaan ramah lingkungan Anda." },
          { label: "Trash Classifier", href: "/trash-classifier", icon: Camera, description: "Identifikasi dan pilah sampah Anda." },
          { label: "Donasi", href: "/donations", icon: Heart, description: "Berikan donasi untuk lingkungan." },
          { label: "Food Rescue", href: "/food-rescue", icon: Wheat, description: "Selamatkan makanan dari pemborosan." },
        ],
      },
      { label: "Leaderboard", href: "/leaderboard", icon: TrendingUp, type: "link" },
    ];

    let finalNavItems = [...navItems];

    finalNavItems = finalNavItems.filter(item => {
      if (item.label === "Aksi Lingkungan" && userRole === "ketua") {
        return false;
      }
      return true;
    });

    if (userRole === "ketua") {
      const produkItemIndex = finalNavItems.findIndex(item => item.label === "Produk");
      if (produkItemIndex !== -1) {
        const verifikasiItem = {
          label: "Verifikasi RT",
          href: "/rt/verification",
          icon: CheckSquare,
          description: "Verifikasi kontribusi dari warga RT."
        };
        finalNavItems[produkItemIndex].items.push(verifikasiItem);
      }
    }

    navItemsToShow = finalNavItems.map(item => {
      if (item.label === "Produk" && item.type === "dropdown") {
        const updatedItems = item.items.map(subItem => {
          if (subItem.label === "Kelola Stok") {
            const newHref = (userRole === "ketua") ? "/manage-stock/rt" : "/manage-stock";
            return { ...subItem, href: newHref };
          }
          return subItem;
        });
        return { ...item, items: updatedItems };
      }
      return item;
    });
  }

  const handleLogout = () => {
    router.push("/logout");
  }

  return (
    <nav className="bg-white/90 backdrop-blur-lg border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" passHref>
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800">ECONARA</span>
          </div>
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navItemsToShow.map((item) => (
              item.type === "link" ? (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        pathname === item.href && "bg-gray-100 text-green-700"
                      )}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                      <span>{item.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuTrigger className={cn(
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    item.items.some(subItem => pathname.startsWith(subItem.href)) && "bg-gray-100 text-green-700"
                  )}>
                    {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {item.items.map((subItem) => (
                        <li key={subItem.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                pathname.startsWith(subItem.href) && "bg-gray-100 text-green-700"
                              )}
                            >
                              <div className="text-sm font-medium leading-none flex items-center">
                                {subItem.icon && <subItem.icon className="w-4 h-4 mr-2" />}
                                {subItem.label}
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {subItem.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-2 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-white/95 backdrop-blur-lg">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-gray-800">ECONARA</span>
                </SheetTitle>
                <SheetDescription>
                  Navigasi utama aplikasi Anda.
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-2 mt-6">
                {navItemsToShow.map((item) => (
                  item.type === "link" ? (
                    <Link href={item.href} key={item.href} passHref>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start flex items-center space-x-2",
                          pathname === item.href && "bg-gray-100 text-green-700"
                        )}
                      >
                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ) : (
                    <div key={item.label} className="w-full">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start flex items-center space-x-2",
                          item.items.some(subItem => pathname.startsWith(subItem.href)) && "bg-gray-100 text-green-700"
                        )}
                      >
                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                        <span>{item.label}</span>
                      </Button>
                      <div className="ml-4 border-l pl-2 py-1 space-y-1">
                        {item.items.map((subItem) => (
                          <Link href={subItem.href} key={subItem.href} passHref>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-sm flex items-center space-x-2",
                                pathname.startsWith(subItem.href) && "bg-gray-100 text-green-700"
                              )}
                            >
                              {subItem.icon && <subItem.icon className="w-3 h-3 mr-2" />}
                              <span>{subItem.label}</span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <DropdownMenuSeparator />
                <Link href="/profile" passHref>
                  <div className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </div>
                </Link>
                <Link href="/settings" passHref>
                  <div className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </div>
                </Link>
                <div onClick={handleLogout} className="flex items-center w-full p-2 hover:bg-red-50 text-red-600 rounded-md cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          {userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 pr-2 pl-2">
                  <div className="relative h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                    {userInitial}
                  </div>
                  <span className="hidden md:inline-block font-medium text-sm">{userDisplayName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userDisplayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userEmail}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}