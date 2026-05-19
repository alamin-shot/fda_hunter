'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Switch } from '@/components/ui/switch'
import { dashboardApi } from '@/services/dashboardApi'

export default function Notification() {
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState<Record<string, boolean>>({
        subscription_confirmation: true,
        reminders_events: true,
        promotions_offers: false,
        email_notifications: true,
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await dashboardApi.getNotificationSettings()
                if (response.status && response.data?.length > 0) {
                    // Map API response to local state
                }
            } catch (error) {
                // Use defaults
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleToggle = async (key: string, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }))
        try {
            await dashboardApi.updateNotificationSettings({ [key]: value })
            toast.success('Notification setting updated')
        } catch (error) {
            toast.error('Failed to update setting')
        }
    }

    if (loading) {
        return (
            <div className="bg-[#0E121B] p-6 rounded-[24px] flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    const notifications = [
        { key: 'subscription_confirmation', title: 'Subscription Confirmation', desc: 'Receive confirmation notification after placing the Subscription.' },
        { key: 'reminders_events', title: 'Reminders and Events', desc: 'Receive push notification whenever the platform requires your attention' },
        { key: 'promotions_offers', title: 'Promotions and Offers', desc: 'Receive push notification whenever the platform requires your attention' },
        { key: 'email_notifications', title: 'Email Notifications', desc: 'Receive push notification via E-mail' },
    ]

    return (
        <div className="bg-[#0E121B] p-6 rounded-[24px]">
            <div>
                <h3 className="text-white text-lg font-semibold">Push Notifications</h3>
                <p className="mt-1 text-sm font-medium text-[#777980]">Get alerts for newly posted wages, confirmations when payments go through successfully, and notifications whenever any fresh update is available.</p>
            </div>
            <div className="mt-8 space-y-6">
                {notifications.map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                        <div>
                            <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                            <p className="mt-1 text-sm font-medium text-[#777980]">{item.desc}</p>
                        </div>
                        <Switch className="cursor-pointer" checked={settings[item.key]} onCheckedChange={(v) => handleToggle(item.key, v)} />
                    </div>
                ))}
            </div>
        </div>
    )
}