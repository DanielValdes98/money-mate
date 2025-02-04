import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet' // Asegúrate de importar SheetTitle
import { UserButton } from '@clerk/nextjs'
import { Menu, Search } from 'lucide-react'
import { SidebarRoutes } from '../SidebarRoutes'
import React from 'react'

export function Navbar() {
    return (
        <div className='flex items-center px-2 gap-x-4 md:px-6 justify-between w-full bg-background border-b h-20 shadow-sm'>
            <div className='block md:hidden'>
                <Sheet>
                    <SheetTrigger className='flex items-center gap-2'>
                        <Menu />
                    </SheetTrigger>

                    <SheetContent side={'left'}>
                        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                        <SidebarRoutes />
                    </SheetContent>
                </Sheet>
            </div>

            <div className='relative w-[300px]'>
                <Input placeholder='Buscar' className='rounded-lg' />
                <Search strokeWidth={1} className='absolute top-2 right-2'/>
            </div>

            <div className='flex gap-x-2 items-center'>
                <p>ToogleTheme</p>
                <UserButton />
            </div>
        </div>
    )
}