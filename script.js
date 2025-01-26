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
      const studentId = student.id;

      const studentName = displayField(student[" Name"]);
      const citizenship = displayField(student["Citizenship"]);
      const residence = displayField(student["Country of residence"]);
      const program = displayField(student["Program"]);
      const university = displayField(student["University"]);
      const country = displayField(student["Country"]);

      let imagePath = `img/${studentId}.jpg`;

      const colDiv = document.createElement('div');
      colDiv.className = 'col-6 col-md-4 col-lg-3 graduate-card';

      const cardDiv = document.createElement('div');
      cardDiv.className = 'card text-center h-100';

      const link = document.createElement('button');
      link.type = 'button';
      link.className = 'text-decoration-none text-dark btn p-0 border-0 bg-transparent';
      link.setAttribute('data-bs-toggle', 'modal');
      link.setAttribute('data-bs-target', '#studentModal');

      link.onclick = () => {
          showStudentDetails({
              name: studentName,
              citizenship,
              residence,
              program,
              university,
              country,
              imagePath
          });
      };

      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = studentName;
      img.className = 'card-img-top student-img mx-auto mt-3';

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const cardTitle = document.createElement('h5');
      cardTitle.className = 'card-title graduate-name';
      cardTitle.innerText = studentName;

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
  const modalImg = document.getElementById('modalStudentImg');
  modalImg.src = student.imagePath;
  modalImg.alt = student.name;

  document.getElementById('modalStudentName').innerText = student.name;
  document.getElementById('modalCitizenship').innerText = student.citizenship;
  document.getElementById('modalResidence').innerText = student.residence;
  document.getElementById('modalProgram').innerText = student.program;
  document.getElementById('modalUniversity').innerText = student.university;
  document.getElementById('modalCountry').innerText = student.country;
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
