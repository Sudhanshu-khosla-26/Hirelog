"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { supabase } from "@/lib/supabase"
import { MdDashboard, MdWork, MdBusiness, MdPeople, MdPerson, MdSettings, MdAdd, MdMenu, MdClose, MdLogout } from "react-icons/md"

export default function Sidebar({ onCreateJob }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [activeItem, setActiveItem] = useState("dashboard")
    const [user, setUser] = useState(null)

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    //  Added sign out functionality
    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: MdDashboard },
        { id: "jobs", label: "Jobs", icon: MdWork },
        { id: "companies", label: "Companies", icon: MdBusiness },
        { id: "candidates", label: "Candidates", icon: MdPeople },
        // { id: "profile", label: "Profile", icon: MdPerson },
        { id: "settings", label: "Settings", icon: MdSettings },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed left-0 top-0 h-full bg-black border-r border-gray-800 z-50 transition-all duration-300 ease-in-out
        ${isCollapsed ? "-translate-x-full lg:w-16" : "w-64"}
        shadow-2xl shadow-black/50 rounded-r-lg
      `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                <MdWork className="w-4 h-4 text-gray-400" />
                            </div>
                            <h1 className="text-xl font-bold bg-gray-400 bg-clip-text text-transparent">
                                HireLog
                            </h1>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
                    >
                        {isCollapsed ? <MdMenu className="w-4 h-4" /> : <MdClose className="w-4 h-4" />}
                    </Button>
                </div>

                {/* Create Job Button */}
                <div className="p-4">
                    <Button
                        onClick={onCreateJob}
                        className={`
              w-full bg-cyan-600 hover:bg-primary
              text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200
              ${isCollapsed ? "px-2" : "px-4"}
            `}
                    >
                        <MdAdd className="w-4 h-4" />
                        {!isCollapsed && <span className="ml-2 leading-8">Create Job</span>}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeItem === item.id

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveItem(item.id)}
                                className={`
                  w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group relative overflow-hidden
                  ${isActive
                                        ? "bg-gradient-to-r from-cyan-600/20 to-emerald-600/20 text-cyan-400 shadow-lg"
                                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                                    }
                `}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-emerald-500 rounded-r" />
                                )}

                                <Icon
                                    className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"} transition-transform group-hover:scale-110`}
                                />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}

                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
                            </button>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 space-y-3">
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "space-x-3"}`}>
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
                            <MdPerson className="w-4 h-4 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                                </p>
                                <p className="text-xs text-gray-400 truncate">{user?.email || "Loading..."}</p>
                            </div>
                        )}
                    </div>

                    {/*  Added sign out button */}
                    <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className={`w-full bg-transparent border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 ${isCollapsed ? "px-2" : ""}`}
                    >
                        <MdLogout className="w-4 h-4" />
                        {!isCollapsed && <span className="ml-2">Sign Out</span>}
                    </Button>
                </div>
            </div>

            {/* Toggle button for desktop - shows when collapsed */}
            {isCollapsed && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-gray-800 hidden lg:flex"
                >
                    <MdMenu className="w-4 h-4" />
                </Button>
            )}
        </>
    )
}
