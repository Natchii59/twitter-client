export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className='fixed inset-0 bg-blue/10 flex items-center justify-center'>
      <div className='w-full max-w-xl bg-black rounded-lg shadow-lg py-4 px-16'>
        {children}
      </div>
    </div>
  )
}
