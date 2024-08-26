import {React,  useState } from 'react';
import Card from 'react-bootstrap/Card';
import Carousel from 'react-bootstrap/Carousel';

import { saveCatToSession, isCatSaved } from '../contexts/helperFunctions';


function BadgerBudSummary({ bud, onCatSaved }) {
    const [showDetails, setShowDetails] = useState(false);
    
    const imageUrl = `https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/${bud.imgIds[0]}`;
    
    const handleSaveClick = () => {
        saveCatToSession(bud.id);
        alert(`${bud.name} has been added to your basket!`);
        onCatSaved(bud.id);
      };

    if (isCatSaved(bud.id)) return null;

    const printAge = (months) => {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (years === 0) return `${remainingMonths} month(s) old`;
        if (remainingMonths === 0) return `${years} year(s) old`;
        return `${years} year(s) and ${remainingMonths} month(s) old`;
    };

    return (
        
        <div className="buddy-summary">
            <Card>
            {showDetails ? (
                <Carousel>
                    {bud.imgIds.map((imgId, index) => {
                        const carouselImageUrl = `https://raw.githubusercontent.com/CS571-F23/hw5-api-static-content/main/cats/${imgId}`;
                        return (
                            <Carousel.Item key={index}>
                                <img className="d-block w-100" src={carouselImageUrl} alt={`A picture of ${bud.name} ${index + 1}`} />
                            </Carousel.Item>
                        );
                    })}
                </Carousel>
            ) : (
                <img src={imageUrl} alt={`A picture of ${bud.name}`} />
            )}
            <h3>{bud.name}</h3>
            
            {showDetails ? (
                <>
                    <p>Gender: {bud.gender}</p>
                    <p>Breed: {bud.breed}</p>
                    <p>Age: {printAge(bud.age)}</p>
                    {bud.description && <p>{bud.description}</p>}
                </>
            ) : null}

            <button onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'Show Less' : 'Show More'}
            </button>
            <button onClick={handleSaveClick}>Save</button>
            </Card>
        </div>
    );
}

export default BadgerBudSummary;