import {Card, Title} from 'react-native-paper';
import {Pressable} from 'react-native';

import {useNavigation} from "@react-navigation/native";

function BadgerNewsItemCard(props) {
    const navigation = useNavigation();

    function handlePress() {
      navigation.push("Article", {ARTICLE_ID: props.id});
    }

    return (
      <Pressable onPress={handlePress}>
        <Card style={{margin: 10}}>
          <Card.Cover source={{uri: props.image}} style={{margin: 5}}/>
          <Card.Content>
            <Title>{props.title}</Title>
          </Card.Content>
        </Card>
      </Pressable>
    );
  }

export default BadgerNewsItemCard;
