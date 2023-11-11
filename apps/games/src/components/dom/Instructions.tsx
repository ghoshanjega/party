import { useStore } from '@/helpers/store'
import React, { useState } from 'react'

export const Instructions = ({ children }: { children: React.ReactNode }) => {
  // const { socket } = useStore()
  // const [userName, setUserName] = useState('')

  return (
    <div
      className='absolute max-w-lg px-4 py-2 text-sm  pointer-events-none select-none md:text-base top-8 left-1/2 text-gray-50 transform -translate-x-1/2'
      style={{
        maxWidth: 'calc(100% - 28px)',
      }}
    >
      <p className='hidden mb-8 md:block'>{children}</p>
    </div>
  )
}
