import { beforeEach, expect, test } from "vitest"
import { createTasksTC, deleteTaskTC, tasksReducer, TasksState, updateTaskTC } from "../tasks-slice.ts"
import { DomainTask, TaskPriority, TaskStatus } from "@/features/todolists/api/tasksApi.types.ts"
import { createTodolistTC, deleteTodolistTC } from "@/features/todolists/model/todolists-slice.ts"
let startState: TasksState = {}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        description: "",
        title: "HTML",
        status: TaskStatus.New,
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        description: "",
        title: "REACT",
        status: TaskStatus.Completed,
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        id: "2",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        description: "",
        title: "JS",
        status: TaskStatus.New,
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        id: "3",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
    ],
    todolistId2: [
      {
        description: "",
        title: "meat",
        status: TaskStatus.Completed,
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        id: "1",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        description: "",
        title: "egg",
        status: TaskStatus.New,
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        id: "2",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        description: "",
        title: "milk",
        status: TaskStatus.Completed,
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        id: "3",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
    ],
  }
})

test("correct task should be deleted", () => {
  const action = deleteTaskTC.fulfilled({ todolistId: "todolistId1", taskId: "2" }, "reqId", {
    todolistId: "todolistId1",
    taskId: "2",
  })
  const endState = tasksReducer(startState, action)

  expect(endState["todolistId1"]).toEqual([
    {
      description: "",
      title: "HTML",
      status: TaskStatus.New,
      priority: TaskPriority.Low,
      startDate: "",
      deadline: "",
      id: "1",
      todoListId: "todolistId1",
      order: 0,
      addedDate: "",
    },
    {
      description: "",
      title: "JS",
      status: TaskStatus.New,
      priority: TaskPriority.Low,
      startDate: "",
      deadline: "",
      id: "3",
      todoListId: "todolistId1",
      order: 0,
      addedDate: "",
    },
  ])
})

test("correct task should be created at correct array", () => {
  const newTasks: DomainTask = {
    description: "",
    title: "juice",
    status: TaskStatus.Completed,
    priority: TaskPriority.Low,
    startDate: "",
    deadline: "",
    id: "4",
    todoListId: "todolistId2",
    order: 0,
    addedDate: "",
  }

  const action = createTasksTC.fulfilled({ task: newTasks, todolistId: "todolistId2" }, "reqId", {
    title: "juice",
    todolistId: "todolistId2",
  })
  const endState = tasksReducer(startState, action)

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBe("4")
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.Completed)
})

test("correct task should change its status", () => {
  const action = updateTaskTC.fulfilled(
    { todolistId: "todolistId2", taskId: "2", domainModel: { status: TaskStatus.Completed } },
    "reqId",
    { todolistId: "todolistId2", taskId: "2", domainModel: { status: TaskStatus.Completed } },
  )
  const endState = tasksReducer(startState, action)

  expect(endState.todolistId2[1].status).toBe(TaskStatus.Completed)
  expect(endState.todolistId1[0].status).toBe(TaskStatus.New)
})

test("correct task should change its title", () => {
  const action = updateTaskTC.fulfilled(
    { todolistId: "todolistId2", taskId: "2", domainModel: { title: "coffee" } },
    "reqId",
    {
      todolistId: "todolistId2",
      taskId: "2",
      domainModel: { title: "coffee" },
    },
  )
  const endState = tasksReducer(startState, action)

  expect(endState.todolistId2[1].title).toBe("coffee")
  expect(endState.todolistId1[1].title).toBe("REACT")
})

test("array should be created for new todolist", () => {
  const newTodolist = {
    id: "123",
    title: "New Todolist",
    filter: "all",
    order: 2,
    addedDate: "",
  }
  const action = createTodolistTC.fulfilled(newTodolist, "reqId", { title: "New Todolist" })
  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const action = deleteTodolistTC.fulfilled({ id: "todolistId2" }, "reqId", { id: "todolistId2" })
  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
