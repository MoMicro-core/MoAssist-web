'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { NavbarItem } from './navbar'

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-current">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  )
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-current">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

function MobileSidebar({ open, close, children }) {
  return (
    <Headless.Dialog open={open} onClose={close} className="lg:hidden">
      <Headless.DialogBackdrop
        transition
        className="fixed inset-0 z-40 bg-zinc-950/45 backdrop-blur-sm transition data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <Headless.DialogPanel
        transition
        className="fixed inset-y-0 z-50 w-full max-w-80 p-2 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
      >
        <div className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl">
          <div className="-mb-3 px-4 pt-3">
            <Headless.CloseButton as={NavbarItem} aria-label="Close navigation">
              <CloseMenuIcon />
            </Headless.CloseButton>
          </div>
          {children}
        </div>
      </Headless.DialogPanel>
    </Headless.Dialog>
  )
}

export function SidebarLayout({
  navbar,
  sidebar,
  children,
  sidebarHidden = false,
  onToggleSidebar,
}) {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="relative isolate flex min-h-svh w-full max-lg:flex-col">
      {sidebarHidden && onToggleSidebar ? (
        <button
          type="button"
          onClick={onToggleSidebar}
          className="ui-pressable fixed left-4 top-4 z-40 hidden rounded-xl border border-zinc-200 bg-white/90 p-2 text-zinc-700 shadow-md backdrop-blur-sm lg:block dark:border-white/10 dark:bg-zinc-900/85 dark:text-zinc-200"
          aria-label="Show menu"
        >
          <OpenMenuIcon />
        </button>
      ) : null}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-30 hidden p-3 transition-all duration-500 ease-out lg:block',
          sidebarHidden
            ? '-translate-x-full opacity-0 pointer-events-none'
            : 'translate-x-0 opacity-100',
        )}
      >
        <div className="h-full w-72">{sidebar}</div>
      </div>
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        {sidebar}
      </MobileSidebar>
      <header className="sticky top-0 z-20 flex items-center border-b border-zinc-200/60 bg-white/75 px-3 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70 lg:hidden">
        <div className="py-2.5">
          <NavbarItem onClick={() => setShowSidebar(true)} aria-label="Open navigation">
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>
      <main
        className={clsx(
          'flex flex-1 flex-col pb-3 transition-[padding] duration-500 ease-out lg:min-w-0 lg:pr-3 lg:pt-3',
          sidebarHidden ? 'lg:pl-3' : 'lg:pl-[18.75rem]',
        )}
      >
        <div className="glass-panel grow p-4 sm:p-6 lg:rounded-[1.75rem] lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  )
}
