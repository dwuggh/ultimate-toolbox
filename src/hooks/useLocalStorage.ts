    import { useState, useEffect } from 'react';

    function useLocalStorageExport(key: string, defaultValue: any) {
      const [value, setValue] = useState(defaultValue);

      useEffect(() => {
        try {
          const storedValue = localStorage.getItem(key);
          if (storedValue !== null) {
            setValue(JSON.parse(storedValue));
          }
        } catch (error) {
          console.error("Error accessing localStorage:", error);
        }
      }, [key]);
    
      const exportData = () => {
        try {
          const storedValue = localStorage.getItem(key);
          if (storedValue !== null) {
            return storedValue;
          }
          return null;
        } catch (error) {
           console.error("Error exporting localStorage:", error);
           return null;
        }
      };

      return [value, setValue, exportData];
    }