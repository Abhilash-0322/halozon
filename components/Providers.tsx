'use client';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#131921',
            color: '#fff',
            borderRadius: 8,
            fontSize: 14,
          },
        }}
      />
    </>
  );
}
