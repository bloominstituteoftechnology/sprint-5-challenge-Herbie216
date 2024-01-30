  // 👇 WORK WORK BELOW THIS LINE 👇
  // Note the async keyword, in case you wish to use `await` inside sprintChallenge5
  //  Question: I am on sprint 5 challenge and need help with the following.
  //            I think I am doing the a sync wrong. When I tried Promises,
  //            I broke it completely.  I went back to a version that was looking the best.


  //  Problems:         
  //              
  //              D. The onlcick for the cardElement function toggles on but not off
  //              E. There a footer issue in test, not sure why. The footer looked good
  //              


async function sprintChallenge5() {

const footer = document.querySelector('footer')

footer.textContent = `© BLOOM INSTITUTE OF TECHNOLOGY 2023`

const cards = document.querySelector(".cards");

// Helper function to update header text
function updateHeaderText(text) {
  const header = document.querySelector('header p'); 
  if (header) {
    header.textContent = text;
  }
}

// Helper function to get learners from API
async function getLearnersFromAPI(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    updateHeaderText('No learner is selected');
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

// Helper function to get mentor from API
async function getMentorsFromAPI(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

// Helper function to get Mentor names from ids
function getMentorDetails(mentorId, mentorList) {
  const mentor = mentorList.find(mentor => mentor.id === mentorId);  
  return mentor 
}

// Helper function to create card
async function createCard({ id, fullName, email, mentors }) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');

  const name = document.createElement('h3');
  name.textContent = `${fullName}`;

  const contact = document.createElement('div');
  contact.textContent = `${email}`;

  const teacher = document.createElement('h4');
  teacher.classList.add('closed');
  teacher.textContent = `Mentors`;

  const mentorListElement = document.createElement('ul');
  mentorListElement.classList.add('closed');   
  
  mentors.forEach(mentorId => {
    const mentor = getMentorDetails(mentorId, mentorList);
    const mentorItem = document.createElement('li');
    mentorItem.textContent = `${mentor.firstName} ${mentor.lastName}`;
    mentorListElement.appendChild(mentorItem);
  });
  
  cardElement.appendChild(name);
  cardElement.appendChild(contact);
  cardElement.appendChild(teacher);
  cardElement.appendChild(mentorListElement);

  cardElement.addEventListener("click", () => {
    const cardsContainer = document.querySelector(".cards")
    const selectedCard = cardsContainer.querySelector(".selected")
    if(!cardElement.classList.contains("selected")){
      cardElement.classList.add("selected");
    } 
    if(selectedCard){
      selectedCard.classList.remove("selected")
    }
    const isSelected = cardElement.classList.contains("selected");
    const learnerIdElement = name.querySelector('.learner-id');
    if (isSelected) {
      if (!learnerIdElement) {
        const learnerId = document.createElement('span');
        learnerId.textContent = ` ID ${id}`;
        learnerId.classList.add('learner-id');
        name.textContent = `${fullName},`;
        name.appendChild(learnerId);
      }
      updateHeaderText(`The selected learner is ${fullName}`);
    } else {
      if (learnerIdElement) {
        name.textContent = `${fullName}`;
        learnerIdElement.remove();
        updateHeaderText('No learner is selected');
      }
      
  // ❗❗❗ Put deselect logic here ❗❗❗  
    }
  });

  // Toggle Mentor list
  teacher.addEventListener("click", () => {
    teacher.classList.toggle("open");
    teacher.classList.toggle("closed");  

  });

  cards.appendChild(cardElement);
}

const learnerApiUrl = "http://localhost:3003/api/learners";
const mentorApiUrl = "http://localhost:3003/api/mentors"; 

// Fetch learners and mentors using Promise.all
const [learners, mentorList] = await Promise.all([
  getLearnersFromAPI(learnerApiUrl),
  getMentorsFromAPI(mentorApiUrl)
]);

// Create cards for each learner
learners.forEach(createCard);

}

// 👆 WORK WORK ABOVE THIS LINE 👆

/* 
                                 IMPORTANT NOTES FROM README:
                ENDPOINTS:::
Endpoint A [GET] http://localhost:3003/api/learners  ----->  get both requests going asap
Endpoint B [GET] http://localhost:3003/api/mentors   ----->  make helper functions to manage results


Here's the tricky thing: each learner has a short list of mentors,
but the response from Endpoint A only identifies the mentors by their ID numbers.
This means you will need to match the mentor IDs from Endpoint A with the real names of the mentors,
found in the response from Endpoint B.
Optionally, you can use Promise.all to handle both requests.
We do not need the data from request A in order to start request B, 
so the requests can happen concurrently instead of back-to-back.)
Once you have the payloads from Endpoints A and B stored inside variables, 
check that they match what you saw in Postman, 
and then use your JavaScript skills to combine the two lists into 
a single data structure that is comfortable to work 

example:

[{ id: 22,
    email:"mickey.mouse@example.com",
    fullName: "Mickey Mouse",
    mentors: ['James Gosling', 'Mary Shaw'] // ❗❗❗ actual names instead of IDs ❗❗❗
  }],
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ready for helper function and looping
Once you have the data in the right shape, 
you can create a component function that takes a single learner in the format above as its argument, 
and returns a Learner Card. Then just loop over the data, generating cards as you go, 
and attaching them to the DOM.
Make sure that each element you create uses the exact same class names and 
text contents as those in the design! Also, render the learners in the same order 
as they arrive from Endpoint A.
As for interactivity, all the behaviors on the page as the user clicks on the cards boil down
to changes in text contents of some elements, and changes to some class names which can be observed 
in the mock. Do not use any other mechanisms! Do not use inline styles!
It might seem like you need several click handlers on different elements inside the card, 
but that would just make the code more complicated. 
***Remember, events bubble up from the target to its ancestor elements!*** --->research this!!!
It's easier to just attach an event listener on the card element,          --->apply research!!
and then check who the target of the click is before taking the appropriate action.  
                                     
                                          Notes about Mock
in header / p tag / toggles on click ---> 
changes text from: 1. fetching while preforming get request
                   2. no learners select on recieving request
                   3. selected learner on click and back to no learner selected on 2nd click

in section / div class cards
populate with info from api learners and mentors 1. make function card maker
                                                 2. make function div maker (combined if possible)
                                                 3. run loop with functions to add to HTML
                                                 4. add functionality to cards (toggle info)
*/
// ❗ DO NOT CHANGE THE CODE  BELOW
if (typeof module !== 'undefined' && module.exports) module.exports = { sprintChallenge5 }
else sprintChallenge5()
