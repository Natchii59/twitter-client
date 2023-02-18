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
      <div className='fixed inset-0 bg-zinc-300/20' aria-hidden='true' />

      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='mx-auto max-w-md rounded-xl bg-black p-4'>
          <Dialog.Title className='text-xl font-bold mb-2'>
            L'url du Tweet a été copié avec succès!
          </Dialog.Title>

          <button
            onClick={() => setIsOpen(false)}
            className='bg-zinc-100 text-black rounded-full py-1.5 mt-2 w-full hover:bg-zinc-100/90 active:bg-zinc-100/80 transition-colors'
          >
            Fermer
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ShareModal
