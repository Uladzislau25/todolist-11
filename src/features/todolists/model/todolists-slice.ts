import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/app/createAppSlice.ts"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => {
    return {
      fetchTodolistsTC: create.asyncThunk(
        async (_, thunkAPI) => {
          const { rejectWithValue } = thunkAPI
          try {
            const res = await todolistsApi.getTodolists()
            return { todolists: res.data }
          } catch (e) {
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            action.payload?.todolists.forEach((tl) => {
              state.push({ ...tl, filter: "all" })
            })
          },
        },
      ),
      changeTodolistTitleTC: create.asyncThunk(
        async (args: { id: string; title: string }, thunkAPI) => {
          const { rejectWithValue } = thunkAPI
          try {
            await todolistsApi.updateTodolist(args)
            return args
          } catch (e) {
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todolist) => todolist.id === action.payload.id)
            if (index !== -1) {
              state[index].title = action.payload.title
            }
          },
        },
      ),
      createTodolistTC: create.asyncThunk(
        async (args: { title: string }, thunkAPI) => {
          const { rejectWithValue } = thunkAPI
          try {
            const res = await todolistsApi.createTodolist(args)
            return res.data.data.item
          } catch (e) {
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            state.unshift({ ...action.payload, filter: "all" })
          },
        },
      ),
      deleteTodolistTC: create.asyncThunk(
        async (args: { id: string }, thunkAPI) => {
          const { rejectWithValue } = thunkAPI
          try {
            await todolistsApi.deleteTodolist(args)
            return args
          } catch (e) {
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex((todolist) => todolist.id === action.payload.id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          },
        },
      ),
      changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.filter = action.payload.filter
        }
      }),
    }
  },
})

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"

export const { changeTodolistFilterAC, fetchTodolistsTC, changeTodolistTitleTC, createTodolistTC, deleteTodolistTC } =
  todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
