async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;

  const endpointLearners = 'http://localhost:3003/api/learners';
  const endpointMentors = 'http://localhost:3003/api/mentors';

  try {
    const [learnersResponse, mentorsResponse] = await Promise.all([
      fetch(endpointLearners).then(res => res.json()),
      fetch(endpointMentors).then(res => res.json())
    ]);

    const mentorsById = mentorsResponse.reduce((acc, mentor) => {
      acc[mentor.id] = mentor.name;
      return acc;
    }, {});

    const learnersWithMentors = learnersResponse.map(learner => ({
      ...learner,
      mentors: learner.mentors.map(mentorId => mentorsById[mentorId])
    }));

    const cardsContainer = document.querySelector('.cards');
    learnersWithMentors.forEach(learner => {
      cardsContainer.appendChild(createLearnerCard(learner));
    });

  } catch (error) {
    console.log('Failed to fetch data:', error);
  }
}

function createLearnerCard(learner) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="learner-details">
      <h3>${learner.fullName}</h3>
      <div class="learner-id">ID: ${learner.id}</div>
      <div class="learner-email">Email: ${learner.email}</div>
    </div>
    <div class="mentor-details">
      <h4 class="toggle-mentors closed">Show Mentors</h4>
      <ul class="mentor-list" style="display: none;">
        ${learner.mentors.map(mentor => `<li>${mentor}</li>`).join('')}
      </ul>
    </div>
  `;

  // Handling the toggle for mentors list
  const toggleMentors = card.querySelector('.toggle-mentors');
  const mentorList = card.querySelector('.mentor-list');
  toggleMentors.addEventListener('click', function(event) {
    event.stopPropagation(); // Stop event bubbling to prevent card selection
    const isOpen = this.classList.contains('open');
    this.classList.toggle('open', !isOpen);
    this.classList.toggle('closed', isOpen);
    this.textContent = isOpen ? 'Show Mentors' : 'Hide Mentors';
    mentorList.style.display = isOpen ? 'none' : 'block';
  });

  // Handling card selection
  card.addEventListener('click', () => {
    const selectedCard = document.querySelector('.card.selected');
    if (selectedCard && selectedCard !== card) {
      selectedCard.classList.remove('selected');
    }
    card.classList.toggle('selected');
  });

  return card;

  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
