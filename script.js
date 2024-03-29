function createTag(tag, addClass) {
   if (typeof tag !== 'string' || typeof addClass !== 'string') return;
   if (!addClass) {
      return document.createElement(tag);
   } else {
      const newTag = document.createElement(tag);
      newTag.className = addClass;
      return newTag;
   }
}

const container = document.querySelector('.container');
const input = createTag('input', 'search');
input.setAttribute('type', 'text');

const autocomplete = createTag('ul', 'autocomplete');
const repositories = createTag('ul', 'repositories');
container.append(input, autocomplete, repositories);


let timerId;

input.addEventListener('input', (e) => {
   const query = e.target.value;
   if (query === '') {
      autocomplete.textContent = '';
   } else {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
         searchRepositories(query);
      }, 1000);
   }
});

function searchRepositories(query) {
   if (typeof query !== 'string' || query.trim() === '') return;
   fetch(`https://api.github.com/search/repositories?q=${query}`)
      .then(response => response.json())
      .then(data => {
         const repos = data.items.slice(0, 5);
         autocomplete.textContent = '';
         repos.forEach(repo => {
            const listItem = createTag('li', 'text');
            listItem.textContent = repo.full_name;
            listItem.addEventListener('click', () => {
               addRepository(repo);
               input.value = '';
               autocomplete.textContent = '';
            });
            autocomplete.appendChild(listItem);
         });
      })
      .catch(error => console.error('Error:', error));
}

function addRepository(repo) {
   const listItem = createTag('li', 'item');
   listItem.innerHTML = `Name: ${repo.full_name}<br>Owner: ${repo.owner.login}<br>Stars: ${repo.stargazers_count}`;

   const deleteButton = createTag('button', 'btn-close');
   deleteButton.append(createTag('span', 'delete-one'), createTag('span', 'delete-two'));
   deleteButton.addEventListener('click', () => {
      repositories.removeChild(listItem);
   });

   listItem.appendChild(deleteButton);
   repositories.appendChild(listItem);
}




