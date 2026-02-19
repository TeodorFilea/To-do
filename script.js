const themeToggle = document.getElementById('themeToggle');
const applyInitialTheme = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerText = "☀️";
    }
};
applyInitialTheme();

themeToggle.onclick = () => {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerText = isDark ? "☀️" : "🌙";
};

const startApp = () => {
    const { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDocs } = window.fb;
    const db = window.db;

    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const taskList = document.getElementById('taskList');

    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
        taskList.innerHTML = "";
        snapshot.forEach((tDoc) => {
            const task = tDoc.data();
            task.id = tDoc.id;
            renderTask(task);
        });
    });

    document.getElementById('addBtn').onclick = async () => {
        if (!taskInput.value.trim()) return;
        await addDoc(collection(db, "tasks"), {
            text: taskInput.value,
            date: dateInput.value,
            priority: prioritySelect.value,
            completed: false,
            createdAt: Date.now()
        });
        taskInput.value = "";
        dateInput.value = "";
    };

    function renderTask(task) {
        const li = document.createElement('li');
        li.className = `priority-${task.priority}`;
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <br><small class="due-date">${task.date ? task.date.replace('T', ' ') : ''}</small>
            </div>
            <button class="delete-btn">X</button>
        `;

        li.querySelector('.task-text').onclick = async () => {
            await updateDoc(doc(db, "tasks", task.id), { completed: !task.completed });
        };

        li.querySelector('.delete-btn').onclick = async () => {
            await deleteDoc(doc(db, "tasks", task.id));
        };

        taskList.appendChild(li);
    }

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            taskList.querySelectorAll('li').forEach(item => {
                const done = item.querySelector('.task-text').classList.contains('completed');
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else if (filter === 'active') {
                    item.style.display = done ? 'none' : 'flex';
                } else if (filter === 'completed') {
                    item.style.display = done ? 'flex' : 'none';
                }
            });
        };
    });

    document.getElementById('clearBtn').onclick = async () => {
        if(confirm("Ștergi tot din cloud?")) {
            const snap = await getDocs(collection(db, "tasks"));
            snap.forEach(async d => await deleteDoc(doc(db, "tasks", d.id)));
        }
    };
};

window.addEventListener('firebaseReady', startApp);
if (window.fb) startApp();