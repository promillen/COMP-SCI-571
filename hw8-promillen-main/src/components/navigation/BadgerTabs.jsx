import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BadgerNewsFeedStack from "./BadgerNewsFeedStack";
import BadgerPreferencesScreen from "../screens/BadgerPreferencesScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tabs = createBottomTabNavigator();

function BadgerTabs(props) {
    return <>
        <Tabs.Navigator>
            <Tabs.Screen
                name="News"
                component={BadgerNewsFeedStack}
                options={{tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="newspaper-variant-multiple-outline" color={color} size={size} />
                ),
                }}
            />
            <Tabs.Screen
                name="Preferences"
                component={BadgerPreferencesScreen}
                options={{tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons name="account-settings-outline" color={color} size={size} />
                ),
                }}
            />
        </Tabs.Navigator>
    </>
}

export default BadgerTabs;