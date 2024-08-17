/* eslint-disable no-unused-vars */
import "./assets/scss/main.scss";
import Controls from "./components/Controls";
import TaskBox from "./components/TaskBox";
import { useState, useEffect, useRef } from "react";
import sun from "./assets/images/icon-sun.svg";
import moon from "./assets/images/icon-moon.svg";

export default function App() {
  let taskData = JSON.parse(localStorage.getItem("tasks"));
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [displayedTasks, setDisplayedTasks] = useState(tasks);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [icon, setIcon] = useState(sun);
  const filter = useRef("all");
  const dragged = useRef(0);
  const draggedOver = useRef(0);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "light") {
      document.body.setAttribute("data-theme", "light");
      setIcon(() => sun);
    } else {
      document.body.setAttribute("data-theme", "dark");
      setIcon(() => moon);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    changeFilter(filter.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  function changeTheme() {
    setTheme((t) => (t == "dark" ? "light" : "dark"));
  }
  function handleChange(event) {
    setNewTask(() => event.target.value);
  }
  function addTask() {
    newTask &&
      setTasks((t) => [
        ...t,
        {
          task: newTask,
          state: "active",
          id: Date.now(),
        },
      ]);
    setNewTask(() => "");
  }
  function deleteTask(id) {
    setTasks((t) => t.filter((e) => e.id !== id));
  }
  function clearCompleted() {
    setTasks((t) => t.filter((e) => e.state === "active"));
  }
  function changeFilter(s) {
    filter.current = s;
    s === "all"
      ? setDisplayedTasks(() => tasks)
      : setDisplayedTasks(() => tasks.filter((e) => e.state === s));
  }
  function completeTask(id) {
    setTasks((t) =>
      t.map((e) => {
        if (e.id === id)
          e.state == "active" ? (e.state = "complete") : (e.state = "active");
        return e;
      })
    );
  }
  function handleSort() {
    let tasksClone = [...tasks];
    let draggedIndex = tasksClone.findIndex((t) => t.id === dragged.current);
    let draggedOverIndex = tasksClone.findIndex(
      (t) => t.id === draggedOver.current
    );
    let draggedItem = tasksClone[draggedIndex];
    tasksClone[draggedIndex] = tasksClone[draggedOverIndex];
    tasksClone[draggedOverIndex] = draggedItem;
    setTasks(() => tasksClone);
  }
  function handleFilter(e, t) {
    document
      .querySelectorAll(".filter span")
      .forEach((s) => s.classList.remove("active"));
    e.target.classList.add("active");
    changeFilter(t);
  }
  return (
    <>
      <main>
        <header>
          <h1>Todo</h1>
          <img onClick={changeTheme} src={icon} />
        </header>
        <form autoComplete="off">
          <div className="circle"></div>
          <input
            type="text"
            name="newTask"
            placeholder="Create a new todo..."
            value={newTask}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTask();
              }
            }}
          />
        </form>
        <div className="main">
          <ul className="tasks">
            {displayedTasks.map((e) => {
              return (
                <li
                  key={e.id}
                  className={e.state}
                  draggable
                  onDragStart={() => (dragged.current = e.id)}
                  onDragEnter={() => (draggedOver.current = e.id)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <TaskBox
                    task={e.task}
                    state={e.state}
                    id={e.id}
                    deleteTask={deleteTask}
                    completeTask={completeTask}
                  />
                </li>
              );
            })}
          </ul>
          <Controls
            changeFilter={changeFilter}
            clearCompleted={clearCompleted}
            left={tasks.filter((e) => e.state === "active").length}
          />
        </div>
        <div className="filter-mobile">
          <span onClick={(e) => handleFilter(e, "all")} className="active">
            All&nbsp;
          </span>
          <span onClick={(e) => handleFilter(e, "active")}>Active&nbsp;</span>
          <span onClick={(e) => handleFilter(e, "complete")}>Completed</span>
        </div>
      </main>
      <p className="tip">Drag and drop to reorder list</p>
    </>
  );
}
