"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { rolePermissions } from '../common/rolePermissions';
import Loader from '@/app/loader/page';

type WithAuthProps = {
  token: string;
  userType: string;
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const withAuth = <P extends object>(Component: React.ComponentType<P & WithAuthProps>) => {
  const AuthHOC = (props: P) => {
    const [token, setToken] = useState<string | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname(); // Get current route

    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        router.push('/admin/auth');
        return;
      }

      setToken(storedToken);

      const verifyToken = async () => {
        try {
          const response = await axios.get(`${appUrl}auth/validate-token`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          const data = response.data;

          if (data.statusCode !== 200 || !data.data?.user_type) {
            localStorage.removeItem('token');
            router.push('/admin/auth');
            return;
          }

          setUserType(data.data.user_type);

          if (data.data.user_type === 'pet_owner') {
            router.push('/customer/dashboard');
            return;
          }

          // Check role-based access
          const allowedRoutes = rolePermissions[data.data.user_type as keyof typeof rolePermissions] || [];
          const ADMIN_BASE = '/admin';

          const isAllowed = allowedRoutes.some(route => {
            if (route === '*') return true; // Admin can access everything
          
            const fullPath = route.startsWith('/') ? route : `${ADMIN_BASE}/${route}`; // Ensure `/admin` is prefixed if missing
          
            if (fullPath === pathname) return true; // Exact match
          
            if (fullPath.endsWith('/*')) {
              const basePath = fullPath.replace('/*', '');
              return pathname.startsWith(basePath); // Match subroutes
            }
          
            return false;
          });
          
          if (!isAllowed) {
            router.push('/404'); // Redirect unauthorized users
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          router.push('/admin/auth');
        }
      };

      verifyToken();
    }, [router, pathname]);

    if (!token || !userType) {
      return <div>
        <Loader/>
      </div>;
    }

    if(userType =="Admin" || userType == "supervisor"){
    return <Component {...(props as P)} token={token} userType={userType} />;
    }
  };

  return AuthHOC;
};

export default withAuth;
