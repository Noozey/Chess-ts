import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/context/auth-provider';
import { Lobby } from '@/room';
import { Board } from '@/chessboard';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/')({
  component: RootPage,
});

function RootPage() {
  const [lobbyName, setLobbyName] = useState<string>('');
  const { signOut } = useAuth();
  return (
    <div className='flex h-screen w-screen justify-between bg-background'>
      <div className='flex-1'>
        <Lobby setLobbyName={setLobbyName} />
      </div>
      <Board lobbyName={lobbyName} />
      <div className='flex flex-1 justify-end p-2'>
        <Button
          variant='outline'
          onClick={signOut}
          className='w-fit items-center gap-2'
        >
          <LogOut className='h-4 w-4' />
          SignOut
        </Button>
      </div>
    </div>
  );
}
