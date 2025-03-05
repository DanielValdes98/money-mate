import React from 'react'
import { CustomIcon } from '@/components/CustomIcon'
import { List } from 'lucide-react'
import { TableIntegrations } from '../TableIntegrations'

export function ListIntegrations() {
    return (
        <div className='shawdow-sm bg-background rounded-lg p-5 flex-1'>
            <div className='flex gap-x-2 items-center'>
                <CustomIcon icon={List} />
                <h1 className='text-xl'>Lista de integraciones</h1>
            </div>

            <TableIntegrations />
        </div>
    )
}
