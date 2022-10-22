import React, { Children } from 'react'

interface Props {
  children: React.ReactNode
}

export const TopBar: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  return (
    <div
      style={{
        width: '100vw',
        display: 'flex',
        height: '50px',
        backgroundColor: 'pink',
      }}
    >
      {children}
    </div>
  )
}
