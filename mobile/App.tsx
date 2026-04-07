import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedScreen } from './src/screens/FeedScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { ContactsScreen } from './src/screens/ContactsScreen';
import { CallsScreen } from './src/screens/CallsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#020617',
            borderTopColor: '#1e293b',
          },
          tabBarActiveTintColor: '#60a5fa',
          tabBarInactiveTintColor: '#64748b',
        }}
      >
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Ligações" component={CallsScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Contatos" component={ContactsScreen} />
        <Tab.Screen name="Configurações" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
