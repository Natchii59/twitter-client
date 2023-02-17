import { Dialog } from '@headlessui/react'

interface ShareModalProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ShareModal({ isOpen, setIsOpen }: ShareModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className='relative z-50'
    >
      <div className='fixed inset-0 bg-blue/30' aria-hidden='true' />

      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='mx-auto max-w-md rounded-xl bg-black p-4'>
          <Dialog.Title className='text-xl font-bold mb-2'>
            L'url du Tweet a été copié avec succès!
          </Dialog.Title>

          <button
            onClick={() => setIsOpen(false)}
            className='bg-zinc-100 text-black rounded-full py-1 px-3'
          >
            Fermer
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ShareModal
