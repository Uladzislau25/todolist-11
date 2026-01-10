import { baseApi } from "@/app/baseApi.ts"
import type { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import type { BaseResponse } from "@/common/types"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<any[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolists) => ({
          ...todolists,
          filter: "all",
          entityStatus: "idle",
        })),
      providesTags: ["Todolist"],
    }),
    createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({
        url: "todo-lists",
        method: "post",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
    deleteTodolist: build.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `todo-lists/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Todolist"],
    }),
    changeTodolist: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `todo-lists/${id}`,
        method: "put",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const { useGetTodolistsQuery, useCreateTodolistMutation, useDeleteTodolistMutation, useChangeTodolistMutation } =
  todolistsApi
