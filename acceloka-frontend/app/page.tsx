'use client';

import { useRouter } from 'next/navigation';

export default function HomePage()
{
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/Mountain.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',

        display: 'flex',
      }}
    >

      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          margin: '0 auto',

          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',

          padding: '40px',

          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',

          borderLeft: '1px solid rgba(255,255,255,0.2)',
          borderRight: '1px solid rgba(255,255,255,0.2)',

          color: 'white',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '42px', marginBottom: '30px' }}>
          Welcome to Acceloka
        </h1>

        {[
          { text: 'Check Available Ticket', path: '/available-ticket' },
          { text: 'Book Ticket', path: '/book-ticket' },
          { text: 'Get Booked Ticket', path: '/booked-ticket' },
          { text: 'Edit Ticket', path: '/edit-ticket' },
          { text: 'Revoke Ticket', path: '/revoke-ticket' },
        ].map((btn, index) => (
          <button
            key={index}
            onClick={() => router.push(btn.path)}
            style={{
              width: '100%',
              margin: '10px 0',
              padding: '14px',

              fontSize: '16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',

              background: 'rgba(0,0,0,0.4)',
              color: 'white',

              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',

              transition: '0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.4)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {btn.text}
          </button>
        ))}
      </div>
    </div>
  );
}