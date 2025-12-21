import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/app/createAppSlice.ts"
import { changeStatusAC, setErrorAC } from "@/app/app-slice.ts"
import { RequestStatus } from "@/common/components/types"

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
          const { rejectWithValue, dispatch } = thunkAPI
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            const res = await todolistsApi.getTodolists()
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { todolists: res.data }
          } catch (e) {
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(e)
          }
        },
        {
          fulfilled: (_state, action) => {
            return action.payload?.todolists.map((tl) => {
              return { ...tl, filter: "all", entityStatus: "idle" }
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
          const { dispatch, rejectWithValue } = thunkAPI
          try {
            const res = await todolistsApi.createTodolist(args)
            if (res.data.resultCode === 0) {
              return res.data.data.item
            } else {
              const errorMessage = res.data.messages.length ? res.data.messages[0] : "Something went wrong"
              dispatch(setErrorAC({ error: errorMessage }))
              return rejectWithValue(null)
            }
          } catch (e) {
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.unshift({ ...action.payload, filter: "all", entityStatus: "idle" })
          },
        },
      ),
      deleteTodolistTC: create.asyncThunk(
        async (args: { id: string }, { dispatch, rejectWithValue }) => {
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            dispatch(changeTodolistEntityAC({ id: args.id, entityStatus: "loading" }))
            await todolistsApi.deleteTodolist(args)
            dispatch(changeStatusAC({ status: "succeeded" }))
            dispatch(changeTodolistEntityAC({ id: args.id, entityStatus: "succeeded" }))
            return args
          } catch (e) {
            dispatch(changeStatusAC({ status: "failed" }))
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
      changeTodolistEntityAC: create.reducer<{ id: string; entityStatus: RequestStatus }>((state, action) => {
        const todolist = state.find((todolist) => todolist.id === action.payload.id)
        if (todolist) {
          todolist.entityStatus = action.payload.entityStatus
        }
      }),
    }
  },
})

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"

export const {
  changeTodolistFilterAC,
  fetchTodolistsTC,
  changeTodolistTitleTC,
  createTodolistTC,
  deleteTodolistTC,
  changeTodolistEntityAC,
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors
