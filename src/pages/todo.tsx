import { NextPage } from "next";
import { useState } from "react";
import { api } from "~/utils/api";

const TodoPage: NextPage = () => {
  const { data: todos } = api.todo.getAll.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
  });

  const [description, setDescription] = useState<string>("");
  const [dueAt, setDueAt] = useState<Date | null>(null);
  const [editID, setEditID] = useState<number>(-1);

  const apiUtils = api.useUtils();

  const { mutateAsync: create, isError: isCreateError } =
    api.todo.create.useMutation({
      onSuccess: async () => {
        await apiUtils.todo.getAll.invalidate();
        setDescription("");
        setDueAt(null);
      },
    });

  const { mutateAsync: update, isError: isUpdateError } =
    api.todo.update.useMutation({
      onSuccess: async () => {
        await apiUtils.todo.getAll.invalidate();
        setDescription("");
        setDueAt(null);
      },
    });

  const { mutateAsync: remove, isError: isRemoveError } =
    api.todo.delete.useMutation({
      onSuccess: async () => {
        await apiUtils.todo.getAll.invalidate();
        setDescription("");
        setDueAt(null);
      },
    });

  return (
    <div className="mx-auto max-w-sm py-12">
      <h1 className="text-2xl font-medium">Todos</h1>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Description"
          className="w-full border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="Due at"
          className="mt-1 w-full border p-2"
          value={dueAt?.toISOString().slice(0, 16)}
          onChange={(e) => setDueAt(new Date(e.target.value))}
        />
        <button
          onClick={async () => {
            await create({ description, dueAt });
          }}
          disabled={!description}
          className="mt-2 w-full bg-black p-2 text-white disabled:opacity-50"
        >
          Create
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {todos?.map((todo) => (
          <div key={todo.id} className="rounded-md border p-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-fit rounded-full border px-3 py-0.5 text-sm ${todo.isDone ? "border-green-500 bg-green-50 text-green-500" : "border-yellow-500 bg-yellow-50 text-yellow-500"}`}
              >
                {todo.isDone ? "Done" : "Todo"}
              </div>
              {todo.dueAt && (
                <div className="w-fit rounded-full border px-3 py-0.5 text-sm">
                  {todo.dueAt?.toLocaleDateString()}
                </div>
              )}
            </div>
            <p className="mt-2">{todo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoPage;
