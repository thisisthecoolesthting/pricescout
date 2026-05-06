import { Tabs } from "expo-router";
import { Camera, ListChecks, CreditCard } from "lucide-react-native";
import { colors } from "@/lib/brand";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.mint500,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          paddingTop: 4,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        headerStyle: { backgroundColor: colors.white },
        headerTitleStyle: { color: colors.ink, fontWeight: "700" },
        headerTintColor: colors.ink,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => <Camera color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Flip log",
          tabBarIcon: ({ color, size }) => <ListChecks color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="pricing"
        options={{
          title: "Pricing",
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
