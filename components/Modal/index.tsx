import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  showModal: boolean; 
  closeModal?: (value: boolean) => void;
  title: string;
  children?: any;
  className?: string;
}

export const Modal = (props: Props) => {

  const { showModal, closeModal, children, title } = props;
  const onClose = closeModal ? closeModal : () => {};

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog as="div" open={showModal} onClose={onClose} className={props.className} > 
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" />
        </Transition.Child>
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
          <div className="flex min-h-screen items-center justify-center px-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel as="div" className={`flex flex-col items-center justify-around py-6 px-6 bg-[#FFFFFF] dark:bg-[#272727] p-3 rounded lg:rounded-md text-center relative w-[480px] h-[260px] text-[#363636] dark:text-white ${props.className}`}>
                <div className="flex items-center justify-between px-5 py-5">
                  <h5 className="text-lg font-bold">{title}</h5>
                  {closeModal && (
                    //@ts-ignore
                    <button type="button" className="text-[#363636] dark:text-[#FFFFFF] hover:text-dark no-outline" onClick={onClose}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
                <div className="p-5">
                  {children}

                </div>
                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}