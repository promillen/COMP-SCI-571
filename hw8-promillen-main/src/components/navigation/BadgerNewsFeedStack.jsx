import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BadgerNewsScreen from "../screens/BadgerNewsScreen";
import BadgerNewsDetailScreen from "../screens/BadgerNewsDetailScreen";

const BadgerNewsStack = createNativeStackNavigator();

function BadgerNewsFeedStack() {
  return (
    <BadgerNewsStack.Navigator>
      <BadgerNewsStack.Screen name="AllPosts" component={BadgerNewsScreen} options={{headerShown: false}}/>
      <BadgerNewsStack.Screen name="Article" component={BadgerNewsDetailScreen} options={{headerShown: true}}/>
    </BadgerNewsStack.Navigator>
  );
}

export default BadgerNewsFeedStack;