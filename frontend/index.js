async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  const footer = document.querySelector('footer');
  const infoParagraph = document.querySelector('.info');
  const cardsContainer = document.querySelector('.cards');

  // Update the footer with the current year
  const currentYear = new Date().getFullYear();
  if (footer) {
    footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;
  }

  try {
    const [learnersResponse, mentorsResponse] = await Promise.all([
      axios.get('http://localhost:3003/api/learners'),
      axios.get('http://localhost:3003/api/mentors')
    ]);

    const learners = learnersResponse.data.map(learner => {
      const mentors = learner.mentors.map(id =>
        mentorsResponse.data.find(mentor => mentor.id === id) || { firstName: 'Mentor', lastName: 'Not found' }
      );
      return {
        ...learner,
        mentorNames: mentors.map(mentor => `${mentor.firstName} ${mentor.lastName}`)
      };
    });

    learners.forEach(learner => {
      const card = createLearnerCard(learner);
      if (cardsContainer) {
        cardsContainer.appendChild(card);
      }
    });

    if (infoParagraph) {
      infoParagraph.textContent = 'No learner is selected';
    }

  } catch (error) {
    if (infoParagraph) {
      infoParagraph.textContent = 'Error fetching learner cards';
    }
  }

  function createLearnerCard(learner) {
    const card = document.createElement('div');
    card.className = 'card';

    const nameElement = document.createElement('h3');
    nameElement.textContent = learner.fullName;

    const emailElement = document.createElement('div');
    emailElement.textContent = learner.email;

    const mentorsList = document.createElement('ul');
    mentorsList.textContent = 'Mentors';
    mentorsList.style.display = 'none';

    learner.mentorNames.forEach(name => {
      const mentorItem = document.createElement('li');
      mentorItem.textContent = name;
      mentorsList.appendChild(mentorItem);
    });

    card.appendChild(nameElement);
    card.appendChild(emailElement);
    card.appendChild(mentorsList);

    card.addEventListener('click', () => {
      const isSelected = card.classList.contains('selected');
      document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
      mentorsList.style.display = isSelected ? 'none' : 'block';
      card.classList.toggle('selected', !isSelected);
      if (infoParagraph) {
        infoParagraph.textContent = isSelected ? 'No learner is selected' : `The selected learner is ${learner.fullName}`;
      }
    });

    return card;
  }
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
