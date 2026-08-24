import { Suspense } from "react";
import LoginPage from "./login-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm leading-relaxed text-muted-foreground">
          در حال بارگذاری…
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
