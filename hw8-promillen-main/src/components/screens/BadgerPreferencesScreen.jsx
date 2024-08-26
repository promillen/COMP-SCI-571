import {useContext} from 'react';
import {View, Switch, Text, ScrollView, StyleSheet} from 'react-native';
import PreferencesContext from "../helper/PreferencesContext";

function BadgerPreferencesScreen() {
    const { preferences, setPreferences } = useContext(PreferencesContext);

    const togglePreference = (tag) => {
        const updatedPreferences = {...preferences, [tag]: !preferences[tag]};
        setPreferences(updatedPreferences);
        console.log(`Preference for '${tag}':`, updatedPreferences[tag]);
    };

    const tags = Object.keys(preferences);

    return (
        <ScrollView style={styles.container}>
        {tags.map(tag => (
            <View key={tag} style={styles.preferenceItem}>
            <Text>{tag}</Text>
            <Switch
                onValueChange={() => {
                    togglePreference(tag)}}
                value={preferences[tag]}
            />
            </View>
        ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({ // Styling based on answer from StackOverflow
    container: {
        flex: 1,
    },
    preferenceItem: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});

export default BadgerPreferencesScreen;