import { BrowserProvider } from "@/context/BrowserContext";
import BrowserShell from "@/components/browser/BrowserShell";
import SyncProvider from "@/components/browser/SyncProvider";
import { ToastProvider } from "@/components/ui/Toast";

export default function HomePage() {
  return (
    <ToastProvider>
      <BrowserProvider>
        <SyncProvider />
        <BrowserShell />
      </BrowserProvider>
    </ToastProvider>
  );
}
