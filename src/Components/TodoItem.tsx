import React, { useState } from 'react';
import { Loader } from './Loader';
import { deleteTodo } from '../api/todos';
import { Error } from '../Types/Todo';

interface Props {
  id: number;
  title: string;
  completed: boolean;
  onToggle: () => void;
  setError: (setError: boolean) => void;
  setErrorType: (setErrorType: Error | null) => void;
  onDelete: (id: number) => void;
  loadingTodoId: number | null;
  loadingAddTodoId: number | null;
  setFocus: (setFocus: boolean) => void;
  setLoadingTodoId: (setLoadingTodoId: number | null) => void;
  showLoader: boolean;
  setLoading: (setLoading: boolean) => void;
  deleteFewTodo: number[];
  updateTodoTitle: (id: number, newTitle: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  id,
  title: initialTitle,
  completed,
  onToggle,
  setError,
  setErrorType,
  onDelete,
  setFocus,
  setLoadingTodoId,
  showLoader,
  loadingTodoId,
  deleteFewTodo,
  updateTodoTitle,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleToggle = () => {
    onToggle();
  };

  const handleDelete = async () => {
    setLoadingTodoId(id);
    try {
      await onDelete(id);
      await deleteTodo(id);
      setFocus(true);
    } catch (err) {
      setError(true);
      setErrorType('delete');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    if (title.trim() !== initialTitle.trim()) {
      updateTodoTitle(id, title);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleKeyDownEdit = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div
      data-cy="Todo"
      data-id={id}
      className={`todo ${completed ? 'completed' : ''}`}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      {!editing ? (
        <>
          <label
            className="todo__status-label"
            onDoubleClick={handleDoubleClick}
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={handleToggle}
            />
          </label>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {initialTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleDelete}
            data-cy="TodoDelete"
            disabled={showLoader || deleteFewTodo.includes(id)}
          >
            ×
          </button>
        </>
      ) : (
        <input
          className="todo__title-field"
          data-cy="TodoTitleField"
          type="text"
          placeholder="Empty todo will be deleted"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDownEdit}
          onBlur={handleBlur}
          autoFocus
        />
      )}
      <Loader loading={showLoader || loadingTodoId === id} />
    </div>
  );
};
