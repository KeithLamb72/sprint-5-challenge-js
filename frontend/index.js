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

        const mentorToggle = document.createElement('h4');
        mentorToggle.textContent = 'Mentors';
        mentorToggle.className = 'closed';

        const mentorsList = document.createElement('ul');
        mentorsList.style.display = 'none';

        learner.mentorNames.forEach(name => {
            const mentorItem = document.createElement('li');
            mentorItem.textContent = name;
            mentorsList.appendChild(mentorItem);
        });

        card.appendChild(nameElement);
        card.appendChild(emailElement);
        card.appendChild(mentorToggle);
        card.appendChild(mentorsList);

        mentorToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents card selection event
            if(card.classList.contains('selected')){
              const isOpen = mentorToggle.classList.contains('open');
              mentorToggle.classList.toggle('open', !isOpen);
              mentorToggle.classList.toggle('closed', isOpen);
              mentorsList.style.display = isOpen ? 'none' : 'block';
            }
        });

        card.addEventListener('click', () => {
            const isSelected = card.classList.contains('selected');
            if (!isSelected) {
                // Deselect all cards
                document.querySelectorAll('.card.selected').forEach(c => {
                    c.classList.remove('selected');
                    c.querySelector('ul').style.display = 'none';
                    c.querySelector('h4').className = 'closed';
                    c.querySelector('h3').textContent = c.querySelector('h3').textContent.split(' (ID: ')[0];
                });
                // Select this card
                card.classList.add('selected');
                nameElement.textContent = `${learner.fullName}, ID: ${learner.id}`;
                infoParagraph.textContent = `The selected learner is ${learner.fullName}`;
            } else {
                // Deselect this card
                card.classList.remove('selected');
                mentorsList.style.display = 'none';
                mentorToggle.className = 'closed';
                nameElement.textContent = learner.fullName;
                infoParagraph.textContent = 'No learner is selected';
            }
        });

        return card;
    }
  // 👆 WORK WORK ABOVE THIS LINE 👆
}

// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
