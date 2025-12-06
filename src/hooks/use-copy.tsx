import { useState, useCallback } from "react";

function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    let success = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.error("Clipboard write failed:", err);
        success = false;
      }
    } else {
      // Fallback for insecure contexts (HTTP / older browsers)
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (err) {
        console.error("Fallback copy failed:", err);
        success = false;
      }
    }

    setIsCopied(success);

    // Auto reset after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);

    return success;
  }, []);

  return { isCopied, copyToClipboard };
}

export default useClipboard;
