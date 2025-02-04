"use client"

import React from 'react'
import { dataGeneralSidebar, dataToolsSidebar,dataSupportSidebar} from './SidebarRoutes.data'

import { SidebarItem } from '../SidebarItem'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export function SidebarRoutes() {
    return (
        <div className='flex flex-col justify-between h-full'>
            <div>
                <div className='p-2 md:p-6'>
                    <p className='text-slate-500 mb-2'>GENERAL</p>
                    {dataGeneralSidebar.map((item) => (
                        <SidebarItem key={item.label} item={item} />
                    ))}
                </div>

                <Separator />

                <div className='p-2 md:p-6'>
                    <p className='text-slate-500 mb-2'>HERRAMIENTAS</p>
                    {dataToolsSidebar.map((item) => (
                        <SidebarItem key={item.label} item={item} />
                    ))}
                </div>

                <Separator />

                <div className='p-2 md:p-6'>
                    <p className='text-slate-500 mb-2'>SOPORTE</p>
                    {dataSupportSidebar.map((item) => (
                        <SidebarItem key={item.label} item={item} />
                    ))}
                </div>
            </div>

            <div>
                <div className='text-center p-6'>
                    <Button variant={"outline"} className='w-full'>
                        Upgrade to Pro
                    </Button>
                </div>

                <Separator />

                <footer className='mt-3 p-3 text-center text-slate-500'>
                    2025. All rights reserved
                </footer>
            </div>
        </div>
    )
}
