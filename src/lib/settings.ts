export interface AppSettings {
  pregnancyDuration: number;
  fatteningDuration: number;
}

export const getSettings = (): AppSettings => {
  if (typeof window === 'undefined') {
    // Server-side defaults
    return {
      pregnancyDuration: 114,
      fatteningDuration: 145,
    };
  }

  try {
    const savedSettings = localStorage.getItem("sowcycle-settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      return {
        pregnancyDuration: settings.pregnancyDuration || 114,
        fatteningDuration: settings.fatteningDuration || 145,
      };
    }
  } catch (error) {
    console.error("Error loading settings:", error);
  }

  // Default values
  return {
    pregnancyDuration: 114,
    fatteningDuration: 145,
  };
};

export const getPregnancyDuration = (): number => {
  return getSettings().pregnancyDuration;
};

export const getFatteningDuration = (): number => {
  return getSettings().fatteningDuration;
};