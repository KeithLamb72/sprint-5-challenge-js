async function sprintChallenge5() { // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  // 👇 WORK WORK BELOW THIS LINE 👇
  const footer = document.querySelector('footer');
  const currentYear = new Date().getFullYear();
  footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY ${currentYear}`;

  try {
      const learnersResponse = await fetch('http://localhost:3003/api/learners').then(res => res.json());
      const mentorsResponse = await fetch('http://localhost:3003/api/mentors').then(res => res.json());

      const mentorsById = mentorsResponse.reduce((acc, mentor) => {
          acc[mentor.id] = mentor.name || "Mentor not found";
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
      console.error('Failed to fetch data:', error);
  }
}

function createLearnerCard(learner) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
      <div class="learner-details">
          <h3>${learner.fullName} <span class="learner-id hidden">ID: ${learner.id}</span></h3>
          <div class="learner-email">${learner.email}</div>
      </div>
      <div class="mentor-details">
          <h4 class="closed">Mentors</h4>
          <ul class="mentor-list hidden">
              ${learner.mentors.map(mentor => `<li>${mentor}</li>`).join('')}
          </ul>
      </div>
  `;

  card.addEventListener('click', function(event) {
      if (event.target.tagName !== 'H4') {
          const isSelected = card.classList.contains('selected');
          document.querySelectorAll('.card.selected').forEach(c => {
              c.classList.remove('selected');
              c.querySelector('.learner-id').classList.add('hidden');
          });

          if (!isSelected) {
              card.classList.add('selected');
              card.querySelector('.learner-id').classList.remove('hidden');
              document.querySelector('.info').textContent = `The selected learner is ${learner.fullName}`;
          } else {
              document.querySelector('.info').textContent = 'No learner is selected';
          }
      }
  });

  card.querySelector('h4').addEventListener('click', function() {
      this.classList.toggle('open');
      this.classList.toggle('closed');
      this.nextElementSibling.classList.toggle('hidden');
  });

  return card;
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
