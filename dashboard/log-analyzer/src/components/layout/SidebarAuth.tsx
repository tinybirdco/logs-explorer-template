'use client';

import { useEffect, useState } from 'react';
import { UserButton, SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";

interface SidebarAuthProps {
  isCollapsed: boolean;
}

export default function SidebarAuth({ isCollapsed }: SidebarAuthProps) {
  const [isClerkAvailable, setIsClerkAvailable] = useState(false);

  useEffect(() => {
    // Check if Clerk is configured after component mounts
    setIsClerkAvailable(!!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  }, []);

  if (!isClerkAvailable) {
    return null;
  }

  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <div>
        {!isCollapsed && (
          <>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm text-gray-600 hover:text-gray-900 font-bold">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <SignOutButton>
                <button className="ml-4 text-sm text-gray-600 hover:text-gray-900 font-bold">
                  Sign out
                </button>
              </SignOutButton>
            </SignedIn>
          </>
        )}
      </div>
    </>
  );
} 