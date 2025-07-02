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
import { Save, RotateCcw } from "lucide-react";

const settingsSchema = z.object({
  pregnancyDuration: z.number().min(100).max(130),
  fatteningDuration: z.number().min(120).max(180),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      pregnancyDuration: 114,
      fatteningDuration: 145,
    },
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("sowcycle-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        form.reset({
          pregnancyDuration: settings.pregnancyDuration || 114,
          fatteningDuration: settings.fatteningDuration || 145,
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, [form]);

  const onSubmit = async (values: SettingsFormData) => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem("sowcycle-settings", JSON.stringify(values));

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
    });
    toast({
      title: "รีเซ็ตสำเร็จ",
      description: "รีเซ็ตเป็นค่าเริ่มต้นแล้ว",
    });
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">การตั้งค่า</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>การตั้งค่าระยะเวลา</CardTitle>
          <CardDescription>
            กำหนดระยะเวลาที่ใช้ในการคำนวณต่างๆ ในระบบ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      บันทึกการตั้งค่า
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={resetToDefaults}
                  disabled={isLoading}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  รีเซ็ต
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
