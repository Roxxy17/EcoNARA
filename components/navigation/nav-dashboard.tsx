"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
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
  Menu,
  Landmark,
  Shield,
} from "lucide-react"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useUser } from "@/contexts/UserContext"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { userProfile, loadingUser, setUserProfile } = useUser()

  console.log("userProfile", userProfile)

  // Ambil nama dan email user dengan fallback yang jelas
  const userName =
    userProfile?.nama && userProfile?.nama !== ""
      ? userProfile.nama
      : userProfile?.user_metadata?.name && userProfile?.user_metadata?.name !== ""
      ? userProfile.user_metadata.name
      : userProfile?.user_metadata?.full_name && userProfile?.user_metadata?.full_name !== ""
      ? userProfile.user_metadata.full_name
      : userProfile?.email
      ? userProfile.email
      : "Pengguna";
  const userEmail = userProfile?.email || userProfile?.user_metadata?.email || "email@example.com"
  const userInitial = userName.charAt(0).toUpperCase()
  const userRole = userProfile?.role

  let navItemsToShow

  if (userRole === "admin") {
    navItemsToShow = [
      { label: "Home", href: "/dashboard", icon: Home, type: "link" },
      { label: "Dashboard", href: "/admin/dashboard", icon: Shield, type: "link" },
      {
        label: "Admin",
        icon: Settings,
        type: "dropdown",
        items: [
          { label: "Kelola Donasi", href: "/admin/donasi", icon: Heart, description: "Lihat dan kelola data donasi." },
          {
            label: "Tambah Desa",
            href: "/admin/desa",
            icon: Landmark,
            description: "Tambahkan data desa baru ke sistem.",
          },
        ],
      },
    ]
  } else {
    const navItems = [
      { label: "Dashboard", href: "/dashboard", icon: Home, type: "link" },
      {
        label: "Produk",
        icon: Package,
        type: "dropdown",
        items: [
          {
            label: "Kelola Stok",
            href: "/manage-stock",
            icon: Package,
            description: "Atur inventaris dan produk Anda.",
          },
        ],
      },
      {
        label: "Aksi Lingkungan",
        icon: CheckSquare,
        type: "dropdown",
        items: [
          {
            label: "Eco Habit Tracker",
            href: "/habit-tracker",
            icon: CheckSquare,
            description: "Lacak kebiasaan ramah lingkungan Anda.",
          },
          {
            label: "Trash Classifier",
            href: "/trash-classifier",
            icon: Camera,
            description: "Identifikasi dan pilah sampah Anda.",
          },
          { label: "Donasi", href: "/donations", icon: Heart, description: "Berikan donasi untuk lingkungan." },
          {
            label: "Food Rescue",
            href: "/food-rescue",
            icon: Wheat,
            description: "Selamatkan makanan dari pemborosan.",
          },
        ],
      },
      { label: "Leaderboard", href: "/leaderboard", icon: TrendingUp, type: "link" },
    ]

    let finalNavItems = [...navItems]

    finalNavItems = finalNavItems.filter((item) => {
      if (item.label === "Aksi Lingkungan" && userRole === "ketua") {
        return false
      }
      return true
    })

    if (userRole === "ketua") {
      const produkItemIndex = finalNavItems.findIndex((item) => item.label === "Produk")
      if (produkItemIndex !== -1) {
        const verifikasiItem = {
          label: "Verifikasi RT",
          href: "/rt/verification",
          icon: CheckSquare,
          description: "Verifikasi kontribusi dari warga RT.",
        }
        finalNavItems[produkItemIndex].items.push(verifikasiItem)
      }
    }

    navItemsToShow = finalNavItems.map((item) => {
      if (item.label === "Produk" && item.type === "dropdown") {
        const updatedItems = item.items.map((subItem) => {
          if (subItem.label === "Kelola Stok") {
            const newHref = userRole === "ketua" ? "/manage-stock/rt" : "/manage-stock"
            return { ...subItem, href: newHref }
          }
          return subItem
        })
        return { ...item, items: updatedItems }
      }
      return item
    })
  }

  const handleLogout = () => {
    router.push("/logout")
  }

  return (
    <nav className="backdrop-blur-xl bg-gradient-to-r from-cyan-500/95 via-blue-500/95 to-teal-500/95 border-b border-white/20 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" passHref>
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center bg-white/95 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Image src="/logo.png" alt="EcoNara Logo" width={32} height={32} className="object-contain" priority />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent leading-tight tracking-tight">
                EcoNara
              </span>
              {/* Tampilkan nama user yang login */}
              <span className="text-xs text-cyan-100/90 font-semibold tracking-wider uppercase">
                {userName}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation - Enhanced */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-2">
            {navItemsToShow.map((item) =>
              item.type === "link" ? (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group inline-flex h-11 w-max items-center justify-center rounded-2xl px-5 py-2 text-sm font-semibold transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 hover:shadow-lg",
                        pathname === item.href && "bg-white/25 shadow-lg scale-105",
                      )}
                    >
                      {item.icon && <item.icon className="w-4 h-4 mr-2 opacity-90" />}
                      <span>{item.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.label}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "group inline-flex h-11 w-max items-center justify-center rounded-2xl px-5 py-2 text-sm font-semibold transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 hover:shadow-lg",
                          item.items.some((subItem) => pathname.startsWith(subItem.href)) &&
                            "bg-white/25 shadow-lg scale-105",
                        )}
                      >
                        {item.icon && <item.icon className="w-4 h-4 mr-2 opacity-90" />}
                        {item.label}
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 rounded-2xl bg-white/98 backdrop-blur-xl shadow-2xl border border-cyan-100/50 overflow-hidden mt-2">
                      {item.items.map((subItem) => (
                        <DropdownMenuItem asChild key={subItem.href}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "flex items-center w-full p-3 rounded-xl mx-2 my-1 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300",
                              pathname.startsWith(subItem.href) && "bg-gradient-to-r from-cyan-50 to-blue-50 shadow-md"
                            )}
                          >
                            {subItem.icon && <subItem.icon className="w-4 h-4 mr-2 text-cyan-600" />}
                            <div>
                              <div className="text-sm font-semibold text-cyan-900">{subItem.label}</div>
                              <div className="text-xs text-cyan-700">{subItem.description}</div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Navigation Button */}
        <div className="flex items-center space-x-3 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] sm:w-[320px] bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 text-white border-r border-white/20 p-0"
            >
              <SheetHeader className="pb-6 px-6 pt-6">
                <SheetTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/95 shadow-lg">
                    <Image
                      src="/logo.png"
                      alt="EcoNara Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-xl bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent leading-tight">
                      EcoNara
                    </span>
                    <span className="text-xs text-cyan-100/90 font-semibold tracking-wider uppercase">
                      OCEAN PLATFORM
                    </span>
                  </div>
                </SheetTitle>
                <SheetDescription className="text-cyan-100/80">Navigasi platform berkelanjutan Anda</SheetDescription>
              </SheetHeader>

              <div className="flex flex-col space-y-3 mt-6 px-4 pb-32">
                {navItemsToShow.map((item) =>
                  item.type === "link" ? (
                    <Link href={item.href} key={item.href} passHref>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start flex items-center space-x-3 text-white bg-white/10 backdrop-blur-sm rounded-xl shadow-sm font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 h-12",
                          pathname === item.href && "bg-white/25 shadow-lg scale-105",
                        )}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ) : (
                    <div key={item.label} className="w-full space-y-2">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start flex items-center space-x-3 text-white bg-white/10 backdrop-blur-sm rounded-xl shadow-sm font-semibold hover:bg-white/20 transition-all duration-300 h-12",
                          item.items.some((subItem) => pathname.startsWith(subItem.href)) && "bg-white/25 shadow-lg",
                        )}
                      >
                        {item.icon && <item.icon className="w-5 h-5" />}
                        <span>{item.label}</span>
                      </Button>
                      <div className="ml-6 space-y-2 border-l-2 border-white/20 pl-4">
                        {item.items.map((subItem) => (
                          <Link href={subItem.href} key={subItem.href} passHref>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start text-sm flex items-center space-x-3 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg shadow-sm font-medium hover:bg-white/15 hover:scale-105 transition-all duration-300 h-10",
                                pathname.startsWith(subItem.href) && "bg-white/20 shadow-md scale-105",
                              )}
                            >
                              {subItem.icon && <subItem.icon className="w-4 h-4" />}
                              <span>{subItem.label}</span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Mobile Footer Actions */}
              <div className="fixed bottom-0 left-0 w-[280px] sm:w-[320px] px-4 pb-6 pt-4 bg-gradient-to-t from-cyan-500/80 via-blue-500/80 to-teal-500/60 backdrop-blur-lg z-50">
                <div className="h-px bg-white/20 mb-4" />
                <Link href="/profile" passHref>
                  <div className="flex items-center w-full p-3 hover:bg-white/15 rounded-xl cursor-pointer bg-white/10 backdrop-blur-sm shadow-sm text-white font-medium transition-all duration-300 hover:scale-105">
                    <User className="mr-3 h-5 w-5" />
                    <span>Profil</span>
                  </div>
                </Link>
                <Link href="/settings" passHref>
                  <div className="flex items-center w-full p-3 hover:bg-white/15 rounded-xl cursor-pointer bg-white/10 backdrop-blur-sm shadow-sm text-white font-medium transition-all duration-300 hover:scale-105">
                    <Settings className="mr-3 h-5 w-5" />
                    <span>Pengaturan</span>
                  </div>
                </Link>
                <div
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 hover:bg-red-500/20 text-red-200 rounded-xl cursor-pointer bg-red-500/10 backdrop-blur-sm shadow-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span>Keluar</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
                                                                                                  
        {/* Desktop User Section */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Notification Button */}
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full relative group transition-all duration-300 hover:bg-white/20 hover:scale-110 bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <Bell className="w-5 h-5 text-white group-hover:text-cyan-100 transition-colors" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full border-2 border-white shadow-lg animate-pulse"></span>
          </Button>

          {/* User Dropdown */}
          {userProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 pr-3 pl-3 text-white bg-white/10 backdrop-blur-sm rounded-2xl shadow-sm font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/20 h-11"
                >
                  <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 flex items-center justify-center text-sm font-bold text-cyan-900 shadow-lg">
                    {userInitial}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                  </div>
                  <span className="hidden md:inline-block font-semibold text-sm">{userName}</span>
                  <ChevronDown className="h-4 w-4 text-cyan-200 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 rounded-2xl bg-white/98 backdrop-blur-xl shadow-2xl border border-cyan-100/50 overflow-hidden">
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-200 to-blue-200 flex items-center justify-center text-base font-bold text-cyan-900 shadow-lg">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-none text-cyan-900">{userName}</p>
                        <p className="text-xs leading-none text-cyan-700 mt-1">{userEmail}</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyan-100/50" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center w-full p-3 rounded-xl mx-2 my-1 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300"
                  >
                    <User className="mr-3 h-5 w-5 text-cyan-600" />
                    <span className="text-cyan-900 font-medium">Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="flex items-center w-full p-3 rounded-xl mx-2 my-1 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300"
                  >
                    <Settings className="mr-3 h-5 w-5 text-cyan-600" />
                    <span className="text-cyan-900 font-medium">Pengaturan</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyan-100/50" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50 rounded-xl mx-2 my-1 p-3 transition-all duration-300"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="font-medium">Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}
