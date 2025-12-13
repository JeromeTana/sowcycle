import { Tabs } from "expo-router";
import {
  Home,
  PiggyBank,
  Calendar,
  Settings,
  Activity,
  Layers,
} from "lucide-react-native";
import { Colors } from "../../constants/Colors";
import { Platform } from "react-native";

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.light.background,
          borderTopColor: Colors.light.border,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "หน้าหลัก",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sows"
        options={{
          title: "แม่พันธุ์",
          tabBarIcon: ({ color }) => <PiggyBank size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="breeding"
        options={{
          title: "ผสมพันธุ์",
          tabBarIcon: ({ color }) => <Activity size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="litters"
        options={{
          title: "คอก",
          tabBarIcon: ({ color }) => <Layers size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="boars"
        options={{
          title: "พ่อพันธุ์",
          tabBarIcon: ({ color }) => <Activity size={24} color={color} />,
          href: null, // Hiding Boars from tab bar if not in design, or keeping it if needed. The design showed 5 tabs: Home, Sows, Breeding, Pens (Litters), Calendar.
          // Let's match the design's 5 tabs: Home, Sows, Breeding, Pens, Calendar.
          // I'll map:
          // Home -> index
          // Sows -> sows
          // Breeding -> breeding
          // Pens -> litters
          // Calendar -> (new placeholder or map to boars for now? No, design says Calendar)
        }}
      />
       <Tabs.Screen
        name="account"
        options={{
          title: "บัญชี",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
