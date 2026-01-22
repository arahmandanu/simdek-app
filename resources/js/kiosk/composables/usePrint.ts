import { ref } from 'vue';

export interface UserPrintData {
  nama: string;
  ktp: string;
}

export function usePrint() {
  const isPrinting = ref(false);
  const printError = ref<string | null>(null);

  /**
   * Trigger browser print dialog
   * @param documentUrl - Optional URL to print specific document
   * @param userData - Optional user data (name, KTP number)
   */
  const printDocument = async (documentUrl?: string, userData?: UserPrintData) => {
    isPrinting.value = true;
    printError.value = null;

    // Log user data if provided (for now - future: send to backend)
    if (userData) {
      console.log('Print requested by:', userData);
    }

    try {
      if (documentUrl) {
        // Open document in new window and print
        const printWindow = window.open(documentUrl, '_blank', 'width=800,height=600');

        if (!printWindow) {
          throw new Error('Popup blocked. Please allow popups for this site.');
        }

        // Wait for document to load before printing
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };

        // Handle print window close
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      } else {
        // Print current page
        window.print();
      }
    } catch (error) {
      console.error('Print failed:', error);
      printError.value = error instanceof Error ? error.message : 'Print failed';
    } finally {
      // Reset printing state after a short delay
      setTimeout(() => {
        isPrinting.value = false;
      }, 500);
    }
  };

  /**
   * Check if browser supports printing
   */
  const canPrint = (): boolean => {
    return typeof window !== 'undefined' && 'print' in window;
  };

  return {
    isPrinting,
    printError,
    printDocument,
    canPrint,
  };
}
