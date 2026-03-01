import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BookType, Calendar, ChartNoAxesColumn, GalleryThumbnails, Gauge, Home, ImageIcon, Inbox, Lightbulb, Search, Settings, User2 } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Thumbnail Generator",
        url: "/thumbnail-generator",
        icon: ImageIcon,
    },
    {
        title: "Thumbnail Search",
        url: "/thumbnail-search",
        icon: GalleryThumbnails,
    },
    {
        title: "Outlier",
        url: "/outlier",
        icon: Gauge,
    },
    {
        title: "Content Generator",
        url: "#",
        icon: Lightbulb,
    },
    {
        title: "Keywords",
        url: "#",
        icon: BookType,
    },
    {
        title: "Optimize",
        url: "#",
        icon: ChartNoAxesColumn,
    },
    {
        title: "Subscription",
        url: "#",
        icon: Settings,
    },
    {
        title: "Account",
        url: "#",
        icon: User2,
    },
]

export function AppSidebar() {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='mb-0'>
                    <Image src={'/Logo.png'} alt='logo' width={200} height={200} className='w-full' />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className='mt-0'>
                            {items.map((item, index) => (
                                // <SidebarMenuItem key={item.title} className='p-2'>
                                //     <SidebarMenuButton asChild className=''>
                                <a href={item.url} key={index} className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-gray-100 rounded-lg ${path.includes(item.url) && 'bg-gray-200ß'}`}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                                //     </SidebarMenuButton>
                                // </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className='p-4 text-sm text-gray-500'>
                    <p>© 2026 Vision KeyInsights</p>
                    <p>All rights reserved.</p>
                </div>  
            </SidebarFooter>
        </Sidebar>
    )
}