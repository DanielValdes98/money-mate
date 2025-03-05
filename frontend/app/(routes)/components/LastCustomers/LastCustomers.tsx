import { Building } from 'lucide-react'
import { CustomIcon } from '@/components/CustomIcon'
import React from 'react'
import { CustomersTable } from '../CustomersTable'

export function LastCustomers() {
    return (
        <div className='mb-4 lg:mb-0 shadow-sm bg-background rounded-lg p-5'>
            <div className='flex gap-x-2 items-center'>
                <CustomIcon icon={Building} />
                <p className='text-xl'>Clientes</p>
            </div>

            <div>
                <CustomersTable />
            </div>
        </div>
    )
}
