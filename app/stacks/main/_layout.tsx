import { COLORS } from "@/hooks/styles";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";


const TablLayout = () => {
  return (
   <Tabs
      initialRouteName="home"
      screenOptions={{
        animation: "shift",
        tabBarActiveTintColor: COLORS.PRIMARY,
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.WHITE },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Invoices",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="document-text-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="bar-chart-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: "Items",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="cube-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clients",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="people-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="settings-outline" color={color} />
          ),
        }}
      />
     
    </Tabs>
  )
}

export default TablLayout

