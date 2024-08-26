import {useState, useEffect, useCallback} from 'react';
import {Text, ScrollView, ActivityIndicator, Animated, Image, View, Alert, Linking, Button} from 'react-native';

function BadgerNewsDetailScreen({route}) {
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const OpenURLButton = ({url, children}) => { // Code taken from https://reactnative.dev/docs/linking
        const handlePress = useCallback(async () => {
            const supported = await Linking.canOpenURL(url);
        
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }, [url]);
      
        return <Button title={children} onPress={handlePress} />;
    };

    useEffect(() => {
        const {ARTICLE_ID} = route.params;
        fetch(`https://cs571.org/api/f23/hw8/article?id=${ARTICLE_ID}`, {
            headers: {"X-CS571-ID": "bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3"}
        })
        .then(response => response.json())
        .then(data => {
            setArticle(data);
            setIsLoading(false);
            console.log('Fetched article:', data);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }).start();
        });
    }, [route.params.ARTICLE_ID]);

    if (isLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{marginTop: 20}}>The content is loading!</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <Animated.View style={{opacity: fadeAnim}}>
                {article && (
                    <>
                        <Image
                            source={{uri: `https://raw.githubusercontent.com/CS571-F23/hw8-api-static-content/main/articles/${article.img}`}}
                            style={{width: '100%', height: 230}}
                            resizeMode='contain'
                        />
                        <Text style={{fontWeight: 'bold', fontSize: 24, marginTop: 10, marginHorizontal: 5}}>{article.title}</Text>
                        <Text style={{marginHorizontal: 5, marginBottom: 10}}>{article.author} - {article.posted}</Text>
                        {article.body && article.body.map((paragraph, index) => (
                            <Text key={index} style={{ margin: 5 }}>{paragraph}</Text>
                        ))}
                        <OpenURLButton url={article.url}>Read original news article</OpenURLButton>
                    </>
                )}
            </Animated.View>
        </ScrollView>
    );
}

export default BadgerNewsDetailScreen;
