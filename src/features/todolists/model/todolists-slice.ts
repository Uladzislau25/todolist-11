import { createSlice, nanoid } from "@reduxjs/toolkit"

export const todolistSlice = createSlice({
  name: "todolists",
  initialState: [] as Todolist[],
  reducers: (create) => {
    return {
      deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      }),
      createTodolistAC: create.preparedReducer(
        (title: string) => {
          const newTodolist: Todolist = {
            id: nanoid(),
            title,
            filter: "all",
          }
          return { payload: newTodolist }
        },
        (state, action) => {
          state.push(action.payload)
        },
      ),
      changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      }),
      changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.filter = action.payload.filter
        }
      }),
    }
  },
})

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const { deleteTodolistAC, createTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC } =
  todolistSlice.actions
