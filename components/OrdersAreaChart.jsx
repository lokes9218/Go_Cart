
'use client'

import { format, subDays } from 'date-fns'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function OrdersAreaChart({ allOrders }) {

    const safeOrders = Array.isArray(allOrders) ? allOrders : []

    // Always render a chart, even when there are zero orders.
    // Keeping the range fixed avoids a blank Recharts area.
    const DAYS = 14
    const today = new Date()

    const ordersPerDay = safeOrders.reduce((acc, order) => {
        const createdAt = order?.createdAt
        if (!createdAt) return acc

        const dateKey = format(new Date(createdAt), 'yyyy-MM-dd')
        acc[dateKey] = (acc[dateKey] || 0) + 1
        return acc
    }, {})

    const chartData = Array.from({ length: DAYS }, (_, index) => {
        const day = subDays(today, DAYS - 1 - index)
        const dateKey = format(day, 'yyyy-MM-dd')
        return {
            date: dateKey,
            orders: ordersPerDay[dateKey] || 0,
        }
    })

    return (
        <div className="w-full max-w-4xl h-[300px] text-xs">
            <h3 className="text-lg font-medium text-slate-800 mb-4 pt-2 text-right"> <span className='text-slate-500'>Orders /</span> Day</h3>
            <ResponsiveContainer width="100%" height="100%"> 
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} label={{ value: 'Orders', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#4f46e5" fill="#8884d8" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
