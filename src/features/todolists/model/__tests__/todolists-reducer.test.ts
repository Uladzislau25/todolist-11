import { nanoid } from "@reduxjs/toolkit"
import { beforeEach, expect, test } from "vitest"
import {
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  createTodolistTC,
  deleteTodolistTC,
  type DomainTodolist,
  todolistsReducer,
} from "../todolists-slice.ts"

let todolistId1: string
let todolistId2: string
let startState: DomainTodolist[] = []

beforeEach(() => {
  todolistId1 = nanoid()
  todolistId2 = nanoid()

  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: "" },
    { id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: "" },
  ]
})

test("correct todolist should be deleted", () => {
  const action = deleteTodolistTC.fulfilled({ id: todolistId1 }, "reqId", { id: todolistId1 })
  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be created", () => {
  const newTodolist = {
    id: "123",
    title: "New Todolist",
    filter: "all",
    order: 2,
    addedDate: "",
  }

  const action = createTodolistTC.fulfilled(newTodolist, "reqId", { title: "New Todolist" })
  const endState = todolistsReducer(startState, action)

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe("New Todolist")
})

test("correct todolist should change its title", () => {
  const title = "New title"
  const action = changeTodolistTitleTC.fulfilled({ id: todolistId2, title: title }, "reqId", {
    id: todolistId2,
    title: title,
  })
  const endState = todolistsReducer(startState, action)

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(title)
})

test("correct todolist should change its filter", () => {
  const filter = "completed"
  const endState = todolistsReducer(startState, changeTodolistFilterAC({ id: todolistId2, filter }))

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(filter)
})
