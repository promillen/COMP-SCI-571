import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, Alert } from 'react-native';
import BadgerBakedGood from './BadgerBakedGood';

export default function BadgerBakery() {
    const [bakedGoods, setBakedGoods] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [basket, setBasket] = useState({});

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw7/goods', {
        headers: { "X-CS571-ID": "bid_01a7f87e819e4806e4e6de48726f21b516f498f568b5d11ddadd30ec40a26ce3" }
        })
        .then(res => res.json())
        .then(data => {
        const goodsArray = Object.keys(data).map(key => {
            return { ...data[key], id: key };
        });

        setBakedGoods(goodsArray);

        const initialBasket = {};
        goodsArray.forEach(item => {
            initialBasket[item.id] = 0;
            });
        setBasket(initialBasket);
        })
    },[]);

    const nextBakedGood = () => {
        if (currentPage < bakedGoods.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevBakedGood = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const addToBasket = (itemId) => {
        if (basket[itemId] !== bakedGoods.find(item => item.id === itemId).upperLimit) {
            setBasket(prevBasket => ({
                ...prevBasket,
                [itemId]: prevBasket[itemId] + 1
            }));
        }
    }

    const removeFromBasket = (itemId) => {
        if (basket[itemId] > 0) {
            setBasket(prevBasket => ({
                ...prevBasket,
                [itemId]: prevBasket[itemId] - 1
            }));
        }
    }

    const calculateOrderCost = () => {
        let total = 0;
        bakedGoods.forEach(item => {
            total += item.price * basket[item.id];
        });
        return total;
    }

    const placeOrder = () => {
        if(calculateOrderCost() === 0) {
            return
        }

        Alert.alert(
            "Order Confirmed!",
            "Your order contains " + Object.values(basket).reduce((a, b) => a + b, 0) + " items and costs $" + calculateOrderCost().toFixed(2) + "!")
    }

    return (
        <View style={styles.container}>
            <Text>Welcome to Badger Bakery!</Text>
            {bakedGoods.length > 0 && (
                <BadgerBakedGood
                    bakedGood={bakedGoods[currentPage - 1]}
                    basket={basket}
                    addToBasket={addToBasket}
                    removeFromBasket={removeFromBasket}
                />
            )}
            <Text>Page {currentPage} of {bakedGoods.length}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title="Previous"
                    onPress={prevBakedGood}
                    disabled={currentPage === 1}
                />
                <View style={styles.buttonSpacing} />
                <Button
                    title="Next"
                    onPress={nextBakedGood}
                    disabled={currentPage === bakedGoods.length}
                />
            </View>
            <View style={styles.order}>
                <Text>Order Total: ${calculateOrderCost().toFixed(2)}</Text>
                <Button
                    title="Place order"
                    onPress={placeOrder}
                    disabled={calculateOrderCost() === 0}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 10,
    },
    buttonSpacing: {
        width: 5,
    },
    order: {
        marginTop: 10,
    },
});