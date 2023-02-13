function Spinner() {
  return (
    <svg className='w-8 h-8 animate-spin-fast'>
      <circle
        cx='16'
        cy='16'
        fill='none'
        r='14'
        stroke-width='4'
        className='stroke-zinc-700'
      ></circle>
      <circle
        cx='16'
        cy='16'
        fill='none'
        r='14'
        strokeWidth='4'
        strokeDasharray={80}
        strokeDashoffset={60}
        className='stroke-blue'
      ></circle>
    </svg>
  )
}

export default Spinner
