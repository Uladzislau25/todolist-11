import { type ChangeEvent, type CSSProperties, useEffect, useState } from "react"
import Checkbox from "@mui/material/Checkbox"
import { CreateItemForm, EditableSpan } from "@/common/components/"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, TaskStatus, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"

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
    const AsyncFunction = async () => {
      /*todolistsApi.getTodolists().then((res) => {
        const todolists = res.data
        setTodolists(todolists)
        todolists.forEach((todolist) => {
          tasksApi.getTasks(todolist.id).then((res) => {
            setTasks({ ...tasks, [todolist.id]: res.data.items })
          })
        })
      })*/
      const todoListAsync = await todolistsApi.getTodolists()
      const todolists = todoListAsync.data
      setTodolists(todolists)
      for (const tl of todolists) {
        const tasksAsync = await tasksApi.getTasks(tl.id)
        setTasks((tasks) => ({ ...tasks, [tl.id]: tasksAsync.data.items }))
      }
    }
    void AsyncFunction()
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

  const deleteTask = (todolistId: string, taskId: string) => {
    tasksApi.deleteTask({ todolistId, taskId }).then(() => {
      setTasks({
        ...tasks,
        [todolistId]: tasks[todolistId].filter((task) => task.id !== taskId),
      })
    })
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>, task: DomainTask) => {
    const model: UpdateTaskModel = {
      description: task.description,
      title: task.title,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New,
    }
    tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model }).then((res) => {
      setTasks({
        ...tasks,
        [task.todoListId]: tasks[task.todoListId].map((t) => (t.id === task.id ? res.data.data.item : t)),
      })
    })
  }

  const changeTaskTitle = (task: DomainTask, title: string) => {
    const model: UpdateTaskModel = {
      description: task.description,
      title: title,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      status: task.status,
    }
    tasksApi.updateTask({ todolistId: task.todoListId, taskId: task.id, model }).then((res) => {
      setTasks({
        ...tasks,
        [task.todoListId]: tasks[task.todoListId].map((t) => (t.id === task.id ? res.data.data.item : t)),
      })
    })
  }

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
              <Checkbox checked={task.status === TaskStatus.Completed} onChange={(e) => changeTaskStatus(e, task)} />
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
