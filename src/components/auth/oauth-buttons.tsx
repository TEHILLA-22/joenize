import { Button } from "@/components/ui/button";
import {
  googleLogin,
} from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (
            options: GoogleInitializeOptions
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: GoogleButtonOptions
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleInitializeOptions {
  client_id: string;
  callback: (
    response: GoogleCredentialResponse
  ) => void;
}

interface GoogleButtonOptions {
  theme: "outline";
  size: "large";
  width: string;
  text: "continue_with";
  shape: "rectangular";
}

interface OAuthButtonsProps {
  onError?: (message: string) => void;
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function GoogleButtonFallback({
  disabled,
}: {
  disabled: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      className="h-11 w-full gap-2 border-[#D8D3CC] bg-white text-[#1E1E1E] hover:bg-[#F5F3EF]"
    >
      <GoogleIcon />
      Continue with Google
    </Button>
  );
}

export function OAuthButtons({
  onError,
}: OAuthButtonsProps) {
  const router = useRouter();
  const buttonRef =
    useRef<HTMLDivElement | null>(
      null
    );
  const [isLoading, setIsLoading] =
    useState(false);
  const [isReady, setIsReady] =
    useState(false);
  const setAccessToken =
    useAuthStore(
      (state) =>
        state.setAccessToken
    );
  const setRefreshToken =
    useAuthStore(
      (state) =>
        state.setRefreshToken
    );
  const setUser =
    useAuthStore(
      (state) => state.setUser
    );

  useEffect(() => {
    const clientId =
      process.env
        .NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      onError?.(
        "Google sign-in is not configured yet."
      );

      return;
    }

    const googleClientId = clientId;

    async function handleCredential(
      response: GoogleCredentialResponse
    ) {
      if (!response.credential) {
        onError?.(
          "Google sign-in did not return a credential."
        );

        return;
      }

      setIsLoading(true);

      try {
        const result =
          await googleLogin({
            credential:
              response.credential,
          });

        setAccessToken(
          result.access
        );

        if (result.refresh_token) {
          setRefreshToken(
            result.refresh_token
          );
        }

        setUser(result.user);

        router.push(
          "/dashboard"
        );
      } catch (error) {
        onError?.(
          getApiErrorMessage(
            error,
            "Google sign-in failed. Please try again."
          )
        );
      } finally {
        setIsLoading(false);
      }
    }

    function renderGoogleButton() {
      if (
        !window.google ||
        !buttonRef.current
      ) {
        return;
      }

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.initialize(
        {
          client_id: googleClientId,
          callback:
            handleCredential,
        }
      );

      window.google.accounts.id.renderButton(
        buttonRef.current,
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rectangular",
        }
      );

      setIsReady(true);
    }

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const script =
      document.createElement(
        "script"
      );

    script.src =
      "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload =
      renderGoogleButton;
    script.onerror = () => {
      onError?.(
        "Google sign-in could not load. Please try again."
      );
    };

    document.head.appendChild(
      script
    );
  }, [
    onError,
    router,
    setAccessToken,
    setUser,
  ]);

  return (
    <div className="relative min-h-11">
      {!isReady && (
        <GoogleButtonFallback
          disabled
        />
      )}

      <div
        ref={buttonRef}
        className={
          isReady
            ? "overflow-hidden rounded-md"
            : "pointer-events-none absolute inset-0 opacity-0"
        }
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/80 text-sm font-medium text-[#1E1E1E]">
          Connecting...
        </div>
      )}
    </div>
  );
}
