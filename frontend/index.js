async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;

  const infoParagraph = document.querySelector('.info');
  const cardsContainer = document.querySelector('.cards');

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

    learnersWithMentors.forEach(learner => {
      cardsContainer.appendChild(createLearnerCard(learner, infoParagraph));
    });

    infoParagraph.textContent = "No learner is selected";

  } catch (error) {
    console.log('Failed to fetch data:', error);
    infoParagraph.textContent = "Failed to fetch learner cards";
  }
}

function createLearnerCard(learner, infoParagraph) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="learner-details">
      <h3>${learner.fullName} <span class="learner-id" style="display: none;">ID: ${learner.id}</span></h3>
      <div class="learner-email">${learner.email}</div>
    </div>
    <div class="mentor-details">
      <h4 class="toggle-mentors closed">Mentors</h4>
      <ul class="mentor-list hidden">
        ${learner.mentors.map(mentor => `<li>${mentor}</li>`).join('')}
      </ul>
    </div>
  `;

  const toggleMentors = card.querySelector('.toggle-mentors');
  const mentorList = card.querySelector('.mentor-list');
  const learnerIdSpan = card.querySelector('.learner-id');

  toggleMentors.addEventListener('click', function(event) {
    const isOpen = this.classList.contains('open');
    this.classList.toggle('open', !isOpen);
    this.classList.toggle('closed', isOpen);
    mentorList.style.display = isOpen ? 'none' : 'block';
    event.stopPropagation(); // Prevent event bubbling to card click
  });

  card.addEventListener('click', () => {
    const previouslySelectedCard = document.querySelector('.card.selected');
    if (previouslySelectedCard && previouslySelectedCard !== card) {
      previouslySelectedCard.classList.remove('selected');
      const previousIdSpan = previouslySelectedCard.querySelector('.learner-id');
      if (previousIdSpan) {
        previousIdSpan.style.display = 'none';
      }
      infoParagraph.textContent = "No learner is selected";
    }

    card.classList.toggle('selected');
    const isSelected = card.classList.contains('selected');
    learnerIdSpan.style.display = isSelected ? '' : 'none';
    infoParagraph.textContent = isSelected ? `The selected learner is ${learner.fullName}` : "No learner is selected";
  });

  return card;
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
