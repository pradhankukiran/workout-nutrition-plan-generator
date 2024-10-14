const userData = {
  name: '',
  gender: '',
  age: '',
  weight: '',
  height: '',
  fitnessLevel: '',
  workoutDays: '',
  fitnessGoal: '',
  injury: '',
  mealsPerDay: '',
  allergies: '',
  dietaryRestrictions: '',
  favoriteFoods: '',
  dislikedFoods: '',
};

const sections = {
  personalInfo: ['name', 'gender', 'age', 'weight', 'height'],
  training: ['fitnessLevel', 'workoutDays', 'fitnessGoal', 'injury'],
  nutrition: ['mealsPerDay', 'allergies', 'dietaryRestrictions', 'favoriteFoods', 'dislikedFoods'],
};

function createField(field) {
  const fieldContainer = document.createElement('div');
  fieldContainer.className = 'field';

  const label = document.createElement('label');
  label.textContent = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  label.setAttribute('for', field);

  let input;
  if (['gender', 'fitnessLevel', 'fitnessGoal'].includes(field)) {
    input = document.createElement('select');
    input.innerHTML = `<option value="">Select ${label.textContent}</option>`;
    const options = {
      gender: ['Male', 'Female', 'Other'],
      fitnessLevel: ['Sedentary', 'Active', 'Extremely Active'],
      fitnessGoal: ['Lose Weight', 'Build Muscle', 'Maintain', 'Improve Health'],
    };
    options[field].forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      input.appendChild(optionElement);
    });
  } else {
    input = document.createElement('input');
    input.type = ['age', 'weight', 'height', 'workoutDays', 'mealsPerDay'].includes(field) ? 'number' : 'text';
    input.placeholder = `Enter ${label.textContent}`;
  }

  input.id = field;
  input.name = field;
  input.addEventListener('change', e => {
    userData[field] = e.target.value;
  });

  fieldContainer.appendChild(label);
  fieldContainer.appendChild(input);
  return fieldContainer;
}

function populateSections() {
  Object.entries(sections).forEach(([sectionId, fields]) => {
    const section = document.getElementById(sectionId);
    fields.forEach(field => {
      section.appendChild(createField(field));
    });
  });
}

function handleSubmit(e) {
  e.preventDefault();
  console.log('Submitted data:', userData);
  // Here you would typically send the data to a server or perform further actions
  alert('Profile submitted successfully!');
}

document.addEventListener('DOMContentLoaded', () => {
  populateSections();
  document.getElementById('userProfileForm').addEventListener('submit', handleSubmit);
});