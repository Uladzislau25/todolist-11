import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
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
          return {
            payload: {
              title,
              id: nanoid(),
            },
          }
        },
        (state, action) => {
          state.push({ ...action.payload, filter: "all", addedDate: "", order: 0 })
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
      /*fetchTodolistsAC: create.reducer<Todolist[]>((_state, action) => {
        return action.payload.map((tl) => {
          return { ...tl, filter: "all" }
        })
      }),*/
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistsTC.fulfilled, (_state, action) => {
        return action.payload.map((tl) => ({ ...tl, filter: "all" }))
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
  },
})

export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  try {
    const res = await todolistsApi.getTodolists()
    return res.data
  } catch (e) {
    return rejectWithValue(e)
  }
})
export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (args: { id: string; title: string }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    try {
      await todolistsApi.updateTodolist(args)
      return args
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const { createTodolistAC, deleteTodolistAC, changeTodolistFilterAC, changeTodolistTitleAC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
