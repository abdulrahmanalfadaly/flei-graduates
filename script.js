/***************************************************
  1) Helper function to safely display a field
     - Trims whitespace
     - Replaces "NaT" or empty strings with "N/A"
****************************************************/
function displayField(fieldValue) {
    if (!fieldValue) return "N/A";
    const trimmed = fieldValue.trim();
    if (trimmed === "" || trimmed.toLowerCase() === "nat") {
      return "N/A";
    }
    return trimmed;
  }
  
  /***************************************************
    2) On window load, fetch JSON and generate cards
  ****************************************************/
  window.onload = () => {
    fetch('student_info.json')
      .then(response => response.json())
      .then(data => {
        generateCards(data);
      })
      .catch(error => {
        console.error("Error fetching student_info.json:", error);
      });
  };
  
  /***************************************************
    3) Generate Bootstrap cards in #graduatesGrid
  ****************************************************/
  function generateCards(students) {
    const graduatesGrid = document.getElementById('graduatesGrid');
  
    students.forEach((student) => {
      // Extract relevant fields
      const studentName = displayField(student[" Name"]);
      const citizenship = displayField(student["Citizenship"]);
      const residence  = displayField(student["Country of residence"]);
      const contact    = displayField(student["Contact"]);
      const gradDate   = displayField(student[" Date of Graduation"]);
      const program    = displayField(student["Program"]);
      const university = displayField(student["University"]);
      const country    = displayField(student["Country"]);
  
      // Determine image path from the first word of studentName
      // E.g. if studentName = "Dala Nedal Kasaba", firstName = "Dala"
      let imagePath = 'https://via.placeholder.com/200';  // fallback
      const nameParts = studentName.split(/\s+/); // split on whitespace
      if (nameParts && nameParts[0] && nameParts[0] !== "N/A") {
        const firstName = nameParts[0];
        // Build the path like: img/Dala.jpg
        // You can force it to lower-case if needed:
        // const firstName = nameParts[0].toLowerCase();
        imagePath = `Img/${firstName}.jpg`;
      }
  
      // Create the outer column
      const colDiv = document.createElement('div');
      colDiv.className = 'col-6 col-md-4 col-lg-3 graduate-card';
  
      // Create the card
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card text-center h-100';
  
      // Button to trigger modal
      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'text-decoration-none text-dark btn p-0 border-0 bg-transparent';
      link.setAttribute('data-bs-toggle', 'modal');
      link.setAttribute('data-bs-target', '#studentModal');
  
      // When clicked, fill the modal
      link.onclick = () => {
        showStudentDetails({
          name: studentName,
          citizenship,
          residence,
          contact,
          gradDate,
          program,
          university,
          country,
          imagePath
        });
      };
  
      // Create an <img> for the card
      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = studentName;
      img.className = 'card-img-top student-img mx-auto mt-3';
  
      // Card body with the student's name
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
  
      const cardTitle = document.createElement('h5');
      cardTitle.className = 'card-title graduate-name';
      cardTitle.innerText = studentName;
  
      // Assemble
      cardBody.appendChild(cardTitle);
      link.appendChild(img);
      link.appendChild(cardBody);
      cardDiv.appendChild(link);
      colDiv.appendChild(cardDiv);
      graduatesGrid.appendChild(colDiv);
    });
  }
  
  /***************************************************
    4) Fill the modal with the clicked student's details
  ****************************************************/
  function showStudentDetails(student) {
    // If we have a valid imagePath, use it; otherwise fallback
    const modalImg = document.getElementById('modalStudentImg');
    modalImg.src = student.imagePath || 'https://via.placeholder.com/200';
    modalImg.alt = student.name;
  
    // Fill text fields
    document.getElementById('modalStudentName').innerText  = student.name;
    document.getElementById('modalCitizenship').innerText  = student.citizenship;
    document.getElementById('modalResidence').innerText    = student.residence;
    document.getElementById('modalContact').innerText      = student.contact;
    document.getElementById('modalGradDate').innerText     = student.gradDate;
    document.getElementById('modalProgram').innerText      = student.program;
    document.getElementById('modalUniversity').innerText   = student.university;
    document.getElementById('modalCountry').innerText      = student.country;
  }
  
  /***************************************************
    5) Search function (by student name)
  ****************************************************/
  function searchGraduates() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const cards = document.getElementsByClassName("graduate-card");
  
    for (let i = 0; i < cards.length; i++) {
      const nameElem = cards[i].querySelector(".graduate-name");
      const nameText = nameElem.textContent || nameElem.innerText;
      
      if (nameText.toLowerCase().includes(filter)) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }
  