import { useEffect, useState } from "react"
import BakedGood from "./BakedGood";
import { Col, Container, Row } from "react-bootstrap";

export default function BadgerBakery() {

    const [bakedGoods, setBakedGoods] = useState([]);
    const [featuredItem, setFeaturedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("https://cs571.org/api/f23/hw3/all-baked-goods", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const sortedBakedGoods = data.slice().sort((a, b) => a.name.localeCompare(b.name));
            setBakedGoods(sortedBakedGoods);
            setIsLoading(false);
            
            const featured = data.find((item) => item.featured);
            setFeaturedItem(featured);
        })
    }, [])

    return <div>
        <h1>Badger Bakery</h1>
        <p>Welcome to our small-town bakery located in Madison, WI!</p>
        {isLoading ? (
            <p>Loading...</p>
        ) : (
        <div>
          {/* Display the featured item information */}
          {featuredItem && (
            <p>
              <em>Today's featured item is {featuredItem.name} for ${featuredItem.price}!</em>
            </p>
          )}
        </div>
        )}
        <Container>
            <Row>
            {
                bakedGoods.map(bakedGood => {
                    return <Col key={bakedGood.name} xs={12} md={6} lg={4} xl={4}>
                        <BakedGood
                            name={bakedGood.name}
                            description={bakedGood.description}
                            price={bakedGood.price}
                            featured={bakedGood.featured}
                        />
                    </Col>
                })
            }
            </Row>
        </Container>
    </div>
}