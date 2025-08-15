"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { Badge } from "@/components/badge"
import { supabase } from "@/lib/supabase"
import Sidebar from "@/components/sidebar"
import JobDetailsModal from "@/components/job-details-modal"
import JobCreationModal from "@/components/job-creation-modal"
import { Briefcase, Calendar, Building } from "lucide-react"

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [jobDescriptions, setJobDescriptions] = useState([])
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        applications: 0,
        hired: 0,
    })

    const handleViewJob = (job) => {
        setSelectedJob(job)
        setIsJobDetailsOpen(true)
    }

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)

            if (user) {
                fetchJobDescriptions()
            }
        }

        getUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
            if (event === "SIGNED_OUT") {
                window.location.href = "/signin"
            } else if (session?.user) {
                fetchJobDescriptions()
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchJobDescriptions = async () => {
        try {
            const response = await fetch("/api/job-descriptions")
            if (response.ok) {
                const result = await response.json()
                setJobDescriptions(result.data || [])

                setStats({
                    totalJobs: result.data?.length || 0,
                    activeJobs: result.data?.length || 0, // All jobs are considered active for now
                    applications: Math.floor(Math.random() * 200) + 50, // Mock data for now
                    hired: Math.floor(Math.random() * 20) + 1, // Mock data for now
                })
            }
        } catch (error) {
            console.error("Error fetching job descriptions:", error)
        }
    }

    const handleJobCreated = () => {
        setIsModalOpen(false)
        fetchJobDescriptions() // Refresh the list
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now - date)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return "1 day ago"
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
        return date.toLocaleDateString()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-2 text-slate-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        window.location.href = "/signin"
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <Sidebar onCreateJob={() => setIsModalOpen(true)} />

            {/* Main Content */}
            <div className="lg:ml-64 transition-all duration-300">
                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Welcome back!
                        </h1>
                        <p className="text-slate-600 mt-2">Manage your job descriptions and recruitment process</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="h-32 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-cyan-100 text-sm">Total Jobs</p>
                                        <p className="text-2xl font-bold">{stats.totalJobs}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-emerald-100 text-sm">Active Jobs</p>
                                        <p className="text-2xl font-bold">{stats.activeJobs}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="h-32 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm">Applications</p>
                                        <p className="text-2xl font-bold">0</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="h-32 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm">Hired</p>
                                        <p className="text-2xl font-bold">0</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Building className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Dashboard Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3">
                            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                                <CardHeader>
                                    <CardTitle>Recent Job Descriptions</CardTitle>
                                    <CardDescription>Your latest job postings and their status</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {jobDescriptions.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                            <p className="text-slate-600 mb-4">No job descriptions yet</p>
                                            <Button
                                                onClick={() => setIsModalOpen(true)}
                                                className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700"
                                            >
                                                Create Your First Job
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {jobDescriptions.slice(0, 5).map((job) => (
                                                <div
                                                    key={job.id}
                                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-slate-900">{job.title}</h4>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            {job.company_name && (
                                                                <>
                                                                    <span className="text-sm text-slate-600">{job.company_name}</span>
                                                                    <span className="text-slate-400">•</span>
                                                                </>
                                                            )}
                                                            <span className="text-sm text-slate-600">Posted {formatDate(job.created_at)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                                            Active
                                                        </Badge>
                                                        <Button variant="outline" size="sm" onClick={() => handleViewJob(job)}>
                                                            View
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        {/* 
                        <div>
                            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                                <CardHeader>
                                    <CardTitle>Account Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-slate-600">Signed in as:</p>
                                        <p className="font-medium text-slate-900">{user.email}</p>
                                        <p className="text-xs text-slate-500 mt-1">User ID: {user.id}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-4">
                                        <p className="text-sm text-slate-600">
                                            Account created: {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button onClick={handleSignOut} variant="outline" className="w-full bg-transparent">
                                        Sign Out
                                    </Button>
                                </CardContent>
                            </Card>
                        </div> */}
                    </div>
                </div>
            </div>

            <JobCreationModal isOpen={isModalOpen} onClose={handleJobCreated} />
            <JobDetailsModal
                isOpen={isJobDetailsOpen}
                onClose={() => setIsJobDetailsOpen(false)}
                job={selectedJob}
            />
        </div>
    )
}
