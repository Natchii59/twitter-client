import { useEffect, useState } from 'react'

interface SpinnerProps {
  size: number
  max: number
  value: number
}

function CircleLength({ size, max, value }: SpinnerProps) {
  return (
    <svg className='transform -rotate-90' width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        fill='none'
        r={size / 2 - 2}
        strokeWidth={size / 10}
        className='stroke-zinc-700'
      ></circle>
      <circle
        cx={size / 2}
        cy={size / 2}
        fill='none'
        r={size / 2 - 2}
        strokeWidth={size / 10}
        strokeDasharray={max}
        strokeDashoffset={value > max ? 0 : max - value}
        pathLength={max}
        className={value > max ? `stroke-red-500` : `stroke-blue`}
      ></circle>
    </svg>
  )
}

export default CircleLength
