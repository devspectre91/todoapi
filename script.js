function main() {
	const BASE_URL = `https://sleepy-falls-37563.herokuapp.com/api/todo`;
	let list = document.querySelector('.todolist');
	let inputElm = document.querySelector('input');
	let loader = document.getElementById('loader');
	let itemsArray = JSON.parse(localStorage.getItem('todos')) || [];

	inputElm.style.borderBottom = '1px solid black';

	inputElm.addEventListener('keyup', handleKey);
	function fetchData() {
		fetch(BASE_URL)
			.then((response) => {
				return response.json();
			})
			.then((listData) => {
				buildUI(listData.todos);
			});
	}
	fetchData();
	//function to handle enter key press
	function handleKey(event) {
		if (event.keyCode == 13) {
			if (inputElm.value.length == 0) {
				alert('Name cannot be empty');
			} else {
				let todo = {
					todo: {
						title: event.target.value,
					},
				};

				fetch(BASE_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(todo), // body data type must match "Content-Type" header
				})
					.then((response) => {
						return response.json();
					})
					.then((listData) => buildUI(listData.todos));

				inputElm.value = '';
				inputElm.style.boxShadow = 'none';
				inputElm.style.borderBottom = '1px solid black';
			}
		}
	}

	//function to create UI
	function buildUI(todos) {
		list.innerHTML = `<div id="mod-loader"></div>`;
		loader.style.display = 'none';
		todos.forEach((item, i) => {
			let movieItem = document.createElement('li');
			let checkBox = document.createElement('input');
			checkBox.type = 'checkbox';
			checkBox.addEventListener('change', handleCheck);
			checkBox.checked = item.isCompleted;
			checkBox.classList.add('styled-checkbox');
			checkBox.setAttribute('data-id', item._id);
			checkBox.setAttribute('id', i);
			let p = document.createElement('label');
			p.innerText = item.title;
			p.style.textTransform = 'capitalize';
			p.setAttribute('data-id', item._id);
			p.setAttribute('for', i);
			p.setAttribute('data-finished', 0);
			if (item.isCompleted == true) {
				p.style.textDecoration = 'line-through';
				p.style.color = 'grey';
			} else {
				p.style.textDecoration = 'none';
			}
			let span = document.createElement('span');
			span.innerText = '❌ ';
			span.setAttribute('data-id', item._id);
			span.addEventListener('click', handleDelete);
			movieItem.append(checkBox, p, span);
			list.append(movieItem);
		});
	}

	//function to handle checkbox change
	function handleCheck(event) {
		let id = event.target.dataset.id;

		let titles = document.querySelectorAll('label');
		console.log(titles);
		titles.forEach((title) => {
			if (title.dataset.id == id && !Boolean(Number(title.dataset.finished))) {
				title.style.textDecoration = 'line-through';
				title.style.color = 'grey';
				title.dataset.finished = 1;
				let todo = {
					todo: {
						isCompleted: true,
					},
				};
				fetch(`${BASE_URL}/${id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(todo),
				});
			} else if (title.dataset.id == id && Boolean(Number(title.dataset.finished))) {
				title.style.textDecoration = 'none';
				title.style.color = 'black';
				title.dataset.finished = 0;
				let todo = {
					todo: {
						isCompleted: false,
					},
				};
				fetch(`${BASE_URL}/${id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(todo),
				}).then((x) => {
					console.log(x);
				});
			}
		});
	}

	//function to handle delete button click
	function handleDelete(event) {
		let id = event.target.dataset.id;

		if (event.target.nodeName == 'SPAN') {
			console.log(`${BASE_URL}/${id}`);
			fetch(`${BASE_URL}/${id}`, {
				method: 'DELETE',
			}).then((response) => {
				fetchData();
			});
			// .then((listData) => {
			// 	console.log(listData);
			// });
		}

		if (list.childElementCount == 0) {
			inputElm.style.boxShadow = '0 5px 10px 6px rgba(0, 0, 0, 0.137)';
			inputElm.style.borderBottom = 'none';
		}
	}
}

//calling the main function
main();
