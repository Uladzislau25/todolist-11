import { type ChangeEvent, type CSSProperties, useEffect, useState } from "react"
import Checkbox from "@mui/material/Checkbox"
import { CreateItemForm, EditableSpan } from "@/common/components/"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"

// CRUD
// Create - POST (создание)
// Read - GET (чтение(доставание))
// Update - PUT(вся сущность целиком) (PATCH)(одна сущность к примеру(тайтл))
// Delete - DELETE (удаление)
// не входит в КРУД операции:
// OPTION - автоматически делается браузером CROSS

export const AppHttpRequests = () => {
  const [todolists, setTodolists] = useState<Todolist[]>([])
  const [tasks, setTasks] = useState<Record<string, DomainTask[]>>({})

  useEffect(() => {
    todolistsApi.getTodolists().then(async (res) => {
      const todolists = res.data
      setTodolists(todolists)
      todolists.forEach((todolist) => {
        tasksApi.getTasks(todolist.id).then((res) => {
          setTasks({ ...tasks, [todolist.id]: res.data.items })
        })
      })
    })
  }, [])

  const createTodolist = (title: string) => {
    todolistsApi.createTodolist(title).then((res) => {
      const newTodolist = res.data.data.item
      setTodolists([newTodolist, ...todolists])
    })
  }

  const deleteTodolist = (id: string) => {
    todolistsApi.deleteTodolist(id).then(() => {
      setTodolists(todolists.filter((item) => item.id !== id))
    })
  }

  const changeTodolistTitle = (id: string, title: string) => {
    todolistsApi.updateTodolist(id, title).then(() => {
      setTodolists(todolists.map((item) => (item.id === id ? { ...item, title } : item)))
    })
  }

  const createTask = (todolistId: string, title: string) => {
    tasksApi.createTask({ todolistId, title }).then((res) => {
      setTasks({ ...tasks, [todolistId]: [res.data.data.item, ...tasks[todolistId]] })
    })
  }

  const deleteTask = (todolistId: string, taskId: string) => {}

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const model: UpdateTaskModel = {
      description: task.description,
      title: task.title,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      status: e.currentTarget.checked ? 2 : 0,
    }
    tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model }).then((res) => {
      setTasks({
        ...tasks,
        [task.todoListId]: tasks[task.todoListId].map((t) => (t.id === task.id ? res.data.data.item : t)),
      })
    })
  }

  const changeTaskTitle = (task: any, title: string) => {}

  return (
    <div style={{ margin: "20px" }}>
      <CreateItemForm onCreateItem={createTodolist} />
      {todolists.map((todolist) => (
        <div key={todolist.id} style={container}>
          <div>
            <EditableSpan value={todolist.title} onChange={(title) => changeTodolistTitle(todolist.id, title)} />
            <button onClick={() => deleteTodolist(todolist.id)}>x</button>
          </div>
          <CreateItemForm onCreateItem={(title) => createTask(todolist.id, title)} />
          {tasks[todolist.id]?.map((task) => (
            <div key={task.id}>
              <Checkbox checked={task.status === 2} onChange={(e) => changeTaskStatus(e, task)} />
              <EditableSpan value={task.title} onChange={(title) => changeTaskTitle(task, title)} />
              <button onClick={() => deleteTask(todolist.id, task.id)}>x</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const container: CSSProperties = {
  border: "1px solid black",
  margin: "20px 0",
  padding: "10px",
  width: "300px",
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
}
