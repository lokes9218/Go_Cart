'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import toast from "react-hot-toast"
import axios from "axios"
export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const { isLoaded } = useUser()
    const { getToken } = useAuth()
    const [loading, setLoading] = useState(true)
    const didFetchRef = useRef(false)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Total Revenue', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    const normalizeDashboardPayload = (payload) => {
        const safe = payload && typeof payload === 'object' ? payload : {}
        const allOrders = Array.isArray(safe.allOrders)
            ? safe.allOrders
            : Array.isArray(safe.orders)
                ? safe.orders
                : []

        return {
            products: safe.products ?? safe.totalProducts ?? 0,
            revenue: safe.revenue ?? safe.totalRevenue ?? 0,
            orders: safe.orders ?? safe.totalOrders ?? 0,
            stores: safe.stores ?? safe.totalStores ?? 0,
            allOrders,
        }
    }

    const fetchDashboardData = async () => {
        // setDashboardData(dummyAdminDashboardData)
        // setLoading(false)
        try {
            let token
            try {
                token = await getToken()
            } catch {
                token = undefined
            }
            const data = await axios.get("/api/admin/dashboard", {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            })
            setDashboardData(normalizeDashboardPayload(data.data))
            setLoading(false)
        } catch (error) {
            const message = error?.response?.data?.error || "Failed to fetch dashboard data"
            toast.error(message)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isLoaded) return
        if (didFetchRef.current) return
        didFetchRef.current = true
        fetchDashboardData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">Admin <span className="text-slate-800 font-medium">Dashboard</span></h1>

            {/* Cards */}
            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            {/* Area Chart */}
            <OrdersAreaChart allOrders={dashboardData.allOrders} />
        </div>
    )
}