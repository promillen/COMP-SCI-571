import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";
import { useState, useEffect } from 'react';
import Student from "./Student";

const Classroom = () => {   
    const [data, setData] = useState([]);
    const [nameSearch, setNameSearch] = useState('');
    const [majorSearch, setMajorSearch] = useState('');
    const [interestSearch, setInterestSearch] = useState('');
    const [shownStudents, setShownStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 24;

    const handleResetSearch = () => {
        setNameSearch('');
        setMajorSearch('');
        setInterestSearch('');
        setShownStudents(data);
        setCurrentPage(1);  // Resetting the page to 1
    };

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw4/students',{
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then(data => {
                setData(data)
                console.log(data)
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            })
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        const filterStudents = () => {
            return data.filter(student => {
                const nameMatch = `${student.name.first} ${student.name.last}`.toLowerCase().includes(nameSearch.trim().toLowerCase());
                const majorMatch = student.major.toLowerCase().includes(majorSearch.trim().toLowerCase());
                const interestMatch = student.interests.some(interest => 
                    interest.toLowerCase().includes(interestSearch.trim().toLowerCase())
                );
    
                return nameMatch && majorMatch && (interestSearch ? interestMatch : true);
            });
        };
    
        setShownStudents(filterStudents());
    }, [nameSearch, majorSearch, interestSearch, data]);

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = shownStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const totalPages = Math.ceil(shownStudents.length / studentsPerPage);

    return <div>
        <h1>Badger Book - Fall 2023</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control 
                    id="searchName" 
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                />
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control 
                    id="searchMajor" 
                    value={majorSearch}
                    onChange={(e) => setMajorSearch(e.target.value)}
                />
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control 
                    id="searchInterest" 
                    value={interestSearch}
                    onChange={(e) => setInterestSearch(e.target.value)}
                />
            <br />
            <Button variant="neutral" onClick={handleResetSearch}>Reset Search</Button>
        </Form>
        <p>There are {shownStudents.length} student(s) matching your search.</p>
        <Container fluid>
            <Row>
                {currentStudents.map(student => (
                    <Col 
                        key={student.id}
                        xs={12}  // 1 column on xs devices
                        sm={6}   // 2 columns on sm devices
                        md={4}   // 3 columns on md devices
                        lg={3}   // 4 columns on lg devices
                        xl={2}   // 6 columns on xl devices
                    >
                        <Student 
                            name={student.name}
                            major={student.major}
                            interests={student.interests}
                            numCredits={student.numCredits}
                            fromWisconsin={student.fromWisconsin}
                            // Add other fields if necessary
                        />
                    </Col>
                ))}
            </Row>
        </Container>
        <Pagination>
            <Pagination.Prev 
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 1 || shownStudents.length === 0}>
                    Previous
            </Pagination.Prev>

            {Array.from({ length: totalPages }).map((_, index) => (
                <Pagination.Item 
                    key={index + 1} 
                    active={index + 1 === currentPage} 
                    onClick={() => setCurrentPage(index + 1)}
                >
                    {index + 1}
                </Pagination.Item>
            ))}

            <Pagination.Next 
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={currentPage === totalPages || shownStudents.length === 0}>Next</Pagination.Next>
        </Pagination>
    </div>

}

export default Classroom;