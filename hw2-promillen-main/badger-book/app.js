let jsonData; // Declare a global variable to store the fetched data

fetch('https://cs571.org/api/f23/hw2/students', {
    headers: {
        "X-CS571-ID": CS571.getBadgerId()
    }
})
.then(res => {
    console.log(res.status);
    return res.json()
})
.then(data => {
    console.log("I recieved data!");
    console.log(data)
	jsonData = data; // Store the data in the global variable
	document.getElementById("num-results").innerText = data.length;
	document.getElementById("students").innerHTML = buildStudentsHtml(data);
})
.catch(err => {
	console.error("Something is wrong")
});




/**
 * Given an array of students, generates HTML for all students
 * using {@link buildStudentHtml}.
 * 
 * @param {*} studs array of students
 * @returns html containing all students
 */
function buildStudentsHtml(studs) {
	return studs.map(stud => buildStudentHtml(stud)).join("\n");
}

/**
 * Given a student object, generates HTML. Use innerHtml to insert this
 * into the DOM, we will talk about security considerations soon!
 * 
 * @param {*} stud 
 * @returns 
 */
function buildStudentHtml(stud) {
    let html = `<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">`; // Apply Bootstrap column classes
    html += `<h2>${stud.name.first} ${stud.name.last}</h2>`;
    html += `<p><strong>Major:</strong> ${stud.major}</p>`;
    html += `<p><strong>Number of Credits:</strong> ${stud.numCredits}</p>`;
    html += `<p><strong>From Wisconsin:</strong> ${stud.fromWisconsin ? 'Yes' : 'No'}</p>`;

    // Add interests as an unordered list
    html += `<p><strong>Interests:</strong></p>`;
    html += `<ul>`;
    stud.interests.forEach(interest => {
        html += `<li>${interest}</li>`;
    });
    html += `</ul>`;

    html += `</div>`;
    return html;
}

function handleSearch(e) {
    e.preventDefault();

    // Get the search input values
    const nameSearch = document.getElementById("search-name").value.trim().toLowerCase();
    const majorSearch = document.getElementById("search-major").value.trim().toLowerCase();
    const interestSearch = document.getElementById("search-interest").value.trim().toLowerCase();

	console.log(nameSearch)
	console.log(majorSearch)
	console.log(interestSearch)

    // Filter the students based on the search criteria
    const filteredStudents = jsonData.filter(stud => {
        const studentName = stud.name.first.toLowerCase() + " " + stud.name.last.toLowerCase();
        const studentMajor = stud.major.toLowerCase();
        const studentInterests = stud.interests.map(interest => interest.toLowerCase());

        const nameMatch = nameSearch === "" || studentName.includes(nameSearch);
        const majorMatch = majorSearch === "" || studentMajor.includes(majorSearch);
        const interestMatch = interestSearch === "" || studentInterests.some(interest => interest.includes(interestSearch));

        return nameMatch && majorMatch && interestMatch;
    });

    // Build and display the HTML for the filtered students
    const studentsHtml = buildStudentsHtml(filteredStudents);
	document.getElementById("num-results").innerText = filteredStudents.length;
    document.getElementById("students").innerHTML = studentsHtml;
}

document.getElementById("search-btn").addEventListener("click", handleSearch);
