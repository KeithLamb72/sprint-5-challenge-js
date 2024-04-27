async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;

  const infoText = document.querySelector('.info');
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
      mentors: learner.mentors.map(mentorId => mentorsById[mentorId] || 'Mentor not found')
    }));

    const cardsContainer = document.querySelector('.cards');
    learnersWithMentors.forEach(learner => {
      cardsContainer.appendChild(createLearnerCard(learner, infoText));
    });
    if (!learnersWithMentors.length) infoText.textContent = 'No learner is selected';
  } catch (error) {
    console.error('Failed to fetch data:', error);
    infoText.textContent = 'Failed to load data';
  }
}

function createLearnerCard(learner, infoText) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="learner-details">
      <h3>${learner.fullName}</h3>
      <div class="learner-id hidden">ID: ${learner.id}</div>
      <div class="learner-email">${learner.email}</div>
    </div>
    <div class="mentor-details">
      <h4 class="toggle-mentors closed">Mentors</h4>
      <ul class="mentor-list hidden">
        ${learner.mentors.map(mentor => `<li>${mentor}</li>`).join('')}
      </ul>
    </div>
  `;

  card.querySelector('.toggle-mentors').addEventListener('click', function(event) {
    event.stopPropagation();
    const mentorList = card.querySelector('.mentor-list');
    const isOpen = this.classList.contains('open');
    this.classList.toggle('open', !isOpen);
    this.classList.toggle('closed', isOpen);
    mentorList.classList.toggle('hidden', isOpen);
  });

  card.addEventListener('click', () => {
    const selectedCard = document.querySelector('.card.selected');
    if (selectedCard && selectedCard !== card) {
      selectedCard.classList.remove('selected');
      selectedCard.querySelector('.learner-id').classList.add('hidden');
    }
    card.classList.toggle('selected');
    card.querySelector('.learner-id').classList.toggle('hidden');
    infoText.textContent = card.classList.contains('selected') ?
      `The selected learner is ${learner.fullName}` : 'No learner is selected';
  });

  return card;
  
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
