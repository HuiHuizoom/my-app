// 将代码中的 JSX 语句转为React.createElement()，所有的 React 模块都应该引入 React 模块，否则会抛错。
import './App.css';
import Todo from './components/Todo';
import Form from './components/Form';
import FilterButton from './components/FilterButton';
import { useEffect, useState } from 'react';
import { nanoid } from "nanoid";

/*
1. 
2. 勾选框函数参数为什么是id   1：20左右
3. useEffect是啥，跳过耗时的事情
4. useRef，拿到组件
*/
export default function App(props) {
  let [editCount,setEditCount] = useState(0);
  useEffect(() => {
    fetch("http://localhost:8080/todo/all").then(
      (res) => {return res.json() ;}
    ).then((value) => {
      setTasks(value);
      
    }
    )},[editCount])

  function addTask(name) {
    fetch("http://localhost:8080/todo/add?name=" + name + "&completed=false" , {method:"post"}).then(
        (res) => {
          console.log(res.text());
          setEditCount(++editCount);
        }
    )
  }

  function toggleTaskCompleted(id) {
  
    fetch("http://localhost:8080/todo/update?id=" + id + "&completd=false"  , { method : "post"}).then(
      (res) => {
        console.log(res.text());
        setEditCount(++editCount);
      }
    )
  }

  function deleteTask(id) {
    fetch("http://localhost:8080/todo/delete?id=" + id , {method:"post"}).then(
      (res) => {
        console.log(res.text());
        setEditCount(++editCount);
      }
  )
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name
        return { ...task, name: newName };
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
  }
  //策略模式，把所以情况抽出map,点击按钮改变filter
  const [filter, setFilter] = useState("All");
  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };
  const FILTER_NAMES = Object.keys(FILTER_MAP);

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));


  const [tasks, setTasks] = useState(props.tasks);
  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}

      </div>
      <h2 id="list-heading"> {headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}


