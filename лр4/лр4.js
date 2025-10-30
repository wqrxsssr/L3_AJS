const BASE_URL = "https://jsonplaceholder.typicode.com";

async function fetchJson(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const sortByTitleLengthDesc = arr => [...arr].sort((a, b) => b.title.length - a.title.length);
const sortByEmailAsc = arr => [...arr].sort((a, b) => a.email.localeCompare(b.email));
const filterUserFields = users => users.map(({ id, name, username, email, phone }) => ({ id, name, username, email, phone }));
const filterIncompleteTodos = todos => todos.filter(todo => !todo.completed);

function fetchWithCallback(endpoint, callback) {
  fetch(`${BASE_URL}/${endpoint}`)
    .then(res => res.json())
    .then(callback)
    .catch(err => console.error(`ошибка ${endpoint} (callback):`, err));
}

fetchWithCallback("posts", posts => {
  const sorted = sortByTitleLengthDesc(posts);
  console.log("посты по длине title:", sorted);
});

fetchWithCallback("comments", comments => {
  const sorted = sortByEmailAsc(comments);
  console.log("коммы по email:", sorted);
});

function fetchFilteredUsers() {
  return fetchJson("users").then(filterUserFields);
}

function fetchIncompleteTodos() {
  return fetchJson("todos").then(todos => {
    const filtered = filterIncompleteTodos(todos);
    console.log("промис: невыполненное:", filtered);
    console.log(`всего: ${filtered.length}`);
    return filtered;
  });
}

fetchFilteredUsers()
  .then(data => console.log("промис: отфильтрованные пользователи:", data))
  .catch(err => console.error("ошибка пользователей:", err));

fetchIncompleteTodos().catch(err => console.error("ошибка задач:", err));

async function displaySorted(endpoint, sortFn, label) {
  try {
    const data = await fetchJson(endpoint);
    const sorted = sortFn(data);
    console.log(`${label}:`, sorted);
    return sorted;
  } catch (err) {
    console.error(`ошибка ${endpoint} (async):`, err);
  }
}

displaySorted("posts", sortByTitleLengthDesc, "посты по длине title");
displaySorted("comments", sortByEmailAsc, "коммы по email");
