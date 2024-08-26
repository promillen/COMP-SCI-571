import {StatusBar} from 'expo-status-bar';
import BadgerNews from './src/components/BadgerNews';
import {PreferencesProvider} from './src/components/helper/PreferencesContext';

export default function App() {
  return (
    <PreferencesProvider>
    <BadgerNews/>
    <StatusBar style="auto" />
    </PreferencesProvider>
  );
}

