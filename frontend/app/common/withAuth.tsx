"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Loader from "../loader/page";

type WithAuthProps = {
  token: string;
  userType: string;
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const withAuth = <P extends object>(
  Component: React.ComponentType<P & WithAuthProps>
) => {
  const AuthHOC = (props: P) => {
    const [token, setToken] = useState<string | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname(); // Get current route

    useEffect(() => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/user-login/pet_owner");
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
            localStorage.removeItem("token");
            router.push("/user-login/pet_owner");
            return;
          }

          setUserType(data.data.user_type);
          alert(data.data.user_type);
          if (
            pathname === "/user-login/pet_owner" ||
            pathname === "/user-register/register-pet-microchip"
          ) {
            router.push("/customer/dashboard");
            return;
          }

          if (
            data.data.user_type === "customer" &&
            pathname !== "/user-login/pet_owner" &&
            pathname !== "/user-register/register-pet-microchip"
          ) {
            router.push("/customer/dashboard");
            return;
          }
        } catch (error) {
          console.error("Error validating token:", error);
          localStorage.removeItem("token");
          router.push("/user-login/pet_owner");
        }
      };

      verifyToken();
    }, [router, pathname]);

    if (!token || !userType) {
      return (
        <div>
          <Loader />
        </div>
      );
    }

    return <Component {...(props as P)} token={token} userType={userType} />;
  };

  return AuthHOC;
};

export default withAuth;
