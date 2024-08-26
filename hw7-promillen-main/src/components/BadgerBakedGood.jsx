import { Text, View, Image, StyleSheet, Button } from 'react-native';

export default function BadgerBakedGood({ bakedGood, basket, addToBasket, removeFromBasket }) {
    const { id, name, imgSrc, price, upperLimit } = bakedGood;

    return (
        <View style={styles.container}>
            {imgSrc ? (
                <Image
                    alt={"Baked good named " + name}
                    source={{ uri: imgSrc }}
                    style={styles.image}
                />
            ) : null}
            <Text style={styles.text}> Name: {name} </Text>
            <Text style={styles.text}> Price: ${price.toFixed(2)} </Text>
            <Text style={styles.text}> Available to order: {upperLimit === -1 ? 'Unlimited' : upperLimit} </Text>

            {upperLimit !== -1 ? (
                <View>
                    <Text style={styles.text}>
                        You can order up to: {upperLimit - basket[id]}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="-"
                            onPress={() => removeFromBasket(id)}
                            disabled={basket[id] <= 0}
                        />
                        <View style={styles.buttonSpacing} />
                        <Text style={styles.itemCountText}>{basket[id]}</Text>
                        <Button
                            title="+"
                            onPress={() => addToBasket(id)}
                            disabled={basket[id] >= upperLimit}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.buttonContainer}>
                <Button
                    title="-"
                    onPress={() => removeFromBasket(id)}
                    disabled={basket[id] <= 0}
                />
                <View style={styles.buttonSpacing} />
                <Text style={styles.itemCountText}>{basket[id]}</Text>
                <Button
                    title="+"
                    onPress={() => addToBasket(id)}
                />
            </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    image: {
        width: 100,
        height: 100,
    },
    text: {
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonSpacing: {
        width: 5,
    },
    itemCountText: {
        fontSize: 20, // Customize the item count text size
        margin: 5,
        marginRight: 7,
    },
});