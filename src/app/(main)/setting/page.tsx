"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw, Check, Calendar, RefreshCw } from "lucide-react";
import TopBar from "@/components/TopBar";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { useCalendarData } from "@/hooks/useCalendarData";

const settingsSchema = z.object({
  pregnancyDuration: z.number().min(100).max(130),
  fatteningDuration: z.number().min(120).max(180),
  googleClientId: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { syncEvents, isSyncing } = useGoogleCalendar();
  const { data: calendarData } = useCalendarData();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      pregnancyDuration: 114,
      fatteningDuration: 145,
      googleClientId: "",
    },
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("sowcycle-settings");
    const googleClientId = localStorage.getItem("google_client_id");

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        form.reset({
          pregnancyDuration: settings.pregnancyDuration || 114,
          fatteningDuration: settings.fatteningDuration || 145,
          googleClientId: googleClientId || "",
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    } else if (googleClientId) {
      form.setValue("googleClientId", googleClientId);
    }
  }, [form]);

  const onSubmit = async (values: SettingsFormData) => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem(
        "sowcycle-settings",
        JSON.stringify({
          pregnancyDuration: values.pregnancyDuration,
          fatteningDuration: values.fatteningDuration,
        })
      );

      if (values.googleClientId) {
        localStorage.setItem("google_client_id", values.googleClientId);
      } else {
        localStorage.removeItem("google_client_id");
      }

      // You could also save to a database here if needed
      // await updateSettings(values);

      toast({
        title: "สำเร็จ",
        description: "การตั้งค่าถูกบันทึกแล้ว",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    form.reset({
      pregnancyDuration: 114,
      fatteningDuration: 145,
      googleClientId: "",
    });
    toast({
      title: "รีเซ็ตสำเร็จ",
      description: "รีเซ็ตเป็นค่าเริ่มต้นแล้ว",
    });
  };

  const handleSync = async () => {
    const events = [
      ...calendarData.farrowEvents.map((e) => ({
        title: `กำหนดคลอด ${e.sows.name}`,
        description: `แม่พันธุ์: ${e.sows.name}`,
        startDate: e.expectedDate,
        allDay: true,
      })),
      ...calendarData.saleableEvents.map((e) => ({
        title: `ลูกขุนพร้อมขาย แม่${e.sowName}`,
        description: `แม่พันธุ์: ${e.sowName}`,
        startDate: e.saleableDate,
        allDay: true,
      })),
    ];

    await syncEvents(events);
  };

  return (
    <>
      <TopBar title="การตั้งค่า" hasBack />
      <main className="container mx-auto max-w-2xl p-4 pt-0 md:pb-8 md:p-8">
        {/* <Card className="mb-6">
          <CardHeader>
            <CardTitle>Google Calendar Sync</CardTitle>
            <CardDescription>
              เชื่อมต่อกับ Google Calendar เพื่อซิงค์ข้อมูลกำหนดการต่างๆ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg text-blue-700">
              <Calendar className="h-5 w-5" />
              <div className="text-sm">
                <p className="font-medium">Sync Events</p>
                <p>
                  ซิงค์ข้อมูลกำหนดคลอดและกำหนดจับขายทั้งหมดไปยัง Google Calendar
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto bg-white hover:bg-blue-100 text-blue-700 border-blue-200"
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync Now
              </Button>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>การตั้งค่าระบบ</CardTitle>
            <CardDescription>กำหนดค่าต่างๆ ในระบบ</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* <FormField
                  control={form.control}
                  name="googleClientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Google Client ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Client ID สำหรับเชื่อมต่อ Google Calendar API
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="pregnancyDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ระยะเวลาการตั้งครรภ์ (วัน)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="100"
                          max="130"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        ระยะเวลาการตั้งครรภ์ของแม่สุกร (ปกติ 114 วัน)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fatteningDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ระยะเวลาการเลี้ยงขุน (วัน)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="120"
                          max="180"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        ระยะเวลาการเลี้ยงขุนลูกสุกร (ปกติ 145 วัน)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={resetToDefaults}
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    รีเซ็ต
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        บันทึก
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
