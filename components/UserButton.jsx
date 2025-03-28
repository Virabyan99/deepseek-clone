'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useRef } from 'react'

export default function UserButton({ isDropdownOpen, toggleDropdown }) {
  const { data: session } = useSession()
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isDropdownOpen) {
          toggleDropdown()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen, toggleDropdown])

  if (!session) {
    return null
  }

  const userImage = session.user.image || '/default-avatar.png'

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src={userImage}
        alt="User profile"
        className="w-9 h-9 rounded-full cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all duration-200 ease-in-out"
        onClick={() => toggleDropdown()}
      />
      {isDropdownOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg w-72 p-4 border border-gray-200">
          <div className="flex items-center mb-4 space-x-3">
            <img
              src={userImage}
              alt="User profile"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-lg text-gray-800">
                {session.user.name}
              </p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out">
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
