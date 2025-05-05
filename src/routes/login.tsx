import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import { useEffect } from 'react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (!user) return;
    navigate({
      to: '/',
    });
  }, [user]);

  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      <img
        src='https://png.pngtree.com/png-vector/20230811/ourmid/pngtree-chess-icon-with-three-chess-pieces-vector-png-image_6841588.png'
        className='h-100'
      />
      <Button
        onClick={signIn}
        className='items-center gap-2'
        variant={'secondary'}
      >
        <img
          className='h-5 w-5'
          src='https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_48dp.png'
        />
        Sign In With Google
      </Button>
    </div>
  );
}
