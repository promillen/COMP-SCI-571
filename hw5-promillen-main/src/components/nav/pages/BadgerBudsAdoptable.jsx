// BadgerBudsAdoptable.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import BadgerBudSummary from '../../BadgerBudSummary'
import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext';
import { isCatSaved } from '../../../contexts/helperFunctions';

export default function BadgerBudsAdoptable(props) {
    const buds = useContext(BadgerBudsDataContext);
    const [savedBuds, setSavedBuds] = useState([]);

    useEffect(() => {
        setSavedBuds(buds.filter(bud => !isCatSaved(bud.id)));
      }, [buds]);

    const handleCatSaved = (catId) => {
        setSavedBuds(prevBuds => prevBuds.filter(bud => bud.id !== catId));
    };

    if (savedBuds.length == 0) {
        return (
            <div>
                <h1>Available Badger Buds</h1>
                <p>No buds are available for adoption!</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Available Badger Buds</h1>
            <p>The following cats are looking for a loving home! Could you help?</p>
            <Container>
                <Row>
                    {savedBuds.map(bud => (
                        <Col key={bud.id} xs={12} sm={6} md={4} lg={3}>
                            <BadgerBudSummary bud={bud} onCatSaved={handleCatSaved}/>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}