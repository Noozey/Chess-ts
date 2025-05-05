import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-provider';

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user } = useAuth();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if (user) return;
    navigate({
      to: '/login',
    });
  }, [user]);

  return <Outlet />;
}
