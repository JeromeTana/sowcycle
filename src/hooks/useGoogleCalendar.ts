"use client";

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Declare global google type
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  allDay?: boolean;
}

export const useGoogleCalendar = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Initialize Google Identity Services script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const connect = useCallback(() => {
    return new Promise<string>((resolve, reject) => {
      if (!window.google) {
        reject(new Error("Google Identity Services not loaded"));
        return;
      }

      const clientId =
        localStorage.getItem("google_client_id") ||
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        reject(
          new Error(
            "Google Client ID is not configured. Please add it in settings.",
          ),
        );
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/calendar.events",
        callback: (response: any) => {
          if (response.access_token) {
            setAccessToken(response.access_token);
            resolve(response.access_token);
          } else {
            reject(new Error("Failed to obtain access token"));
          }
        },
      });

      client.requestAccessToken();
    });
  }, []);

  const createEvent = async (token: string, event: CalendarEvent) => {
    const start = event.allDay
      ? { date: event.startDate.toISOString().split("T")[0] }
      : { dateTime: event.startDate.toISOString() };

    // For all-day events, end date is exclusive, so we add 1 day if not provided or same as start
    let endDate = event.endDate;
    if (!endDate && event.allDay) {
      endDate = new Date(event.startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else if (!endDate) {
      endDate = new Date(event.startDate.getTime() + 60 * 60 * 1000); // 1 hour default
    }

    const end = event.allDay
      ? { date: endDate.toISOString().split("T")[0] }
      : { dateTime: endDate.toISOString() };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: event.title,
          description: event.description,
          start,
          end,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to create event");
    }

    return response.json();
  };

  const listEvents = async (token: string, timeMin: Date, timeMax: Date) => {
    const params = new URLSearchParams({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: "true",
    });

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to list events");
    }

    const data = await response.json();
    return data.items || [];
  };

  const syncEvents = async (events: CalendarEvent[]) => {
    if (events.length === 0) {
      toast({
        title: "No events to sync",
        description: "There are no events to sync to Google Calendar.",
      });
      return;
    }

    setIsSyncing(true);
    try {
      let token = accessToken;
      if (!token) {
        token = await connect();
      }

      if (!token) throw new Error("No access token available");

      // Find date range for existing events check
      const dates = events.map((e) => e.startDate.getTime());
      const minDate = new Date(Math.min(...dates));
      // Subtract 1 day buffer
      minDate.setDate(minDate.getDate() - 1);

      const maxDate = new Date(Math.max(...dates));
      // Add 30 days buffer
      maxDate.setDate(maxDate.getDate() + 30);

      const existingEvents = await listEvents(token, minDate, maxDate);

      let successCount = 0;
      let skippedCount = 0;

      // Process in batches or sequentially to avoid rate limits
      for (const event of events) {
        // Check for duplicates
        const isDuplicate = existingEvents.some((existing: any) => {
          if (existing.summary !== event.title) return false;

          const eventStart = event.allDay
            ? event.startDate.toISOString().split("T")[0]
            : event.startDate.toISOString();

          if (existing.start.date && event.allDay) {
            return existing.start.date === eventStart;
          }
          if (existing.start.dateTime && !event.allDay) {
            // Compare timestamps with 1 minute tolerance
            const existingTime = new Date(existing.start.dateTime).getTime();
            const eventTime = event.startDate.getTime();
            return Math.abs(existingTime - eventTime) < 60000;
          }
          return false;
        });

        if (isDuplicate) {
          skippedCount++;
          continue;
        }

        try {
          await createEvent(token, event);
          successCount++;
        } catch (e) {
          console.error("Failed to sync event", event, e);
        }
      }

      toast({
        title: "Sync Complete",
        description: `Synced ${successCount} events. Skipped ${skippedCount} duplicates.`,
      });
    } catch (error) {
      console.error("Sync error:", error);
      toast({
        title: "Sync Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    connect,
    syncEvents,
    isSyncing,
    isConnected: !!accessToken,
  };
};
