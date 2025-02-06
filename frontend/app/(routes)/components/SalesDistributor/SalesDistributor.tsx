import React from 'react'
import { BarChart } from 'lucide-react'
import { CustomIcon } from '@/components/CustomIcon'
import { GraphicSuscribers } from '../GraphicSuscribers'

export function SalesDistributor() {
    return (
        <div className='shawdow-sm bg-background rounded-lg p-5 flex-1'>
            <div className='flex gap-x-2 items-center'>
                <CustomIcon icon={BarChart} />
                <p className='text-xl'>Distribución de ventas</p>
            </div>
            <GraphicSuscribers />
        </div>
    )
}
