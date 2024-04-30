async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  const footer = document.querySelector('footer');
  const infoParagraph = document.querySelector('.info');
  const cardsContainer = document.querySelector('.cards');

  // Update the footer with the current year for task [6]
  const currentYear = new Date().getFullYear();
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;

  try {
    // Fetch data from API for learners and mentors
    const [learnersResponse, mentorsResponse] = await Promise.all([
      axios.get('http://localhost:3003/api/learners'),
      axios.get('http://localhost:3003/api/mentors')
    ]);

    // Prepare learner cards
    const learners = learnersResponse.data.map(learner => {
      const mentors = learner.mentors.map(id =>
        mentorsResponse.data.find(mentor => mentor.id === id) || { firstName: 'Mentor', lastName: 'Not found' }
      );
      return {
        ...learner,
        mentorNames: mentors.map(mentor => `${mentor.firstName} ${mentor.lastName}`)
      };
    });

    // Update UI with learners' data
    learners.forEach(learner => {
      const card = createLearnerCard(learner);
      cardsContainer.appendChild(card);
    });

    // Set info text after rendering cards, as required by task [7]
    infoParagraph.textContent = 'No learner is selected';

  } catch (error) {
    // Handle errors in fetching data
    infoParagraph.textContent = 'Error fetching learner cards';
  }

  // Function to create a single learner card
  function createLearnerCard(learner) {
    const card = document.createElement('div');
    card.className = 'card'; // Ensure it has only one class for task [9]

    const nameElement = document.createElement('h3');
    nameElement.textContent = learner.fullName; // Correct name for task [10]

    const emailElement = document.createElement('div');
    emailElement.textContent = learner.email; // Correct email display for task [11]

    const mentorsList = document.createElement('ul');
    mentorsList.textContent = 'Mentors'; // Header for mentors list for task [12]
    mentorsList.style.display = 'none'; // Mentors are hidden on page load for task [15]

    learner.mentorNames.forEach(name => {
      const mentorItem = document.createElement('li');
      mentorItem.textContent = name;
      mentorsList.appendChild(mentorItem);
    });

    card.appendChild(nameElement);
    card.appendChild(emailElement);
    card.appendChild(mentorsList);

    // Interactivity for selecting a card
    card.addEventListener('click', () => {
      // Toggle class 'selected' and show/hide mentors
      const isSelected = card.classList.contains('selected');
      document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
      mentorsList.style.display = isSelected ? 'none' : 'block';
      card.classList.toggle('selected', !isSelected);

      // Update info text based on selection
      infoParagraph.textContent = isSelected ? 'No learner is selected' : `The selected learner is ${learner.fullName}`;
    });

    return card;
  }
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
