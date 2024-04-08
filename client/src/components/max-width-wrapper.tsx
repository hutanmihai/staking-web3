import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type TMaxWidthWrapperProps = {
  className?: string
  children: ReactNode
}

function MaxWidthWrapper({ className, children }: TMaxWidthWrapperProps) {
  return (
    <div className={cn('mx-auto w-full max-w-screen-xl px-2.5 md:px-20', className)}>
      {children}
    </div>
  )
}

export default MaxWidthWrapper
