import {useState, useEffect, useContext} from 'react';
import {ScrollView, View, Text} from "react-native";
import BadgerNewsItemCard from "../helper/BadgerNewsItemCard";
import PreferencesContext from "../helper/PreferencesContext";

function BadgerNewsScreen(props) {
    const [articles, setArticles] = useState([]);
    const {preferences, setPreferences} = useContext(PreferencesContext);

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw8/articles', {
            headers: {"X-CS571-ID": "bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3"}
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            setArticles(data);
            console.log(data.flatMap(article => article.tags))
            const fetchedTags = new Set(data.flatMap(article => article.tags));
            console.log("Fetched tags:", fetchedTags);

            const newPreferences = {...preferences};
            fetchedTags.forEach(tag => {
                if (newPreferences[tag] === undefined) {
                    newPreferences[tag] = true; // Set default value to true
                }
            });

            setPreferences(newPreferences);
            console.log("New preferences:", newPreferences);
        });
    }, []);

    const visibleArticles = articles.filter(article =>
        article.tags.some(tag => preferences[tag])
    );

    if (visibleArticles.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textAlign: 'center'}}>No articles available at this moment based on your preferences.</Text>
            </View>
        );
    }

    return <ScrollView>
        {visibleArticles.map(item => (
                <BadgerNewsItemCard
                    key={item.id}
                    id={item.fullArticleId}
                    image={`https://raw.githubusercontent.com/CS571-F23/hw8-api-static-content/main/articles/${item.img}`}
                    title={item.title}
                />
            ))}
    </ScrollView>
    }

export default BadgerNewsScreen;