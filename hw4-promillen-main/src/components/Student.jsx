const Student = (props) => {
    return (
        <div>
            <h2>{props.name.first} {props.name.last}</h2>
            <p>Major: {props.major}</p>
            <p>Number of credits: {props.numCredits}</p>
            <p>From Wisconsin: {props.wisconsin ? "Yes" : "No"}</p>
            <p>Interests: </p>
            <ul>
                {props.interests.map((int, index) => (
                    <li key={index}>{int}</li>
                ))}
            </ul>
            <p>Number of interests: {props.interests.length}</p>
        </div>
    );
}

export default Student;