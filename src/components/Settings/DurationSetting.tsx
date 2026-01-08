"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Check } from "lucide-react";

interface DurationSettingProps {
  title: string;
  settingKey: "pregnancyDuration" | "fatteningDuration";
  defaultDuration: number;
  min: number;
  max: number;
  description: string;
  setDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DurationSetting({
  title,
  settingKey,
  defaultDuration,
  min,
  max,
  description,
  setDialog,
}: DurationSettingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const schema = z.object({
    duration: z.number().min(min).max(max),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      duration: defaultDuration,
    },
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem("sowcycle-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings[settingKey]) {
          form.setValue("duration", settings[settingKey]);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, [form, settingKey]);

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    try {
      const savedSettings = localStorage.getItem("sowcycle-settings");
      let settings = {
        pregnancyDuration: 114,
        fatteningDuration: 145,
      };

      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          settings = { ...settings, ...parsed };
        } catch (e) {
             // ignore
        }
      }

      settings[settingKey] = values.duration;

      localStorage.setItem("sowcycle-settings", JSON.stringify(settings));

      toast({
        title: "สำเร็จ",
        description: "บันทึกการตั้งค่าเรียบร้อยแล้ว",
      });
      
      if (setDialog) {
        setDialog(false);
      }
      
      // Dispatch storage event to notify other components if needed (though standard event works across tabs, inside same tab we might need custom event or just let react state handle it if it was shared. Here we might just want to ensure consistency)
       window.dispatchEvent(new Event("storage"));
       
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

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>{title}</FormLabel>
                    <FormControl>
                    <Input
                        type="number"
                        min={min}
                        max={max}
                        {...field}
                         onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                    />
                    </FormControl>
                    <FormDescription>
                    {description}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button size={"lg"} type="submit" className="w-full" disabled={isLoading}>
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
            </form>
        </Form>
    </div>
  );
}
