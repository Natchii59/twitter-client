interface SpinnerProps {
  size: number
}

function Spinner({ size }: SpinnerProps) {
  return (
    <svg className='animate-spin-fast' width={size} height={size}>
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
        strokeDasharray={80}
        strokeDashoffset={60}
        className='stroke-blue'
      ></circle>
    </svg>
  )
}

export default Spinner
